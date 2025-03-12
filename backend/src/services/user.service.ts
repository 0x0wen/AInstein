import { User, IUser } from "@/models/user.model";

export async function createUser(userData: Partial<IUser>): Promise<IUser> {
	const user = new User(userData);
	return await user.save();
}
export async function findUser(username: string): Promise<IUser | null> {
	return await User.findById(username);
}
export async function loginUser({
	email,
	password,
}: {
	email: string;
	password: string;
}): Promise<boolean> {
	return true;
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
	return await User.findOne({ email });
}

export async function deleteAllUsers() {
	return await User.deleteMany({});
}
