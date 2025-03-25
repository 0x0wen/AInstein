import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser, UserRequestSchema } from "./user.model";
import { IStudykit } from "./studykit.model";
import * as z from 'zod';

export interface IVideo {
  title: string;
  description: string;
  studyKitId: mongoose.Types.ObjectId | IStudykit;
  userId: mongoose.Types.ObjectId | IUser;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  transcript: string;
  sourceResourceId?: mongoose.Types.ObjectId;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVideoDocument extends IVideo, Document {}

const VideoSchema: Schema<IVideoDocument> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    studyKitId: {
      type: Schema.Types.ObjectId,
      ref: "StudyKit",
      required: true,
      index: true
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    transcript: { type: String, default: "" },
    sourceResourceId: { 
      type: Schema.Types.ObjectId, 
      ref: "Resource" 
    },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Add compound index for efficient queries
VideoSchema.index({ studyKitId: 1, userId: 1 });


// Video Request Schema
export const VideoRequestSchema = z.object({
  title: z.string().min(1, { message: "Video title is required" }),
  description: z.string().optional(),
  studyKitId: z.string(), // MongoDB ObjectId as string
  userId: z.union([z.string(),UserRequestSchema]), // MongoDB ObjectId as string
  videoUrl: z.string().url({ message: "Invalid video URL" }),
  thumbnailUrl: z.string().url({ message: "Invalid thumbnail URL" }).optional(),
  duration: z.number().optional(),
  transcript: z.string().optional(),
  sourceResourceId: z.string().optional(),
  views: z.number().optional().default(0)
});

// Video Response Schema
export const VideoResponseSchema = VideoRequestSchema.extend({
  id: z.string(), // MongoDB _id
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});

export const Video: Model<IVideoDocument> = mongoose.model<IVideoDocument>(
  "Video",
  VideoSchema
);