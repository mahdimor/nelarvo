/**
 * The counts.
 *
 * If a stakeholder asks for one number, the honest answer is a count. *Three of
 * ten questions unanswered* survives being repeated in a corridor; a score does
 * not, because the first thing anyone does with a score is argue about the
 * weighting. Counts point at specific work instead, and cannot be gamed without
 * doing the work.
 *
 * Two rules hold here:
 *
 *   - **Every count describes what is in the file.** None of them is a judgment
 *     about whether the change is wise, and passing a count is not approval.
 *   - **What is not counted is named.** A summary that lists only what it
 *     measured reads as complete. This one says out loud which questions it
 *     cannot answer yet, because a reader has no other way to know.
 */

import type { Period, Project } from "../types.ts";
import { QUESTIONS, unansweredQuestions } from "../questions.ts";
import { assignmentsByStep, findScenario } from "./hours.ts";
import { workflowTotals } from "./composition.ts";

export interface Summary {
  period: Period;
  step_count: number;
  assessed_step_count: number;
  role_count: number;
  recorded_hours_before: number;
  hours_before: number;
  hours_after: number;
  change_pct: number;
  new_work_hours: number;
  unassessed_hours: number;
  unassessed_share: number;
  /** Steps nobody has said what happens to. Counted as unchanged in the totals. */
  steps_not_decided: number;
  /** Claims somebody materially challenged. Recorded, never resolved silently. */
  claims_disputed: number;
  /** Claims nobody could evidence yet. */
  claims_unknown: number;
  questions_unanswered: number;
  questions_total: number;
  /** True when the decision is open and no other future was examined. */
  single_future_considered: boolean;
  /** Named so a reader knows what this summary is silent about. */
  not_counted: readonly string[];
}

/**
 * What this analysis contains, as counts.
 *
 * The `not_counted` list is not an apology. It is the same contract every check
 * in this project carries: state what you could not determine, or the reader
 * will assume you determined it.
 */
export function summaryCounts(project: Project, scenarioId?: string): Summary {
  const totals = workflowTotals(project, scenarioId);
  const scenario = findScenario(project, scenarioId);
  const assigned = assignmentsByStep(scenario);

  const notDecided = project.steps.filter((s) => {
    const a = assigned.get(s.id);
    return !a || a.allocation === "unresolved";
  }).length;

  return {
    period: totals.period,
    step_count: totals.step_count,
    assessed_step_count: totals.assessed_step_count,
    role_count: totals.role_count,
    recorded_hours_before: totals.recorded_hours_before,
    hours_before: totals.hours_before,
    hours_after: totals.hours_after,
    change_pct: totals.change_pct,
    new_work_hours: totals.new_work_hours,
    unassessed_hours: totals.unassessed_hours,
    unassessed_share: totals.unassessed_share,
    steps_not_decided: notDecided,
    claims_disputed: project.steps.filter((s) => s.evidence === "disputed").length,
    claims_unknown: project.steps.filter((s) => s.evidence === "unknown").length,
    questions_unanswered: unansweredQuestions(project).length,
    questions_total: QUESTIONS.length,
    single_future_considered:
      project.case.decision_status === "open" &&
      project.case.alternatives_considered.length === 0,
    not_counted: [
      "whether the decisions inside this workflow have owners with real authority",
      "whether anyone is actually offering the work people would move into",
      "whether the people doing this work have confirmed the description",
    ],
  };
}
