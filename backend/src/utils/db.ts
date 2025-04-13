import mongoose from "mongoose";
import { MongoClient } from "mongodb";

export async function connectToDatabase(URI: string) {
	if (!URI) {
		throw new Error(
			"Please define the MONGODB_URI environment variable inside .env",
		);
	}

	try {
		console.log("Attempting to connect to MongoDB...");
		await mongoose.connect(URI, {
			serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
		});
		console.log("Connected to MongoDB successfully");
	} catch (error) {
		console.error(`Failed to connect to MongoDB (${URI}):`, error);
		throw error;
	}
}

export const client = new MongoClient(
	Bun.env.MONGODB_URI || "mongodb://localhost/ainstein-test",
) as MongoClient;

const videoCollection = client.db().collection("videos");
const studykitCollection = client.db().collection("studykits");
const userCollection = client.db().collection("user");
const quizCollection = client.db().collection("quizzes");
const flashcardCollection = client.db().collection("flashcards");
const resourceCollection = client.db().collection("resources");
const chatCollection = client.db().collection("chats");

export {
	videoCollection,
	studykitCollection,
	userCollection,
	quizCollection,
	flashcardCollection,
	resourceCollection,
	chatCollection,
};
