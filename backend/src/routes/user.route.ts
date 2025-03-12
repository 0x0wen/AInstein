import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { UserController } from "@/controllers/user.controller";

const user = new OpenAPIHono();
const user_controller = new UserController();

// User schema definitions
const userSchema = z.object({
  username: z.string().min(3),
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  age: z.number().int().positive()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Response schemas
const errorResponseSchema = z.object({
  message: z.string(),
  error: z.string().optional()
});

const createUserResponseSchema = z.object({
  message: z.string(),
  userId: z.string(),
  token: z.string()
});

const loginResponseSchema = z.object({
  message: z.string(),
  userId: z.string(),
  token: z.string()
});

const deleteUsersResponseSchema = z.object({
  message: z.string(),
  count: z.number()
});

// Route definitions
const getUserRoute = user.openapi(
  createRoute({
    method: "get",
    path: "/:username",
    request: {
      params: z.object({
        username: z.string()
      })
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: userSchema.omit({ password: true }),
          },
        },
        description: "User information fetched successfully",
      },
      404: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "User not found",
      },
      400: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "Error fetching user",
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
    request: {
      body: {
        content: {
          "application/json": {
            schema: userSchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          "application/json": {
            schema: createUserResponseSchema,
          },
        },
        description: "User created successfully",
      },
      400: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "Error creating user",
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
    request: {
      body: {
        content: {
          "application/json": {
            schema: loginSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: loginResponseSchema,
          },
        },
        description: "Login successful",
      },
      401: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "Invalid credentials",
      },
      404: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "User not found",
      },
      400: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "Error during login",
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
    responses: {
      200: {
        content: {
          "application/json": {
            schema: deleteUsersResponseSchema,
          },
        },
        description: "All users deleted successfully",
      },
      500: {
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
        description: "Error deleting users",
      },
    },
    tags: ["User"],
  }),
  user_controller.deleteAllUsers,
);

export { getUserRoute, createUserRoute, loginUserRoute, deleteAllUserRoute };
export default user;