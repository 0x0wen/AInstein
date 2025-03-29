import { ObjectId } from "mongodb";
// Current normalized approach
export interface User {
	_id: ObjectId;
	email: string;
	username: string;
	passwordHash: string;
	firstName?: string;
	lastName?: string;
	avatar?: string;
	preferences?: {
		theme?: string;
		notifications?: boolean;
	};
	createdAt: Date;
	updatedAt?: Date;
	lastLogin?: Date;
}

export interface StudyKit {
	_id: ObjectId;
	name: string;
	description?: string;
	userId: ObjectId;
	subject?: string;
	tags?: string[];
	background?: string;
	colorTheme?: string;
	isPublic?: boolean;
	progress?: {
		percentage?: number;
		lastActivity?: Date;
	};
	createdAt: Date;
	updatedAt?: Date;
}

export interface Chat {
	_id: ObjectId;
	studykitId: ObjectId;
	userId?: ObjectId;
	content: string;
	role: "user" | "assistant";
	contextResources?: ObjectId[];
	createdAt: Date;
}

export interface Video {
	_id: ObjectId;
	title: string;
	description?: string;
	studykitId: ObjectId;
	userId: ObjectId;
	videoUrl: string;
	thumbnailUrl?: string;
	duration?: number;
	transcript?: string;
	sourceResourceId?: ObjectId;
	views?: number;
	createdAt: Date;
	updatedAt?: Date;
}

// Current normalized approach for flashcards
export interface FlashcardDeck {
	_id: ObjectId;
	name: string;
	description?: string;
	studykitId: ObjectId;
	userId: ObjectId;
	sourceResourceId?: ObjectId;
	cardCount?: number;
	lastStudied?: Date;
	progress?: {
		mastered?: number;
		learning?: number;
		needsReview?: number;
	};
	createdAt: Date;
	updatedAt?: Date;
}

export interface Flashcard {
	_id: ObjectId;
	deckId: ObjectId;
	front: string;
	back: string;
	difficulty?: "easy" | "medium" | "hard";
	lastReviewed?: Date;
	nextReviewDate?: Date;
	reviewCount?: number;
	mastered?: boolean;
	createdAt: Date;
	updatedAt?: Date;
}

// Current normalized approach for quizzes
export interface Quiz {
	_id: ObjectId;
	title: string;
	description?: string;
	studykitId: ObjectId;
	userId: ObjectId;
	sourceResourceId?: ObjectId;
	questionCount?: number;
	timeLimit?: number;
	passingScore?: number;
	isPublic?: boolean;
	createdAt: Date;
	updatedAt?: Date;
}

export interface QuizQuestion {
	_id: ObjectId;
	quizId: ObjectId;
	question: string;
	options: string[];
	correctOption: number;
	explanation?: string;
	difficulty?: "easy" | "medium" | "hard";
	points?: number;
	createdAt: Date;
	updatedAt?: Date;
}

export interface QuizAttempt {
	_id: ObjectId;
	quizId: ObjectId;
	userId: ObjectId;
	score: number;
	outOf?: number;
	timeTaken?: number;
	answers?: {
		questionId?: ObjectId;
		selectedOption?: number;
		isCorrect?: boolean;
	}[];
	passed?: boolean;
	createdAt: Date;
	completedAt?: Date;
}

export interface Resource {
	_id: ObjectId;
	name: string;
	description?: string;
	type: "document" | "image" | "video" | "audio" | "link" | "text";
	studykitId: ObjectId;
	userId: ObjectId;
	fileUrl?: string;
	filePath?: string;
	fileSize?: number;
	fileType?: string;
	content?: string;
	extractedText?: string;
	isActive?: boolean;
	useForContext?: boolean;
	createdAt: Date;
	updatedAt?: Date;
}

// Alternative denormalized approach for flashcards
export interface DenormalizedFlashcardDeck {
	_id: ObjectId;
	name: string;
	description?: string;
	studykitId: ObjectId;
	userId: ObjectId;
	sourceResourceId?: ObjectId;
	lastStudied?: Date;
	progress?: {
		mastered?: number;
		learning?: number;
		needsReview?: number;
	};
	cards: {
		front: string;
		back: string;
		difficulty?: "easy" | "medium" | "hard";
		lastReviewed?: Date;
		nextReviewDate?: Date;
		reviewCount?: number;
		mastered?: boolean;
		createdAt: Date;
		updatedAt?: Date;
	}[];
	createdAt: Date;
	updatedAt?: Date;
}

// Alternative denormalized approach for quizzes
export interface DenormalizedQuiz {
	_id: ObjectId;
	title: string;
	description?: string;
	studykitId: ObjectId;
	userId: ObjectId;
	sourceResourceId?: ObjectId;
	timeLimit?: number;
	passingScore?: number;
	isPublic?: boolean;
	questions: {
		question: string;
		options: string[];
		correctOption: number;
		explanation?: string;
		difficulty?: "easy" | "medium" | "hard";
		points?: number;
		createdAt: Date;
		updatedAt?: Date;
	}[];
	attempts?: {
		userId: ObjectId;
		score: number;
		outOf?: number;
		timeTaken?: number;
		answers?: {
			questionIndex?: number;
			selectedOption?: number;
			isCorrect?: boolean;
		}[];
		passed?: boolean;
		createdAt: Date;
		completedAt?: Date;
	}[];
	createdAt: Date;
	updatedAt?: Date;
}
