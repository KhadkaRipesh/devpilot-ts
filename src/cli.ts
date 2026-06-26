#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { registry } from "./core/index.js";
import "./agents/index.js";

const program = new Command();

program
  .name("devpilot")
  .description("DevPilot — All-in-one AI coding agent")
  .version("0.1.0");

program
  .command("list")
  .description("List all available agent features")
  .action(() => {
    console.log(chalk.bold("\nAvailable Agents:\n"));
    for (const agent of registry.list()) {
      console.log(
        `  ${chalk.cyan(agent.name.padEnd(12))} ${agent.description}`,
      );
    }
    console.log();
  });

program
  .command("explain <file>")
  .description("Explain a code file in plain English")
  .action(async (file: string) => {
    const spinner = ora("Analyzing code...").start();
    const agent = registry.get("explain")!;
    const result = await agent.run({ filePath: file });
    spinner.stop();
    console.log(result.output);
  });

program
  .command("testgen <file>")
  .description("Generate and run tests for a code file")
  .action(async (file: string) => {
    const spinner = ora("Generating tests (may retry on failures)...").start();
    const agent = registry.get("testgen")!;
    const result = await agent.run({ filePath: file });
    spinner.stop();

    const icon = result.success ? chalk.green("✓") : chalk.red("✗");
    console.log(`${icon} ${result.output}`);
  });

program.parse();
