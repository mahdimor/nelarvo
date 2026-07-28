/**
 * The local process behind the Studio window.
 *
 * It binds to 127.0.0.1 only, serves the interface, and reads and writes case
 * files in the folder where it was launched. That is the entire surface. There
 * are no accounts, no database, no telemetry, and no route that reaches
 * anything outside the working folder.
 *
 * TypeScript is stripped on the fly by Node itself, so the browser can import
 * the same core modules the tests run against — no bundler, no build step, and
 * no chance of the interface and the engine drifting apart.
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { stripTypeScriptTypes } from "node:module";
import { spawn } from "node:child_process";

import { BRAND } from "../core/brand.ts";
import { parseProject, serializeProject, ProjectFileError } from "../core/parse.ts";
import type { Project } from "../core/types.ts";

// Node warns once that type stripping is experimental. It is accurate but
// alarming for someone who just wanted to open a window, so we mute that one
// message and nothing else.
const emit = process.emit.bind(process);
// @ts-expect-error narrow monkey patch, deliberately untyped
process.emit = (name, data, ...rest) => {
  if (
    name === "warning" &&
    data instanceof Error &&
    data.name === "ExperimentalWarning" &&
    data.message.includes("stripTypeScriptTypes")
  ) {
    return false;
  }
  // @ts-expect-error see above
  return emit(name, data, ...rest);
};

const SRC_ROOT = resolve(fileURLToPath(import.meta.url), "..", "..");
const PKG_ROOT = resolve(SRC_ROOT, "..");
const CASE_SUFFIX = ".nelarvo.json";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".ts": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function send(
  res: ServerResponse,
  status: number,
  body: string | Buffer,
  type = "text/plain; charset=utf-8",
): void {
  res.writeHead(status, {
    "content-type": type,
    // Nothing here should ever be cached by a proxy, and there is no proxy.
    "cache-control": "no-store",
  });
  res.end(body);
}

function sendJson(res: ServerResponse, status: number, value: unknown): void {
  send(res, status, JSON.stringify(value), MIME[".json"]!);
}

/** Only plain case files, only in the working folder, never a path. */
function safeCasePath(name: string): string | null {
  const base = basename(name);
  if (base !== name) return null;
  if (!base.endsWith(CASE_SUFFIX)) return null;
  if (base.includes("..")) return null;
  return join(process.cwd(), base);
}

async function serveStatic(res: ServerResponse, urlPath: string): Promise<void> {
  const relative = urlPath === "/" ? "studio/index.html" : urlPath.replace(/^\//, "");
  const full = resolve(SRC_ROOT, relative);

  // Never serve outside src/, whatever the URL claims.
  if (!full.startsWith(SRC_ROOT) || !existsSync(full)) {
    return send(res, 404, "Not found");
  }

  const ext = extname(full);
  const type = MIME[ext] ?? "application/octet-stream";

  if (ext === ".ts") {
    const source = await readFile(full, "utf8");
    const js = stripTypeScriptTypes(source, { mode: "strip" });
    return send(res, 200, js, type);
  }

  return send(res, 200, await readFile(full), type);
}

async function listCases(): Promise<unknown[]> {
  const names = (await readdir(process.cwd())).filter((n) => n.endsWith(CASE_SUFFIX));
  const out = [];

  for (const file of names) {
    try {
      const project = parseProject(await readFile(join(process.cwd(), file), "utf8"));
      out.push({
        file,
        title: project.case.title,
        scope: project.case.scope,
        updated: project.case.updated,
        steps: project.steps.length,
      });
    } catch {
      // A file we cannot read is simply not offered. It is not an error the
      // analyst needs to see on the start screen.
    }
  }
  return out.sort((a, b) => String(b.updated).localeCompare(String(a.updated)));
}

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > 8_000_000) throw new Error("That case file is implausibly large.");
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  const path = url.pathname;

  if (path === "/api/cases") {
    return sendJson(res, 200, await listCases());
  }

  if (path === "/api/example") {
    const file = "claims-intake.nelarvo.json";
    const full = join(PKG_ROOT, "examples", file);
    if (!existsSync(full)) return sendJson(res, 404, { error: "No example installed." });
    return sendJson(res, 200, {
      file,
      project: parseProject(await readFile(full, "utf8")),
    });
  }

  if (path.startsWith("/api/case/")) {
    const name = decodeURIComponent(path.slice("/api/case/".length));
    const full = safeCasePath(name);
    if (!full) return sendJson(res, 400, { error: "Not a case file name." });

    if (req.method === "GET") {
      if (!existsSync(full)) return sendJson(res, 404, { error: "No such case." });
      return sendJson(res, 200, parseProject(await readFile(full, "utf8")));
    }

    if (req.method === "PUT") {
      const project = JSON.parse(await readBody(req)) as Project;
      await writeFile(full, serializeProject(project), "utf8");
      return sendJson(res, 200, { file: basename(full) });
    }

    return sendJson(res, 405, { error: "Method not allowed." });
  }

  if (req.method !== "GET") return send(res, 405, "Method not allowed");
  return serveStatic(res, path);
}

function openBrowser(url: string): void {
  const command =
    process.platform === "win32"
      ? ["cmd", ["/c", "start", "", url]]
      : process.platform === "darwin"
        ? ["open", [url]]
        : ["xdg-open", [url]];

  try {
    spawn(command[0] as string, command[1] as string[], {
      detached: true,
      stdio: "ignore",
    }).unref();
  } catch {
    // Not being able to open a browser is not a reason to fail. The URL is
    // printed either way.
  }
}

export function startStudio(port = 7777, open = true): void {
  const server = createServer((req, res) => {
    handle(req, res).catch((e: unknown) => {
      if (e instanceof ProjectFileError) {
        return sendJson(res, 422, { error: e.message, problems: e.problems });
      }
      const message = e instanceof Error ? e.message : String(e);
      sendJson(res, 500, { error: message });
    });
  });

  server.on("error", (e: NodeJS.ErrnoException) => {
    if (e.code === "EADDRINUSE") {
      process.stderr.write(
        `\n  Port ${port} is busy. Try: ${BRAND.command} studio --port ${port + 1}\n\n`,
      );
      process.exit(1);
    }
    throw e;
  });

  // 127.0.0.1, never 0.0.0.0. Nothing on the network can reach this.
  server.listen(port, "127.0.0.1", () => {
    const url = `http://127.0.0.1:${port}`;
    process.stdout.write(
      `\n  ${BRAND.name} is open at ${url}\n` +
        `  Cases are read from and written to ${process.cwd()}\n` +
        `  Nothing leaves this machine. Press Ctrl+C to stop.\n\n`,
    );
    if (open) openBrowser(url);
  });
}
