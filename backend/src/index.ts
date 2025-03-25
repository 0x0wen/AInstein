import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import chat from "@/routes/chat.route";
import video from "@/routes/video.route";
import user from "@/routes/user.route";
import studykit from "@/routes/studykit.route";
import { serve } from "bun";
import { connectToDatabase } from "./utils/db";
const api = new OpenAPIHono().basePath("/api");

const MONGODB_URI =
	Bun.env.BUN_ENV == "development"
		? "mongodb://localhost/ainstein"
		: Bun.env.MONGODB_URI;
await connectToDatabase(MONGODB_URI!);

api.doc("/doc", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "AInstein API",
	},
});

api.onError((err, c) => {
	console.error(err);
	return c.json({ success: false, message: err.message }, 500);
});

api.use(logger());
api.use(cors());
api.notFound((c) => {
	return c.json(
		{
			message: "Not Found",
		},
		404,
	);
});

api.get("/", (c) => {
	return c.text("Hello Hono!");
});

api.route("/studykit", studykit);
api.route("/user", user);
// api.route("/chat", chat);
// api.route("/video", chat);
// api.route("/flashcard", chat);
// api.route("/quiz", chat);

const port = Bun.env.PORT || 3000;

serve({
	fetch: api.fetch,
	port: port,
});

console.log(`Server is running on http://localhost:${port}`);
export default api;
