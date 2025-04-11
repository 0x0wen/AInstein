import mongoose, { Schema, type Model } from "mongoose";
import * as z from "zod";

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
  { timestamps: true } 
);

export const UserRequestSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  emailVerified: z.boolean().optional().default(false),
  image: z.string().url().optional(),
});

export const UserResponseSchema = UserRequestSchema.extend({
  _id: z.string(), 
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);