import { ChatService } from "@/services/chat.service";
import { Context } from "hono";
import { ObjectId } from "mongodb";

export class ChatController {
	constructor(chat_service: ChatService) {
		// Bind the methods to preserve 'this' context
		this.fetchChat = this.fetchChat.bind(this);
	}

	async fetchChat(c: Context) {
		try {
			const studykitId = c.req.param("studykitId");
			const result = await this.chat_service.fetchAllChat(
				new ObjectId(studykitId),
			);
			return c.json(
				{
					success: true,
					message: "Chat fetched!",
					body: { chat_history: result },
				},
				200,
			);
		} catch (error) {
			if (error instanceof Error) {
				return c.json(
					{
						success: false,
						message: "Chat fetch failed!",
						error: error.message,
					},
					401,
				);
			}
			throw error;
		}
	}
}
