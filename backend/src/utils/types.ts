import { z } from "zod";

export const errorResponseSchema = z.object({
	message: z.string(),
	error: z.string().optional(),
});
