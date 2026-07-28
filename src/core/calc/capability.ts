/**
 * Capability demand: the bridge from workflow analysis to reskilling.
 *
 * A capability's demand is the hours of work that need it. When a step shrinks,
 * demand for its capabilities shrinks with it; when a step grows or is created,
 * demand rises. Rising capabilities that few people have IS the training
 * requirement — derived from this workflow, not from a generic catalogue.
 *
 * This usually shows that most growing work uses capabilities people already
 * have, and only one or two are genuinely new. That makes the transition
 * smaller and far more plannable than the headline suggests.
 */

import type { CapabilityNote, Project } from "../types.ts";
import {
  assignmentsByStep,
  createdSteps,
  findScenario,
  futureHumanHours,
  newStepHours,
  stepHours,
  targetRole,
} from "./hours.ts";

export type Readiness = CapabilityNote["readiness"];

export interface CapabilityDemand {
  capability: string;
  hours_before: number;
  hours_after: number;
  delta: number;
  /** Roles that will need this capability after the change. */
  roles_after: string[];
  /** From the analyst's answer, if they have given one yet. */
  readiness?: Readiness;
  /** Rising demand plus few or no people who can do it. */
  is_gap: boolean;
}

const GAP_READINESS: readonly Readiness[] = ["few_do", "nobody_does"];

function norm(capability: string): string {
  return capability.trim().toLowerCase();
}

/**
 * Demand for every capability tagged anywhere in the workflow, before and
 * after, sorted by the size of the change.
 */
export function capabilityDemand(
  project: Project,
  scenarioId?: string,
): CapabilityDemand[] {
  const scenario = findScenario(project, scenarioId);
  const assigned = assignmentsByStep(scenario);

  const before = new Map<string, number>();
  const after = new Map<string, number>();
  const rolesAfter = new Map<string, Set<string>>();

  const add = (m: Map<string, number>, cap: string, hours: number) => {
    m.set(cap, (m.get(cap) ?? 0) + hours);
  };
  const noteRole = (cap: string, role: string, hours: number) => {
    if (hours <= 0) return;
    if (!rolesAfter.has(cap)) rolesAfter.set(cap, new Set());
    rolesAfter.get(cap)!.add(role);
  };

  for (const step of project.steps) {
    const hBefore = stepHours(step);
    const a = assigned.get(step.id);
    const hAfter = a ? futureHumanHours(step, a) : hBefore;
    const role = targetRole(step, a);

    for (const raw of step.capabilities) {
      const cap = norm(raw);
      if (!cap) continue;
      add(before, cap, hBefore);
      add(after, cap, hAfter);
      noteRole(cap, role, hAfter);
    }
  }

  for (const ns of createdSteps(scenario)) {
    const hours = newStepHours(ns);
    for (const raw of ns.capabilities) {
      const cap = norm(raw);
      if (!cap) continue;
      add(after, cap, hours);
      noteRole(cap, ns.role, hours);
    }
  }

  const readinessByCap = new Map<string, Readiness>();
  for (const note of project.capabilities) {
    readinessByCap.set(norm(note.capability), note.readiness);
  }

  const all = new Set<string>([...before.keys(), ...after.keys()]);

  return [...all]
    .map((cap) => {
      const hb = before.get(cap) ?? 0;
      const ha = after.get(cap) ?? 0;
      const readiness = readinessByCap.get(cap);
      const delta = ha - hb;

      return {
        capability: cap,
        hours_before: hb,
        hours_after: ha,
        delta,
        roles_after: [...(rolesAfter.get(cap) ?? [])].sort(),
        readiness,
        is_gap:
          delta > 0 && readiness !== undefined && GAP_READINESS.includes(readiness),
      };
    })
    .sort((a, b) => b.delta - a.delta);
}

/** Capabilities gaining hours. What people will need to be able to do. */
export function risingCapabilities(
  project: Project,
  scenarioId?: string,
): CapabilityDemand[] {
  return capabilityDemand(project, scenarioId).filter((c) => c.delta > 0);
}

/** Capabilities losing hours. What the organization will need less of. */
export function fallingCapabilities(
  project: Project,
  scenarioId?: string,
): CapabilityDemand[] {
  return capabilityDemand(project, scenarioId)
    .filter((c) => c.delta < 0)
    .sort((a, b) => a.delta - b.delta);
}

/**
 * The training requirement, in priority order: rising demand first, and among
 * those, the ones fewest people can already do.
 */
export function capabilityGaps(
  project: Project,
  scenarioId?: string,
): CapabilityDemand[] {
  const order: Record<string, number> = {
    nobody_does: 0,
    few_do: 1,
    some_do: 2,
    unknown: 3,
    already_strong: 4,
  };
  return risingCapabilities(project, scenarioId)
    .filter((c) => c.readiness === undefined || c.readiness !== "already_strong")
    .sort((a, b) => {
      const ra = order[a.readiness ?? "unknown"] ?? 3;
      const rb = order[b.readiness ?? "unknown"] ?? 3;
      if (ra !== rb) return ra - rb;
      return b.delta - a.delta;
    });
}
