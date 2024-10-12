import { ChatOpenAI } from "@langchain/openai";
import dotenv from 'dotenv';

dotenv.config();

const chatOpenIA = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 1,
    maxTokens: 60,
    timeout: undefined,
    maxRetries: 2,
    apiKey: process.env.OPENAI_API_KEY,
});

export default chatOpenIA;