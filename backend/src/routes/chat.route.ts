import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { ChatController } from "@/controllers/chat.controller";
import { ChatService } from "@/services/chat.service";
import { Chat } from "@/utils/db";

const chat = new OpenAPIHono();
const chat_service = new ChatService(Chat);
const chat_controller = new ChatController(chat_service);

const getAllChatRoute = chat.openapi(
	createRoute({
		method: "get",
		path: "/history/:studykitId",
		// middleware: [authMiddleware] as const,
		responses: {
			200: {
				description: "Message history fetched",
			},
		},
		tags: ["Chat"],
		summary: "Fetch message history",
		description: "Fetch message history with a user",
	}),
	chat_controller.fetchChat,
);

const getChatRoute = chat.openapi(
	createRoute({
		method: "get",
		path: "/history/:studykitId",
		// middleware: [authMiddleware] as const,
		responses: {
			200: {
				description: "Message history fetched",
			},
		},
		tags: ["Chat"],
		summary: "Fetch message history",
		description: "Fetch message history with a user",
	}),
	chat_controller.fetchChat,
);
export { getAllChatRoute, getChatRoute };
export default chat;
