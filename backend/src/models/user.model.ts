import mongoose, { Schema, type Model } from "mongoose";
import * as z from "zod";
export interface IUser {
	username: string;
	name: string;
	email: string;
	password: string;
	age: number;
	id: string;
}

const UserSchema: Schema<IUser> = new Schema({
	username: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	age: { type: Number, required: true },
	id: { type: String, required: true },
});

export const UserRequestSchema = z.object({
	username: z
		.string()
		.min(3, { message: "Username must be at least 3 characters" }),
	name: z.string().min(2, { message: "Name must be at least 2 characters" }),
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" }),
	age: z
		.number()
		.min(13, { message: "Must be at least 13 years old" })
		.max(120),
});

export const UserResponseSchema = UserRequestSchema.omit({
	password: true,
}).extend({
	id: z.string(), // Assuming you want to include MongoDB _id
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
