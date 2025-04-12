import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { ChatController } from "@/controllers/chat.controller";
import mongoose from "mongoose";
import { z } from "zod";
import { ChatRequestSchema, ChatResponseSchema } from "@/models/chat.model";

const chat = new OpenAPIHono();
const chatController = new ChatController();

const uploadFileRoute = chat.openapi(
	createRoute({
		method: "post",
		path: "/upload/{studykitId}",
		request: {
			params: z.object({
				studykitId: z.string().openapi({
					description: "ID of the StudyKit",
					example: new mongoose.Types.ObjectId().toString(),
				}),
			}),
			body: {
				content: {
					"multipart/form-data": {
						// Specify content type
						schema: {
							type: "object",
							properties: {
								file: {
									// Input field name
									type: "string",
									format: "binary", // Indicate it's a file
									description: "The file to upload for context.",
								},
							},
							required: ["file"], // File is required
						},
					},
				},
			},
		},
		responses: {
			201: {
				description: "File uploaded successfully",
				content: {
					"application/json": {
						schema: z.object({
							message: z.string(),
							resourceId: z.string(),
							openaiFileId: z.string(),
							filename: z.string(),
						}),
					},
				},
			},
			400: { description: "Bad request (e.g., no file, invalid ID format)" },
			401: { description: "Unauthorized" },
			404: { description: "StudyKit not found" },
			500: { description: "Internal server error" },
		},
		tags: ["Chat"],
		summary: "Upload a file for context",
		description:
			"Uploads a file, sends it to OpenAI Assistants API, associates it with a StudyKit, and stores a reference in the database.",
	}),
	chatController.uploadFile,
);

// --- Streaming Chat Route ---
const streamChatRoute = chat.openapi(
	createRoute({
		method: "post",
		path: "/chat/{studykitId}",
		request: {
			params: z.object({
				studykitId: z.string().openapi({
					description: "ID of the StudyKit",
					example: new mongoose.Types.ObjectId().toString(),
				}),
			}),
			body: {
				content: {
					"application/json": {
						schema: ChatRequestSchema, // Validate request body
					},
				},
				required: true,
			},
		},
		responses: {
			// SSE response is not easily described in OpenAPI spec for content
			200: {
				description:
					"SSE stream started. Events emitted: 'message_delta' (JSON {text: string}), 'tool_call' (JSON), 'message_complete' (JSON {message: string}), 'error' (JSON {message: string}).",
				headers: z
					.object({
						"Content-Type": z
							.string()
							.openapi({ example: "text/event-stream" }),
						"Cache-Control": z.string().openapi({ example: "no-cache" }),
						Connection: z.string().openapi({ example: "keep-alive" }),
					})
					.openapi({ description: "Standard SSE headers." }),
			},
			400: { description: "Bad request (invalid input body or ID format)" },
			401: { description: "Unauthorized" },
			404: { description: "StudyKit not found" },
			500: { description: "Internal server error / Failed to start stream" },
		},
		tags: ["Chat"],
		summary: "Send a message and get a streaming response",
		description:
			"Sends a user message to the associated StudyKit assistant (creating assistant/thread if needed) and streams the response back using Server-Sent Events (SSE). Attaches uploaded files associated with the StudyKit to the message.",
	}),
	chatController.streamChat, // Controller handles SSE streaming
);

// --- Chat History Route ---
const getChatHistoryRoute = chat.openapi(
	createRoute({
		method: "get",
		path: "/history/{studykitId}",
		request: {
			params: z.object({
				studykitId: z.string().openapi({
					description: "ID of the StudyKit",
					example: new mongoose.Types.ObjectId().toString(),
				}),
			}),
			query: z.object({
				limit: z.string().optional().openapi({
					description: "Maximum number of messages to return",
					example: "50",
				}),
			}), // Optional limit query param
		},
		responses: {
			200: {
				description:
					"Message history fetched successfully (sorted oldest to newest)",
				content: {
					"application/json": {
						schema: z.array(ChatResponseSchema), // Array of chat messages
					},
				},
			},
			400: { description: "Bad request (invalid limit or ID format)" },
			401: { description: "Unauthorized" },
			404: { description: "StudyKit not found" },
			500: { description: "Internal server error" },
		},
		tags: ["Chat"],
		summary: "Fetch message history",
		description:
			"Fetches the recent chat message history for a specific StudyKit, sorted chronologically (oldest first). Includes populated user details.",
	}),
	chatController.fetchChat,
);

// Register routes
chat.route("/upload/:studykitId", uploadFileRoute);
chat.route("/chat/:studykitId", streamChatRoute);
chat.route("/history/:studykitId", getChatHistoryRoute);

export { uploadFileRoute, streamChatRoute, getChatHistoryRoute };
export default chat;
