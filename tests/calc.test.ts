/**
 * The engine's numbers must be reproducible by hand. Every fixture here uses
 * round figures so a reader can verify the expected values with a calculator
 * and no trust in the code.
 *
 * If a change makes one of these fail, the change is wrong until proven
 * otherwise. These numbers are the product's credibility.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import type { Project } from "../src/core/types.ts";
import {
  capabilityDemand,
  capabilityGaps,
  reviewLoadMinutes,
  roleComposition,
  stepHours,
  stepShifts,
  toFte,
  workflowTotals,
  WORKING_DAY_MINUTES,
} from "../src/core/calc/index.ts";
import {
  parseProject,
  serializeProject,
  validateProject,
} from "../src/core/parse.ts";

/**
 * Hand-computable fixture.
 *
 *   A  Clerk    100 x  6 min = 600 min = 10 h   data_handling
 *   B  Clerk     50 x 12 min = 600 min = 10 h   routine_judgment
 *   C  Analyst   20 x 30 min = 600 min = 10 h   complex_judgment
 *   ------------------------------------------------------------
 *   before                              = 30 h
 *
 * Scenario "future":
 *   A  rule_automated                   ->  0 h
 *   B  ai_exception_review, share 0.2   ->  50 x 12 x 0.2 / 60 =  2 h
 *   C  human (unchanged)                -> 10 h
 *   +  new: "Review AI output" Analyst, 50 x 6 min          =  5 h
 *   ------------------------------------------------------------
 *   after                               = 17 h   (delta -13 h, -43%)
 */
function fixture(): Project {
  return {
    spec_version: "1.0",
    case: {
      id: "test-case",
      title: "Test case",
      organization: "Example",
      scope: "Test workflow",
      boundary_start: "start",
      boundary_end: "end",
      technology: "Test AI",
      purpose: "testing",
      sponsor_role: "Sponsor",
      decision_status: "open",
      period: "week",
      alternatives_considered: [],
      participants: [],
      updated: "2026-07-28",
      maintainer_role: "Analyst",
    },
    steps: [
      {
        id: "a",
        name: "Step A",
        sequence: 1,
        role: "Clerk",
        volume_per_period: 100,
        minutes_per_unit: 6,
        work_type: "data_handling",
        capabilities: ["typing"],
        is_decision_point: false,
        is_invisible_work: false,
        exposure: { feasible: "yes", share_addressable: 1, evidence: "documented" },
        evidence: "documented",
        origin: "human",
      },
      {
        id: "b",
        name: "Step B",
        sequence: 2,
        role: "Clerk",
        volume_per_period: 50,
        minutes_per_unit: 12,
        work_type: "routine_judgment",
        capabilities: ["policy lookup"],
        is_decision_point: false,
        is_invisible_work: false,
        exposure: { feasible: "partly", share_addressable: 0.8, evidence: "reported" },
        evidence: "reported",
        origin: "human",
      },
      {
        id: "c",
        name: "Step C",
        sequence: 3,
        role: "Analyst",
        volume_per_period: 20,
        minutes_per_unit: 30,
        work_type: "complex_judgment",
        capabilities: ["judgment"],
        is_decision_point: true,
        is_invisible_work: false,
        exposure: { feasible: "unknown", share_addressable: 0, evidence: "unknown" },
        evidence: "unknown",
        origin: "human",
      },
    ],
    scenarios: [
      {
        id: "future",
        name: "Proposed",
        description: "",
        assignments: [
          {
            step_id: "a",
            allocation: "rule_automated",
            human_share: 0,
            evidence: "proposed",
            origin: "human",
          },
          {
            step_id: "b",
            allocation: "ai_exception_review",
            human_share: 0.2,
            confidence_floor: 0.9,
            on_low_confidence: "escalate_human",
            review_capacity: { items_per_day: 200, minutes_per_item: 3 },
            evidence: "proposed",
            origin: "human",
            creates_steps: [
              {
                id: "b-review",
                name: "Review AI output",
                role: "Analyst",
                volume_per_period: 50,
                minutes_per_unit: 6,
                work_type: "supervision",
                capabilities: ["ai output evaluation"],
              },
            ],
          },
          {
            step_id: "c",
            allocation: "human",
            human_share: 1,
            evidence: "proposed",
            origin: "human",
          },
        ],
      },
    ],
    decisions: [],
    role_impacts: [],
    capabilities: [
      {
        capability: "ai output evaluation",
        role: "Analyst",
        readiness: "nobody_does",
      },
    ],
    pathways: [],
    answers: [],
  };
}

test("stepHours multiplies volume by duration", () => {
  const p = fixture();
  assert.equal(stepHours(p.steps[0]!), 10);
  assert.equal(stepHours(p.steps[1]!), 10);
  assert.equal(stepHours(p.steps[2]!), 10);
});

test("toFte divides by the period's full-time hours", () => {
  assert.equal(toFte(37.5, "week"), 1);
  assert.equal(toFte(162.5, "month"), 1);
  assert.equal(toFte(30, "week"), 0.8);
});

test("workflow totals match the hand calculation", () => {
  const t = workflowTotals(fixture());
  assert.equal(t.hours_before, 30);
  assert.equal(t.hours_after, 17);
  assert.equal(t.hours_delta, -13);
  assert.equal(t.change_pct, -43);
  assert.equal(t.new_work_hours, 5);
  assert.equal(t.step_count, 3);
  assert.equal(t.role_count, 2);
});

test("unassessed hours are reported separately, not hidden in the total", () => {
  const t = workflowTotals(fixture());
  // Step C has unknown evidence and unknown feasibility: 10 of 30 hours.
  assert.equal(t.unassessed_hours, 10);
  assert.equal(t.unassessed_share, 33);
  // ...and it still counts in the totals, because people really do that work.
  assert.equal(t.hours_before, 30);
});

test("role composition splits hours by kind of work, before and after", () => {
  const comps = roleComposition(fixture());
  const clerk = comps.find((c) => c.role === "Clerk")!;
  const analyst = comps.find((c) => c.role === "Analyst")!;

  assert.equal(clerk.before.hours, 20);
  assert.equal(clerk.after.hours, 2);
  assert.equal(clerk.hours_delta, -18);

  assert.equal(analyst.before.hours, 10);
  assert.equal(analyst.after.hours, 15); // 10 kept + 5 new supervision
  assert.equal(analyst.hours_delta, 5);

  const supervision = analyst.after.by_work_type.find(
    (s) => s.work_type === "supervision",
  )!;
  assert.equal(supervision.hours, 5);
  assert.equal(supervision.share, 33); // 5 of 15
});

test("a role can shrink in hours while a work type grows in share", () => {
  const clerk = roleComposition(fixture()).find((c) => c.role === "Clerk")!;
  const routineBefore = clerk.before.by_work_type.find(
    (s) => s.work_type === "routine_judgment",
  )!;
  const routineAfter = clerk.after.by_work_type.find(
    (s) => s.work_type === "routine_judgment",
  )!;

  assert.equal(routineBefore.share, 50); // 10 of 20
  assert.equal(routineAfter.share, 100); // 2 of 2
  assert.ok(routineAfter.hours < routineBefore.hours); // ...on fewer hours
});

test("new work appears as new, not as a reinvested saving", () => {
  const shifts = stepShifts(fixture());
  const created = shifts.find((s) => s.step_id === "b-review")!;
  assert.equal(created.is_new, true);
  assert.equal(created.hours_before, 0);
  assert.equal(created.hours_after, 5);
  assert.equal(created.role_after, "Analyst");
});

test("step shifts are ordered by size of change", () => {
  const shifts = stepShifts(fixture());
  assert.equal(shifts[0]!.step_id, "a"); // -10, the biggest move
  assert.equal(shifts[0]!.delta, -10);
});

test("capability demand follows the hours of the work that needs it", () => {
  const demand = capabilityDemand(fixture());
  const by = (name: string) => demand.find((d) => d.capability === name)!;

  assert.equal(by("typing").delta, -10);
  assert.equal(by("policy lookup").delta, -8);
  assert.equal(by("judgment").delta, 0);
  assert.equal(by("ai output evaluation").delta, 5);
  assert.deepEqual(by("ai output evaluation").roles_after, ["Analyst"]);
});

test("capability gaps put rising demand nobody can meet first", () => {
  const gaps = capabilityGaps(fixture());
  assert.equal(gaps[0]!.capability, "ai output evaluation");
  assert.equal(gaps[0]!.readiness, "nobody_does");
  assert.equal(gaps[0]!.is_gap, true);
});

test("review load is measured against a real working day", () => {
  const p = fixture();
  const a = p.scenarios[0]!.assignments[1]!;
  assert.equal(reviewLoadMinutes(a), 600); // 200 items x 3 min
  assert.ok(600 > WORKING_DAY_MINUTES); // impossible, and a check will say so
});

test("an empty project produces zeros, not NaN", () => {
  const p = fixture();
  p.steps = [];
  p.scenarios[0]!.assignments = [];
  const t = workflowTotals(p);
  assert.equal(t.hours_before, 0);
  assert.equal(t.hours_after, 0);
  assert.equal(t.change_pct, 0);
  assert.equal(t.unassessed_share, 0);
  assert.deepEqual(roleComposition(p), []);
});

test("a step with no assignment carries on unchanged", () => {
  const p = fixture();
  p.scenarios[0]!.assignments = [];
  const t = workflowTotals(p);
  assert.equal(t.hours_after, 30);
  assert.equal(t.hours_delta, 0);
});

test("round trip through serialize and parse is byte-identical", () => {
  const first = serializeProject(fixture());
  const second = serializeProject(parseProject(first));
  assert.equal(first, second);
});

test("validation names the exact path of a problem", () => {
  const p = fixture() as unknown as Record<string, unknown>;
  (p["steps"] as Record<string, unknown>[])[0]!["work_type"] = "nonsense";
  const problems = validateProject(p);
  assert.ok(problems.some((x) => x.path === "steps[0].work_type"));
});

test("an assignment pointing at a missing step is caught", () => {
  const p = fixture();
  p.scenarios[0]!.assignments[0]!.step_id = "does-not-exist";
  const problems = validateProject(p);
  assert.ok(
    problems.some((x) => x.message.includes("refers to a step that does not exist")),
  );
});

test("scaling to a month period changes FTE but not hours", () => {
  const p = fixture();
  p.case.period = "month";
  const t = workflowTotals(p);
  assert.equal(t.hours_before, 30);
  assert.equal(t.fte_before, 30 / 162.5);
});
