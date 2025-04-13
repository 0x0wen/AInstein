import mongoose from "mongoose";
import { Resource, type IResource } from "@/models/resource.model";
import openai from "@/utils/openai";
import { Chat, type IChatDocument } from "@/models/chat.model";
import type { Stream } from "openai/streaming";
import type { AssistantStreamEvent } from "openai/resources/beta/assistants";
import { Conversation } from "@/models/conversation.model";

export async function uploadFileForStudykit(
	conversationId: string,
	file: File,
): Promise<IResource> {
	if (!mongoose.Types.ObjectId.isValid(conversationId)) {
		throw new Error("Invalid StudyKit ID format");
	}

	const conversation = await Conversation.findById(conversationId);
	if (!conversation) {
		throw new Error("StudyKit not found");
	}

	// 1. Upload to OpenAI
	try {
		const openaiFile = await openai.files.create({
			file: file,
			purpose: "assistants",
		});

		// 2. Create Resource in DB
		const newResource = new Resource({
			conversationId: conversation._id,
			openaiFileId: openaiFile.id,
			filename: file.name,
		});
		await newResource.save();

		// 3. Attach file to Assistant if it exists
		if (conversation.openaiAssistantId) {
			try {
				// @ts-ignore - OpenAI types are not up to date
				await openai.beta.assistants.files.create(
					conversation.openaiAssistantId,
					{
						file_id: openaiFile.id,
					},
				);
				console.log(
					`File ${openaiFile.id} attached to Assistant ${conversation.openaiAssistantId}`,
				);
			} catch (error) {
				console.error(
					`Failed to attach file ${openaiFile.id} to assistant ${conversation.openaiAssistantId}:`,
					error,
				);
				// Continue anyway - the file is still uploaded and can be attached to messages
			}
		}

		return newResource.toJSON();
	} catch (error) {
		console.error("Error uploading file to OpenAI:", error);
		throw new Error("Failed to upload file to OpenAI. Please try again.");
	}
}

export async function getOrCreateAssistantAndThread(
	conversationId: string,
): Promise<{ assistantId: string; threadId: string }> {
	const studykit = await Conversation.findById(conversationId).exec();
	if (!studykit) {
		throw new Error("StudyKit not found");
	}

	let assistantId = studykit.openaiAssistantId;
	let threadId = studykit.openaiThreadId;
	let needsSave = false;

	// Create Assistant if it doesn't exist
	if (!assistantId) {
		// Retrieve associated file IDs for this studykit
		const resources = await Resource.find({ studyKitId: studykit._id })
			.select("openaiFileId")
			.exec();
		const fileIds = resources.map((r) => r.openaiFileId);

		console.log(
			`Creating new Assistant for StudyKit ${conversationId} with files: ${fileIds.join(", ")}`,
		);
		try {
			const assistant = await openai.beta.assistants.create({
				name: `StudyKit Assistant ${conversationId}`,
				instructions:
					"You are a helpful study assistant. Use the provided files to answer questions about the study material. Be concise, accurate, and helpful. If you're not sure about something, acknowledge the uncertainty.",
				model: "gpt-4-turbo-preview", // Or your preferred model
				tools: [{ type: "file_search" }], // Enable retrieval tool for file context
			});
			assistantId = assistant.id;
			studykit.openaiAssistantId = assistantId;
			needsSave = true;
			console.log(`Created Assistant ${assistantId}`);

			// Attach existing files to the new assistant
			if (fileIds.length > 0) {
				for (const fileId of fileIds) {
					try {
						// @ts-ignore - OpenAI types are not up to date
						await openai.beta.assistants.files.create(assistantId, {
							file_id: fileId,
						});
						console.log(
							`File ${fileId} attached to new Assistant ${assistantId}`,
						);
					} catch (error) {
						console.error(
							`Failed to attach file ${fileId} to new assistant ${assistantId}:`,
							error,
						);
					}
				}
			}
		} catch (error) {
			console.error("Error creating OpenAI assistant:", error);
			throw new Error("Failed to create AI assistant. Please try again.");
		}
	}

	// Create Thread if it doesn't exist
	if (!threadId) {
		console.log(`Creating new Thread for StudyKit ${conversationId}`);
		try {
			const thread = await openai.beta.threads.create();
			threadId = thread.id;
			studykit.openaiThreadId = threadId;
			needsSave = true;
			console.log(`Created Thread ${threadId}`);
		} catch (error) {
			console.error("Error creating OpenAI thread:", error);
			throw new Error("Failed to create chat thread. Please try again.");
		}
	}

	if (needsSave) {
		await studykit.save();
	}

	if (!assistantId || !threadId) {
		throw new Error("Failed to obtain Assistant or Thread ID");
	}

	return { assistantId, threadId };
}

// --- Process Chat Message (Streaming) ---
export async function processMessageStream(
	conversationId: string,
	userId: string,
	userContent: string,
): Promise<
	Stream<AssistantStreamEvent> & { _request_id?: string | null | undefined }
> {
	const { assistantId, threadId } =
		await getOrCreateAssistantAndThread(conversationId);

	const resources = await Resource.find({
		conversationId: conversationId,
	})
		.select("openaiFileId")
		.exec();
	const fileIds = resources.map((r) => r.openaiFileId);

	// 1. Add user message to the thread
	try {
		// @ts-ignore - OpenAI types are not up to date
		await openai.beta.threads.messages.create(threadId, {
			role: "user",
			content: userContent,
			attachments: fileIds.map((fileId) => ({
				file_id: fileId,
				tools: [{ type: "file_search" }],
			})),
		});

		// Save user message to our DB (do this *before* starting the stream)
		const userChat = new Chat({
			conversationId,
			userId,
			content: userContent,
			role: "user",
			contextResources: resources.map((r) => r._id),
		});
		await userChat.save();

		// 2. Create a Run and stream the response
		const stream = await openai.beta.threads.runs.create(threadId, {
			assistant_id: assistantId,
			stream: true,
		});

		return stream; // Return the stream for the controller to handle
	} catch (error) {
		console.error("Error processing message:", error);
		throw new Error("Failed to process your message. Please try again.");
	}
}

// --- Save Assistant's Final Message ---
// This should be called after the stream is fully processed
export async function saveAssistantMessage(
	conversationId: string,
	userId: string,
	assistantContent: string,
): Promise<IChatDocument> {
	try {
		const assistantChat = new Chat({
			conversationId,
			userId, // Link assistant message to the user who initiated the request
			content: assistantContent,
			role: "assistant",
		});
		await assistantChat.save();
		return assistantChat;
	} catch (error) {
		console.error("Error saving assistant message:", error);
		throw new Error(
			"Failed to save chat history. Your message was processed but not saved.",
		);
	}
}

// --- Fetch Chat History ---
export async function fetchChatHistory(
	conversationId: string | number,
	limit = 50,
): Promise<IChatDocument[]> {
	try {
		const studyKit = await Conversation.findOne({
			_id: conversationId,
		}).exec();
		if (!studyKit) {
			throw new Error("StudyKit not found");
		}

		// Then use the StudyKit's ObjectId to query the chat history
		return Chat.find({ conversationId: studyKit._id })
			.sort({ createdAt: -1 })
			.limit(limit)
			.exec();
	} catch (error) {
		console.error("Error fetching chat history:", error);
		throw new Error("Failed to fetch chat history. Please try again.");
	}
}
