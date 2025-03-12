import { Schema, model } from "mongoose";

const ResourceSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		type: {
			type: String,
			enum: ["document", "image", "video", "audio", "link", "text"],
			required: true,
		},
		studykitId: {
			type: Schema.Types.ObjectId,
			ref: "StudyKit",
			required: true,
		},
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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

export default ResourceSchema;
