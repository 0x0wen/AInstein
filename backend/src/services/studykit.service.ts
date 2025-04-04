import { Studykit, type IStudykit } from "@/models/studykit.model";
import type mongoose from "mongoose";
import type { IUser } from "@/models/user.model";

export async function createStudykit(
	studykitData: IStudykit,
): Promise<IStudykit> {
	const studykit = new Studykit(studykitData);
	await studykit.save();
	return studykit.toJSON();
}

export async function fetchAllStudykits(
	userId: mongoose.Types.ObjectId | IUser,
): Promise<IStudykit[]> {
	return await Studykit.find({ userId: userId });
}

export async function fetchStudykitById(
	studykitId: string,
): Promise<IStudykit | null> {
	return await Studykit.findOne({ _id: studykitId });
}

export async function updateStudykit(
	studykitId: string,
	studykitData: Partial<IStudykit>,
): Promise<IStudykit | null> {
	const studykit = await Studykit.findOne({ _id: studykitId });
	if (!studykit) {
		return null;
	}
	Object.assign(studykit, studykitData);
	await studykit.save();
	return studykit.toJSON();
}

export async function deleteStudykit(
	studykitId: string,
): Promise<IStudykit | null> {
	const studykit = await Studykit.findOne({ _id: studykitId });
	if (!studykit) {
		return null;
	}
	await studykit.deleteOne();
	return studykit.toJSON();
}
