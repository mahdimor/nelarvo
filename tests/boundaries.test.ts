/**
 * Architectural boundaries, enforced rather than trusted.
 *
 * These are the constraints most likely to be broken accidentally by someone
 * being helpful — including a coding agent. The type system cannot express
 * them, so they are tested instead.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join, extname } from "node:path";

const CORE = new URL("../src/core/", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const STUDIO = new URL("../src/studio/", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

async function tsFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await tsFiles(full)));
    else if (extname(entry.name) === ".ts") out.push(full);
  }
  return out;
}

test("the core touches no filesystem, network, or process", async () => {
  const banned = [
    /from\s+["']node:fs/,
    /from\s+["']node:http/,
    /from\s+["']node:https/,
    /from\s+["']node:net/,
    /from\s+["']node:child_process/,
    /from\s+["']node:path/,
    /\bfetch\s*\(/,
    /\bprocess\./,
    /\bXMLHttpRequest\b/,
  ];

  for (const file of await tsFiles(CORE)) {
    const source = await readFile(file, "utf8");
    for (const pattern of banned) {
      assert.ok(
        !pattern.test(source),
        `${file} matches ${pattern}. The core must stay pure — it has to run ` +
          `in a browser, and it is what makes the engine testable.`,
      );
    }
  }
});

test("no AI anywhere in the calculation or checking path", async () => {
  const banned = [
    /openai/i,
    /anthropic/i,
    /\bllm\b/i,
    /completions?\s*\(/i,
    /api[._-]?key/i,
  ];

  for (const file of await tsFiles(CORE)) {
    const source = await readFile(file, "utf8");
    for (const pattern of banned) {
      assert.ok(
        !pattern.test(source),
        `${file} matches ${pattern}. Numbers and findings are deterministic ` +
          `or they are worthless.`,
      );
    }
  }
});

test("the interface never shows an analyst the words we promised to hide", async () => {
  // JSON, schema, lint and check identifiers belong in the code, never on
  // screen. This checks the strings an analyst actually reads.
  const copy = await readFile(join(STUDIO, "copy.ts"), "utf8");
  const body = copy.slice(copy.indexOf("export const COPY"));

  for (const word of ["JSON", "schema", "lint", "YAML"]) {
    assert.ok(
      !new RegExp(`\\b${word}\\b`, "i").test(body),
      `copy.ts says "${word}" to the analyst. Say what they would say instead.`,
    );
  }
});

test("generated wording avoids consultancy vocabulary", async () => {
  const banned = [
    "leverage",
    "synergy",
    "holistic",
    "seamless",
    "best-in-class",
    "robust framework",
    "empower",
    "unlock",
  ];

  const copy = await readFile(join(STUDIO, "copy.ts"), "utf8");
  const body = copy.slice(copy.indexOf("export const COPY"));

  for (const word of banned) {
    assert.ok(
      !new RegExp(`\\b${word}\\b`, "i").test(body),
      `copy.ts uses "${word}". If it could appear in a consultancy deck, rewrite it.`,
    );
  }
});

test("the product name lives in exactly one place", async () => {
  const files = [...(await tsFiles(CORE)), ...(await tsFiles(STUDIO))];

  for (const file of files) {
    if (file.endsWith("brand.ts")) continue;
    const source = await readFile(file, "utf8");
    assert.ok(
      !/\bNelarvo\b/.test(source),
      `${file} hardcodes the product name. Renaming must stay a one-file edit — ` +
        `import it from brand.ts instead.`,
    );
  }
});
