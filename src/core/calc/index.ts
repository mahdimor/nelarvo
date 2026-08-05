/**
 * The calculation engine.
 *
 * Pure functions only. No filesystem, no network, no AI — ever. Every number
 * this product shows is produced here and must be reproducible by hand with a
 * spreadsheet. See tests/calc.test.ts for the worked example that proves it.
 */

export {
  FTE_HOURS,
  WORKING_DAY_MINUTES,
  assignmentsByStep,
  assessedCreatedSteps,
  createdSteps,
  findScenario,
  futureHumanHours,
  isUnassessed,
  newStepHours,
  pct,
  reviewLoadMinutes,
  round1,
  stepHours,
  targetRole,
  toFte,
} from "./hours.ts";

export {
  roleComposition,
  stepShifts,
  workflowTotals,
} from "./composition.ts";
export type {
  RoleComposition,
  StepShift,
  WorkTypeSlice,
  WorkflowTotals,
} from "./composition.ts";

export {
  capabilityDemand,
  capabilityGaps,
  fallingCapabilities,
  risingCapabilities,
} from "./capability.ts";
export type { CapabilityDemand, Readiness } from "./capability.ts";

export { summaryCounts } from "./summary.ts";
export type { Summary } from "./summary.ts";

export {
  carriesMostDoubt,
  PARAMETER_LABELS,
  sensitivity,
} from "./uncertainty.ts";
export type {
  Band,
  ParameterKind,
  Sensitivity,
  UncertainParameter,
} from "./uncertainty.ts";
