import {
	getUserRoute,
	createUserRoute,
	loginUserRoute,
	deleteAllUserRoute,
} from "@/routes/user.route";
import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { testClient } from "hono/testing";
import { IUser } from "../models/user.model";
import { connectToDatabase } from "@/utils/db";

describe("User API Routes", () => {
	const testUser: IUser = {
		username: "testuser",
		name: "test user",
		email: "test@example.com",
		password: "Password123!",
		age: 25,
	};

	let userToken: string;

	const testFailures: Array<{
		testName: string;
		error: Error & { response?: Response; responseBody?: any };
	}> = [];

	beforeAll(async () => {
		console.log("Starting User API tests...");
		await connectToDatabase(
			Bun.env.MONGODB_TEST_URI || "mongodb://localhost/ainstein",
		);
	});

	afterAll(() => {
		if (testFailures.length > 0) {
			console.error("\n===== TEST FAILURES =====");
			testFailures.forEach((failure, index) => {
				console.error(`\nFailure #${index + 1}: ${failure.testName}`);
				console.error(`Error: ${failure.error.message}`);
				console.error(`Stack: ${failure.error.stack}`);
				if (failure.error.response) {
					console.error(`Response status: ${failure.error.response.status}`);
					console.error(
						`Response body: ${JSON.stringify(failure.error.responseBody, null, 2)}`,
					);
				}
			});
		} else {
			console.log("\nAll tests completed successfully!");
		}
	});

	const runTest = async (testName: string, testFn: () => Promise<void>) => {
		try {
			await testFn();
		} catch (error: any) {
			testFailures.push({
				testName,
				error,
			});
			throw error;
		}
	};

	it("should create a new user", async () => {
		await runTest("Create User", async () => {
			let response;
			try {
				response = await testClient(createUserRoute, {
					path: "/api/user",
				})["sign-up"].$post({
					json: testUser,
				});

				const responseBody = await response.text();
				const data = JSON.parse(responseBody);
				expect(response.status).toBe(201);
				expect(data).toHaveProperty("message", "User signed up successfully");
				expect(data).toHaveProperty("username");
				expect(data).toHaveProperty("token");
				expect(data.username).toBe(testUser.username);

				userToken = data.token;
			} catch (error: any) {
				if (response) {
					error.response = response;
					try {
						error.responseBody = await response.text();
					} catch (e) {
						error.responseBody = "Could not read response body";
					}
				}
				throw error;
			}
		});
	});

	it("should login a user", async () => {
		await runTest("Login User", async () => {
			let response;
			try {
				response = await testClient(loginUserRoute, {
					path: "/api/user",
				}).login.$post({
					json: {
						email: testUser.email,
						password: testUser.password,
					},
				});

				const data = await response.json();
				expect(response.status).toBe(200);
				expect(data).toHaveProperty("message", "Login successful");
				expect(data).toHaveProperty("token");
			} catch (error: any) {
				if (response) {
					error.response = response;
					error.responseBody = await response
						.text()
						.catch(() => "Could not read response body");
				}
				throw error;
			}
		});
	});

	it("should get user information", async () => {
		await runTest("Get User Info", async () => {
			let response;
			try {
				response = await testClient(getUserRoute, {
					path: "/api/user",
				})[":username"].$get({
					param: {
						username: testUser.username,
					},
				});

				const responseBody = await response.text();
				const data = JSON.parse(responseBody);
				expect(response.status).toBe(200);
				expect(data).toHaveProperty("name", testUser.name);
				expect(data).toHaveProperty("email", testUser.email);
				expect(data).toHaveProperty("age", testUser.age);
				expect(data).not.toHaveProperty("password");
				expect(data.username).toBe(testUser.username);
				expect(data.email).toBe(testUser.email);
				expect(data.age).toBe(testUser.age);
			} catch (error: any) {
				if (response) {
					error.response = response;
					error.responseBody = await response
						.text()
						.catch(() => "Could not read response body");
				}
				throw error;
			}
		});
	});

	it("should delete all users", async () => {
		await runTest("Delete All Users", async () => {
			let response;
			try {
				response = await testClient(deleteAllUserRoute, {
					path: "/api/user",
				}).index.$delete({
					headers: {
						Authorization: `Bearer ${userToken}`,
					},
				});

				const responseBody = await response.text();
				const data = JSON.parse(responseBody);
				expect(response.status).toBe(200);
				expect(data).toHaveProperty(
					"message",
					"All users deleted successfully",
				);
				expect(data).toHaveProperty("deletedCount");
				expect(data.deletedCount).toBe(1);
			} catch (error: any) {
				if (response) {
					error.response = response;
					error.responseBody = await response
						.text()
						.catch(() => "Could not read response body");
				}
				throw error;
			}
		});
	});
});
