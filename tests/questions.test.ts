/**
 * The ten questions make exactly one promise, and it is the one worth testing:
 * skipping is allowed, hiding that it was skipped is not.
 *
 * The counts make a second: they describe what is in the file, and they say
 * what they did not count. A summary that lists only its own measurements reads
 * as complete, which is the failure being guarded against here.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { parseProject, serializeProject } from "../src/core/parse.ts";
import { renderReportHtml } from "../src/core/report/html.ts";
import { summaryCounts, workflowTotals } from "../src/core/calc/index.ts";
import {
  QUESTIONS,
  questionStates,
  unansweredQuestions,
} from "../src/core/questions.ts";
import type { Project } from "../src/core/types.ts";

const EXAMPLE = new URL("../examples/claims-intake.nelarvo.json", import.meta.url);

async function example(): Promise<Project> {
  return parseProject(await readFile(EXAMPLE, "utf8"));
}

test("the question identifiers are stable, unique and ten", () => {
  const ids = QUESTIONS.map((q) => q.id);
  assert.equal(ids.length, 10);
  assert.equal(new Set(ids).size, 10);
  assert.deepEqual(ids, [
    "P01",
    "P02",
    "P03",
    "P04",
    "P05",
    "P06",
    "P07",
    "P08",
    "P09",
    "P10",
  ]);
});

test("an empty answer is not an answer", async () => {
  const project = await example();
  project.answers = [
    { prompt_id: "P01", answer: "   " },
    { prompt_id: "P02", answer: "The chase work moves to the intake clerk." },
  ];

  const states = questionStates(project);
  assert.equal(states.find((s) => s.question.id === "P01")!.answered, false);
  assert.equal(states.find((s) => s.question.id === "P02")!.answered, true);
  assert.equal(unansweredQuestions(project).length, 9);
});

test("a skipped question is named in the report, not quietly dropped", async () => {
  const project = await example();
  project.answers = [
    { prompt_id: "P10", answer: "A leakage rate above 4% by March.", answered_by_role: "VP Claims" },
  ];

  const html = renderReportHtml(project);

  assert.ok(html.includes("A leakage rate above 4% by March."));
  assert.ok(html.includes("VP Claims"));
  assert.ok(html.includes("9 of 10 were not"), "the skipped count is missing");
  // The text of a skipped question has to appear, or it is hidden by omission.
  assert.ok(html.includes(QUESTIONS[0]!.question));
  assert.ok(html.includes("9 of 10 questions unanswered"));
});

test("answering every question removes the warning but claims nothing", async () => {
  const project = await example();
  project.answers = QUESTIONS.map((q) => ({ prompt_id: q.id, answer: `Answer to ${q.id}.` }));

  const html = renderReportHtml(project);
  assert.ok(!html.includes("were not"), "nothing was skipped, so nothing should say so");
  assert.ok(html.includes("0 of 10 questions unanswered"));
  // No grade, ever.
  assert.ok(html.includes("These are counts, not a grade."));
});

test("the counts match the engine rather than being recomputed", async () => {
  const project = await example();
  const s = summaryCounts(project);
  const t = workflowTotals(project);

  assert.equal(s.hours_before, t.hours_before);
  assert.equal(s.hours_after, t.hours_after);
  assert.equal(s.change_pct, t.change_pct);
  assert.equal(s.new_work_hours, t.new_work_hours);
  assert.equal(s.step_count, t.step_count);
});

test("a step nobody has decided about is counted as undecided", async () => {
  const project = await example();
  const before = summaryCounts(project).steps_not_decided;

  project.scenarios[0]!.assignments = project.scenarios[0]!.assignments.slice(1);
  assert.equal(summaryCounts(project).steps_not_decided, before + 1);

  // An explicit "not yet decided" counts the same as no answer at all.
  project.scenarios[0]!.assignments[0]!.allocation = "unresolved";
  assert.equal(summaryCounts(project).steps_not_decided, before + 2);
});

test("the summary says what it did not count", async () => {
  const s = summaryCounts(await example());
  assert.ok(s.not_counted.length >= 3);
  assert.ok(s.not_counted.some((x) => x.includes("authority")));
  assert.ok(s.not_counted.some((x) => x.includes("offering")));

  const html = renderReportHtml(await example());
  assert.ok(html.includes("This summary does not count"));
});

test("one future examined while the decision is open is a count", async () => {
  const project = await example();
  project.case.decision_status = "open";
  project.case.alternatives_considered = [];
  assert.equal(summaryCounts(project).single_future_considered, true);

  project.case.alternatives_considered = ["Keep it fully human"];
  assert.equal(summaryCounts(project).single_future_considered, false);
});

test("an answer survives a round trip through the file", async () => {
  const project = await example();
  project.answers = [
    { prompt_id: "P03", answer: "Operations keeps the saving.", answered_by_role: "Analyst" },
  ];

  const reread = parseProject(serializeProject(project));
  assert.deepEqual(reread.answers, project.answers);
});
