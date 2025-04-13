import { IUser } from "@/models/user.model";
import { IVideo, Video } from "@/models/video.model";
import mongoose from "mongoose";
import { execSync } from "child_process";
import { writeFileSync } from "fs";
import * as path from "path";
import * as crypto from "crypto";
import oaiClient from "@/utils/openai";
import { videoCollection } from "@/utils/db";
import lambda from "@/utils/lambda";
import { InvocationType } from "@aws-sdk/client-lambda";
import logger from "@/utils/logger"; // Assuming you have a logger utility
import { extractPythonCode, SYSTEM_PROMPT } from "@/utils/helpers";

export async function createVideo(
	prompt: string,
	userId: mongoose.Types.ObjectId | IUser,
): Promise<IVideo> {
	logger.info(`Starting video creation process for user: ${userId}`, { userId, promptLength: prompt.length });
	
	try {
		const videoCount = 0; // Replace with actual logic to count videos for the user
		// const videoCount = await videoCollection.countDocuments({userId: userId});

        logger.debug(`User ${userId} has ${videoCount} videos created so far`);
		
		if (videoCount >= 3) {
            logger.warn({ userId, videoCount }, `Video limit reached for user ${userId}`);
			throw new Error("Video limit reached");
		}
		
		const requestId = crypto.randomUUID();
		logger.info(`Generated request ID for video creation: ${requestId}`, { requestId, userId });
		
		const workDir = path.join(process.cwd(), "temp", requestId);
		const pythonFilePath = path.join(workDir, "animation.py");

		logger.debug(`Creating working directory: ${workDir}`, { workDir, requestId });
		execSync(`mkdir -p ${workDir}`);

		logger.info(`Calling OpenAI to generate animation code`, { 
			userId, 
			requestId, 
			model: "gpt-4-turbo",
			promptLength: prompt.length 
		});
		
		const startTime = Date.now();
		const completion = await oaiClient.chat.completions.create({
			model: "gpt-4-turbo",
			messages: [
				{ role: "system", content: SYSTEM_PROMPT },
				{ role: "user", content: prompt },
			],
			temperature: 0.2,
		});
		const completionTime = Date.now() - startTime;
		
		logger.info(`Received code from OpenAI`, { 
			userId, 
			requestId, 
			completionTimeMs: completionTime,
			responseTokens: completion.usage?.completion_tokens,
			totalTokens: completion.usage?.total_tokens
		});

		const generatedCode = extractPythonCode(completion.choices[0].message.content as string);
// 		const generatedCode =`
// from manim import *
// from manim_voiceover import VoiceoverScene
// from manim_voiceover.services.openai import OpenAIService

// class HidrokarbonScene(VoiceoverScene):
//     def construct(self):
//         self.set_speech_service(OpenAIService(voice='sage', model='gpt-4o-mini-tts', transcription_model=None))

//         title = Text("Konsep Dasar Hidrokarbon", font_size=60, color=YELLOW)
//         with self.voiceover("Halo! Hari ini kita akan membahas konsep dasar hidrokarbon dan struktur-strukturnya.") as tracker:
//             self.play(Write(title))
//         self.wait()
//         self.clear()

//         hidrokarbon = Text("Hidrokarbon = Hidrogen + Karbon", font_size=48)
//         with self.voiceover("Hidrokarbon adalah senyawa yang hanya tersusun dari atom karbon dan hidrogen.") as tracker:
//             self.play(Write(hidrokarbon))
//         self.wait()

//         self.clear()
//         jenis = Text("Dua Jenis Utama Hidrokarbon", font_size=52)
//         alifatik = Text("1. Alifatik", font_size=42).next_to(jenis, DOWN).shift(LEFT*3)
//         aromatik = Text("2. Aromatik", font_size=42).next_to(jenis, DOWN).shift(RIGHT*3)
//         with self.voiceover("Secara umum, hidrokarbon dibagi menjadi dua jenis: alifatik dan aromatik.") as tracker:
//             self.play(Write(jenis), FadeIn(alifatik), FadeIn(aromatik))
//         self.wait()

//         self.clear()
//         alkan = Text("Alkana: Rantai tunggal (C-C)", font_size=42).to_edge(UP)
//         rantai = VGroup(
//             Dot(), Line(LEFT, RIGHT).scale(0.6), Dot(), Line(LEFT, RIGHT).scale(0.6),
//             Dot(), Line(LEFT, RIGHT).scale(0.6), Dot()
//         ).arrange(RIGHT).scale(1.2)
//         rantai.set_color(GREEN)
//         with self.voiceover("Hidrokarbon alifatik terdiri dari alkana, yaitu rantai karbon tunggal seperti ini.") as tracker:
//             self.play(Write(alkan), Create(rantai))
//         self.wait()

//         self.clear()
//         alken = Text("Alkena: Ikatan rangkap dua (C=C)", font_size=42).to_edge(UP)
//         double_bond = VGroup(Dot(), Line(LEFT, RIGHT).scale(0.6), Line(LEFT, RIGHT).scale(0.6).shift(DOWN*0.1), Dot())
//         double_bond.set_color(ORANGE).arrange(RIGHT).scale(1.2)
//         with self.voiceover("Alkena memiliki ikatan rangkap dua antar karbon.") as tracker:
//             self.play(Write(alken), Create(double_bond))
//         self.wait()

//         self.clear()
//         alkuna = Text("Alkuna: Ikatan rangkap tiga (C≡C)", font_size=42).to_edge(UP)
//         triple_bond = VGroup(Dot(), 
//                              Line(LEFT, RIGHT).scale(0.6),
//                              Line(LEFT, RIGHT).scale(0.6).shift(UP*0.1),
//                              Line(LEFT, RIGHT).scale(0.6).shift(DOWN*0.1),
//                              Dot()).arrange(RIGHT).scale(1.2)
//         triple_bond.set_color(RED)
//         with self.voiceover("Sedangkan alkuna memiliki ikatan rangkap tiga.") as tracker:
//             self.play(Write(alkuna), Create(triple_bond))
//         self.wait()

//         self.clear()
//         benzena = Text("Aromatik: Contoh Benzena", font_size=42).to_edge(UP)
//         cincin = Circle(radius=1.2).set_color(BLUE)
//         garis_dalam = VGroup(
//             Line([-1, 0.6, 0], [1, 0.6, 0]),
//             Line([0.5, -1.1, 0], [-0.5, -1.1, 0]),
//             Line([-1, 0.6, 0], [0.5, -1.1, 0])
//         ).set_stroke(width=3)
//         with self.voiceover("Hidrokarbon aromatik seperti benzena memiliki struktur cincin yang stabil.") as tracker:
//             self.play(Write(benzena), Create(cincin), Create(garis_dalam))
//         self.wait()

//         self.clear()
//         summary = VGroup(
//             Text("Jenis Hidrokarbon:", font_size=48, color=YELLOW),
//             Text("1. Alkana – Ikatan tunggal", font_size=38),
//             Text("2. Alkena – Ikatan rangkap dua", font_size=38),
//             Text("3. Alkuna – Ikatan rangkap tiga", font_size=38),
//             Text("4. Aromatik – Cincin benzena", font_size=38)
//         ).arrange(DOWN, aligned_edge=LEFT).to_edge(UP)
//         with self.voiceover("Kesimpulannya, struktur hidrokarbon dibedakan berdasarkan jenis ikatan antar atom karbon.") as tracker:
//             self.play(FadeIn(summary))
//         self.wait(tracker.duration + 1)`

		console.debug(`Generated code: ${generatedCode}`, {
			userId,
			requestId,
			code: generatedCode
		});

//         const generatedCode = `from manim import *

// class CreateCircle(Scene):
//     def construct(self):
//         circle = Circle()  
//         circle.set_fill(PINK, opacity=0.5) 
//         self.play(Create(circle))`;
        logger.debug(`Generated code length: ${generatedCode.length} characters`, {
            userId,
            requestId,
            codeLength: generatedCode.length
        });
		
		if (!generatedCode) {
			logger.error(`OpenAI returned empty code response`, { userId, requestId });
			throw new Error("Failed to generate animation code");
		}
		
		logger.debug(`Generated code length: ${generatedCode.length} characters`, { 
			userId, 
			requestId,
			codeLength: generatedCode.length
		});

		// Invoke Lambda for video generation
		logger.info(`Invoking Lambda function for video generation`, { 
			userId, 
			requestId,
			functionName: Bun.env.LAMBDA_FUNCTION_NAME || 'manim-video-generator'
		});
		
		const lambdaStartTime = Date.now();
		const params = {
			FunctionName: Bun.env.LAMBDA_FUNCTION_NAME || 'manim-video-generator',
			InvocationType: InvocationType.RequestResponse,
			Payload: JSON.stringify({
				body: JSON.stringify({ code: generatedCode })
			})
		};
		
		const lambdaResponse = await lambda.invoke(params);
		const lambdaTime = Date.now() - lambdaStartTime;
		
		logger.info(`Lambda function completed`, { 
			userId, 
			requestId, 
			executionTimeMs: lambdaTime,
			statusCode: lambdaResponse.StatusCode
		});
		
		const payload = JSON.parse(Buffer.from(lambdaResponse.Payload || Buffer.from('{}')).toString());
		const responseBody = JSON.parse(payload.body || '{}');
		
		if (payload.statusCode !== 200) {
			logger.error(`Lambda function failed ${JSON.stringify(payload)}`, { 
				userId, 
				requestId, 
				statusCode: payload.statusCode,
				error: payload.errorMessage || 'Unknown lambda error'
			});
			
			throw Error('Lambda function failed', {
				cause: payload,
			});
		}
		
		logger.info(`Successfully generated video`, { 
			userId, 
			requestId, 
			videoUrl: responseBody.video_url 
		});
		
		// Create video document
		const videoData = {
			title: prompt,
			studyKitId: new mongoose.Types.ObjectId("67e2695d8f4383738ccce306"),
			userId: userId,
			videoUrl: responseBody.video_url,
			thumbnailUrl: "",
			duration: 0,
			sourceResourceId: new mongoose.Types.ObjectId("67e2695d8f4383738ccce306"),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		
		logger.debug(`Creating video document in database`, { userId, requestId });
		const video = new Video(videoData);
		await video.save();
		
		logger.info(`Video document created successfully`, { 
			userId, 
			requestId, 
			videoId: video._id
		});
		
		return video.toJSON();
	} catch (error: any) {
		logger.error(`Error in video creation process ${error.message}`, {
			userId,
			error: error.message,
			stack: error.stack
		});
		throw error;
	}
}

export async function fetchAllVideos(
	userId: mongoose.Types.ObjectId | IUser,
): Promise<IVideo[]> {
	logger.info(`Fetching all videos for user: ${userId}`, { userId });
	
	try {
		const videos = await Video.find({ userId: userId });
		logger.info(`Found ${videos.length} videos for user: ${userId}`, { 
			userId, 
			count: videos.length 
		});
		
		return videos;
	} catch (error: any) {
		logger.error(`Error fetching videos for user: ${userId}`, {
			userId,
			error: error.message
		});
		throw error;
	}
}

export async function fetchVideoById(
	videoId: mongoose.Types.ObjectId,
): Promise<IVideo | null> {
	logger.info(`Fetching video by ID: ${videoId}`, { videoId });
	
	try {
		const video = await Video.findOne({ _id: videoId });
		
		if (video) {
			logger.info(`Video found: ${videoId}`, { videoId });
		} else {
			logger.warn(`Video not found: ${videoId}`, { videoId });
		}
		
		return video;
	} catch (error: any) {
		logger.error(`Error fetching video by ID: ${videoId}`, {
			videoId,
			error: error.message
		});
		throw error;
	}
}

export async function updateVideo(
	videoId: mongoose.Types.ObjectId,
	videoData: Partial<IVideo>,
): Promise<IVideo | null> {
	logger.info(`Updating video: ${videoId}`, { 
		videoId, 
		updateFields: Object.keys(videoData) 
	});
	
	try {
		const video = await Video.findOne({ _id: videoId });
		
		if (!video) {
			logger.warn(`Cannot update - video not found: ${videoId}`, { videoId });
			return null;
		}
		
		Object.assign(video, videoData);
		await video.save();
		
		logger.info(`Video updated successfully: ${videoId}`, { videoId });
		return video.toJSON();
	} catch (error: any) {
		logger.error(`Error updating video: ${videoId}`, {
			videoId,
			error: error.message
		});
		throw error;
	}
}

export async function deleteVideo(
	videoId: mongoose.Types.ObjectId,
): Promise<IVideo | null> {
	logger.info(`Deleting video: ${videoId}`, { videoId });
	
	try {
		const video = await Video.findOne({ _id: videoId });
		
		if (!video) {
			logger.warn(`Cannot delete - video not found: ${videoId}`, { videoId });
			return null;
		}
		
		await video.deleteOne();
		
		logger.info(`Video deleted successfully: ${videoId}`, { videoId });
		return video.toJSON();
	} catch (error: any) {
		logger.error(`Error deleting video: ${videoId}`, {
			videoId,
			error: error.message
		});
		throw error;
	}
}