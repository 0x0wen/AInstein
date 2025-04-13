import { ConversationRequestSchema } from "@/models/conversation.model";
import {
	createConversation,
	getConversationsByUserAndStudyKit,
} from "@/services/conversation.service";
import type { Context } from "hono";

export class ConversationController {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	async createConversation(c: any) {
		const conversationRequest = ConversationRequestSchema.parse(
			c.req.valid("json"),
		);

		const title = conversationRequest.title;
		const userId = c.get("user").id;
		const studyKitId = conversationRequest.studyKitId;

		try {
			const result = await createConversation(title, userId, studyKitId);
			return c.json(result, 200);
		} catch (error) {
			if (error instanceof Error) {
				return c.json(
					{
						success: false,
						message: "Conversation creation failed!",
						error: error.message,
					},
					500,
				);
			}
			throw error;
		}
	}

	async getAllConversationsByUserId(c: Context) {
		const userId = c.get("user").id;
		const studyKitId = c.req.param("studykitId");

		try {
			const result = await getConversationsByUserAndStudyKit(
				userId,
				studyKitId,
			);

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const parsedResult = result.map((conversation: any) => ({
				id: conversation._id.toString(),
				title: conversation.title,
				studyKitId: conversation.studyKitId._id.toString(),
				lastMessageAt: conversation.lastMessageAt,
				createdAt: conversation.createdAt,
			}));

			return c.json(parsedResult, 200);
		} catch (error) {
			if (error instanceof Error) {
				return c.json(
					{
						success: false,
						message: "Get conversations error!",
						error: error.message,
					},
					500,
				);
			}
			throw error;
		}
	}
}
