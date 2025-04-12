import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IResource extends Document {
	conversationId: mongoose.Types.ObjectId;
	openaiFileId: string;
	filename: string;
	createdAt: Date;
}

const ResourceSchema: Schema<IResource> = new Schema({
	conversationId: {
		type: Schema.Types.ObjectId,
		ref: "Conversation",
		required: true,
		index: true,
	},
	openaiFileId: { type: String, required: true, unique: true },
	filename: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

export const Resource: Model<IResource> =
	mongoose.models.Resource ||
	mongoose.model<IResource>("Resource", ResourceSchema);
