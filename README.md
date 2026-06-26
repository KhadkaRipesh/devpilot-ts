# DevPilot

All-in-one AI coding agent CLI — built to learn agentic workflows step by step.

Uses the [Vercel AI SDK](https://sdk.vercel.ai) with [Ollama](https://ollama.com) via the [@ai-sdk/openai](https://www.npmjs.com/package/@ai-sdk/openai) provider to run AI models locally for free.

## What This Covers

This is the foundation for a learning project. It covers:

- **Plugin architecture** — A registry system that lets you add new AI agents without touching existing code
- **Abstract base class** — A contract (`BaseAgent`) that every agent must follow
- **LLM integration** — Ollama connected through the OpenAI-compatible Vercel AI SDK
- **Code Explainer agent** — Your first working agent that reads code and explains it in plain English
- **Test Generator agent** — An agent that generates unit tests, runs them, observes failures, and self-corrects — demonstrating the core agent loop
- **CLI interface** — A terminal tool with colored output and loading spinners

## Prerequisites

- [Node.js](https://nodejs.org) v20+
- [Ollama](https://ollama.com) installed

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/KhadkaRipesh/devpilot-ts.git
cd devpilot-ts

# 2. Install dependencies
npm install

# 3. Pull an AI model (pick one)
ollama pull gemma3:4b           # lighter, faster
ollama pull qwen2.5-coder:7b    # better for code

# 4. Start Ollama (keep running in a separate terminal)
ollama serve

```

## Usage

### List all available agents

```bash
npx tsx src/cli.ts list
```

### Explain any code file

```bash
npx tsx src/cli.ts explain src/core/llm.ts
npx tsx src/cli.ts explain src/agents/explain.ts
npx tsx src/cli.ts explain path/to/any/file.ts
```

### Generate test file of any code file

```bash
npx tsx src/cli.ts testgen examples/math.ts
```
