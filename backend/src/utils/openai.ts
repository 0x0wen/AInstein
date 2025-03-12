import OpenAI from "openai";

const OAIClient = new OpenAI({
	apiKey: Bun.env.OPENAI_API_KEY,
});

export default OAIClient;
