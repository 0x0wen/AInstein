import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import user from "@/routes/user.route";
import studykit from "@/routes/studykit.route";
import { connectToDatabase } from "./utils/db";
import { auth } from "@/utils/auth";
import video from "./routes/video.route";
import type { Context } from "hono";

const MONGODB_URI =
	Bun.env.BUN_ENV === "development"
		? "mongodb://localhost/ainstein"
		: Bun.env.MONGODB_URI;

// biome-ignore lint/style/noNonNullAssertion: <explanation>
await connectToDatabase(MONGODB_URI!);

const api = new OpenAPIHono().basePath("/api");

api.use(logger());
api.use(
	"*",
	cors({
		origin:
			Bun.env.BUN_ENV === "development"
				? "http://localhost:5173"
				: // biome-ignore lint/style/noNonNullAssertion: <explanation>
					Bun.env.CLIENT_URL!,
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

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

api.notFound((c) => {
	return c.json(
		{
			message: "Not Found",
		},
		404,
	);
});

api.on(["POST", "GET"], "/auth/*", (c: Context) => {
	return auth.handler(c.req.raw);
});

api.get("/", (c) => {
	return c.text("Hello Hono!");
});

api.route("/studykit", studykit);
api.route("/user", user);
// api.route("/chat", chat);
api.route("/video", video);
// api.route("/flashcard", chat);
// api.route("/quiz", chat);

const port = Bun.env.PORT || 3000;

export default {
	port: port,
	fetch: api.fetch,
};
