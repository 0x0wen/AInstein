import { Schema } from "mongoose";

const FlashcardSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		studykitId: {
			type: Schema.Types.ObjectId,
			ref: "StudyKit",
			required: true,
		},
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		sourceResourceId: { type: Schema.Types.ObjectId, ref: "Resource" },
		lastStudied: { type: Date },
		progress: {
			mastered: { type: Number, default: 0 },
			learning: { type: Number, default: 0 },
			needsReview: { type: Number, default: 0 },
		},
		cards: [
			{
				front: { type: String, required: true },
				back: { type: String, required: true },
				difficulty: { type: String, enum: ["easy", "medium", "hard"] },
				lastReviewed: { type: Date },
				nextReviewDate: { type: Date },
				reviewCount: { type: Number, default: 0 },
				mastered: { type: Boolean, default: false },
				createdAt: { type: Date, default: Date.now },
				updatedAt: { type: Date },
			},
		],
	},
	{ timestamps: true },
);

export default FlashcardSchema;
