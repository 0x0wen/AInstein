import { ChatRequestSchema, ChatResponseSchema } from "@/models/chat.model";
import {
	fetchChatHistory,
	processMessageStream,
	saveAssistantMessage,
	uploadFileForStudykit,
} from "@/services/chat.service";
import type { Context } from "hono";
import { streamSSE } from "hono/streaming";
import mongoose from "mongoose";

export class ChatController {
	uploadFile = async (c: Context): Promise<Response> => {
		try {
			const studyKitId = c.req.param("studykitId");
			// Get user ID from auth middleware
			const userId = c.get("user")?.id;
			if (!userId) {
				return c.json({ error: "User not authenticated" }, 401);
			}

			const formData = await c.req.parseBody();
			const file = formData.file;

			if (!(file instanceof File)) {
				return c.json({ error: "No file uploaded or invalid format" }, 400);
			}

			const resource = await uploadFileForStudykit(studyKitId, file, userId);

			return c.json(
				{
					message: "File uploaded successfully",
					resourceId: resource._id, // Use the DB resource ID
					openaiFileId: resource.openaiFileId,
					filename: resource.filename,
				},
				201,
			);
		} catch (error: any) {
			console.error("File upload error:", error);
			return c.json({ error: error.message || "Failed to upload file" }, 500);
		}
	};

	streamChat = async (c: Context) => {
		try {
			const studyKitId = c.req.param("studykitId");
			// Get user ID from auth middleware
			const userId = c.get("user")?.id;
			if (!userId) {
				// SSE cannot easily return a 401 before starting, handle upstream
				console.error("Streaming chat attempt without user ID");
				// Return an empty stream or an error event
				return streamSSE(c, async (stream) => {
					stream.writeSSE({ event: "error", data: "Authentication required" });
				});
			}

			const body = await c.req.json();
			const validation = ChatRequestSchema.safeParse(body);

			if (!validation.success) {
				// Return an error event in the SSE stream
				return streamSSE(c, async (stream) => {
					stream.writeSSE({
						event: "error",
						data: JSON.stringify(validation.error.flatten()),
					});
				});
			}

			const { content: userContent } = validation.data;

			const assistantStream = await processMessageStream(
				studyKitId,
				userId,
				userContent,
			);

			let accumulatedAssistantResponse = ""; // To store the final message

			// Stream events back to the client using streamSSE
			return streamSSE(c, async (stream) => {
				for await (const event of assistantStream) {
					// console.log("SSE Event:", event.event); // Log event type

					// --- Handle Text Deltas (Content Updates) ---
					if (event.event === "thread.message.delta") {
						const delta = event.data.delta?.content?.[0];
						if (delta?.type === "text" && delta.text?.value) {
							const textChunk = delta.text.value;
							accumulatedAssistantResponse += textChunk; // Accumulate text
							// Send the chunk to the client
							stream.writeSSE({
								event: "message_delta", // Custom event name for frontend
								data: JSON.stringify({ text: textChunk }), // Send only the new text chunk
							});
						}
					}
					// --- Handle Tool Calls (e.g., Retrieval in progress) ---
					else if (event.event === "thread.run.step.delta") {
						const delta = event.data.delta?.step_details;
						if (delta?.type === "tool_calls") {
							// You could send updates about which tool is being called
							// e.g., "Searching documents..."
							stream.writeSSE({
								event: "tool_call",
								data: JSON.stringify(delta.tool_calls),
							});
						}
					}
					// --- Handle Run Status ---
					else if (event.event === "thread.run.requires_action") {
						// Handle function calling if you implement it
						stream.writeSSE({
							event: "requires_action",
							data: JSON.stringify(event.data),
						});
					} else if (event.event === "thread.run.failed") {
						console.error("Run Failed:", event.data);
						stream.writeSSE({
							event: "error",
							data: `Assistant run failed: ${event.data.last_error?.message}`,
						});
						await stream.close(); // Close stream on failure
						return; // Stop processing
					}
					// --- Handle End of Stream (or other events) ---
					// The stream automatically ends when the run completes or fails.
					// 'thread.run.completed' event signifies the end.
					else if (event.event === "thread.run.completed") {
						console.log(
							"Run Completed. Final Assistant Message:",
							accumulatedAssistantResponse,
						);
						// Save the complete assistant message *after* the stream finishes
						try {
							if (accumulatedAssistantResponse) {
								await saveAssistantMessage(
									studyKitId,
									userId,
									accumulatedAssistantResponse,
								);
								console.log("Assistant message saved to DB.");
							}
							stream.writeSSE({
								event: "message_complete",
								data: "Stream finished",
							});
						} catch (saveError: any) {
							console.error("Failed to save assistant message:", saveError);
							stream.writeSSE({
								event: "error",
								data: "Failed to save message history.",
							});
						}
						// No need to manually close here for 'completed', stream handles it.
					}
				}
				console.log("SSE stream connection closed.");
				// Stream closes automatically when the 'async function*' completes
			});
		} catch (error: any) {
			console.error("Streaming chat error:", error);
			// If error happens before stream starts, return JSON error
			return c.json(
				{ error: error.message || "Failed to start chat stream" },
				500,
			);
		}
	};

	fetchChat = async (c: Context) => {
		try {
			const studyKitId = c.req.param("studykitId");
			const userId = c.get("user")?.id;
			if (!userId) {
				console.warn("Fetch history attempt without userId authentication.");
				return c.json({ error: "User not authenticated" }, 401);
			}
			console.log(
				`Fetch history request for StudyKit: ${studyKitId} by User: ${userId}`,
			);

			// Optional: Add query param for limit, e.g., c.req.query('limit')
			const limitParam = c.req.query("limit");
			const limit = limitParam ? Number.parseInt(limitParam, 10) : 50;
			if (Number.isNaN(limit) || limit <= 0) {
				return c.json({ error: "Invalid limit parameter" }, 400);
			}

			const history = await fetchChatHistory(studyKitId, limit);
			console.log(`Fetched ${history.length} history messages.`);

			// Reverse history to show oldest first for typical chat display
			const displayHistory = history.reverse();

			// Map to response schema, handling potential population of userId
			const responseData = displayHistory.map((msg) => {
				// Safely determine the userId string
				let userIdString: string;
				if (msg.userId instanceof mongoose.Types.ObjectId) {
					userIdString = msg.userId.toString();
				} else if (typeof msg.userId === "object" && msg.userId?.id) {
					// It's populated, use the _id from the populated object
					userIdString = msg.userId.id.toString();
				} else {
					// Fallback or error case - should not happen with correct population
					console.error(
						"Unexpected userId type in fetched history:",
						msg.userId,
					);
					userIdString = "unknown_user"; // Or handle as error
				}

				// Parse using Zod schema
				return ChatResponseSchema.parse({
					...msg.toJSON(), // Use toJSON to get plain object, includes fields like content, role, createdAt
					id: msg.id.toString(), // Explicitly use document's _id
					studyKitId: msg.studyKitId.toString(), // studyKitId is always ObjectId here
					userId: userIdString, // Use the determined string ID
					contextResources: msg.contextResources?.map((id) => id.toString()), // Map context resource ObjectIds
				});
			});

			return c.json(responseData);
		} catch (error: any) {
			console.error(
				`Fetch chat history error for StudyKit ${c.req.param("studykitId")}:`,
				error,
			);
			if (error.message === "StudyKit not found") {
				return c.json({ error: error.message }, 404);
			}
			if (error.message.includes("Invalid StudyKit ID format")) {
				return c.json({ error: error.message }, 400);
			}
			return c.json(
				{ error: error.message || "Failed to fetch chat history" },
				500,
			);
		}
	};
}
