import { GoogleGenAI, type Content } from "@google/genai";
import db from "../db/knex";

const GEMINI_MODEL = "gemini-2.5-flash";
const MAX_HISTORY_MESSAGES = 10;
const MAX_OUTPUT_TOKENS = 1000;

let genAI: GoogleGenAI | null = null;
let systemPrompt = "";

export async function initLLM(): Promise<void> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required to start the AI service");
  }

  genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const rows = await db<{ key: string; value: string }>(
    "store_knowledge",
  ).select("key", "value");
  systemPrompt = buildSystemPrompt(rows);

  console.log("LLM initialized with ShopSpur store knowledge");
}

export async function generateReply(
  history: Array<{ sender: string; text: string }>,
  userMessage: string,
): Promise<string> {
  try {
    if (!genAI) {
      throw new Error("AI_NOT_INITIALIZED");
    }

    const result = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: [...formatHistory(history), createUserContent(userMessage)],
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
      },
    });

    if (!result.text) {
      throw new Error("EMPTY_AI_RESPONSE");
    }

    return result.text;
  } catch (error) {
    throw mapLLMError(error);
  }
}

function buildSystemPrompt(
  rows: Array<{ key: string; value: string }>,
): string {
  const knowledgeBlock = rows
    .map((row) => `${row.key.toUpperCase()}: ${row.value}`)
    .join("\n");

  return `You are a helpful support agent for ShopSpur.
Answer clearly and concisely in a friendly tone.
If you are unsure, direct customers to support@shopspur.com.
Never make up order details.

Store knowledge:
${knowledgeBlock}`;
}

function formatHistory(
  history: Array<{ sender: string; text: string }>,
): Content[] {
  return history.slice(-MAX_HISTORY_MESSAGES).map((message) => ({
    role: message.sender === "user" ? "user" : "model",
    parts: [{ text: message.text }],
  }));
}

function createUserContent(text: string): Content {
  return {
    role: "user",
    parts: [{ text }],
  };
}

function mapLLMError(error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("429")) {
    return new Error("RATE_LIMIT");
  }

  if (message.includes("API_KEY")) {
    return new Error("INVALID_KEY");
  }

  if (message.includes("AI_NOT_INITIALIZED")) {
    return new Error("AI_NOT_READY");
  }

  return new Error("LLM_ERROR");
}
