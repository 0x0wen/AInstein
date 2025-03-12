import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { UserController } from "@/controllers/user.controller";

const user = new OpenAPIHono();
const user_controller = new UserController();

const getUserRoute = user.openapi(
	createRoute({
		method: "get",
		path: "/:id",
		// middleware: [authMiddleware] as const,
		responses: {
			200: {
				description: "User fetched",
			},
		},
		tags: ["User"],
	}),
	user_controller.getUser,
);

const createUserRoute = user.openapi(
	createRoute({
		method: "post",
		path: "/sign-up",
		responses: {
			200: {
				description: "Sign up successful",
			},
		},
		tags: ["User"],
	}),
	user_controller.createUser,
);

const loginUserRoute = user.openapi(
	createRoute({
		method: "post",
		path: "/login",
		responses: {
			200: {
				description: "Login successful",
			},
		},
		tags: ["User"],
	}),
	user_controller.loginUser,
);

const deleteAllUserRoute = user.openapi(
	createRoute({
		method: "delete",
		path: "/",
		// middleware: [authMiddleware] as const,
		responses: {
			200: {
				description: "All users deleted",
			},
		},
		tags: ["User"],
	}),
	user_controller.deleteAllUsers,
);

export { getUserRoute, createUserRoute, loginUserRoute, deleteAllUserRoute };
export default user;
