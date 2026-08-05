/**
 * Hours: the base unit everything else is built from.
 *
 * Every number this product shows traces back to one multiplication:
 *   volume x duration = hours.
 *
 * There is no AI in here and there never will be. If these numbers are ever
 * subtly wrong, the product's credibility is gone permanently, so this module
 * is deliberately dull and heavily tested.
 */

import type {
  Allocation,
  Assignment,
  NewStep,
  Period,
  Project,
  Scenario,
  Step,
} from "../types.ts";

/** Hours in a full-time equivalent, by period. */
export const FTE_HOURS: Record<Period, number> = {
  week: 37.5,
  month: 162.5,
};

/** A human working day, in minutes. Used to catch impossible review loads. */
export const WORKING_DAY_MINUTES = 420; // 7 hours of actual reviewing

/** Allocations where no human time remains on this step. */
const NO_HUMAN_TIME: readonly Allocation[] = [
  "eliminated",
  "outsourced",
  "rule_automated",
  "machine",
];

/** Allocations where the human keeps doing the whole thing, unchanged. */
const UNCHANGED: readonly Allocation[] = ["human", "unresolved"];

/** Hours this step consumes today, per the project's period. */
export function stepHours(step: Step): number {
  return (step.volume_per_period * step.minutes_per_unit) / 60;
}

/** Hours a created step will consume. */
export function newStepHours(step: NewStep): number {
  return (step.volume_per_period * step.minutes_per_unit) / 60;
}

export function toFte(hours: number, period: Period): number {
  return hours / FTE_HOURS[period];
}

/**
 * Human hours remaining on a step after the change.
 *
 * `human_share` is the share of VOLUME a human still touches. It is entered by
 * the analyst, never guessed by the tool — the whole analysis rests on it, so
 * inventing it would be inventing the answer.
 */
export function futureHumanHours(step: Step, a: Assignment): number {
  if (NO_HUMAN_TIME.includes(a.allocation)) return 0;
  if (UNCHANGED.includes(a.allocation)) return stepHours(step);

  const minutes = a.new_minutes_per_unit ?? step.minutes_per_unit;
  return (step.volume_per_period * minutes * a.human_share) / 60;
}

/** Who carries this step after the change. */
export function targetRole(step: Step, a: Assignment | undefined): string {
  return a?.new_role ?? step.role;
}

/**
 * A step is "unassessed" when we do not actually know what happens to it.
 * These hours are excluded from headline totals and reported on their own.
 * Burying unknowns inside a confident number is the most damaging thing this
 * tool could do.
 */
export function isUnassessed(step: Step): boolean {
  return step.evidence === "unknown" || step.exposure.feasible === "unknown";
}

/** The scenario to compute against, by id. Undefined id means the first one. */
export function findScenario(
  project: Project,
  scenarioId?: string,
): Scenario | undefined {
  if (!scenarioId) return project.scenarios[0];
  return project.scenarios.find((s) => s.id === scenarioId);
}

/** Index a scenario's assignments by step id for repeated lookup. */
export function assignmentsByStep(
  scenario: Scenario | undefined,
): Map<string, Assignment> {
  const map = new Map<string, Assignment>();
  if (!scenario) return map;
  for (const a of scenario.assignments) map.set(a.step_id, a);
  return map;
}

/** Every step created by any assignment in the scenario. */
export function createdSteps(scenario: Scenario | undefined): NewStep[] {
  if (!scenario) return [];
  return scenario.assignments.flatMap((a) => a.creates_steps ?? []);
}

/**
 * Work created by assignments whose source step is assessed.
 *
 * A proposed consequence of a step whose evidence or feasibility is unknown
 * cannot enter the comparable before/after perimeter. It remains visible in
 * the workflow drawing, but it is not a defensible headline number yet.
 */
export function assessedCreatedSteps(
  project: Project,
  scenario: Scenario | undefined,
): NewStep[] {
  if (!scenario) return [];
  const assessed = new Set(
    project.steps.filter((step) => !isUnassessed(step)).map((step) => step.id),
  );
  return scenario.assignments
    .filter((assignment) => assessed.has(assignment.step_id))
    .flatMap((assignment) => assignment.creates_steps ?? []);
}

/**
 * Minutes of review a human is being asked to absorb per day.
 * Compared against WORKING_DAY_MINUTES to catch review that cannot happen.
 */
export function reviewLoadMinutes(a: Assignment): number | undefined {
  if (!a.review_capacity) return undefined;
  return a.review_capacity.items_per_day * a.review_capacity.minutes_per_item;
}

/** Display rounding. Never round before arithmetic is finished. */
export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Whole-number percentage. Returns 0 rather than NaN when the total is zero. */
export function pct(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}
