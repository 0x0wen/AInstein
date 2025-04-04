import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { errorResponseSchema } from "@/utils/types";
import { VideoController } from "@/controllers/video.controller";
import { VideoRequestSchema, VideoResponseSchema } from "@/models/video.model";

const video_route = new OpenAPIHono();
const video_controller = new VideoController();

const getAllStudykitRoute = video_route.openapi(
	createRoute({
		method: "get",
		path: "/",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: VideoResponseSchema.array().nullable(),
					},
				},
				description: "Video fetched successfully",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "video not found",
			},
			500: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Error fetching studykit model",
			},
		},
		tags: ["Video"],
	}),
	video_controller.fetchAllVideo,
);

const getStudykitRoute = video_route.openapi(
	createRoute({
		method: "get",
		path: "/:studykitId",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: VideoResponseSchema.nullable(),
					},
				},
				description: "Video fetched successfully",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "User not found",
			},
			500: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Error fetching video_route",
			},
		},
		tags: ["Video"],
	}),
	video_controller.fetchVideo,
);

const deleteStudykitRoute = video_route.openapi(
	createRoute({
		method: "delete",
		path: "/:studykitId",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: VideoResponseSchema.nullable(),
					},
				},
				description: "Video fetched successfully",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Video not found",
			},
			500: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Error fetching video",
			},
		},
		tags: ["Video"],
	}),
	video_controller.deleteVideo,
);

const createStudykitRoute = video_route.openapi(
	createRoute({
		method: "post",
		path: "/",
		request: {
			body: {
				content: {
					"application/json": {
						schema: VideoRequestSchema,
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: VideoResponseSchema,
					},
				},
				description: "Video created successfully",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Error creating video",
			},
			429: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Reached video limit",
			},
			500: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Error creating video",
			},
		},
		tags: ["Video"],
	}),
	video_controller.createVideo,
);

export {
	getAllStudykitRoute,
	getStudykitRoute,
	deleteStudykitRoute,
	createStudykitRoute,
};
export default video_route;
