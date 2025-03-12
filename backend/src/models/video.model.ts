import { Schema } from "mongoose";
const VideoSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		studykitId: {
			type: Schema.Types.ObjectId,
			ref: "StudyKit",
			required: true,
		},
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		videoUrl: { type: String, required: true },
		thumbnailUrl: { type: String },
		duration: { type: Number },
		transcript: { type: String },
		sourceResourceId: { type: Schema.Types.ObjectId, ref: "Resource" },
		views: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

export default VideoSchema;
