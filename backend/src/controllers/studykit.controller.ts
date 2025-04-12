import type { Context } from "hono";
import * as StudykitService from "@/services/studykit.service";
import type { IStudykit } from "@/models/studykit.model";
import mongoose from "mongoose";
import { IUser } from "@/models/user.model";

export class StudykitController {
	async fetchAllStudyKit(c: Context) {
		try {
			const result = await StudykitService.fetchAllStudykits(
				c.get('user').id,
			);
			return c.json(result, 200);
		} catch (error) {
			if (error instanceof Error) {
				return c.json(
					{
						success: false,
						message: "Study kit fetch failed!",
						error: error.message,
					},
					500,
				);
			}
			throw error;
		}
	}

	async fetchStudyKit(c: Context) {
		try {
			const studykitId = c.req.param("studykitId");
			const result = await StudykitService.fetchStudykitById(studykitId);
			return c.json(result, 200);
		} catch (error) {
			if (error instanceof Error) {
				return c.json(
					{
						success: false,
						message: "Study kit fetch failed!",
						error: error.message,
					},
					500,
				);
			}
			throw error;
		}
	}

	async createStudyKit(c: Context) {
		try {
			console.log(new Date().toISOString());
			const studykit = c.req.valid("json") as IStudykit;
			const result = await StudykitService.createStudykit({
				...studykit,
				userId: c.get('user').id,
			});
			return c.json(
				result,
				200,
			);
		} catch (error) {
			if (error instanceof Error) {
				return c.json(
					{
						message: "Study kit creation failed!",
						error: error.message,
					},
					500,
				);
			}
			throw error;
		}
	}

	async deleteStudyKit(c: Context) {
		try {
			const studykitId = c.req.param("studykitId");
			const result = await StudykitService.deleteStudykit(studykitId);
			return c.json(result, 200);
		} catch (error) {
			if (error instanceof Error) {
				return c.json(
					{
						success: false,
						message: "Study kit deletion failed!",
						error: error.message,
					},
					500,
				);
			}
			throw error;
		}
	}

	async updateStudyKit(c: any) {
		try {
			const studykitId = c.req.param("studykitId");
			const studykit = c.req.valid("json") as IStudykit;
			const result = await StudykitService.updateStudykit(studykitId, studykit);
			return c.json(
				{
					success: true,
					message: "Study kit updated!",
					body: { studykit: result },
				},
				200,
			);
		} catch (error) {
			if (error instanceof Error) {
				return c.json(
					{
						success: false,
						message: "Study kit update failed!",
						error: error.message,
					},
					401,
				);
			}
			throw error;
		}
	}
}
