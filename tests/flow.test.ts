/**
 * The diagram is an argument, not decoration. Every promise it makes to a
 * reader is checked here rather than trusted to whoever last adjusted a
 * coordinate.
 *
 * Geometry is deliberately not asserted pixel by pixel — that would break on
 * every visual improvement and prove nothing. What is asserted is proportion,
 * which is the only thing a reader is entitled to rely on.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { parseProject, validateProject } from "../src/core/parse.ts";
import { renderFlowSvg } from "../src/core/report/flow.ts";
import { workflowTotals } from "../src/core/calc/index.ts";
import type { Project } from "../src/core/types.ts";

const EXAMPLE = new URL("../examples/claims-intake.nelarvo.json", import.meta.url);

async function example(): Promise<Project> {
  return parseProject(await readFile(EXAMPLE, "utf8"));
}

/** Every block in one lane, as [y, height]. */
function blocks(svg: string, x: number): [number, number][] {
  const pattern = new RegExp(
    `<rect x="${x}" y="([\\d.]+)" width="\\d+" height="([\\d.]+)"`,
    "g",
  );
  return [...svg.matchAll(pattern)].map((m) => [Number(m[1]), Number(m[2])]);
}

/** The two lane positions, read from the drawing rather than assumed. */
function laneX(svg: string): [number, number] {
  const xs = [...svg.matchAll(/<rect x="(\d+)" y="[\d.]+" width="(\d+)"/g)]
    .filter((m) => Number(m[2]) > 40)
    .map((m) => Number(m[1]));
  const unique = [...new Set(xs)].sort((a, b) => a - b);
  return [unique[0]!, unique[1]!];
}

test("both lanes are drawn to one scale, so a halved workflow looks halved", async () => {
  const project = await example();
  const svg = renderFlowSvg(project);
  const totals = workflowTotals(project);

  const [xBefore, xAfter] = laneX(svg);
  const height = (list: [number, number][]) =>
    list.reduce((sum, [, h]) => sum + h, 0);

  const beforePx = height(blocks(svg, xBefore));
  const afterPx = height(blocks(svg, xAfter));

  // Pixels per hour, each side. They must agree — that is the whole promise.
  const scaleBefore = beforePx / totals.hours_before;
  const scaleAfter = afterPx / totals.hours_after;

  assert.ok(
    Math.abs(scaleBefore - scaleAfter) < 0.01,
    `the lanes use different scales: ${scaleBefore} against ${scaleAfter}`,
  );
  assert.ok(afterPx < beforePx, "this case shrinks, and the picture must show it");
});

test("work that did not exist before is marked as new", async () => {
  const svg = renderFlowSvg(await example());
  assert.ok(svg.includes("stroke-dasharray"), "created work has no marking");
  assert.ok(svg.includes("new work"), "created work is not labelled");
  assert.ok(svg.includes("work nobody does today"));
});

test("work whose fate is unknown is hatched, not quietly drawn as settled", async () => {
  const project = await example();
  project.steps[0]!.evidence = "unknown";

  const svg = renderFlowSvg(project);
  assert.ok(svg.includes("url(#nlv-unassessed)"), "unassessed work is not hatched");
  assert.ok(svg.includes("not yet assessed"));
});

test("rework is drawn coming back, and only when a step says so", async () => {
  const project = await example();
  assert.ok(
    renderFlowSvg(project).includes("sends work back to"),
    "the reference case has a chase step that returns, and it is not drawn",
  );

  for (const step of project.steps) delete step.returns_to;
  assert.ok(!renderFlowSvg(project).includes("sends work back to"));
});

test("a step cannot send work back to itself, or to nothing", async () => {
  const project = await example();

  project.steps[1]!.returns_to = "nowhere";
  assert.ok(
    validateProject(project).some((p) => p.path === "steps[1].returns_to"),
    "a dangling return was accepted",
  );

  project.steps[1]!.returns_to = project.steps[1]!.id;
  assert.ok(
    validateProject(project).some((p) =>
      p.message.includes("cannot send work back to itself"),
    ),
  );
});

test("no name reaches the diagram, even when the file contains one", async () => {
  const project = await example();
  project.decisions[0]!.owner.person = "j.tremblay";

  assert.ok(!renderFlowSvg(project).includes("j.tremblay"));
});

test("a step name cannot break out of the drawing", async () => {
  const project = await example();
  project.steps[0]!.name = `</text><script>alert(1)</script>`;

  const svg = renderFlowSvg(project);
  assert.ok(!svg.includes("<script>"), "a live script tag survived");
  assert.ok(!/<\/text><script/.test(svg), "a step name escaped its element");
  assert.ok(svg.includes("&lt;"), "the name should appear escaped");
});

test("a workflow with no steps produces no diagram rather than an empty frame", () => {
  const bare = {
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
      updated: "2026-08-05",
      maintainer_role: "",
    },
    steps: [],
    scenarios: [],
    decisions: [],
    role_impacts: [],
    capabilities: [],
    pathways: [],
    answers: [],
  } as Project;

  assert.equal(renderFlowSvg(bare), "");
});

test("the same project always draws the same picture", async () => {
  const project = await example();
  assert.equal(renderFlowSvg(project), renderFlowSvg(project));
});
