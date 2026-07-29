/**
 * The report is the thing that leaves the building. Everything here is a
 * promise made in the memorandum, checked rather than trusted.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { parseProject } from "../src/core/parse.ts";
import { renderReportHtml, esc } from "../src/core/report/html.ts";
import type { Project } from "../src/core/types.ts";

const EXAMPLE = new URL("../examples/claims-intake.nelarvo.json", import.meta.url);

async function example(): Promise<Project> {
  return parseProject(await readFile(EXAMPLE, "utf8"));
}

test("the report renders a complete, self-contained document", async () => {
  const html = renderReportHtml(await example());

  assert.ok(html.startsWith("<!doctype html>"));
  assert.ok(html.includes("</html>"));
  // Self-contained: nothing to fetch, from anywhere.
  assert.ok(!/<script/i.test(html), "the report must contain no script");
  assert.ok(!/src\s*=\s*["']https?:/i.test(html), "no remote resources");
  assert.ok(!/<link\b/i.test(html), "no external stylesheet");
});

test("a name is never rendered, even when the file contains one", async () => {
  const project = await example();
  project.decisions[0]!.owner.person = "j.tremblay";

  const html = renderReportHtml(project);
  assert.ok(
    !html.includes("j.tremblay"),
    "the report rendered an individual's name. It must describe roles, never people.",
  );
});

test("a case recorded as already decided says so, and cannot hide it", async () => {
  const project = await example();
  project.case.decision_status = "already_decided";

  const html = renderReportHtml(project);
  assert.ok(html.includes("already decided"));
  assert.ok(html.includes("do not indicate that"));
});

test("an open decision with no alternative is flagged", async () => {
  const project = await example();
  project.case.decision_status = "open";
  project.case.alternatives_considered = [];

  const html = renderReportHtml(project);
  assert.ok(html.includes("No alternative future was recorded"));
});

test("unassessed work is reported and excluded from the headline", async () => {
  const project = await example();
  project.steps[0]!.evidence = "unknown";

  const html = renderReportHtml(project);
  assert.ok(html.includes("not yet known"));
  assert.ok(html.includes("excluded from every figure above"));
});

test("the numbers in the report match the engine", async () => {
  const html = renderReportHtml(await example());
  // The reference case: 709.9 -> 442.4 hrs/week, -38%, 136.3 hrs of new work.
  assert.ok(html.includes("709.9"), "hours before");
  assert.ok(html.includes("442.4"), "hours after");
  assert.ok(html.includes("-38%"), "change");
  assert.ok(html.includes("136.3"), "new work");
});

test("user content is escaped, not injected", async () => {
  const project = await example();
  project.case.title = `<img src=x onerror="alert(1)">`;
  project.steps[0]!.name = `</style><script>alert(2)</script>`;

  const html = renderReportHtml(project);

  // What matters is that no live tag reaches the document. The escaped text
  // may still read "onerror=", which is inert and correct.
  assert.ok(!html.includes("<script>alert(2)"), "a live script tag survived");
  assert.ok(!html.includes("<img src=x"), "a live img tag survived");
  assert.ok(!/<\/style><script/i.test(html), "a step name broke out of the stylesheet");

  assert.ok(html.includes("&lt;img"), "the title should appear escaped");
  assert.ok(html.includes("&lt;script&gt;"), "the step name should appear escaped");
});

test("esc handles the characters that matter", () => {
  assert.equal(esc(`<&>"'`), "&lt;&amp;&gt;&quot;&#39;");
  assert.equal(esc(undefined), "");
  assert.equal(esc(null), "");
});

test("the report avoids consultancy vocabulary", async () => {
  const html = renderReportHtml(await example());
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
  for (const word of banned) {
    assert.ok(
      !new RegExp(`\\b${word}\\b`, "i").test(html),
      `the report says "${word}". If it could appear in a consultancy deck, rewrite it.`,
    );
  }
});

test("the report states its own limits", async () => {
  const html = renderReportHtml(await example());
  assert.ok(html.includes("estimates"));
  assert.ok(html.includes("is not proof"));
});

test("an empty project produces a document rather than a crash", () => {
  const bare: Project = {
    spec_version: "1.0",
    case: {
      id: "empty",
      title: "Empty",
      organization: "",
      scope: "Nothing yet",
      boundary_start: "",
      boundary_end: "",
      technology: "",
      purpose: "",
      sponsor_role: "",
      decision_status: "open",
      period: "week",
      alternatives_considered: [],
      participants: [],
      updated: "2026-07-29",
      maintainer_role: "",
    },
    steps: [],
    scenarios: [],
    decisions: [],
    role_impacts: [],
    capabilities: [],
    pathways: [],
    answers: [],
  };

  const html = renderReportHtml(bare);
  assert.ok(html.includes("</html>"));
  assert.ok(!html.includes("NaN"), "an empty project produced NaN");
  assert.ok(!html.includes("undefined"), "an empty project leaked undefined");
});
