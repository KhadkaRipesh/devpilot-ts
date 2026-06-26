import { generateText } from "ai";
import { execSync } from "child_process";
import { writeFileSync, mkdirSync, copyFileSync } from "fs";
import { tmpdir } from "os";
import { join, resolve, basename } from "path";
import { BaseAgent, type AgentResult } from "./base-agent.js";
import { getModel } from "../core/llm.js";
import { readFile, getExtension, saveFile } from "../utils/files.js";

export class TestGenAgent extends BaseAgent {
  private maxRetries = 10;

  constructor() {
    super("testgen", "Generate unit tests, run them, fix failures");
  }

  systemPrompt(): string {
    return [
      "You are an expert test engineer.",
      "Given source code, write comprehensive unit tests.",
      "For TypeScript/JavaScript, use Node.js built-in test runner (node:test).",
      "Import the test functions: import { describe, it } from 'node:test';",
      "Import assert: import assert from 'node:assert';",
      "Import the source file using a relative path: import { myFunc } from './filename.js';",
      "Return ONLY the test file contents — no explanation, no markdown fences.",
    ].join(" ");
  }

  async run(options: Record<string, unknown>): Promise<AgentResult> {
    const filePath = options.filePath as string;
    const source = readFile(filePath);
    const lang = getExtension(filePath);

    const prompt = [
      `Write unit tests for this ${lang} code.`,
      `Source file: \`${basename(filePath)}\`\n`,
      `\`\`\`${lang}\n${source}\n\`\`\``,
    ].join("\n");

    let { text: testCode } = await generateText({
      model: getModel(),
      system: this.systemPrompt(),
      prompt,
    });

    testCode = this.cleanCode(testCode);

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      const runResult = this.runTests(testCode, lang, filePath);

      if (runResult.passed) {
        const savedPath = saveFile(testCode, filePath);

        return {
          success: true,
          output: `All tests passed on attempt ${attempt}.\n\nTest saved to: ${savedPath}`,
          metadata: { attempts: attempt, testCode },
        };
      }

      const fixPrompt = [
        "The tests failed. Fix them.\n",
        `Source code:\n\`\`\`${lang}\n${source}\n\`\`\`\n`,
        `Current tests:\n\`\`\`${lang}\n${testCode}\n\`\`\`\n`,
        `Error output:\n\`\`\`\n${runResult.output}\n\`\`\`\n`,
        "Return ONLY the corrected test file contents.",
      ].join("\n");

      const result = await generateText({
        model: getModel(),
        system: this.systemPrompt(),
        prompt: fixPrompt,
      });
      testCode = this.cleanCode(result.text);
    }

    const savedPath = saveFile(testCode, filePath);
    return {
      success: false,
      output: `Tests still failing after ${this.maxRetries} attempts.\n\nLast attempt saved to: ${savedPath}`,
      metadata: { attempts: this.maxRetries, testCode },
    };
  }

  private runTests(
    testCode: string,
    lang: string,
    sourcePath: string,
  ): { passed: boolean; output: string } {
    if (lang !== "ts" && lang !== "js") {
      return { passed: true, output: "(auto-run only supported for JS/TS)" };
    }

    const tmp = join(tmpdir(), `devpilot-test-${Date.now()}`);
    mkdirSync(tmp, { recursive: true });

    const srcFile = resolve(sourcePath);
    copyFileSync(srcFile, join(tmp, basename(srcFile)));

    const testFileName = `test_${basename(sourcePath)}`;
    writeFileSync(join(tmp, testFileName), this.cleanCode(testCode));

    try {
      const output = execSync(`npx tsx --test ${testFileName}`, {
        cwd: tmp,
        encoding: "utf-8",
        timeout: 30_000,
      });
      return { passed: true, output };
    } catch (err: unknown) {
      const e = err as { stdout?: string; stderr?: string };
      return {
        passed: false,
        output: (e.stdout ?? "") + (e.stderr ?? ""),
      };
    }
  }

  private cleanCode(code: string): string {
    return code
      .replace(/^```(?:ts|typescript|js|javascript)?\n/gm, "")
      .replace(/```$/gm, "")
      .trim();
  }
}
