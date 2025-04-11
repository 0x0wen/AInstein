import { Studykit, type IStudykit } from "@/models/studykit.model";
import mongoose from "mongoose";
import { Resource, type IResource } from "@/models/resource.model";
import openai from "@/utils/openai";
import { Chat, type IChatDocument } from "@/models/chat.model";
import type { Stream } from "openai/streaming";
import type { AssistantStreamEvent } from "openai/resources/beta/assistants";

export async function uploadFileForStudykit(
	studyKitId: string,
	file: File,
	userId: string,
): Promise<IResource> {
	if (!mongoose.Types.ObjectId.isValid(studyKitId)) {
		throw new Error("Invalid StudyKit ID format");
	}

	const studykit = await Studykit.findById(studyKitId);
	if (!studykit) {
		throw new Error("StudyKit not found");
	}

	// 1. Upload to OpenAI
	const openaiFile = await openai.files.create({
		file: file,
		purpose: "assistants",
	});

	// 2. Create Resource in DB
	const newResource = new Resource({
		studyKitId: studykit._id,
		openaiFileId: openaiFile.id,
		filename: file.name,
		// Add userId if needed for ownership/permissions
	});
	await newResource.save();

	// 3. (Optional but Recommended) Attach file to Assistant if it exists
	//    This makes the file readily available for all threads with this assistant.
	//    Alternatively, attach files when adding a message to a specific thread.
	// if (studykit.openaiAssistantId) {
	//      try {
	//          await openai.beta.assistants.files.create(studykit.openaiAssistantId, {
	//              file_id: openaiFile.id
	//          });
	//          console.log(`File ${openaiFile.id} attached to Assistant ${studykit.openaiAssistantId}`);
	//      } catch (error) {
	//          console.error(`Failed to attach file ${openaiFile.id} to assistant ${studykit.openaiAssistantId}:`, error);
	//          // Decide how to handle: maybe retry later, or just rely on attaching to messages
	//      }
	// }

	return newResource.toJSON();
}

export async function getOrCreateAssistantAndThread(
	studyKitId: string,
): Promise<{ assistantId: string; threadId: string }> {
	const studykit = await Studykit.findById(studyKitId).exec();
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
			`Creating new Assistant for StudyKit ${studyKitId} with files: ${fileIds.join(", ")}`,
		);
		const assistant = await openai.beta.assistants.create({
			name: `StudyKit Assistant ${studyKitId}`,
			instructions:
				"You are a helpful study assistant. Use the provided files to answer questions about the study material.",
			model: "gpt-4-turbo-preview", // Or your preferred model
			tools: [{ type: "file_search" }], // Enable retrieval tool for file context
		});
		assistantId = assistant.id;
		studykit.openaiAssistantId = assistantId;
		needsSave = true;
		console.log(`Created Assistant ${assistantId}`);
	}

	// Create Thread if it doesn't exist
	if (!threadId) {
		console.log(`Creating new Thread for StudyKit ${studyKitId}`);
		const thread = await openai.beta.threads.create();
		threadId = thread.id;
		studykit.openaiThreadId = threadId;
		needsSave = true;
		console.log(`Created Thread ${threadId}`);
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
	studyKitId: string,
	userId: string,
	userContent: string,
): Promise<
	Stream<AssistantStreamEvent> & { _request_id?: string | null | undefined }
> {
	if (
		!mongoose.Types.ObjectId.isValid(studyKitId) ||
		!mongoose.Types.ObjectId.isValid(userId)
	) {
		throw new Error("Invalid StudyKit or User ID format");
	}

	const { assistantId, threadId } =
		await getOrCreateAssistantAndThread(studyKitId);

	const resources = await Resource.find({
		studyKitId: new mongoose.Types.ObjectId(studyKitId),
	})
		.select("openaiFileId")
		.exec();
	const fileIds = resources.map((r) => r.openaiFileId);

	// 1. Add user message to the thread
	//    Include file_ids here if you want the assistant to specifically reference
	//    these files for *this* particular message.
	await openai.beta.threads.messages.create(threadId, {
		role: "user",
		content: userContent,
		attachments: fileIds.map((fileId) => ({ file_id: fileId })),
	});

	// Save user message to our DB (do this *before* starting the stream)
	const userChat = new Chat({
		studyKitId,
		userId,
		content: userContent,
		role: "user",
		// Optionally link resource documents if needed
		contextResources: resources.map((r) => r._id),
	});
	await userChat.save();

	// 2. Create a Run and stream the response
	const stream = await openai.beta.threads.runs.create(threadId, {
		assistant_id: assistantId,
		stream: true,
	});

	return stream; // Return the stream for the controller to handle
}

// --- Save Assistant's Final Message ---
// This should be called after the stream is fully processed
export async function saveAssistantMessage(
	studyKitId: string,
	userId: string,
	assistantContent: string,
): Promise<IChatDocument> {
	const assistantChat = new Chat({
		studyKitId,
		userId, // Link assistant message to the user who initiated the request
		content: assistantContent,
		role: "assistant",
	});
	await assistantChat.save();
	return assistantChat;
}

// --- Fetch Chat History ---
export async function fetchChatHistory(
	studyKitId: string,
	limit = 50,
): Promise<IChatDocument[]> {
	return Chat.find({ studyKitId: new mongoose.Types.ObjectId(studyKitId) })
		.sort({ createdAt: -1 }) // Get latest messages first
		.limit(limit)
		.populate("userId", "name email") // Populate user details if needed (adjust fields)
		.exec();
}
