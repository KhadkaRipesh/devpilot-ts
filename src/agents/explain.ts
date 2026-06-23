import { generateText } from "ai";
import { getExtension, readFile } from "../utils/files.js";
import { BaseAgent, type AgentResult } from "./base-agent.js";
import { getModel } from "../core/index.js";

export class ExplainAgent extends BaseAgent {
  declare readonly name: string;
  declare readonly description: string;

  constructor() {
    super("explain", "Explain code in plain English");
  }

  systemPrompt(): string {
    return [
      "You are an expert code explainer.",
      "When given code, explain what it does in clear, plain English.",
      "Break down the logic step by step.",
      "Mention the language, key patterns used, and any potential issues.",
      "Keep explanations concise but thorough.",
    ].join(" ");
  }

  async run(options: Record<string, unknown>): Promise<AgentResult> {
    const filePath = options.filePath as string | undefined;
    const code = options.code as string | undefined;

    let prompt: string;

    if (filePath) {
      const source = readFile(filePath);
      const lang = getExtension(filePath);
      prompt = `Explain this ${lang} code from \`${filePath}\`:\n\n\`\`\`${lang}\n${source}\n\`\`\``;
    } else if (code) {
      prompt = `Explain this code:\n\n\`\`\`\n${code}\n\`\`\``;
    } else {
      return { success: false, output: "Provide a file path or code snippet." };
    }

    const { output } = await generateText({
      model: getModel(),
      system: this.systemPrompt(),
      prompt,
    });

    console.log(output);

    return { success: true, output };
  }
}
