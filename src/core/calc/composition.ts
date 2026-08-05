/**
 * Role composition: the single most important output of this product.
 *
 * For each role, hours by kind of work before and after. This is the chart
 * that carries the whole argument, because the work that GROWS is the
 * capability requirement, and the capability requirement is the pathway.
 *
 * A role can shrink in absolute hours while a work type grows as a
 * percentage. Both numbers are returned, and any view that shows one without
 * the other is misleading. That is why `hours` and `share` travel together.
 */

import type { Period, Project, WorkType } from "../types.ts";
import { WORK_TYPE_VALUES } from "../types.ts";
import {
  assessedCreatedSteps,
  assignmentsByStep,
  createdSteps,
  findScenario,
  futureHumanHours,
  isUnassessed,
  newStepHours,
  stepHours,
  targetRole,
  toFte,
} from "./hours.ts";

export interface WorkTypeSlice {
  work_type: WorkType;
  hours: number;
  /** Share of THIS role's own total, 0-100. */
  share: number;
}

export interface RoleComposition {
  role: string;
  before: {
    hours: number;
    fte: number;
    by_work_type: WorkTypeSlice[];
  };
  after: {
    hours: number;
    fte: number;
    by_work_type: WorkTypeSlice[];
  };
  /** Positive means this role gains hours. */
  hours_delta: number;
  fte_delta: number;
}

export interface StepShift {
  step_id: string;
  name: string;
  role_before: string;
  role_after: string;
  hours_before: number;
  hours_after: number;
  delta: number;
  work_type: WorkType;
  /** True when this work did not exist before the change. */
  is_new: boolean;
}

function emptySlices(): Map<WorkType, number> {
  const m = new Map<WorkType, number>();
  for (const w of WORK_TYPE_VALUES) m.set(w, 0);
  return m;
}

function toSlices(m: Map<WorkType, number>, total: number): WorkTypeSlice[] {
  return WORK_TYPE_VALUES.map((w) => {
    const hours = m.get(w) ?? 0;
    return {
      work_type: w,
      hours,
      share: total === 0 ? 0 : Math.round((hours / total) * 100),
    };
  }).filter((s) => s.hours > 0);
}

/**
 * Composition for every role touched by the workflow, before and after.
 * Unassessed steps are included here (they are real work someone does today)
 * but are reported separately in the totals so headline figures stay honest.
 */
export function roleComposition(
  project: Project,
  scenarioId?: string,
): RoleComposition[] {
  const period: Period = project.case.period;
  const scenario = findScenario(project, scenarioId);
  const assigned = assignmentsByStep(scenario);

  const before = new Map<string, Map<WorkType, number>>();
  const after = new Map<string, Map<WorkType, number>>();

  const bump = (
    target: Map<string, Map<WorkType, number>>,
    role: string,
    work: WorkType,
    hours: number,
  ) => {
    if (!target.has(role)) target.set(role, emptySlices());
    const slices = target.get(role)!;
    slices.set(work, (slices.get(work) ?? 0) + hours);
  };

  for (const step of project.steps) {
    if (isUnassessed(step)) continue;
    bump(before, step.role, step.work_type, stepHours(step));

    const a = assigned.get(step.id);
    if (!a) {
      // No assignment yet: the work continues as it is today.
      bump(after, step.role, step.work_type, stepHours(step));
      continue;
    }
    bump(after, targetRole(step, a), step.work_type, futureHumanHours(step, a));
  }

  // Work that did not exist before lands only in the "after" side.
  for (const ns of assessedCreatedSteps(project, scenario)) {
    bump(after, ns.role, ns.work_type, newStepHours(ns));
  }

  const roles = new Set<string>([...before.keys(), ...after.keys()]);

  return [...roles]
    .map((role) => {
      const b = before.get(role) ?? emptySlices();
      const af = after.get(role) ?? emptySlices();
      const bTotal = [...b.values()].reduce((x, y) => x + y, 0);
      const aTotal = [...af.values()].reduce((x, y) => x + y, 0);

      return {
        role,
        before: {
          hours: bTotal,
          fte: toFte(bTotal, period),
          by_work_type: toSlices(b, bTotal),
        },
        after: {
          hours: aTotal,
          fte: toFte(aTotal, period),
          by_work_type: toSlices(af, aTotal),
        },
        hours_delta: aTotal - bTotal,
        fte_delta: toFte(aTotal - bTotal, period),
      };
    })
    .sort((x, y) => y.before.hours - x.before.hours);
}

/**
 * Per-step change, sorted by magnitude. Feeds the task-shift chart.
 * New work appears with `is_new: true` and a zero "before" — it is not a
 * saving that got reinvested, it is work nobody does today.
 */
export function stepShifts(project: Project, scenarioId?: string): StepShift[] {
  const scenario = findScenario(project, scenarioId);
  const assigned = assignmentsByStep(scenario);
  const shifts: StepShift[] = [];

  for (const step of project.steps) {
    const a = assigned.get(step.id);
    const hoursBefore = stepHours(step);
    const hoursAfter = a ? futureHumanHours(step, a) : hoursBefore;

    shifts.push({
      step_id: step.id,
      name: step.name,
      role_before: step.role,
      role_after: targetRole(step, a),
      hours_before: hoursBefore,
      hours_after: hoursAfter,
      delta: hoursAfter - hoursBefore,
      work_type: step.work_type,
      is_new: false,
    });
  }

  for (const ns of createdSteps(scenario)) {
    const hours = newStepHours(ns);
    shifts.push({
      step_id: ns.id,
      name: ns.name,
      role_before: "—",
      role_after: ns.role,
      hours_before: 0,
      hours_after: hours,
      delta: hours,
      work_type: ns.work_type,
      is_new: true,
    });
  }

  return shifts.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

export interface WorkflowTotals {
  period: Period;
  /** All current work recorded, including the part not assessed yet. */
  recorded_hours_before: number;
  /** Comparable, assessed perimeter only. */
  hours_before: number;
  hours_after: number;
  fte_before: number;
  fte_after: number;
  hours_delta: number;
  /** Percentage change, negative when work reduces. */
  change_pct: number;
  /** Hours we genuinely do not know the fate of. Never inside the headline. */
  unassessed_hours: number;
  unassessed_share: number;
  /** Work that did not exist before the change. */
  new_work_hours: number;
  assessed_step_count: number;
  step_count: number;
  role_count: number;
}

export function workflowTotals(
  project: Project,
  scenarioId?: string,
): WorkflowTotals {
  const period = project.case.period;
  const scenario = findScenario(project, scenarioId);
  const assigned = assignmentsByStep(scenario);

  let before = 0;
  let after = 0;
  let unassessed = 0;
  let recordedBefore = 0;
  let assessedStepCount = 0;

  for (const step of project.steps) {
    const h = stepHours(step);
    recordedBefore += h;
    if (isUnassessed(step)) {
      unassessed += h;
      continue;
    }
    assessedStepCount += 1;
    before += h;
    const a = assigned.get(step.id);
    after += a ? futureHumanHours(step, a) : h;
  }

  const assessedNewSteps = assessedCreatedSteps(project, scenario);
  const newWork = assessedNewSteps.reduce(
    (sum, ns) => sum + newStepHours(ns),
    0,
  );
  after += newWork;

  const roles = new Set(
    project.steps.filter((step) => !isUnassessed(step)).map((step) => step.role),
  );
  for (const ns of assessedNewSteps) roles.add(ns.role);

  return {
    period,
    recorded_hours_before: recordedBefore,
    hours_before: before,
    hours_after: after,
    fte_before: toFte(before, period),
    fte_after: toFte(after, period),
    hours_delta: after - before,
    change_pct: before === 0 ? 0 : Math.round(((after - before) / before) * 100),
    unassessed_hours: unassessed,
    unassessed_share:
      recordedBefore === 0 ? 0 : Math.round((unassessed / recordedBefore) * 100),
    new_work_hours: newWork,
    assessed_step_count: assessedStepCount,
    step_count: project.steps.length,
    role_count: roles.size,
  };
}
