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
  Range,
  Scenario,
  Step,
} from "../../core/types.ts";
import { ALLOCATION_VALUES } from "../../core/types.ts";
import {
  carriesMostDoubt,
  futureHumanHours,
  sensitivity,
  stepHours,
  workflowTotals,
} from "../../core/calc/index.ts";

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

  const shareRange = rangeFields({
    current: a.human_share_range,
    scale: 100,
    onChange: (r) => {
      touch(() => {
        const target = ensureAssignment(step.id);
        if (r) target.human_share_range = r;
        else delete target.human_share_range;
      });
      repaint();
    },
  });

  const minutesRange = rangeFields({
    current: a.new_minutes_range,
    onChange: (r) => {
      touch(() => {
        const target = ensureAssignment(step.id);
        if (r) target.new_minutes_range = r;
        else delete target.new_minutes_range;
      });
      repaint();
    },
  });

  return [
    el(
      "div",
      { class: "row" },
      labelled(C.humanShare.label, C.humanShare.help, share, shareRange),
      labelled(C.newMinutes.label, C.newMinutes.help, minutes, minutesRange),
    ),
    el("p", { class: "field__help" }, C.range.help),
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
        "div",
        { class: "creates__ranges" },
        rangeFields({
          caption: fill(C.creates.volume, { period }),
          current: ns.volume_range,
          onChange: (r) => {
            touch(() => {
              const created = ensureAssignment(step.id).creates_steps![index]!;
              if (r) created.volume_range = r;
              else delete created.volume_range;
            });
            repaint();
          },
        }),
        rangeFields({
          caption: C.creates.minutes,
          current: ns.minutes_range,
          onChange: (r) => {
            touch(() => {
              const created = ensureAssignment(step.id).creates_steps![index]!;
              if (r) created.minutes_range = r;
              else delete created.minutes_range;
            });
            repaint();
          },
        }),
      ),
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

  // The same arithmetic the report uses. Working the totals out again by hand
  // here is how one workflow ends up with two different answers.
  const t = workflowTotals(project);
  const band = sensitivity(project);
  const doubt = carriesMostDoubt(band);

  return el(
    "div",
    { class: "totals" },
    el("h2", { class: "totals__heading" }, C.totals.heading),
    el(
      "p",
      { class: "totals__figures" },
      `${C.totals.before}: `,
      el("strong", {}, fmt(t.hours_before)),
      ` hrs/${period}`,
    ),
    el(
      "p",
      { class: "totals__figures totals__figures--big" },
      `${C.totals.after}: `,
      el("strong", {}, fmt(t.hours_after)),
      ` hrs/${period}`,
      t.change_pct !== 0
        ? el("span", { class: "totals__change" }, ` (${t.change_pct}%)`)
        : null,
    ),
    band.has_ranges
      ? el(
          "p",
          { class: "totals__figures totals__band" },
          `${C.totals.band}: `,
          el(
            "strong",
            {},
            `${fmt(band.hours_after.low)} to ${fmt(band.hours_after.high)}`,
          ),
          ` hrs/${period}`,
        )
      : null,
    doubt
      ? el(
          "p",
          { class: "muted small" },
          fill(C.totals.carries, { name: doubt.name, hours: fmt(doubt.swing) }),
        )
      : null,
    t.new_work_hours > 0
      ? el("p", { class: "note" }, `${fmt(t.new_work_hours)} hrs ${C.totals.newWork}`)
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

function labelled(
  label: string,
  help: string,
  input: HTMLElement,
  extra?: HTMLElement | null,
): HTMLElement {
  return el(
    "div",
    { class: "field field--half" },
    el(
      "label",
      { class: "field__inner" },
      el("span", { class: "field__label" }, label),
      input,
      el("span", { class: "field__help" }, help),
    ),
    extra ?? null,
  );
}

/**
 * The optional band on a number.
 *
 * Both ends or neither: half a range says nothing, so an incomplete pair is
 * stored as no range at all. Nothing here fills in a default — a band the tool
 * invented would be a guess wearing a measurement's clothes.
 */
function rangeFields(opts: {
  caption?: string;
  current: Range | undefined;
  /** 100 when the field is shown as a percentage, 1 otherwise. */
  scale?: number;
  onChange: (r: Range | undefined) => void;
}): HTMLElement {
  const scale = opts.scale ?? 1;
  const shown = (v: number | undefined) =>
    v === undefined ? "" : String(Math.round(v * scale * 100) / 100);

  const end = (value: string) => {
    const input = el("input", {
      class: "field__input field__input--small",
      type: "number",
      min: 0,
      step: "any",
    });
    input.value = value;
    return input;
  };

  const low = end(shown(opts.current?.low));
  const high = end(shown(opts.current?.high));

  const emit = () => {
    const lo = Number(low.value);
    const hi = Number(high.value);
    const missing = low.value.trim() === "" || high.value.trim() === "";
    if (missing || !Number.isFinite(lo) || !Number.isFinite(hi)) {
      opts.onChange(undefined);
      return;
    }
    opts.onChange({ low: lo / scale, high: hi / scale });
  };

  low.addEventListener("input", emit);
  high.addEventListener("input", emit);

  return el(
    "div",
    { class: "range" },
    opts.caption ? el("span", { class: "range__caption" }, opts.caption) : null,
    el(
      "label",
      { class: "range__end" },
      el("span", { class: "range__label" }, C.range.low),
      low,
    ),
    el(
      "label",
      { class: "range__end" },
      el("span", { class: "range__label" }, C.range.high),
      high,
    ),
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
