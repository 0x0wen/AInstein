import OpenAI from "openai";

const oaiClient = new OpenAI({
	apiKey: Bun.env.OPENAI_API_KEY,
});

export default oaiClient;
