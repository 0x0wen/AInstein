import { ChatService } from "@/services/chat.service";
import { Context } from "hono";
import { ObjectId } from "mongodb";

export class StudykitController {
	private readonly studykit_service: ChatService;

	constructor(studykit_service: ChatService) {
		this.studykit_service = studykit_service;

		// Bind the methods to preserve 'this' context
		this.fetchAllStudyKit = this.fetchAllStudyKit.bind(this);
	}

	async fetchAllStudyKit(c: Context) {
		try {
			const studykitId = c.req.param("studykitId");
			const result = await this.studykit_service.fetchAllChat(
				new ObjectId(studykitId),
			);
			return c.json(
				{
					success: true,
					message: "Study kit fetched!",
					body: { chat_history: result },
				},
				200,
			);
		} catch (error) {
			if (error instanceof Error) {
				return c.json(
					{
						success: false,
						message: "Study kit fetch failed!",
						error: error.message,
					},
					401,
				);
			}
			throw error;
		}
	}
}
