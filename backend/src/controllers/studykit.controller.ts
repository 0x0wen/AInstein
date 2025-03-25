import { Context } from "hono";
import * as StudykitService from "@/services/studykit.service";
import { IStudykit } from "@/models/studykit.model";
import mongoose from "mongoose";
export class StudykitController {
	constructor() {
		this.fetchAllStudyKit = this.fetchAllStudyKit.bind(this);
	}

	async fetchAllStudyKit(c: Context) {
		try {
			const result = await StudykitService.fetchAllStudykits(new mongoose.Types.ObjectId('67e2695d8f4383738ccce306'));
			return c.json(
				result,
				200,
			);
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
			return c.json(
				result,
				200,
			);
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

	async createStudyKit(c: any) {
		try {
			console.log(new Date().toISOString())
			const studykit = c.req.valid("json") as IStudykit;
			const result = await StudykitService.createStudykit({...studykit, userId: new mongoose.Types.ObjectId('67e2695d8f4383738ccce306')});
			return c.json(
				{
					success: true,
					message: "Study kit created!",
					body: { studykit: result },
				},
				200,
			);
		} catch (error) {
			if (error instanceof Error) {
				return c.json(
					{
						success: false,
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
			return c.json(
				result,
				200,
			);
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
			const result = await StudykitService.updateStudykit(studykitId,studykit);
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
