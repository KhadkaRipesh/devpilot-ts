import {
  readFileSync,
  readdirSync,
  statSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "fs";
import { resolve, extname, join, basename } from "path";

export function readFile(filePath: string): string {
  const resolved = resolve(filePath);
  return readFileSync(resolved, "utf-8");
}

export function getExtension(filePath: string): string {
  return extname(filePath).replace(".", "");
}

export function listFiles(dir: string, extensions?: string[]): string[] {
  const results: string[] = [];

  function walk(currentDir: string) {
    for (const entry of readdirSync(currentDir)) {
      if (entry.startsWith(".") || entry === "node_modules") continue;

      const full = join(currentDir, entry);
      const stat = statSync(full);

      if (stat.isDirectory()) {
        walk(full); // Recurse into subdirectories
      } else if (!extensions || extensions.some((ext) => entry.endsWith(ext))) {
        results.push(full);
      }
    }
  }

  walk(resolve(dir));
  return results.sort();
}

export function saveFile(testCode: string, sourcePath: string): string {
  const testsDir = join(resolve("."), "examples");
  if (!existsSync(testsDir)) {
    mkdirSync(testsDir, { recursive: true });
  }
  const testFile = join(testsDir, `test_${basename(sourcePath)}`);
  writeFileSync(testFile, testCode, "utf-8");
  return testFile;
}
