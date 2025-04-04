import { User, type IUser } from "@/models/user.model";
import JWTUtil from "@/utils/jwt";
import { compare, hash } from "bcrypt";

export async function createUser(
	userData: IUser,
): Promise<{ user: IUser; token: string }> {
	const existingUser = await User.find({ username: userData.username });
	if (existingUser.length > 0) {
		throw new Error("User already exists");
	}
	try {
		if (!Bun.env.JWT_SECRET) {
			throw new Error("JWT secret is required to generate token");
		}

		const hashedPassword = await hash(userData.password, 10);
		const user = new User({
			...userData,
			password: hashedPassword,
		});
		await user.save();

		const token = await JWTUtil.generateToken({
			userId: user.id.toString(),
			email: user.email,
		});
		return { user: user.toJSON(), token };
	} catch (error) {
		throw new Error(`Error creating user:${error}`);
	}
}

export async function findUser(
	username: string,
): Promise<Partial<IUser> | null> {
	const user = await User.findOne({ username }, { password: 0 });
	return user ? user.toJSON() : null;
}

export async function loginUser({
	email,
	password,
}: {
	email: string;
	password: string;
}): Promise<{ token: string }> {
	const user_exists = await User.find({ email });
	if (user_exists.length === 0) {
		throw new Error("User not found");
	}
	const user = user_exists[0];
	const isValid = await compare(password, user.password);
	if (!isValid) {
		throw new Error("Invalid credentials");
	}
	const token = await JWTUtil.generateToken({
		userId: user.id.toString(),
		email: user.email,
	});

	return { token };
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
	return await User.findOne({ email });
}

export async function deleteAllUsers() {
	return await User.deleteMany({});
}
