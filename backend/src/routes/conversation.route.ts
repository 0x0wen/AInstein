import { ConversationController } from "@/controllers/conversation.controller";
import {
	ConversationRequestSchema,
	ConversationResponseSchema,
} from "@/models/conversation.model";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";

const conversation = new OpenAPIHono();
const conversationController = new ConversationController();

const createConversationRoute = conversation.openapi(
	createRoute({
		method: "post",
		path: "/conversations",
		request: {
			body: {
				content: {
					"application/json": {
						schema: ConversationRequestSchema,
					},
				},
			},
		},
		responses: {
			200: ConversationResponseSchema,
			500: { description: "Internal server error" },
		},
		tags: ["Conversation"],
		summary: "Upload a file for context",
		description:
			"Uploads a file, sends it to OpenAI Assistants API, associates it with a StudyKit, and stores a reference in the database.",
	}),
	conversationController.createConversation,
);

const getAllConversationByUserAndStudyKit = conversation.openapi(
	createRoute({
		method: "get",
		path: "/conversations",
		request: {
			body: {
				content: {
					"application/json": {
						schema: ConversationRequestSchema,
					},
				},
			},
		},
		responses: {
			200: ConversationResponseSchema,
			500: { description: "Internal server error" },
		},
		tags: ["Conversation"],
		summary: "Upload a file for context",
		description:
			"Uploads a file, sends it to OpenAI Assistants API, associates it with a StudyKit, and stores a reference in the database.",
	}),
	conversationController.createConversation,
);

export { createConversationRoute, getAllConversationByUserAndStudyKit };
export default conversation;
