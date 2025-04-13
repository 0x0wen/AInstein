import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { IUser } from "./user.model";
import type { IStudykit } from "./studykit.model";
import * as z from "zod";

export interface IConversation {
	title: string;
	studyKitId: mongoose.Types.ObjectId | IStudykit;
	userId: mongoose.Types.ObjectId | IUser;
	lastMessageAt: Date;
	openaiAssistantId?: string | null;
	openaiThreadId?: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface IConversationDocument extends IConversation, Document {}

const ConversationSchema: Schema<IConversationDocument> = new Schema(
	{
		title: { type: String, required: true },
		studyKitId: {
			type: Schema.Types.ObjectId,
			ref: "StudyKit",
			required: true,
			index: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		lastMessageAt: { type: Date, default: Date.now },
		openaiAssistantId: { type: String, default: null },
	},
	{ timestamps: true },
);

ConversationSchema.index({ userId: 1, createdAt: -1 });
ConversationSchema.index({ studyKitId: 1, userId: 1 });

export const ConversationRequestSchema = z.object({
	title: z.string().min(1, { message: "Conversation title is required" }),
	studyKitId: z.string({ message: "Study kit ID is required" }),
});

export const GetAllConversationRequestSchema = z.object({
	studyKitId: z.string({ message: "Study kit ID is required" }),
});

export const ConversationResponseSchema = z.object({
	_id: z.string(),
	title: z.string(),
	studyKitId: z.string(),
	userId: z.string(),
	lastMessageAt: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const UpdateChatSchema = z.object({
	conversationId: z.string({ message: "Conversation ID is required" }),
	content: z.string().min(1, { message: "Chat content is required" }),
});

export const Conversation: Model<IConversationDocument> =
	mongoose.model<IConversationDocument>("Conversation", ConversationSchema);

