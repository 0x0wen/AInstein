import { ObjectId, WithId } from "mongodb";
import { Chat } from "@/utils/db";
import { IChat } from "@/utils/db";

export class StudykitService {
	constructor(private chat_collection: typeof Chat) {}

	async fetchAllChat(studykitId: ObjectId): Promise<IChat[] | null> {
		return await this.chat_collection.find({ studykitId });
	}

	async fetchChatById(chatId: ObjectId): Promise<IChat | null> {
		return await this.chat_collection.findOne({ _id: chatId });
	}
}
