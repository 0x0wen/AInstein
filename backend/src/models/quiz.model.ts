import { Schema } from "mongoose";

const QuizSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		studykitId: {
			type: Schema.Types.ObjectId,
			ref: "StudyKit",
			required: true,
		},
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		sourceResourceId: { type: Schema.Types.ObjectId, ref: "Resource" },
		timeLimit: { type: Number },
		passingScore: { type: Number },
		isPublic: { type: Boolean, default: false },
		questions: [
			{
				question: { type: String, required: true },
				options: { type: [String], required: true },
				correctOption: { type: Number, required: true },
				explanation: { type: String },
				difficulty: { type: String, enum: ["easy", "medium", "hard"] },
				points: { type: Number, default: 1 },
				createdAt: { type: Date, default: Date.now },
				updatedAt: { type: Date },
			},
		],
		attempts: [
			{
				userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
				score: { type: Number, required: true },
				outOf: { type: Number },
				timeTaken: { type: Number },
				answers: [
					{
						questionIndex: { type: Number },
						selectedOption: { type: Number },
						isCorrect: { type: Boolean },
					},
				],
				passed: { type: Boolean },
				createdAt: { type: Date, default: Date.now },
				completedAt: { type: Date },
			},
		],
	},
	{ timestamps: true },
);

export default QuizSchema;
