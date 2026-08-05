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

const isNumber = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

/**
 * Structural validation. Deliberately checks only what the calculation engine
 * and the checks actually depend on — a validator that rejects more than the
 * product needs just blocks people from getting to a useful result.
 */
export function validateProject(value: unknown): ProblemReport[] {
  const p: ProblemReport[] = [];
  const bad = (path: string, message: string) => p.push({ path, message });
  const origins = ["human", "ai_suggested", "ai_accepted"] as const;
  const feasibleValues = ["yes", "partly", "no", "unknown"] as const;

  const requiredText = (value: unknown, path: string) => {
    if (typeof value !== "string" || value.trim() === "") bad(path, "missing");
  };
  const text = (value: unknown, path: string) => {
    if (typeof value !== "string") bad(path, "must be text");
  };
  const nonNegative = (value: unknown, path: string) => {
    if (!isNumber(value) || value < 0) bad(path, "must be a number, zero or more");
  };
  const share = (value: unknown, path: string) => {
    if (!isNumber(value) || value < 0 || value > 1) {
      bad(path, "must be a number between 0 and 1");
    }
  };
  const boolean = (value: unknown, path: string) => {
    if (typeof value !== "boolean") bad(path, "must be true or false");
  };
  const stringList = (value: unknown, path: string) => {
    if (!Array.isArray(value)) return bad(path, "should be a list, even if empty");
    value.forEach((item, index) => {
      if (typeof item !== "string") bad(`${path}[${index}]`, "must be text");
    });
  };
  const evidence = (value: unknown, path: string) => {
    if (!EVIDENCE_VALUES.includes(value as never)) {
      bad(path, `must be one of: ${EVIDENCE_VALUES.join(", ")}`);
    }
  };
  const origin = (value: unknown, path: string) => {
    if (!origins.includes(value as never)) {
      bad(path, `must be one of: ${origins.join(", ")}`);
    }
  };

  /**
   * A range is optional everywhere. When present it must be usable, because a
   * reversed or impossible one would silently widen a headline figure.
   */
  const range = (value: unknown, path: string, max?: number) => {
    if (value === undefined) return;
    if (!isObj(value)) return bad(path, "should have a low and a high");

    const lo = value["low"];
    const hi = value["high"];
    const limit = max === undefined ? "" : ` and at most ${max}`;

    if (!isNumber(lo) || lo < 0 || (max !== undefined && lo > max)) {
      bad(`${path}.low`, `must be a number, zero or more${limit}`);
    }
    if (!isNumber(hi) || hi < 0 || (max !== undefined && hi > max)) {
      bad(`${path}.high`, `must be a number, zero or more${limit}`);
    }
    if (isNumber(lo) && isNumber(hi) && lo > hi) {
      bad(path, "the low end is above the high end");
    }
  };

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
    for (const key of ["id", "title", "scope"]) requiredText(c[key], `case.${key}`);
    for (const key of [
      "organization",
      "boundary_start",
      "boundary_end",
      "technology",
      "purpose",
      "sponsor_role",
      "updated",
      "maintainer_role",
    ]) text(c[key], `case.${key}`);
    stringList(c["alternatives_considered"], "case.alternatives_considered");
    if (!Array.isArray(c["participants"])) {
      bad("case.participants", "should be a list, even if empty");
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

      nonNegative(s["sequence"], `${at}.sequence`);
      nonNegative(s["volume_per_period"], `${at}.volume_per_period`);
      nonNegative(s["minutes_per_unit"], `${at}.minutes_per_unit`);
      stringList(s["capabilities"], `${at}.capabilities`);
      boolean(s["is_decision_point"], `${at}.is_decision_point`);
      boolean(s["is_invisible_work"], `${at}.is_invisible_work`);

      if (!WORK_TYPE_VALUES.includes(s["work_type"] as never)) {
        bad(
          `${at}.work_type`,
          `must be one of: ${WORK_TYPE_VALUES.join(", ")}`,
        );
      }
      evidence(s["evidence"], `${at}.evidence`);
      origin(s["origin"], `${at}.origin`);
      if (!isObj(s["exposure"])) {
        bad(`${at}.exposure`, "missing");
      } else {
        const exposure = s["exposure"];
        if (!feasibleValues.includes(exposure["feasible"] as never)) {
          bad(`${at}.exposure.feasible`, `must be one of: ${feasibleValues.join(", ")}`);
        }
        share(exposure["share_addressable"], `${at}.exposure.share_addressable`);
        evidence(exposure["evidence"], `${at}.exposure.evidence`);
      }
    });

    // Second pass: a return can point at any step, including a later one, so
    // every id has to exist before this can be checked.
    const ids = new Set(steps.filter(isObj).map((s) => String(s["id"])));
    steps.forEach((s, i) => {
      if (!isObj(s)) return;
      const back = s["returns_to"];
      if (back === undefined) return;
      if (typeof back !== "string" || !ids.has(back)) {
        bad(`steps[${i}].returns_to`, "points at a step that does not exist");
      } else if (back === s["id"]) {
        bad(`steps[${i}].returns_to`, "a step cannot send work back to itself");
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
    const scenarioIds = new Set<string>();
    scenarios.forEach((sc, i) => {
      const at = `scenarios[${i}]`;
      if (!isObj(sc)) return bad(at, "not an object");
      const scenarioId = sc["id"];
      if (typeof scenarioId !== "string" || scenarioId.trim() === "") {
        bad(`${at}.id`, "missing");
      } else if (scenarioIds.has(scenarioId)) {
        bad(`${at}.id`, `duplicate id "${scenarioId}"`);
      } else {
        scenarioIds.add(scenarioId);
      }
      requiredText(sc["name"], `${at}.name`);
      text(sc["description"], `${at}.description`);

      const asg = sc["assignments"];
      if (!Array.isArray(asg)) return bad(`${at}.assignments`, "missing");

      const assignedStepIds = new Set<string>();
      asg.forEach((a, j) => {
        const aAt = `${at}.assignments[${j}]`;
        if (!isObj(a)) return bad(aAt, "not an object");

        const sid = a["step_id"];
        if (typeof sid !== "string") bad(`${aAt}.step_id`, "missing");
        else if (!stepIds.has(sid)) {
          bad(`${aAt}.step_id`, `refers to a step that does not exist: "${sid}"`);
        } else if (assignedStepIds.has(sid)) {
          bad(`${aAt}.step_id`, `the step "${sid}" is assigned more than once`);
        } else {
          assignedStepIds.add(sid);
        }

        if (!ALLOCATION_VALUES.includes(a["allocation"] as never)) {
          bad(
            `${aAt}.allocation`,
            `must be one of: ${ALLOCATION_VALUES.join(", ")}`,
          );
        }

        share(a["human_share"], `${aAt}.human_share`);
        evidence(a["evidence"], `${aAt}.evidence`);
        origin(a["origin"], `${aAt}.origin`);
        if (a["new_minutes_per_unit"] !== undefined) {
          nonNegative(a["new_minutes_per_unit"], `${aAt}.new_minutes_per_unit`);
        }
        if (a["new_role"] !== undefined) text(a["new_role"], `${aAt}.new_role`);
        if (a["confidence_floor"] !== undefined) {
          share(a["confidence_floor"], `${aAt}.confidence_floor`);
        }
        if (a["review_capacity"] !== undefined) {
          if (!isObj(a["review_capacity"])) {
            bad(`${aAt}.review_capacity`, "not an object");
          } else {
            nonNegative(
              a["review_capacity"]["items_per_day"],
              `${aAt}.review_capacity.items_per_day`,
            );
            nonNegative(
              a["review_capacity"]["minutes_per_item"],
              `${aAt}.review_capacity.minutes_per_item`,
            );
          }
        }

        range(a["human_share_range"], `${aAt}.human_share_range`, 1);
        range(a["new_minutes_range"], `${aAt}.new_minutes_range`);

        const creates = a["creates_steps"];
        if (creates !== undefined && !Array.isArray(creates)) {
          bad(`${aAt}.creates_steps`, "should be a list, even if empty");
        } else if (Array.isArray(creates)) {
          const createdIds = new Set<string>();
          creates.forEach((ns, k) => {
            const nAt = `${aAt}.creates_steps[${k}]`;
            if (!isObj(ns)) return bad(nAt, "not an object");
            const newId = ns["id"];
            if (typeof newId !== "string" || newId.trim() === "") {
              bad(`${nAt}.id`, "missing");
            } else if (createdIds.has(newId)) {
              bad(`${nAt}.id`, `duplicate id "${newId}"`);
            } else {
              createdIds.add(newId);
            }
            requiredText(ns["name"], `${nAt}.name`);
            requiredText(ns["role"], `${nAt}.role`);
            nonNegative(ns["volume_per_period"], `${nAt}.volume_per_period`);
            nonNegative(ns["minutes_per_unit"], `${nAt}.minutes_per_unit`);
            if (!WORK_TYPE_VALUES.includes(ns["work_type"] as never)) {
              bad(`${nAt}.work_type`, `must be one of: ${WORK_TYPE_VALUES.join(", ")}`);
            }
            stringList(ns["capabilities"], `${nAt}.capabilities`);
            range(ns["volume_range"], `${nAt}.volume_range`);
            range(ns["minutes_range"], `${nAt}.minutes_range`);
          });
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

  for (const key of ["decisions", "role_impacts", "pathways"]) {
    const list = value[key];
    if (!Array.isArray(list)) continue;
    list.forEach((item, index) => {
      if (!isObj(item)) bad(`${key}[${index}]`, "not an object");
    });
  }

  if (Array.isArray(value["capabilities"])) {
    value["capabilities"].forEach((item, index) => {
      const at = `capabilities[${index}]`;
      if (!isObj(item)) return bad(at, "not an object");
      requiredText(item["capability"], `${at}.capability`);
      requiredText(item["role"], `${at}.role`);
      if (![
        "already_strong",
        "some_do",
        "few_do",
        "nobody_does",
        "unknown",
      ].includes(item["readiness"] as string)) {
        bad(`${at}.readiness`, "not a recognized readiness");
      }
    });
  }

  if (Array.isArray(value["answers"])) {
    const answerIds = new Set<string>();
    value["answers"].forEach((item, index) => {
      const at = `answers[${index}]`;
      if (!isObj(item)) return bad(at, "not an object");
      requiredText(item["prompt_id"], `${at}.prompt_id`);
      text(item["answer"], `${at}.answer`);
      if (typeof item["prompt_id"] === "string") {
        if (answerIds.has(item["prompt_id"])) bad(`${at}.prompt_id`, "duplicate answer");
        answerIds.add(item["prompt_id"]);
      }
    });
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
      alternatives_considered: [],
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
