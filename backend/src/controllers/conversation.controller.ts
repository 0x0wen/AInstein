import {
	ConversationRequestSchema,
	ConversationResponseSchema,
	GetAllConversationRequestSchema,
} from "@/models/conversation.model";
import {
	createConversation,
	getConversationsByUserAndStudyKit,
} from "@/services/conversation.service";

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

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	async getAllConversationsByUserId(c: any) {
		const request = GetAllConversationRequestSchema.parse(c.req.valid("json"));
		const userId = c.get("user").id;
		const studyKitId = request.studyKitId;

		try {
			const result = await getConversationsByUserAndStudyKit(
				userId,
				studyKitId,
			);

			const response = ConversationResponseSchema.array().parse(result);

			return c.json(response, 200);
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
}
