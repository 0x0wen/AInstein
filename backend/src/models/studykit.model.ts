import { Schema } from "mongoose";

const StudykitSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		subject: { type: String },
		tags: [{ type: String }],
		coverImage: { type: String },
		colorTheme: { type: String },
		isPublic: { type: Boolean, default: false },
		progress: {
			percentage: { type: Number },
			lastActivity: { type: Date },
		},
	},
	{ timestamps: true },
);

export default StudykitSchema;
