import type { LanguageModel } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

let cachedModel: LanguageModel | null = null;

export function getModel(modelName = "gemma3:4b"): LanguageModel {
  // if (cachedModel) return cachedModel;

  const ollama = createOpenAI({
    baseURL: "http://localhost:11434/v1",
    apiKey: "ollama",
  });

  cachedModel = ollama(modelName);

  return cachedModel;
}
