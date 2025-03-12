import * as UserService from "@/services/user.service";
import { IUser } from "@/models/user.model";

export class UserController {
	constructor() {
		this.createUser = this.createUser.bind(this);
		this.getUser = this.getUser.bind(this);
		this.loginUser = this.loginUser.bind(this);
	}

	async createUser(c: any) {
		try {
			const userData = c.req.valid("json") as Partial<IUser>;
			const user = await UserService.createUser(userData);
			return c.json(user, 201);
		} catch (error) {
			return c.json(
				{
					message: "Error creating user",
					error: error instanceof Error ? error.message : "Unknown error",
				},
				400,
			);
		}
	}

	async getUser(c: any) {
		try {
			const username = c.req.param("username");
			const user = await UserService.findUser(username);

			if (!user) {
				return c.json({ message: "User not found" }, 404);
			}

			return c.json(user, 200);
		} catch (error) {
			return c.json(
				{
					message: "Error fetching user",
					error: error instanceof Error ? error.message : "Unknown error",
				},
				400,
			);
		}
	}

	async loginUser(c: any) {
		try {
			const { email, password } = c.req.valid("json");

			const user = await UserService.findUserByEmail(email);
			if (!user) {
				return c.json({ message: "User not found" }, 404);
			}

			const isValid = await UserService.loginUser({ email, password });

			if (!isValid) {
				return c.json({ message: "Invalid credentials" }, 401);
			}

			return c.json({
				message: "Login successful",
				userId: user.username,
			}, 200);
		} catch (error) {
			return c.json(
				{
					message: "Error during login",
					error: error instanceof Error ? error.message : "Unknown error",
				},
				400,
			);
		}
	}

	async deleteAllUsers(c: any) {
		try {
			const result = await UserService.deleteAllUsers();
			return c.json({
				message: "All users deleted",
				deletedCount: result.deletedCount,
			}, 200);
		} catch (error) {
			return c.json(
				{
					message: "Error deleting users",
					error: error instanceof Error ? error.message : "Unknown error",
				},
				500,
			);
		}
	}
}
