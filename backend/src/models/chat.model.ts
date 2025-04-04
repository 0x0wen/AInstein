import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser, UserRequestSchema } from "./user.model";
import { IStudykit } from "./studykit.model";
import * as z from "zod";

export interface IChat {
	studyKitId: mongoose.Types.ObjectId | IStudykit;
	userId: mongoose.Types.ObjectId | IUser;
	content: string;
	role: "user" | "assistant";
	contextResources: mongoose.Types.ObjectId[];
	createdAt: Date;
}

export interface IChatDocument extends IChat, Document {}

const ChatSchema: Schema<IChatDocument> = new Schema({
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
	content: { type: String, required: true },
	role: {
		type: String,
		enum: ["user", "assistant"],
		required: true,
	},
	contextResources: [
		{
			type: Schema.Types.ObjectId,
			ref: "Resource",
		},
	],
	createdAt: { type: Date, default: Date.now },
});

// Add compound index for conversation retrieval
ChatSchema.index({ studyKitId: 1, createdAt: 1 });
ChatSchema.index({ userId: 1, studyKitId: 1, createdAt: 1 });

// Chat Request Schema
export const ChatRequestSchema = z.object({
	studyKitId: z.string(), // MongoDB ObjectId as string
	userId: z.union([z.string(), UserRequestSchema]), // MongoDB ObjectId as string
	content: z.string().min(1, { message: "Chat content is required" }),
	role: z.enum(["user", "assistant"]),
	contextResources: z.array(z.string()).optional(), // Array of resource ObjectIds
});

// Chat Response Schema
export const ChatResponseSchema = ChatRequestSchema.extend({
	id: z.string(), // MongoDB _id
	createdAt: z.coerce.date(),
});

export const Chat: Model<IChatDocument> = mongoose.model<IChatDocument>(
	"Chat",
	ChatSchema,
);
