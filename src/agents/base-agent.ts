export interface AgentResult {
  success: boolean;
  output: string;
  metadata?: Record<string, unknown>;
}

export interface AgentInfo {
  name: string;
  description: string;
}

export abstract class BaseAgent {
  readonly name: string;
  readonly description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  systemPrompt(): string {
    return "You are a helpful coding assistant.";
  }

  abstract run(options: Record<string, unknown>): Promise<AgentResult>;
}
