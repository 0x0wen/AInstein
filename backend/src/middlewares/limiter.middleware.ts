import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";

const limiterMiddleware = rateLimiter({
	limit: 10,
	statusCode: 429,
	message: "Too many requests",
	keyGenerator: (c) => {
		const ip = getConnInfo(c).remote.address;
		return `${c.req.path}:${ip}`;
	},
});
