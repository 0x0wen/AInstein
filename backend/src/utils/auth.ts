import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client } from "@/utils/db"; // your mongodb client

const db = client.db();

export const auth = betterAuth({
	database: mongodbAdapter(db),
	trustedOrigins: ["http://localhost:5173"],
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: Bun.env.GOOGLE_CLIENT_ID as string,
			clientSecret: Bun.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
});
