import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { IUser } from "./user.model";
import * as z from "zod";

export interface IStudykit {
	name: string;
	description: string;
	userId: mongoose.Types.ObjectId | IUser;
	background: File | string;
	colorTheme: string;
	progress: {
		percentage: number;
		lastActivity: Date;
	};
	createdAt: Date;
	updatedAt: Date;
}

export interface IStudykitDocument extends IStudykit, Document {
	openaiAssistantId?: string;
	openaiThreadId?: string;
}

const StudykitSchema: Schema<IStudykitDocument> = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, default: "" },
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		background: { type: String, default: "" },
		colorTheme: { type: String, default: "#1E88E5" }, // Default to primary blue from spec
		progress: {
			percentage: { type: Number, default: 0 },
			lastActivity: { type: Date, default: Date.now },
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
);

// Add indexes for common queries
StudykitSchema.index({ userId: 1, name: 1 });

export const StudyKitRequestSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	description: z.string().optional().default(""),
	background: z.union([z.instanceof(File), z.string()]).optional(),
	colorTheme: z.string().optional().default("#1E88E5"),
	progress: z
		.object({
			percentage: z.number().min(0).max(100).optional().default(0),
			lastActivity: z.coerce.date().optional(),
		})
		.optional(),
});

export const StudyKitResponseSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	description: z.string().default(""),
	background: z.union([z.instanceof(File), z.string()]),
	colorTheme: z.string().default("#1E88E5"),
	progress: z.object({
		percentage: z.number().min(0).max(100).default(0),
		lastActivity: z.coerce.date(),
	}),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const Studykit: Model<IStudykitDocument> =
	mongoose.model<IStudykitDocument>("Studykit", StudykitSchema);
