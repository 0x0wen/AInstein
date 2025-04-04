import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser, UserRequestSchema } from "./user.model";
import { IStudykit } from "./studykit.model";
import * as z from "zod";

export interface IVideo {
	title: string;
	studyKitId: mongoose.Types.ObjectId | IStudykit;
	userId: mongoose.Types.ObjectId | IUser;
	videoUrl: string;
	thumbnailUrl: string;
	duration: number;
	sourceResourceId?: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

export interface IVideoDocument extends IVideo, Document {}

const VideoSchema: Schema<IVideoDocument> = new Schema(
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
		videoUrl: { type: String, required: true },
		thumbnailUrl: { type: String, default: "" },
		duration: { type: Number, default: 0 },
		sourceResourceId: {
			type: Schema.Types.ObjectId,
			ref: "Resource",
		},
	},
	{ timestamps: true },
);

VideoSchema.index({ studyKitId: 1, userId: 1 });

export const VideoRequestSchema = z.object({
	prompt: z.string().min(1, { message: "Prompt is required" }),
});

export const VideoResponseSchema = z.object({
	title: z.string().min(1, { message: "Video title is required" }),
	videoUrl: z.string().url({ message: "Invalid video URL" }),
	thumbnailUrl: z.string().url({ message: "Invalid thumbnail URL" }).optional(),
	duration: z.number().optional(),
	sourceResourceId: z.string().optional(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const Video: Model<IVideoDocument> = mongoose.model<IVideoDocument>(
	"Video",
	VideoSchema,
);
