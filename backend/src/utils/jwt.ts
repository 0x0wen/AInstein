import { sign, verify } from "hono/jwt";

export interface JWTPayload {
	userId: string;
	email: string;
	iat?: number;
	exp?: number;
}

export default class JWTUtil {
	static async generateToken(
		payload: Omit<JWTPayload, "iat" | "exp">,
	): Promise<string> {
		const iat = Math.floor(Date.now() / 1000);
		const exp = iat + 3600;

		if (!Bun.env.JWT_SECRET) {
			throw new Error("JWT secret is required to generate token");
		}
		return await sign(
			{
				...payload,
				iat,
				exp,
			},
			Bun.env.JWT_SECRET,
			"HS256",
		);
	}

	static async verifyToken(token: string) {
		if (!Bun.env.JWT_SECRET) {
			throw new Error("JWT secret is required to verify token");
		}
		return await verify(token, Bun.env.JWT_SECRET, "HS256");
	}
}
