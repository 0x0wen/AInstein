import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./user.model";
import { IStudykit } from "./studykit.model";
import * as z from 'zod';

export interface IFlashCard {
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
  lastReviewed: Date;
  nextReviewDate: Date;
  reviewCount: number;
  mastered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFlashCardDeck {
  name: string;
  description: string;
  studyKitId: mongoose.Types.ObjectId | IStudykit;
  userId: mongoose.Types.ObjectId | IUser;
  sourceResourceId?: mongoose.Types.ObjectId;
  lastStudied: Date;
  progress: {
    mastered: number;
    learning: number;
    needsReview: number;
  };
  cards: IFlashCard[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IFlashCardDeckDocument extends IFlashCardDeck, Document {}

const FlashCardZodSchema = new Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ["easy", "medium", "hard"],
    default: "medium"
  },
  lastReviewed: { type: Date },
  nextReviewDate: { type: Date },
  reviewCount: { type: Number, default: 0 },
  mastered: { type: Boolean, default: false }
}, { timestamps: true });

const FlashCardDeckSchema: Schema<IFlashCardDeckDocument> = new Schema(
  {
    name: { type: String, required: true },
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
    sourceResourceId: { 
      type: Schema.Types.ObjectId, 
      ref: "Resource" 
    },
    lastStudied: { type: Date },
    progress: {
      mastered: { type: Number, default: 0 },
      learning: { type: Number, default: 0 },
      needsReview: { type: Number, default: 0 }
    },
    cards: [FlashCardZodSchema]
  },
  { timestamps: true }
);

// Add compound index for efficient queries
FlashCardDeckSchema.index({ studyKitId: 1, userId: 1 });


// Individual FlashCard Schema
const FlashCardSchema = z.object({
  front: z.string().min(1, { message: "Front of card is required" }),
  back: z.string().min(1, { message: "Back of card is required" }),
  difficulty: z.enum(["easy", "medium", "hard"]).optional().default("medium"),
  lastReviewed: z.coerce.date().optional(),
  nextReviewDate: z.coerce.date().optional(),
  reviewCount: z.number().optional().default(0),
  mastered: z.boolean().optional().default(false)
});

// FlashCard Deck Request Schema
export const FlashCardDeckRequestSchema = z.object({
  name: z.string().min(1, { message: "Deck name is required" }),
  description: z.string().optional(),
  studyKitId: z.string(), // MongoDB ObjectId as string
  userId: z.string(), // MongoDB ObjectId as string
  sourceResourceId: z.string().optional(),
  lastStudied: z.coerce.date().optional(),
  progress: z.object({
    mastered: z.number().optional().default(0),
    learning: z.number().optional().default(0),
    needsReview: z.number().optional().default(0)
  }).optional(),
  cards: z.array(FlashCardSchema)
});

// FlashCard Deck Response Schema
export const FlashCardDeckResponseSchema = FlashCardDeckRequestSchema.extend({
  id: z.string(), // MongoDB _id
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});

export const FlashCardDeck: Model<IFlashCardDeckDocument> = mongoose.model<IFlashCardDeckDocument>(
  "FlashCardDeck",
  FlashCardDeckSchema
);