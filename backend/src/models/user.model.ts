import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser {
	username: string;
	name: string;
	email: string;
	password: string;
	age: number;
}

const UserSchema: Schema<IUser> = new Schema({
	username: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	age: { type: Number, required: true },
});

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
