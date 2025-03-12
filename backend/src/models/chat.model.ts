import { Schema } from "mongoose";

const ChatSchema = new Schema({
	studykitId: { type: Schema.Types.ObjectId, ref: "StudyKit", required: true },
	userId: { type: Schema.Types.ObjectId, ref: "User" },
	content: { type: String, required: true },
	role: { type: String, enum: ["user", "assistant"], required: true },
	contextResources: [{ type: Schema.Types.ObjectId, ref: "Resource" }],
	createdAt: { type: Date, default: Date.now },
});

export default ChatSchema;
