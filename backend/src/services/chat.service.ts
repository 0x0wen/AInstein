import { ObjectId } from "mongodb";
import { Chat, StudyKit, Video, Flashcard, Quiz, Resource } from "@/utils/db";
import {
	IStudyKit,
	IChat,
	IVideo,
	IFlashcard,
	IQuiz,
	IResource,
} from "@/utils/db";

export class ChatService {
	constructor(
		private studykit_model: typeof StudyKit,
		private chat_model: typeof Chat,
		private video_model: typeof Video,
		private flashcard_model: typeof Flashcard,
		private quiz_model: typeof Quiz,
		private resource_model: typeof Resource,
	) {}

	async fetchAllStudykit(): Promise<IStudyKit[] | null> {
		return await this.studykit_model.find();
	}

	async fetchStudykitById(studykitId: ObjectId): Promise<{
		studykit: IStudyKit;
		chat: IChat[];
		videos: IVideo[];
		flashcards: IFlashcard[];
		quizzes: IQuiz[];
		resources: IResource[];
	} | null> {
		const studykit = await this.studykit_model.findOne({ _id: studykitId });

		if (!studykit) {
			throw new Error("Studykit not found");
		}

		const chat = await this.chat_model.find({ studykitId });
		const videos = await this.video_model.find({ studykitId });
		const flashcards = await this.flashcard_model.find({ studykitId });
		const quizzes = await this.quiz_model.find({ studykitId });
		const resources = await this.resource_model.find({ studykitId });

		return {
			studykit,
			chat,
			videos,
			flashcards,
			quizzes,
			resources,
		};
	}
}
