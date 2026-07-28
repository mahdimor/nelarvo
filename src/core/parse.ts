/**
 * Reading and writing the project file.
 *
 * The file is plain JSON with a stable key order so `git diff` is meaningful
 * over the life of an engagement. It is the source of truth; everything else
 * (caches, snapshots) is discardable.
 *
 * Validation is hand-written rather than schema-library-driven so the project
 * keeps zero runtime dependencies and error messages stay in plain language.
 */

import type { Project } from "./types.ts";
import {
  ALLOCATION_VALUES,
  EVIDENCE_VALUES,
  WORK_TYPE_VALUES,
} from "./types.ts";

export interface ProblemReport {
  path: string;
  message: string;
}

export class ProjectFileError extends Error {
  problems: ProblemReport[];
  constructor(problems: ProblemReport[]) {
    super(
      problems.length === 1
        ? `${problems[0]!.path}: ${problems[0]!.message}`
        : `${problems.length} problems in the project file`,
    );
    this.name = "ProjectFileError";
    this.problems = problems;
  }
}

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Structural validation. Deliberately checks only what the calculation engine
 * and the checks actually depend on — a validator that rejects more than the
 * product needs just blocks people from getting to a useful result.
 */
export function validateProject(value: unknown): ProblemReport[] {
  const p: ProblemReport[] = [];
  const bad = (path: string, message: string) => p.push({ path, message });

  if (!isObj(value)) {
    return [{ path: "(root)", message: "the file is not a JSON object" }];
  }

  if (typeof value["spec_version"] !== "string") {
    bad("spec_version", "missing");
  }

  const c = value["case"];
  if (!isObj(c)) {
    bad("case", "missing — every project needs a case");
  } else {
    for (const key of ["id", "title", "scope", "period"]) {
      if (typeof c[key] !== "string" || (c[key] as string).trim() === "") {
        bad(`case.${key}`, "missing");
      }
    }
    if (c["period"] !== "week" && c["period"] !== "month") {
      bad("case.period", 'must be "week" or "month"');
    }
    const ds = c["decision_status"];
    if (
      ds !== "open" &&
      ds !== "partially_decided" &&
      ds !== "already_decided"
    ) {
      bad(
        "case.decision_status",
        'must be "open", "partially_decided" or "already_decided"',
      );
    }
  }

  const steps = value["steps"];
  if (!Array.isArray(steps)) {
    bad("steps", "missing — should be a list, even if empty");
  } else {
    const seen = new Set<string>();
    steps.forEach((s, i) => {
      const at = `steps[${i}]`;
      if (!isObj(s)) return bad(at, "not an object");

      const id = s["id"];
      if (typeof id !== "string" || id.trim() === "") bad(`${at}.id`, "missing");
      else if (seen.has(id)) bad(`${at}.id`, `duplicate id "${id}"`);
      else seen.add(id);

      if (typeof s["name"] !== "string") bad(`${at}.name`, "missing");
      if (typeof s["role"] !== "string" || (s["role"] as string).trim() === "") {
        bad(`${at}.role`, "missing — every step needs someone who does it");
      }

      const vol = s["volume_per_period"];
      if (typeof vol !== "number" || !Number.isFinite(vol) || vol < 0) {
        bad(`${at}.volume_per_period`, "must be a number, zero or more");
      }
      const min = s["minutes_per_unit"];
      if (typeof min !== "number" || !Number.isFinite(min) || min < 0) {
        bad(`${at}.minutes_per_unit`, "must be a number, zero or more");
      }

      if (!WORK_TYPE_VALUES.includes(s["work_type"] as never)) {
        bad(
          `${at}.work_type`,
          `must be one of: ${WORK_TYPE_VALUES.join(", ")}`,
        );
      }
      if (!EVIDENCE_VALUES.includes(s["evidence"] as never)) {
        bad(`${at}.evidence`, `must be one of: ${EVIDENCE_VALUES.join(", ")}`);
      }
      if (!isObj(s["exposure"])) {
        bad(`${at}.exposure`, "missing");
      }
    });
  }

  const scenarios = value["scenarios"];
  if (!Array.isArray(scenarios)) {
    bad("scenarios", "missing — should be a list, even if empty");
  } else {
    const stepIds = new Set(
      Array.isArray(steps)
        ? steps.filter(isObj).map((s) => String(s["id"]))
        : [],
    );
    scenarios.forEach((sc, i) => {
      const at = `scenarios[${i}]`;
      if (!isObj(sc)) return bad(at, "not an object");
      if (typeof sc["id"] !== "string") bad(`${at}.id`, "missing");

      const asg = sc["assignments"];
      if (!Array.isArray(asg)) return bad(`${at}.assignments`, "missing");

      asg.forEach((a, j) => {
        const aAt = `${at}.assignments[${j}]`;
        if (!isObj(a)) return bad(aAt, "not an object");

        const sid = a["step_id"];
        if (typeof sid !== "string") bad(`${aAt}.step_id`, "missing");
        else if (!stepIds.has(sid)) {
          bad(`${aAt}.step_id`, `refers to a step that does not exist: "${sid}"`);
        }

        if (!ALLOCATION_VALUES.includes(a["allocation"] as never)) {
          bad(
            `${aAt}.allocation`,
            `must be one of: ${ALLOCATION_VALUES.join(", ")}`,
          );
        }

        const hs = a["human_share"];
        if (typeof hs !== "number" || hs < 0 || hs > 1) {
          bad(`${aAt}.human_share`, "must be a number between 0 and 1");
        }
      });
    });
  }

  for (const key of [
    "decisions",
    "role_impacts",
    "capabilities",
    "pathways",
    "answers",
  ]) {
    if (!Array.isArray(value[key])) {
      bad(key, "missing — should be a list, even if empty");
    }
  }

  return p;
}

/** Parse JSON text into a Project, or throw with readable problems. */
export function parseProject(text: string): Project {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new ProjectFileError([
      { path: "(file)", message: `this is not valid JSON — ${msg}` },
    ]);
  }

  const problems = validateProject(raw);
  if (problems.length > 0) throw new ProjectFileError(problems);
  return raw as Project;
}

/** Top-level key order. Stable output keeps git diffs readable. */
const KEY_ORDER: readonly string[] = [
  "spec_version",
  "case",
  "steps",
  "scenarios",
  "decisions",
  "role_impacts",
  "capabilities",
  "pathways",
  "answers",
];

/**
 * Serialize with stable key order. Round-tripping a file must produce
 * byte-identical output — there is a test for it.
 */
export function serializeProject(project: Project): string {
  const ordered: Record<string, unknown> = {};
  const source = project as unknown as Record<string, unknown>;

  for (const key of KEY_ORDER) {
    if (key in source) ordered[key] = source[key];
  }
  for (const key of Object.keys(source)) {
    if (!(key in ordered)) ordered[key] = source[key];
  }

  return JSON.stringify(ordered, null, 2) + "\n";
}

/** A minimum valid project. Used by `nelarvo new`. */
export function emptyProject(title: string, scope: string): Project {
  const today = new Date().toISOString().slice(0, 10);
  const id = scope
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    spec_version: "1.0",
    case: {
      id: id || "case",
      title,
      organization: "",
      scope,
      boundary_start: "",
      boundary_end: "",
      technology: "",
      purpose: "",
      sponsor_role: "",
      decision_status: "open",
      period: "week",
      participants: [],
      updated: today,
      maintainer_role: "",
    },
    steps: [],
    scenarios: [
      {
        id: "future",
        name: "Proposed future state",
        description: "",
        assignments: [],
      },
    ],
    decisions: [],
    role_impacts: [],
    capabilities: [],
    pathways: [],
    answers: [],
  };
}
