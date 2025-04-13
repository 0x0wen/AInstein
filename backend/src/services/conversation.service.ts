import mongoose, { Types } from "mongoose";
import {
	Conversation,
	type IConversation,
	type IConversationDocument,
} from "../models/conversation.model";
import { Studykit } from "../models/studykit.model";

/**
 * Creates a new conversation.
 *
 * @param {z.infer<typeof ConversationRequestSchema>} conversationData - Data for the new conversation.
 * @returns {Promise<IConversationDocument | null>} The newly created conversation, or null on error.
 */
export const createConversation = async (
	title: string,
	userId: string,
	studyKitId: string,
): Promise<IConversationDocument | null> => {
	try {
		// Check if the study kit exists
		const studyKitExists = await Studykit.findById(studyKitId);
		if (!studyKitExists) {
			throw new Error("Study kit not found");
		}

		const conversation = new Conversation({
			title: title,
			studyKitId: studyKitId,
			userId: userId,
			lastMessageAt: new Date(), // Initialize lastMessageAt
		});

		const savedConversation = await conversation.save();
		return savedConversation;
	} catch (error) {
		console.error("Error creating conversation:", error);
		return null;
	}
};

/**
 * Retrieves all conversations.
 *
 * @returns {Promise<IConversationDocument[]>} A list of all conversations.
 */
export const getAllConversations = async (): Promise<
	IConversationDocument[]
> => {
	try {
		// Fetch all conversations from the database, and populate the studyKit and user fields.
		const conversations = await Conversation.find()
			.populate({
				path: "studyKitId",
				model: "StudyKit", // Explicitly specify the model name
				select: "_id title", // Select the fields you need
			})
			.populate({
				path: "userId",
				model: "User", // Explicitly specify the model name
				select: "_id name", // Select the fields you need
			})
			.sort({ createdAt: -1 }) // Sort by creation date, newest first.  Good default.
			.exec(); // Use exec() to return a proper Promise
		return conversations;
	} catch (error) {
		console.error("Error retrieving all conversations:", error);
		//  Important:  You should handle errors here (e.g., log, throw, or return a specific error).
		//  For example:
		//  throw new Error("Failed to retrieve conversations: " + (error instanceof Error ? error.message : String(error)));
		return []; // Or throw the error, depending on your error handling strategy
	}
};

/**
 * Updates an existing conversation.
 *
 * @param {string} conversationId - The ID of the conversation to update.
 * @param {Partial<IConversation>} updateData - The data to update the conversation with.
 * @returns {Promise<IConversationDocument | null>} The updated conversation, or null if not found or error.
 */
export const updateConversation = async (
	conversationId: string,
	updateData: Partial<IConversation>,
): Promise<IConversationDocument | null> => {
	try {
		// Validate the conversationId is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(conversationId)) {
			throw new Error("Invalid conversation ID");
		}

		// Find the conversation by ID and update it.
		const updatedConversation = await Conversation.findByIdAndUpdate(
			conversationId,
			{ $set: updateData }, // Use $set to update only the provided fields
			{ new: true, runValidators: true }, // Return the updated document and run schema validators
		).exec();

		if (!updatedConversation) {
			return null; // Conversation not found
		}

		return updatedConversation;
	} catch (error) {
		console.error("Error updating conversation:", error);
		//  Important:  Handle the error appropriately (log, throw, etc.)
		return null; // Or throw, depending on your error handling
	}
};

export const getConversationsByUserAndStudyKit = async (
	userId: string,
	studyKitId: string,
): Promise<IConversationDocument[]> => {
	try {
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			throw new Error("Invalid user ID");
		}
		if (!mongoose.Types.ObjectId.isValid(studyKitId)) {
			throw new Error("Invalid study kit ID");
		}

		console.log("User ID:", userId);
		console.log("Study Kit ID:", studyKitId);

		// Find all conversations where both userId and studyKitId match.
		const conversations = await Conversation.find({
			userId: userId,
			studyKitId: studyKitId,
		})
			.populate({
				path: "studyKitId",
				model: "Studykit",
				select: "_id title",
			})
			.populate({
				path: "userId",
				model: "User",
				select: "_id name",
			})
			.sort({ lastMessageAt: -1 })
			.exec();

		console.log("Conversations:", conversations);
		return conversations;
	} catch (error) {
		console.error(
			"Error retrieving conversations by user and study kit ID:",
			error,
		);
		//  Important: Handle errors appropriately.  Consider throwing.
		return [];
	}
};
