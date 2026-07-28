/**
 * The data model. This is the contract every other module depends on.
 *
 * Rules that must survive any future change:
 *   - `person` is optional forever. A project naming zero individuals must
 *     pass every check and render a complete report.
 *   - Role impact numbers are NEVER stored. They are always computed from
 *     steps and assignments. Storing them lets them drift.
 *   - Multiple futures are `scenarios`: sets of assignments over the SAME
 *     steps. Never duplicate steps per scenario.
 *   - A field that no calculation reads and no view renders gets deleted.
 */

/** How sure is the person who entered this? Applies to claims, not just documents. */
export type Evidence =
  | "observed" // directly witnessed under identified conditions
  | "documented" // supported by a named document or system record
  | "reported" // stated by an identified participant
  | "inferred" // derived by a person or system from other evidence
  | "proposed" // part of a possible future design
  | "disputed" // materially challenged by a participant
  | "unknown"; // evidence is currently insufficient

export const EVIDENCE_VALUES: readonly Evidence[] = [
  "observed",
  "documented",
  "reported",
  "inferred",
  "proposed",
  "disputed",
  "unknown",
];

/**
 * The kind of work a step is. This vocabulary is fixed and small on purpose:
 * it is what makes the before/after composition chart mean something.
 * Roughly, AI absorbs the top two and grows the middle three.
 */
export type WorkType =
  | "data_handling" // collecting, entering, extracting, moving information
  | "routine_judgment" // applying clear rules to cases
  | "complex_judgment" // weighing ambiguous evidence, handling exceptions
  | "relationship" // communicating with, supporting, persuading people
  | "coordination" // scheduling, chasing, handoffs
  | "supervision" // checking machine or human output
  | "physical" // moving, handling, inspecting things
  | "improvement"; // changing the process itself

export const WORK_TYPE_VALUES: readonly WorkType[] = [
  "data_handling",
  "routine_judgment",
  "complex_judgment",
  "relationship",
  "coordination",
  "supervision",
  "physical",
  "improvement",
];

/** Plain-language labels. The UI and reports never show the raw key. */
export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  data_handling: "Data handling",
  routine_judgment: "Routine judgment",
  complex_judgment: "Complex judgment",
  relationship: "Relationship",
  coordination: "Coordination",
  supervision: "Supervision",
  physical: "Physical",
  improvement: "Improvement",
};

/** What happens to a step in a future scenario. */
export type Allocation =
  | "human" // stays human, unchanged
  | "human_ai_assisted" // human does it, AI helps
  | "ai_full_review" // AI does it, a human reviews every one
  | "ai_exception_review" // AI does it, a human reviews exceptions only
  | "rule_automated" // deterministic automation
  | "machine" // robot or physical machine
  | "outsourced"
  | "eliminated" // the work stops
  | "redesigned" // becomes something different
  | "unresolved"; // not yet decided

export const ALLOCATION_VALUES: readonly Allocation[] = [
  "human",
  "human_ai_assisted",
  "ai_full_review",
  "ai_exception_review",
  "rule_automated",
  "machine",
  "outsourced",
  "eliminated",
  "redesigned",
  "unresolved",
];

export const ALLOCATION_LABELS: Record<Allocation, string> = {
  human: "Stays human",
  human_ai_assisted: "Human does it, AI assists",
  ai_full_review: "AI does it, human reviews every one",
  ai_exception_review: "AI does it, human reviews exceptions",
  rule_automated: "Automated by fixed rules",
  machine: "Done by a machine",
  outsourced: "Handled outside",
  eliminated: "The work stops",
  redesigned: "Redesigned into something different",
  unresolved: "Not yet decided",
};

/** Allocations that involve an AI making or drafting the call. */
export const AI_ALLOCATIONS: readonly Allocation[] = [
  "human_ai_assisted",
  "ai_full_review",
  "ai_exception_review",
];

/** Where a value came from. Anything AI-touched stays visible for good. */
export type Origin = "human" | "ai_suggested" | "ai_accepted";

export type Period = "week" | "month";

export type Materiality = "low" | "medium" | "high" | "critical";

export type AuthorityLevel = "full" | "partial" | "none";

export type DecisionStatus = "open" | "partially_decided" | "already_decided";

// ---------------------------------------------------------------------------
// Project
// ---------------------------------------------------------------------------

export interface Project {
  spec_version: string;
  case: Case;
  steps: Step[];
  scenarios: Scenario[];
  decisions: Decision[];
  /** Human-entered notes only. All numbers are computed. */
  role_impacts: RoleImpactNote[];
  /** Human-entered readiness only. Demand is computed. */
  capabilities: CapabilityNote[];
  pathways: Pathway[];
  answers: PromptAnswer[];
}

export interface Case {
  id: string;
  title: string;
  organization: string;
  /** One workflow, not a whole department. "Auto claims intake". */
  scope: string;
  boundary_start: string;
  boundary_end: string;
  technology: string;
  purpose: string;
  /** A role, never a person. */
  sponsor_role: string;
  /**
   * Answered honestly. If "already_decided", the report says so on page one
   * and that banner cannot be suppressed.
   */
  decision_status: DecisionStatus;
  /** All volumes in the project use this period. */
  period: Period;
  participants: Participant[];
  updated: string; // YYYY-MM-DD
  maintainer_role: string;
}

export interface Participant {
  role: string;
  group:
    | "sponsor"
    | "operations"
    | "affected_worker"
    | "hr"
    | "risk_legal"
    | "union"
    | "technology"
    | "external";
  /** Did they actually review and confirm this description? */
  reviewed: boolean;
}

export interface Step {
  id: string;
  name: string;
  sequence: number;
  /** Who does it today. */
  role: string;
  volume_per_period: number;
  minutes_per_unit: number;
  work_type: WorkType;
  /** Free-text tags, normalized lowercase. */
  capabilities: string[];
  failure_mode?: string;
  /** A choice with consequences, not just work performed. */
  is_decision_point: boolean;
  /** Done in practice, appears in no procedure. Automation plans die here. */
  is_invisible_work: boolean;
  exposure: Exposure;
  evidence: Evidence;
  origin: Origin;
  notes?: string;
}

export interface Exposure {
  feasible: "yes" | "partly" | "no" | "unknown";
  /** Realistic share of volume the technology could address, 0..1. */
  share_addressable: number;
  cost_of_error?: string;
  evidence: Evidence;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  assignments: Assignment[];
}

export interface Assignment {
  step_id: string;
  allocation: Allocation;
  /** Share of volume a human still touches, 0..1. Entered, never guessed. */
  human_share: number;
  /** If the human part gets faster or slower. Defaults to the step's value. */
  new_minutes_per_unit?: number;
  agent_id?: string;
  confidence_floor?: number;
  on_low_confidence?:
    | "escalate_human"
    | "reject"
    | "defer"
    | "proceed_flagged";
  review_capacity?: ReviewCapacity;
  /** If the work moves to a different role. */
  new_role?: string;
  /** Work that did not exist before. Usually supervision of the AI. */
  creates_steps?: NewStep[];
  evidence: Evidence;
  origin: Origin;
}

export interface ReviewCapacity {
  items_per_day: number;
  minutes_per_item: number;
}

export interface NewStep {
  id: string;
  name: string;
  role: string;
  volume_per_period: number;
  minutes_per_unit: number;
  work_type: WorkType;
  capabilities: string[];
}

export interface Decision {
  id: string;
  /** Links back to the workflow step this decision lives in. */
  step_id?: string;
  name: string;
  description: string;
  frequency: string;
  materiality: Materiality;
  evidence: Evidence;
  owner: Owner;
  outcome: Outcome;
  authority: Authority;
  escalation: Escalation[];
  trace?: Trace;
  loop?: Loop;
}

export interface Owner {
  role: string;
  /** false means a committee owns it — a real and revealing answer. */
  is_individual: boolean;
  /** OPTIONAL FOREVER. Never validated, never rendered. */
  person?: string;
}

export interface Outcome {
  statement: string;
  metrics: Metric[];
  review_cadence: "daily" | "weekly" | "monthly" | "quarterly" | "annually";
}

export interface Metric {
  name: string;
  definition: string;
  target?: string;
  /** Where the number actually comes from. A metric with no source is a wish. */
  source?: string;
}

/** The four questions. Together they are the difference between ownership and blame. */
export interface Authority {
  information: AuthorityLevel;
  act: AuthorityLevel;
  resources: AuthorityLevel;
  change_system: AuthorityLevel;
  notes?: string;
}

export interface Escalation {
  trigger: string;
  to: string;
  sla: string;
}

export interface Trace {
  where: string;
  records: string[];
  retention: string;
  contestable_by_subject?: boolean;
}

export interface Loop {
  review: string;
  inputs: string[];
  /** What this forum can actually change. Empty means it is a status meeting. */
  can_change: string[];
  last_change?: string;
  last_change_effect?: string;
}

export interface RoleImpactNote {
  role: string;
  headcount_current?: number;
  authority_change: "increases" | "unchanged" | "decreases" | "unknown";
  /** Have people doing this job seen this and confirmed it? */
  worker_reviewed: boolean;
  /** Roles that materially disagree. Recorded, not resolved silently. */
  disputed_by: string[];
  notes?: string;
}

export interface CapabilityNote {
  capability: string;
  role: string;
  readiness:
    | "already_strong"
    | "some_do"
    | "few_do"
    | "nobody_does"
    | "unknown";
  how_to_build?: string;
}

export interface Pathway {
  from_role: string;
  to_role: string;
  kind:
    | "redesigned_current"
    | "internal_move"
    | "new_role"
    | "external_with_support"
    | "protected_arrangement";
  /** Who is actually offering this. Empty means speculative, and we say so. */
  opportunity_provider?: string;
  opportunity_status: "confirmed" | "conditional" | "speculative";
  transferable_capabilities: string[];
  gaps: string[];
  /** What a receiving manager would accept as proof. */
  required_evidence: string[];
  support?: PathwaySupport;
  fallback?: string;
  evidence: Evidence;
}

export interface PathwaySupport {
  who_pays: string;
  time_estimate: string;
  income_impact: string;
}

export interface PromptAnswer {
  prompt_id: string; // "P01" .. "P10"
  answer: string;
  answered_by_role?: string;
}
