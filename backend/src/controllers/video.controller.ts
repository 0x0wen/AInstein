import type { Context } from "hono";
import * as VideoService from "@/services/video.service";
import mongoose from "mongoose";

export class VideoController {
	async fetchAllVideo(c: Context) {
		try {
			const result = await VideoService.fetchAllVideos(
				c.get('user').id,
			);
			return c.json(result, 200);
		} catch (error) {
			if (error instanceof Error) {
				return c.json(
					{
						success: false,
						message: "Video fetch failed!",
						error: error.message,
					},
					500,
				);
			}
			throw error;
		}
	}

	async fetchVideo(c: Context) {
		try {
			const videoId = c.req.param("videoId");
			const result = await VideoService.fetchVideoById(
				new mongoose.Types.ObjectId(videoId),
			);
			return c.json(result, 200);
		} catch (error) {
			if (error instanceof Error) {
				return c.json(
					{
						success: false,
						message: "Video fetch failed!",
						error: error.message,
					},
					500,
				);
			}
			throw error;
		}
	}

	async createVideo(c: Context) {
		try {
			const { prompt } = await c.req.json();
			const result = await VideoService.createVideo(
				prompt,
				c.get('user').id,
			);

			return c.json(result, 200);
		} catch (error) {
			if (error == Error("Video limit reached")) {
				return c.json(
					{
						error: (error as Error).message,
						message: "You have reached the limit of videos you can create.",
					},
					429,
				);
			}
			if (error instanceof Error) {
				return c.json(
					{
						message: "Error creating video",
						error: error.message,
					},
					500,
				);
			}
			throw error;
		}
	}

	async deleteVideo(c: Context) {
		try {
			const videoId = c.req.param("videoId");
			const result = await VideoService.deleteVideo(
				new mongoose.Types.ObjectId(videoId),
			);
			return c.json(result, 200);
		} catch (error) {
			if (error instanceof Error) {
				return c.json(
					{
						success: false,
						message: "Video deletion failed!",
						error: error.message,
					},
					500,
				);
			}
			throw error;
		}
	}
}
