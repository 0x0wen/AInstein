import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser, UserRequestSchema } from "./user.model";
import { IStudykit } from "./studykit.model";
import * as z from "zod";

export interface IResource {
	name: string;
	description: string;
	type: "document" | "image" | "video" | "audio" | "link" | "text";
	studyKitId: mongoose.Types.ObjectId | IStudykit;
	userId: mongoose.Types.ObjectId | IUser;
	fileUrl: string;
	filePath: string;
	fileSize: number;
	fileType: string;
	content: string;
	extractedText: string;
	isActive: boolean;
	useForContext: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface IResourceDocument extends IResource, Document {}

const ResourceSchema: Schema<IResourceDocument> = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, default: "" },
		type: {
			type: String,
			enum: ["document", "image", "video", "audio", "link", "text"],
			required: true,
		},
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
		fileUrl: { type: String },
		filePath: { type: String },
		fileSize: { type: Number },
		fileType: { type: String },
		content: { type: String },
		extractedText: { type: String },
		isActive: { type: Boolean, default: true },
		useForContext: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

// Add indexes for common queries
ResourceSchema.index({ studyKitId: 1, type: 1 });
ResourceSchema.index({ studyKitId: 1, useForContext: 1 }, { sparse: true });

export const ResourceRequestSchema = z.object({
	name: z.string().min(1, { message: "Resource name is required" }),
	description: z.string().optional(),
	type: z.enum(["document", "image", "video", "audio", "link", "text"]),
	studyKitId: z.string(),
	userId: z.union([z.string(), UserRequestSchema]),
	fileUrl: z.string().optional(),
	filePath: z.string().optional(),
	fileSize: z.number().optional(),
	fileType: z.string().optional(),
	content: z.string().optional(),
	extractedText: z.string().optional(),
	isActive: z.boolean().optional().default(true),
	useForContext: z.boolean().optional().default(false),
});

export const ResourceResponseSchema = ResourceRequestSchema.extend({
	id: z.string(), // MongoDB _id
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const Resource: Model<IResourceDocument> =
	mongoose.model<IResourceDocument>("Resource", ResourceSchema);
