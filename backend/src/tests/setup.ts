import mongoose from "mongoose";
import { connectToDatabase } from "@/utils/db";

export async function setupTestDB() {
	const MONGODB_URI = Bun.env.MONGODB_TEST_URI;
	await connectToDatabase(MONGODB_URI!);
}

export async function cleanupTestDB() {
	await mongoose.connection.db?.dropDatabase(); // Clears test data
	await mongoose.connection.close();
}
