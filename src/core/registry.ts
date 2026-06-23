import { BaseAgent, type AgentInfo } from "../agents/base-agent.js";

class AgentRegistry {
  private agents = new Map<string, BaseAgent>();

  register(agent: BaseAgent): void {
    this.agents.set(agent.name, agent);
  }

  get(name: string): BaseAgent | undefined {
    return this.agents.get(name);
  }

  list(): AgentInfo[] {
    return Array.from(this.agents.values()).map((a) => ({
      name: a.name,
      description: a.description,
    }));
  }
}

// Single global instance.. All agents register to this
export const registry = new AgentRegistry();
