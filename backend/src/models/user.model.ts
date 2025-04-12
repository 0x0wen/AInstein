import mongoose, { Schema, type Model } from "mongoose";

export interface IUser {
	_id: mongoose.Types.ObjectId;
	name: string;
	email: string;
	emailVerified: boolean;
	image: string;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		emailVerified: { type: Boolean, default: false },
		image: { type: String },
	},
	{ timestamps: true },
);

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

