import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { StudykitController } from "@/controllers/studykit.controller";
import {
	StudyKitRequestSchema,
	StudyKitResponseSchema,
} from "@/models/studykit.model";
import { errorResponseSchema } from "@/utils/types";

const studykit_route = new OpenAPIHono();
const studykit_controller = new StudykitController();

const getAllStudykitRoute = studykit_route.openapi(
	createRoute({
		method: "get",
		path: "/",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: StudyKitResponseSchema.array().nullable(),
					},
				},
				description: "Studykit information fetched successfully",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Study kit not found",
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
		tags: ["Studykit"],
	}),
	studykit_controller.fetchAllStudyKit,
);

const getStudykitRoute = studykit_route.openapi(
	createRoute({
		method: "get",
		path: "/:studykitId",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: StudyKitResponseSchema.nullable(),
					},
				},
				description: "Studykit information fetched successfully",
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
				description: "Error fetching studykit_route",
			},
		},
		tags: ["Studykit"],
	}),
	studykit_controller.fetchStudyKit,
);

const updateStudykitRoute = studykit_route.openapi(
	createRoute({
		method: "put",
		path: "/:studykitId",
		request: {
			params: z.object({
				username: z.string(),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: StudyKitResponseSchema.nullable(),
					},
				},
				description: "Studykit information fetched successfully",
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
				description: "Error fetching studykit_route",
			},
		},
		tags: ["Studykit"],
	}),
	studykit_controller.updateStudyKit,
);

const deleteStudykitRoute = studykit_route.openapi(
	createRoute({
		method: "delete",
		path: "/:studykitId",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: StudyKitResponseSchema.nullable(),
					},
				},
				description: "Studykit information fetched successfully",
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
				description: "Error fetching studykit_route",
			},
		},
		tags: ["Studykit"],
	}),
	studykit_controller.deleteStudyKit,
);

const createStudykitRoute = studykit_route.openapi(
	createRoute({
		method: "post",
		path: "/",
		request: {
			body: {
				content: {
					"application/json": {
						schema: StudyKitRequestSchema,
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: StudyKitResponseSchema,
					},
				},
				description: "User created successfully",
			},
			500: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Error creating study kit",
			},
		},
		tags: ["Studykit"],
	}),
	studykit_controller.createStudyKit,
);

export {
	getAllStudykitRoute,
	getStudykitRoute,
	updateStudykitRoute,
	deleteStudykitRoute,
	createStudykitRoute,
};
export default studykit_route;
