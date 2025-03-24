import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "./user.model";

export interface IStudykit {
	title: string;
	description: string;
	userId: mongoose.Types.ObjectId | IUser;
	subject: string;
	tags: string[];
	coverImage: string;
	colorTheme: string;
	isPublic: boolean;
	progress: {
		percentage: number;
		lastActivity: Date;
	};
	createdAt: Date;
	updatedAt: Date;
}

const StudykitSchema: Schema<IStudykit> = new Schema(
	{
		title: { type: String, required: true },
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

export const Studykit: Model<IStudykit> = mongoose.model<IStudykit>(
	"Studykit",
	StudykitSchema,
);
