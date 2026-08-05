/**
 * How much the answer could move, and which single number moves it.
 *
 * The arithmetic in this engine is exact. The inputs are not. `human_share`,
 * the minutes a review takes and the volume of work the change creates are all
 * estimates, and the whole result rests on them. One confident figure hides
 * that, which is the same failure as burying unassessed hours in a total.
 *
 * So any of those numbers may carry a range, and this module reports two things:
 *
 *   - how wide the answer gets when the estimates sit at their edges;
 *   - which one number decides most of that width.
 *
 * The second is the useful one. It says what would be worth measuring instead
 * of estimating, and it is the only honest way to decide that a measurement is
 * worth its cost.
 *
 * Three rules hold here:
 *
 *   - Nothing invents a range. A parameter with none entered contributes
 *     nothing, and the band is exactly as wide as the analyst said it was.
 *   - The band is NOT a confidence interval. It is every estimate landing at
 *     the same end at once — unlikely, deliberately blunt, and stated as such
 *     wherever it is shown.
 *   - The arithmetic is not reimplemented. A bound is applied to a copy of the
 *     project and the same `workflowTotals` computes the result, so a band can
 *     never drift away from the headline it qualifies.
 */

import type { Period, Project, Range, Scenario } from "../types.ts";
import { findScenario, isUnassessed, targetRole, toFte } from "./hours.ts";
import { workflowTotals } from "./composition.ts";

/** The four numbers that decide the answer, and the only ones that take a range. */
export type ParameterKind =
  | "human_share"
  | "human_minutes"
  | "new_work_volume"
  | "new_work_minutes";

/** Plain-language labels. Views never show the raw key. */
export const PARAMETER_LABELS: Record<ParameterKind, string> = {
  human_share: "share still passing through a person",
  human_minutes: "how long the human part takes",
  new_work_volume: "how much new work this creates",
  new_work_minutes: "how long each piece of new work takes",
};

/** Where a ranged parameter sits, so the same one can be found in a copy. */
interface Locator {
  assignment_index: number;
  created_index?: number;
  kind: ParameterKind;
}

interface Ranged extends Locator {
  step_id: string;
  /** What the analyst reads: the step, or the work the change creates. */
  name: string;
  role: string;
  point: number;
  low: number;
  high: number;
}

export interface UncertainParameter {
  step_id: string;
  name: string;
  role: string;
  kind: ParameterKind;
  point: number;
  low: number;
  high: number;
  /** Total future hours with this parameter alone at each end. */
  hours_at_low: number;
  hours_at_high: number;
  /** Hours of the answer this one number decides on its own. */
  swing: number;
}

export interface Band {
  low: number;
  point: number;
  high: number;
}

export interface Sensitivity {
  period: Period;
  hours_before: number;
  hours_after: Band;
  fte_after: Band;
  /** Percentage change at each end. Negative when work reduces. */
  change_pct: Band;
  /** Widest first. The number worth measuring is at the top. */
  parameters: UncertainParameter[];
  /** Hours between the two ends of the band. */
  width: number;
  /** True when the band reaches "no change at all" — the direction is not established. */
  straddles_no_change: boolean;
  /** False when nothing carries a range, and every figure is a bare estimate. */
  has_ranges: boolean;
}

/**
 * A range is usable when it has two finite ends that differ. A reversed pair is
 * read in the order that makes sense rather than rejected — the file may have
 * been edited by hand, and refusing to compute helps nobody.
 */
function usable(r: Range | undefined): Range | undefined {
  if (!r) return undefined;
  if (!Number.isFinite(r.low) || !Number.isFinite(r.high)) return undefined;
  const low = Math.min(r.low, r.high);
  const high = Math.max(r.low, r.high);
  if (low === high) return undefined; // a band of zero width says nothing
  return { low, high };
}

/** Every parameter in this scenario that carries a range. */
function ranged(project: Project, scenario: Scenario | undefined): Ranged[] {
  const out: Ranged[] = [];
  if (!scenario) return out;

  const stepById = new Map(project.steps.map((s) => [s.id, s]));

  scenario.assignments.forEach((a, assignment_index) => {
    const step = stepById.get(a.step_id);
    if (!step || isUnassessed(step)) return;

    const share = usable(a.human_share_range);
    if (share) {
      out.push({
        assignment_index,
        kind: "human_share",
        step_id: step.id,
        name: step.name,
        role: targetRole(step, a),
        point: a.human_share,
        ...share,
      });
    }

    const minutes = usable(a.new_minutes_range);
    if (minutes) {
      out.push({
        assignment_index,
        kind: "human_minutes",
        step_id: step.id,
        name: step.name,
        role: targetRole(step, a),
        point: a.new_minutes_per_unit ?? step.minutes_per_unit,
        ...minutes,
      });
    }

    (a.creates_steps ?? []).forEach((ns, created_index) => {
      const volume = usable(ns.volume_range);
      if (volume) {
        out.push({
          assignment_index,
          created_index,
          kind: "new_work_volume",
          step_id: step.id,
          name: ns.name || step.name,
          role: ns.role,
          point: ns.volume_per_period,
          ...volume,
        });
      }

      const each = usable(ns.minutes_range);
      if (each) {
        out.push({
          assignment_index,
          created_index,
          kind: "new_work_minutes",
          step_id: step.id,
          name: ns.name || step.name,
          role: ns.role,
          point: ns.minutes_per_unit,
          ...each,
        });
      }
    });
  });

  return out;
}

/** Move one parameter in a copy of the project. Never touches the original. */
function move(
  copy: Project,
  scenarioId: string | undefined,
  at: Locator,
  value: number,
): void {
  const scenario = findScenario(copy, scenarioId);
  const a = scenario?.assignments[at.assignment_index];
  if (!a) return;

  if (at.kind === "human_share") {
    a.human_share = value;
    return;
  }
  if (at.kind === "human_minutes") {
    a.new_minutes_per_unit = value;
    return;
  }

  const created = a.creates_steps?.[at.created_index ?? -1];
  if (!created) return;
  if (at.kind === "new_work_volume") created.volume_per_period = value;
  else created.minutes_per_unit = value;
}

/** Future hours with the given parameters moved. The original is untouched. */
function hoursWith(
  project: Project,
  scenarioId: string | undefined,
  moves: { at: Ranged; value: number }[],
): number {
  if (moves.length === 0) return workflowTotals(project, scenarioId).hours_after;

  const copy = structuredClone(project);
  for (const m of moves) move(copy, scenarioId, m.at, m.value);
  return workflowTotals(copy, scenarioId).hours_after;
}

/**
 * The band around the headline, and what decides its width.
 *
 * With no ranges entered this returns the headline three times over and says
 * so through `has_ranges` — a caller must never present that as certainty.
 */
export function sensitivity(
  project: Project,
  scenarioId?: string,
): Sensitivity {
  const period = project.case.period;
  const totals = workflowTotals(project, scenarioId);
  const found = ranged(project, findScenario(project, scenarioId));

  const point = totals.hours_after;
  const atEvery = (pick: (r: Ranged) => number) =>
    hoursWith(
      project,
      scenarioId,
      found.map((at) => ({ at, value: pick(at) })),
    );

  const ends = [point, atEvery((r) => r.low), atEvery((r) => r.high)];
  const low = Math.min(...ends);
  const high = Math.max(...ends);

  const parameters: UncertainParameter[] = found
    .map((at) => {
      const hours_at_low = hoursWith(project, scenarioId, [{ at, value: at.low }]);
      const hours_at_high = hoursWith(project, scenarioId, [
        { at, value: at.high },
      ]);
      return {
        step_id: at.step_id,
        name: at.name,
        role: at.role,
        kind: at.kind,
        point: at.point,
        low: at.low,
        high: at.high,
        hours_at_low,
        hours_at_high,
        swing: Math.abs(hours_at_high - hours_at_low),
      };
    })
    .sort((a, b) => b.swing - a.swing);

  const changePct = (hours: number) =>
    totals.hours_before === 0
      ? 0
      : Math.round(((hours - totals.hours_before) / totals.hours_before) * 100);

  return {
    period,
    hours_before: totals.hours_before,
    hours_after: { low, point, high },
    fte_after: {
      low: toFte(low, period),
      point: toFte(point, period),
      high: toFte(high, period),
    },
    change_pct: {
      low: changePct(low),
      point: changePct(point),
      high: changePct(high),
    },
    parameters,
    width: high - low,
    straddles_no_change:
      found.length > 0 &&
      totals.hours_before > 0 &&
      low <= totals.hours_before &&
      high >= totals.hours_before,
    has_ranges: found.length > 0,
  };
}

/**
 * The number that decides most of the band, when one actually does.
 *
 * This is the whole point of the module: it names what to go and measure. A
 * parameter that changes nothing — a range on work that is fully automated, say
 * — is not an answer, so a zero swing returns nothing.
 */
export function carriesMostDoubt(
  s: Sensitivity,
): UncertainParameter | undefined {
  const first = s.parameters[0];
  return first && first.swing > 0 ? first : undefined;
}
