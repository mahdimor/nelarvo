/**
 * What changes.
 *
 * The analyst decides what happens to each step. The tool computes the cost of
 * that decision and never suggests one — more automation is not a more mature
 * answer, and a tool that implies otherwise is doing the vendor's job.
 */

import { COPY, fill } from "../copy.ts";
import { el, fmt, mount } from "../dom.ts";
import { go, state, touch } from "../state.ts";
import type {
  Allocation,
  Assignment,
  NewStep,
  Scenario,
  Step,
} from "../../core/types.ts";
import { ALLOCATION_VALUES } from "../../core/types.ts";
import { futureHumanHours, newStepHours, stepHours } from "../../core/calc/index.ts";

const C = COPY.future;

/** Allocations where the human share and duration actually change the answer. */
const SHARE_MATTERS: readonly Allocation[] = [
  "human_ai_assisted",
  "ai_full_review",
  "ai_exception_review",
  "redesigned",
];

function scenario(): Scenario {
  const project = state.project!;
  if (project.scenarios.length === 0) {
    project.scenarios.push({
      id: "future",
      name: "Proposed future state",
      description: "",
      assignments: [],
    });
  }
  return project.scenarios[0]!;
}

function assignmentFor(stepId: string): Assignment | undefined {
  return scenario().assignments.find((a) => a.step_id === stepId);
}

/** Create the assignment lazily — an untouched step stays genuinely unassigned. */
function ensureAssignment(stepId: string): Assignment {
  const existing = assignmentFor(stepId);
  if (existing) return existing;

  const created: Assignment = {
    step_id: stepId,
    allocation: "unresolved",
    human_share: 1,
    evidence: "proposed",
    origin: "human",
  };
  scenario().assignments.push(created);
  return created;
}

export function renderFuture(root: HTMLElement): void {
  const project = state.project;
  if (!project) return go("start");

  const ordered = [...project.steps].sort((a, b) => a.sequence - b.sequence);
  const totalsHost = el("aside", { class: "layout__side" });
  const paintTotals = () => mount(totalsHost, totalsPanel());

  mount(
    root,
    el(
      "section",
      { class: "screen" },
      el("h1", {}, C.title),
      el("p", { class: "lede" }, C.lede),

      ordered.length === 0
        ? el("p", { class: "muted" }, C.noSteps)
        : el(
            "div",
            { class: "layout" },
            el(
              "div",
              { class: "layout__main" },
              ...ordered.map((step) => stepBlock(step, paintTotals)),
            ),
            totalsHost,
          ),
    ),
  );

  paintTotals();
}

function stepBlock(step: Step, paintTotals: () => void): HTMLElement {
  const period = state.project!.case.period;
  const a = assignmentFor(step.id);
  const before = stepHours(step);

  const detail = el("div", { class: "assign__detail" });
  const readout = el("span", { class: "assign__delta" });

  /** Text only. Safe to call while someone is typing. */
  const paintReadout = () => {
    const now = assignmentFor(step.id);
    const hoursAfter = now ? futureHumanHours(step, now) : before;
    const diff = hoursAfter - before;
    readout.textContent =
      `${fmt(before)} → ${fmt(hoursAfter)} hrs` +
      (Math.abs(diff) > 0.05 ? `  (${diff > 0 ? "+" : ""}${fmt(diff)})` : "");
    readout.className =
      "assign__delta" + (diff < -0.05 ? " is-down" : diff > 0.05 ? " is-up" : "");
    paintTotals();
  };

  /** Rebuilds inputs, so only ever on an allocation change — never mid-typing. */
  const paintDetail = () => {
    mount(detail, ...detailFields(step, paintReadout, paintDetail));
    paintReadout();
  };

  const select = el("select", { class: "field__input assign__select" });
  for (const value of ALLOCATION_VALUES) {
    const option = el("option", { value }, C.allocation.options[value]);
    if (a?.allocation === value) option.selected = true;
    select.append(option);
  }
  if (!a) {
    const none = el("option", { value: "" }, C.unassigned);
    none.selected = true;
    select.prepend(none);
  }
  select.addEventListener("change", () => {
    const chosen = select.value as Allocation;
    touch(() => {
      const target = ensureAssignment(step.id);
      target.allocation = chosen;
      // A step whose human part is gone has no meaningful share left.
      if (!SHARE_MATTERS.includes(chosen)) target.human_share = 1;
    });
    paintDetail();
  });

  const block = el(
    "div",
    { class: "assign" },
    el(
      "div",
      { class: "assign__head" },
      el("span", { class: "assign__name" }, step.name || "(unnamed step)"),
      readout,
    ),
    el(
      "div",
      { class: "assign__meta" },
      el("span", { class: "chip" }, step.role),
      `${fmt(step.volume_per_period, 0)} x ${fmt(step.minutes_per_unit, 0)} min / ${period}`,
    ),
    select,
    detail,
  );

  paintDetail();
  return block;
}

/**
 * `repaint` updates numbers only and is safe during typing. `rebuild` replaces
 * these inputs, so it is reserved for structural changes like adding a row.
 */
function detailFields(
  step: Step,
  repaint: () => void,
  rebuild: () => void,
): HTMLElement[] {
  const a = assignmentFor(step.id);
  if (!a || !SHARE_MATTERS.includes(a.allocation)) {
    return a ? [createsBlock(step, a, repaint, rebuild)] : [];
  }

  const share = el("input", {
    class: "field__input",
    type: "number",
    min: 0,
    max: 100,
    step: 1,
  });
  share.value = String(Math.round(a.human_share * 100));
  share.addEventListener("input", () => {
    const pct = Math.min(100, Math.max(0, Number(share.value) || 0));
    touch(() => {
      ensureAssignment(step.id).human_share = pct / 100;
    });
    repaint();
  });

  const minutes = el("input", {
    class: "field__input",
    type: "number",
    min: 0,
    step: "any",
    placeholder: String(step.minutes_per_unit),
  });
  minutes.value = a.new_minutes_per_unit ? String(a.new_minutes_per_unit) : "";
  minutes.addEventListener("input", () => {
    const value = Number(minutes.value);
    touch(() => {
      const target = ensureAssignment(step.id);
      if (minutes.value === "" || !Number.isFinite(value) || value < 0) {
        delete target.new_minutes_per_unit;
      } else {
        target.new_minutes_per_unit = value;
      }
    });
    repaint();
  });

  return [
    el(
      "div",
      { class: "row" },
      labelled(C.humanShare.label, C.humanShare.help, share),
      labelled(C.newMinutes.label, C.newMinutes.help, minutes),
    ),
    createsBlock(step, a, repaint, rebuild),
  ];
}

function createsBlock(
  step: Step,
  a: Assignment,
  repaint: () => void,
  rebuild: () => void,
): HTMLElement {
  const period = state.project!.case.period;
  const created = a.creates_steps ?? [];

  const rows = created.map((ns, index) =>
    el(
      "div",
      { class: "creates__row" },
      field(C.creates.name, ns.name, (v) => {
        touch(() => {
          ensureAssignment(step.id).creates_steps![index]!.name = v;
        });
      }),
      field(C.creates.role, ns.role, (v) => {
        touch(() => {
          ensureAssignment(step.id).creates_steps![index]!.role = v;
        });
      }),
      numberField(
        fill(C.creates.volume, { period }),
        ns.volume_per_period,
        (v) => {
          touch(() => {
            ensureAssignment(step.id).creates_steps![index]!.volume_per_period = v;
          });
          repaint();
        },
      ),
      numberField(C.creates.minutes, ns.minutes_per_unit, (v) => {
        touch(() => {
          ensureAssignment(step.id).creates_steps![index]!.minutes_per_unit = v;
        });
        repaint();
      }),
      el(
        "button",
        {
          class: "btn btn--small btn--danger",
          onClick: () => {
            touch(() => {
              const target = ensureAssignment(step.id);
              target.creates_steps = (target.creates_steps ?? []).filter(
                (_, i) => i !== index,
              );
            });
            rebuild();
          },
        },
        C.creates.remove,
      ),
    ),
  );

  return el(
    "details",
    { class: "creates", open: created.length > 0 },
    el("summary", { class: "creates__summary" }, C.creates.heading),
    el("p", { class: "field__help" }, C.creates.help),
    ...rows,
    el(
      "button",
      {
        class: "btn btn--small",
        onClick: () => {
          touch(() => {
            const target = ensureAssignment(step.id);
            const list = (target.creates_steps ??= []);
            const created: NewStep = {
              id: `${step.id}-creates-${list.length + 1}`,
              name: "",
              role: step.role,
              volume_per_period: step.volume_per_period,
              minutes_per_unit: 0,
              work_type: "supervision",
              capabilities: [],
            };
            list.push(created);
          });
          rebuild();
        },
      },
      C.creates.add,
    ),
  );
}

// ---------------------------------------------------------------------------

function totalsPanel(): HTMLElement {
  const project = state.project!;
  const period = project.case.period;
  const assignments = scenario().assignments;

  let before = 0;
  let after = 0;
  for (const step of project.steps) {
    const h = stepHours(step);
    before += h;
    const a = assignments.find((x) => x.step_id === step.id);
    after += a ? futureHumanHours(step, a) : h;
  }
  const newWork = assignments
    .flatMap((a) => a.creates_steps ?? [])
    .reduce((sum, ns) => sum + newStepHours(ns), 0);
  after += newWork;

  const change = before === 0 ? 0 : Math.round(((after - before) / before) * 100);

  return el(
    "div",
    { class: "totals" },
    el("h2", { class: "totals__heading" }, C.totals.heading),
    el(
      "p",
      { class: "totals__figures" },
      `${C.totals.before}: `,
      el("strong", {}, fmt(before)),
      ` hrs/${period}`,
    ),
    el(
      "p",
      { class: "totals__figures totals__figures--big" },
      `${C.totals.after}: `,
      el("strong", {}, fmt(after)),
      ` hrs/${period}`,
      change !== 0 ? el("span", { class: "totals__change" }, ` (${change}%)`) : null,
    ),
    newWork > 0
      ? el(
          "p",
          { class: "note" },
          `${fmt(newWork)} hrs ${C.totals.newWork}`,
        )
      : null,
    assignments.length === 0 ? el("p", { class: "muted" }, C.totals.unchanged) : null,
    el(
      "button",
      { class: "btn btn--primary", onClick: () => go("results") },
      COPY.results.title,
    ),
  );
}

// ---------------------------------------------------------------------------

function labelled(label: string, help: string, input: HTMLElement): HTMLElement {
  return el(
    "label",
    { class: "field field--half" },
    el("span", { class: "field__label" }, label),
    input,
    el("span", { class: "field__help" }, help),
  );
}

function field(
  label: string,
  value: string,
  onInput: (v: string) => void,
): HTMLElement {
  const input = el("input", { class: "field__input", type: "text" });
  input.value = value;
  input.addEventListener("input", () => onInput(input.value));
  return el(
    "label",
    { class: "field field--tight" },
    el("span", { class: "field__label" }, label),
    input,
  );
}

function numberField(
  label: string,
  value: number,
  onInput: (v: number) => void,
): HTMLElement {
  const input = el("input", {
    class: "field__input",
    type: "number",
    min: 0,
    step: "any",
  });
  input.value = value ? String(value) : "";
  input.addEventListener("input", () => {
    const parsed = Number(input.value);
    onInput(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0);
  });
  return el(
    "label",
    { class: "field field--tight" },
    el("span", { class: "field__label" }, label),
    input,
  );
}
