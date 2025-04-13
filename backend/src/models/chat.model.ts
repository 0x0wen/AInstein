import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { IConversation } from "./conversation.model";
import * as z from "zod";

export interface IChat {
	conversationId: mongoose.Types.ObjectId | IConversation;
	content: string;
	role: "user" | "assistant";
	contextResources?: mongoose.Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

export interface IChatDocument extends IChat, Document {}

const ChatSchema: Schema<IChatDocument> = new Schema(
	{
		conversationId: {
			type: Schema.Types.ObjectId,
			ref: "Conversation",
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
	},
	{ timestamps: true },
);

// Add index for conversation retrieval
ChatSchema.index({ conversationId: 1, createdAt: 1 });

// Chat Request Schema
export const ChatRequestSchema = z.object({
	content: z.string().min(1, { message: "Chat content is required" }),
});

// Chat Response Schema
export const ChatResponseSchema = z.object({
	_id: z.string(),
	conversationId: z.string(),
	content: z.string(),
	role: z.enum(["user", "assistant"]),
	contextResources: z.array(z.string()).optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

ChatSchema.pre("save", async function (next) {
	if (this.isNew) {
		try {
			await mongoose
				.model("Conversation")
				.findByIdAndUpdate(this.conversationId, { lastMessageAt: new Date() });
		} catch (error) {
			console.error("Error updating conversation lastMessageAt:", error);
		}
	}
	next();
});

export const Chat: Model<IChatDocument> = mongoose.model<IChatDocument>(
	"Chat",
	ChatSchema,
);
