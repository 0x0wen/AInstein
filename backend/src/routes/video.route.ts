import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { ChatController } from "@/controllers/video.controller";
import { ChatService } from "@/services/video.service";
import { chatsCollection } from "@/utils/db";

const video = new OpenAPIHono();
const chat_service = new ChatService(chatsCollection);
const chat_controller = new ChatController(chat_service);
video.openapi(
	createRoute({
		method: "post",
		path: "/history",
		middleware: [authMiddleware] as const,
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

export default video;
