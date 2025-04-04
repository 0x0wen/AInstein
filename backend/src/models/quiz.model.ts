import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser, UserRequestSchema } from "./user.model";
import { IStudykit } from "./studykit.model";
import * as z from "zod";

export interface IQuizQuestion {
	question: string;
	options: string[];
	correctOption: number;
	explanation: string;
	difficulty: "easy" | "medium" | "hard";
	points: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface IQuizAnswer {
	questionIndex: number;
	selectedOption: number;
	isCorrect: boolean;
}

export interface IQuizAttempt {
	userId: mongoose.Types.ObjectId | IUser;
	score: number;
	outOf: number;
	timeTaken: number;
	answers: IQuizAnswer[];
	passed: boolean;
	createdAt: Date;
	completedAt: Date;
}

export interface IQuiz {
	title: string;
	description: string;
	studyKitId: mongoose.Types.ObjectId | IStudykit;
	userId: mongoose.Types.ObjectId | IUser;
	sourceResourceId?: mongoose.Types.ObjectId;
	timeLimit?: number;
	passingScore?: number;
	isPublic: boolean;
	questions: IQuizQuestion[];
	attempts: IQuizAttempt[];
	createdAt: Date;
	updatedAt: Date;
}

export interface IQuizDocument extends IQuiz, Document {}

const QuizAnswerSchema = new Schema({
	questionIndex: { type: Number, required: true },
	selectedOption: { type: Number, required: true },
	isCorrect: { type: Boolean, required: true },
});

const QuizAttemptSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	score: { type: Number, required: true },
	outOf: { type: Number, required: true },
	timeTaken: { type: Number },
	answers: [QuizAnswerSchema],
	passed: { type: Boolean },
	createdAt: { type: Date, default: Date.now },
	completedAt: { type: Date },
});

const QuizQuestionSchema = new Schema(
	{
		question: { type: String, required: true },
		options: { type: [String], required: true },
		correctOption: { type: Number, required: true },
		explanation: { type: String, default: "" },
		difficulty: {
			type: String,
			enum: ["easy", "medium", "hard"],
			default: "medium",
		},
		points: { type: Number, default: 1 },
	},
	{ timestamps: true },
);

const QuizSchema: Schema<IQuizDocument> = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, default: "" },
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
		sourceResourceId: {
			type: Schema.Types.ObjectId,
			ref: "Resource",
		},
		timeLimit: { type: Number },
		passingScore: { type: Number, default: 70 }, // 70% is a common default
		isPublic: { type: Boolean, default: false },
		questions: [QuizQuestionSchema],
		attempts: [QuizAttemptSchema],
	},
	{ timestamps: true },
);

// Add indexes for common queries
QuizSchema.index({ studyKitId: 1, userId: 1 });
QuizSchema.index({ isPublic: 1 }, { sparse: true });

// Quiz Question Schema
const QuizQuestionZodSchema = z.object({
	question: z.string().min(1, { message: "Question is required" }),
	options: z
		.array(z.string())
		.min(2, { message: "At least two options required" }),
	correctOption: z
		.number()
		.min(0, { message: "Correct option index must be valid" }),
	explanation: z.string().optional(),
	difficulty: z.enum(["easy", "medium", "hard"]).optional().default("medium"),
	points: z.number().optional().default(1),
});

// Quiz Answer Schema
const QuizAnswerZodSchema = z.object({
	questionIndex: z.number(),
	selectedOption: z.number(),
	isCorrect: z.boolean(),
});

// Quiz Attempt Schema
const QuizAttemptZodSchema = z.object({
	userId: z.string(), // MongoDB ObjectId as string
	score: z.number(),
	outOf: z.number(),
	timeTaken: z.number().optional(),
	answers: z.array(QuizAnswerZodSchema),
	passed: z.boolean().optional(),
});

// Quiz Request Schema
export const QuizRequestSchema = z.object({
	title: z.string().min(1, { message: "Quiz title is required" }),
	description: z.string().optional(),
	studyKitId: z.string(), // MongoDB ObjectId as string
	userId: z.union([z.string(), UserRequestSchema]), // MongoDB ObjectId as string
	sourceResourceId: z.string().optional(),
	timeLimit: z.number().optional(),
	passingScore: z.number().optional().default(70),
	isPublic: z.boolean().optional().default(false),
	questions: z
		.array(QuizQuestionZodSchema)
		.min(1, { message: "At least one question required" }),
});

// Quiz Response Schema
export const QuizResponseSchema = QuizRequestSchema.extend({
	id: z.string(), // MongoDB _id
	attempts: z.array(QuizAttemptZodSchema).optional(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const Quiz: Model<IQuizDocument> = mongoose.model<IQuizDocument>(
	"Quiz",
	QuizSchema,
);
