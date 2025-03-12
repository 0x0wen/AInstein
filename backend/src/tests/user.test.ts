import { getUserRoute, createUserRoute, loginUserRoute, deleteAllUserRoute } from "@/routes/user.route";
import { describe, it, expect } from "bun:test";
import { testClient } from "hono/testing";
import { IUser } from "../models/user.model";
import { ObjectId } from "mongoose";

describe("User API Routes", () => {
  const testUser:IUser = {
    username: "testuser",
    name: "test user",
    email: "test@example.com",
    password: "Password123!",
    age: 25,
  };

  let userToken: string;

  it("should create a new user", async () => {
    const response = await testClient(createUserRoute)["sign-up"].$post({
      json: testUser
    });
    
    const data:any = await response.json();
    expect(response.status).toBe(201);
    expect(data).toHaveProperty("message", "User created successfully");
    expect(data).toHaveProperty("userId");
    expect(data).toHaveProperty("token");
    
    userToken = data.token;
  });

  it("should login a user", async () => {
    const response = await testClient(loginUserRoute).login.$post({
      json: {
        email: testUser.email,
        password: testUser.password
      }
    });
    
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("message", "Login successful");
    expect(data).toHaveProperty("token");
  });

  it("should get user information", async () => {
    const response = await testClient(getUserRoute)[":id"].$get({
      param: {
        id: "me"
      }
    });
    
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("name", testUser.name);
    expect(data).toHaveProperty("email", testUser.email);
  });

  it("should delete all users", async () => {
    const response = await testClient(deleteAllUserRoute).index.$delete();
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("message", "All users deleted successfully");
    expect(data).toHaveProperty("count");
  });
});