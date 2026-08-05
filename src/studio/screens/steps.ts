/**
 * The workflow as it runs today.
 *
 * This is the longest screen in the product and the one adoption turns on. An
 * analyst who cannot enter twelve steps in forty minutes will not come back,
 * so the required fields are five and everything else waits.
 */

import { COPY, fill } from "../copy.ts";
import { el, fmt, mount } from "../dom.ts";
import { currentStep, go, makeStepId, state, touch, update } from "../state.ts";
import type { Evidence, Step, WorkType } from "../../core/types.ts";
import { EVIDENCE_VALUES, WORK_TYPE_VALUES } from "../../core/types.ts";
import { isUnassessed, stepHours, toFte } from "../../core/calc/index.ts";

const C = COPY.steps;

export function renderSteps(root: HTMLElement): void {
  if (!state.project) return go("start");
  if (state.editingStepId) return renderEditor(root);
  renderList(root);
}

// ---------------------------------------------------------------------------
// The list
// ---------------------------------------------------------------------------

function renderList(root: HTMLElement): void {
  const project = state.project!;
  const period = project.case.period;
  const ordered = [...project.steps].sort((a, b) => a.sequence - b.sequence);

  mount(
    root,
    el(
      "section",
      { class: "screen" },
      el("h1", {}, C.title),
      el("p", { class: "lede" }, C.lede),
      el("p", { class: "note" }, C.minimumNote),

      el(
        "div",
        { class: "layout" },
        el(
          "div",
          { class: "layout__main" },
          ordered.length === 0
            ? el("p", { class: "muted" }, C.empty)
            : el(
                "ul",
                { class: "steps" },
                ...ordered.map((s) => stepRow(s, period)),
              ),
          el(
            "button",
            { class: "btn btn--primary", onClick: () => addStep() },
            C.addStep,
          ),
        ),
        el("aside", { class: "layout__side" }, totalsPanel()),
      ),
    ),
  );
}

function stepRow(step: Step, period: "week" | "month"): HTMLElement {
  const hours = stepHours(step);
  const label = COPY.steps.workTypes[step.work_type].label;

  return el(
    "li",
    { class: "step" },
    el(
      "button",
      { class: "step__body", onClick: () => go("steps", step.id) },
      el(
        "span",
        { class: "step__head" },
        el("span", { class: "step__name" }, step.name || "(unnamed step)"),
        el("span", { class: "step__hours" }, `${fmt(hours)} hrs/${period}`),
      ),
      el(
        "span",
        { class: "step__meta" },
        el("span", { class: "chip" }, step.role || "no role yet"),
        el("span", { class: `chip chip--${step.work_type}` }, label),
        `${fmt(step.volume_per_period, 0)} x ${fmt(step.minutes_per_unit, 0)} min`,
        step.is_decision_point ? el("span", { class: "chip chip--flag" }, "decision") : null,
        step.is_invisible_work
          ? el("span", { class: "chip chip--flag" }, "not in any procedure")
          : null,
        isUnassessed(step) ? el("span", { class: "chip chip--unknown" }, "not yet known") : null,
      ),
    ),
  );
}

function addStep(): void {
  const project = state.project!;
  const seq =
    project.steps.reduce((max, s) => Math.max(max, s.sequence), 0) + 1;
  const id = makeStepId(`step ${seq}`, project.steps);

  const step: Step = {
    id,
    name: "",
    sequence: seq,
    role: "",
    volume_per_period: 0,
    minutes_per_unit: 0,
    work_type: "data_handling",
    capabilities: [],
    is_decision_point: false,
    is_invisible_work: false,
    exposure: { feasible: "unknown", share_addressable: 0, evidence: "unknown" },
    evidence: "reported",
    origin: "human",
  };

  update((s) => {
    s.project!.steps.push(step);
    s.editingStepId = id;
  });
}

// ---------------------------------------------------------------------------
// Totals
// ---------------------------------------------------------------------------

function totalsPanel(): HTMLElement {
  const project = state.project!;
  const period = project.case.period;
  const steps = project.steps;

  const total = steps.reduce((sum, s) => sum + stepHours(s), 0);
  const unassessed = steps
    .filter(isUnassessed)
    .reduce((sum, s) => sum + stepHours(s), 0);
  const roles = new Set(steps.map((s) => s.role).filter(Boolean));

  const byType = new Map<WorkType, number>();
  for (const s of steps) {
    byType.set(s.work_type, (byType.get(s.work_type) ?? 0) + stepHours(s));
  }
  const split = [...byType.entries()]
    .filter(([, hours]) => hours > 0)
    .sort((a, b) => b[1] - a[1]);

  return el(
    "div",
    { class: "totals" },
    el("h2", { class: "totals__heading" }, C.totals.heading),
    el(
      "p",
      { class: "totals__figures" },
      el("strong", {}, String(steps.length)),
      ` ${C.totals.steps} · `,
      el("strong", {}, String(roles.size)),
      ` ${C.totals.roles}`,
    ),
    el(
      "p",
      { class: "totals__figures totals__figures--big" },
      el("strong", {}, fmt(total)),
      ` ${C.totals.hours}/${period} · `,
      el("strong", {}, fmt(toFte(total, period))),
      ` ${C.totals.fte}`,
    ),

    split.length === 0
      ? el("p", { class: "muted" }, C.totals.firstStepHint)
      : el(
          "div",
          {},
          el("h3", { class: "totals__sub" }, C.totals.splitHeading),
          el(
            "div",
            { class: "split" },
            ...split.map(([type, hours]) =>
              el("span", {
                class: `split__seg split__seg--${type}`,
                style: `flex: ${hours}`,
                title: `${COPY.steps.workTypes[type].label} — ${fmt(hours)} hrs`,
              }),
            ),
          ),
          el(
            "ul",
            { class: "legend" },
            ...split.map(([type, hours]) =>
              el(
                "li",
                { class: "legend__item" },
                el("span", { class: `legend__dot legend__dot--${type}` }),
                COPY.steps.workTypes[type].label,
                el(
                  "span",
                  { class: "legend__value" },
                  `${Math.round((hours / total) * 100)}%`,
                ),
              ),
            ),
          ),
        ),

    unassessed > 0
      ? el(
          "p",
          { class: "note note--warn" },
          fill(C.totals.unassessedNote, { hours: fmt(unassessed) }),
        )
      : null,
    el("p", { class: "muted small" }, COPY.app.estimateNote),
  );
}

// ---------------------------------------------------------------------------
// The editor
// ---------------------------------------------------------------------------

function renderEditor(root: HTMLElement): void {
  const project = state.project!;
  const step = currentStep();
  if (!step) return go("steps");
  const period = project.case.period;

  const readout = el("p", { class: "readout" });
  const paint = () => {
    const hours = stepHours(step);
    readout.textContent =
      hours > 0
        ? `${fmt(hours)} hrs/${period} · ${fmt(toFte(hours, period))} FTE`
        : "";
  };

  // touch, not update: the keystroke is already in the input. Re-rendering
  // here would take the analyst's focus and caret away mid-word.
  const set = <K extends keyof Step>(key: K, value: Step[K]) => {
    touch((s) => {
      const target = s.project!.steps.find((x) => x.id === step.id);
      if (target) (target as unknown as Record<string, unknown>)[key as string] = value;
    });
  };

  mount(
    root,
    el(
      "section",
      { class: "screen screen--narrow" },
      el(
        "button",
        { class: "btn btn--quiet", onClick: () => go("steps") },
        `← ${COPY.app.back}`,
      ),
      el("h1", {}, C.editing),

      text("name", step.name, (v) => set("name", v)),
      text("role", step.role, (v) => set("role", v)),

      el(
        "div",
        { class: "row" },
        number(
          fill(C.fields.volume.label, { period }),
          C.fields.volume.help,
          C.fields.volume.placeholder,
          step.volume_per_period,
          (v) => {
            step.volume_per_period = v;
            set("volume_per_period", v);
            paint();
          },
        ),
        number(
          C.fields.minutes.label,
          C.fields.minutes.help,
          C.fields.minutes.placeholder,
          step.minutes_per_unit,
          (v) => {
            step.minutes_per_unit = v;
            set("minutes_per_unit", v);
            paint();
          },
        ),
      ),
      readout,

      workTypePicker(step, (v) => set("work_type", v)),

      text(
        "capabilities",
        step.capabilities.join(", "),
        (v) =>
          set(
            "capabilities",
            v.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean),
          ),
      ),

      evidencePicker(step, (v) => set("evidence", v)),
      text("failureMode", step.failure_mode ?? "", (v) => set("failure_mode", v)),

      returnsToPicker(step, (v) => set("returns_to", v)),

      checkbox(
        C.fields.decisionPoint.label,
        C.fields.decisionPoint.help,
        step.is_decision_point,
        (v) => set("is_decision_point", v),
      ),
      checkbox(
        C.fields.invisibleWork.label,
        C.fields.invisibleWork.help,
        step.is_invisible_work,
        (v) => set("is_invisible_work", v),
      ),

      el(
        "div",
        { class: "screen__actions" },
        el("button", { class: "btn btn--primary", onClick: () => go("steps") }, C.done),
        el(
          "button",
          { class: "btn btn--danger", onClick: () => removeStep(step) },
          C.deleteStep,
        ),
      ),
    ),
  );

  paint();

  // Focus the first field only when this step is newly opened, never on a
  // later repaint — otherwise the cursor jumps to the top of the form.
  if (lastFocusedStepId !== step.id) {
    lastFocusedStepId = step.id;
    (root.querySelector(".field__input") as HTMLInputElement | null)?.focus();
  }
}

let lastFocusedStepId: string | null = null;

function removeStep(step: Step): void {
  const project = state.project!;
  const linked = project.decisions.some((d) => d.step_id === step.id);
  const message = linked ? C.deleteBlockedByDecision : C.deleteConfirm;
  if (!globalThis.confirm(message)) return;

  update((s) => {
    s.project!.steps = s.project!.steps.filter((x) => x.id !== step.id);
    for (const scenario of s.project!.scenarios) {
      scenario.assignments = scenario.assignments.filter(
        (a) => a.step_id !== step.id,
      );
    }
    s.editingStepId = null;
  });
}

// ---------------------------------------------------------------------------
// Field builders
// ---------------------------------------------------------------------------

/**
 * Where rework goes back to. Only earlier steps are offered — work that returns
 * to something later is not rework, it is the sequence being wrong.
 */
function returnsToPicker(
  step: Step,
  onChange: (v: string | undefined) => void,
): HTMLElement {
  const earlier = state
    .project!.steps.filter((s) => s.sequence < step.sequence)
    .sort((a, b) => a.sequence - b.sequence);

  const select = el("select", { class: "field__input" });
  const none = el("option", { value: "" }, C.fields.returnsTo.none);
  if (!step.returns_to) none.selected = true;
  select.append(none);

  for (const s of earlier) {
    const option = el("option", { value: s.id }, s.name || "(unnamed step)");
    if (step.returns_to === s.id) option.selected = true;
    select.append(option);
  }

  select.addEventListener("change", () => {
    onChange(select.value === "" ? undefined : select.value);
  });

  return el(
    "label",
    { class: "field" },
    el("span", { class: "field__label" }, C.fields.returnsTo.label),
    select,
    el("span", { class: "field__help" }, C.fields.returnsTo.help),
  );
}

type FieldKey = "name" | "role" | "capabilities" | "failureMode";

function text(
  key: FieldKey,
  value: string,
  onInput: (v: string) => void,
): HTMLElement {
  const spec = C.fields[key];
  const input = el("input", {
    class: "field__input",
    type: "text",
    placeholder: spec.placeholder,
  });
  input.value = value;
  input.addEventListener("input", () => onInput(input.value));

  return el(
    "label",
    { class: "field" },
    el("span", { class: "field__label" }, spec.label),
    input,
    el("span", { class: "field__help" }, spec.help),
  );
}

function number(
  label: string,
  help: string,
  placeholder: string,
  value: number,
  onInput: (v: number) => void,
): HTMLElement {
  const input = el("input", {
    class: "field__input",
    type: "number",
    min: 0,
    step: "any",
    placeholder,
  });
  input.value = value ? String(value) : "";
  input.addEventListener("input", () => {
    const parsed = Number(input.value);
    onInput(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0);
  });

  return el(
    "label",
    { class: "field field--half" },
    el("span", { class: "field__label" }, label),
    input,
    el("span", { class: "field__help" }, help),
  );
}

function workTypePicker(step: Step, onPick: (v: WorkType) => void): HTMLElement {
  return el(
    "fieldset",
    { class: "field" },
    el("legend", { class: "field__label" }, C.fields.workType.label),
    el("p", { class: "field__help" }, C.fields.workType.help),
    el(
      "div",
      { class: "worktypes" },
      ...WORK_TYPE_VALUES.map((type) => {
        const spec = C.workTypes[type];
        const input = el("input", {
          type: "radio",
          name: "work_type",
          checked: step.work_type === type,
        });
        input.addEventListener("change", () => onPick(type));
        return el(
          "label",
          { class: `worktype worktype--${type}` },
          input,
          el(
            "span",
            {},
            el("span", { class: "worktype__label" }, spec.label),
            el("span", { class: "worktype__help" }, spec.help),
          ),
        );
      }),
    ),
  );
}

function evidencePicker(step: Step, onPick: (v: Evidence) => void): HTMLElement {
  const select = el("select", { class: "field__input" });
  for (const value of EVIDENCE_VALUES) {
    const option = el("option", { value }, C.evidenceLevels[value]);
    if (step.evidence === value) option.selected = true;
    select.append(option);
  }
  select.addEventListener("change", () => onPick(select.value as Evidence));

  return el(
    "label",
    { class: "field" },
    el("span", { class: "field__label" }, C.fields.evidence.label),
    select,
    el("span", { class: "field__help" }, C.fields.evidence.help),
  );
}

function checkbox(
  label: string,
  help: string,
  checked: boolean,
  onToggle: (v: boolean) => void,
): HTMLElement {
  const input = el("input", { type: "checkbox", checked });
  input.addEventListener("change", () => onToggle(input.checked));
  return el(
    "label",
    { class: "field field--check" },
    input,
    el(
      "span",
      {},
      el("span", { class: "field__label" }, label),
      el("span", { class: "field__help" }, help),
    ),
  );
}
