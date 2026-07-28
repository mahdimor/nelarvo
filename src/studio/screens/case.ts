/**
 * Case setup. Five minutes of context, and one question the analyst is not
 * allowed to dodge: has this already been decided?
 */

import { COPY } from "../copy.ts";
import { el, mount } from "../dom.ts";
import { go, state, touch } from "../state.ts";
import type { Case, DecisionStatus, Period } from "../../core/types.ts";

const C = COPY.caseScreen;

type TextKey = keyof typeof C.fields;

function textField(
  key: TextKey,
  value: string,
  onInput: (v: string) => void,
  multiline = false,
): HTMLElement {
  const spec = C.fields[key];
  const input = multiline
    ? el("textarea", { class: "field__input", rows: 3, placeholder: spec.placeholder })
    : el("input", {
        class: "field__input",
        type: "text",
        placeholder: spec.placeholder,
      });
  (input as HTMLInputElement | HTMLTextAreaElement).value = value;
  input.addEventListener("input", () =>
    onInput((input as HTMLInputElement | HTMLTextAreaElement).value),
  );

  return el(
    "label",
    { class: "field" },
    el("span", { class: "field__label" }, spec.label),
    input,
    spec.help ? el("span", { class: "field__help" }, spec.help) : null,
  );
}

export function renderCase(root: HTMLElement): void {
  const project = state.project;
  if (!project) return go("start");
  const c = project.case;

  const set = (key: keyof Case, value: string) =>
    touch((s) => {
      if (s.project) (s.project.case as unknown as Record<string, unknown>)[key] = value;
    });

  const statusNote = el("p", { class: "note note--warn" });
  const paintStatusNote = () => {
    if (c.decision_status === "already_decided") {
      statusNote.textContent = C.decisionStatus.warnAlreadyDecided;
      statusNote.style.display = "";
    } else {
      statusNote.style.display = "none";
    }
  };

  mount(
    root,
    el(
      "section",
      { class: "screen screen--narrow" },
      el("h1", {}, C.title),
      el("p", { class: "lede" }, C.lede),

      textField("scope", c.scope, (v) => set("scope", v)),
      textField("organization", c.organization, (v) => set("organization", v)),
      textField("boundary_start", c.boundary_start, (v) => set("boundary_start", v)),
      textField("boundary_end", c.boundary_end, (v) => set("boundary_end", v)),
      textField("technology", c.technology, (v) => set("technology", v)),
      textField("purpose", c.purpose, (v) => set("purpose", v), true),
      textField("sponsor_role", c.sponsor_role, (v) => set("sponsor_role", v)),
      textField("maintainer_role", c.maintainer_role, (v) => set("maintainer_role", v)),

      el(
        "fieldset",
        { class: "field" },
        el("legend", { class: "field__label" }, C.decisionStatus.label),
        el("p", { class: "field__help" }, C.decisionStatus.help),
        el(
          "div",
          { class: "choices" },
          ...(
            Object.entries(C.decisionStatus.options) as [DecisionStatus, string][]
          ).map(([value, label]) =>
            radio("decision_status", label, c.decision_status === value, () => {
              touch((s) => {
                if (s.project) s.project.case.decision_status = value;
              });
              paintStatusNote();
            }),
          ),
        ),
        statusNote,
      ),

      el(
        "fieldset",
        { class: "field" },
        el("legend", { class: "field__label" }, C.period.label),
        el("p", { class: "field__help" }, C.period.help),
        el(
          "div",
          { class: "choices" },
          ...(Object.entries(C.period.options) as [Period, string][]).map(
            ([value, label]) =>
              radio("period", label, c.period === value, () =>
                touch((s) => {
                  if (s.project) s.project.case.period = value;
                }),
              ),
          ),
        ),
      ),

      alternativesField(c),

      el(
        "div",
        { class: "screen__actions" },
        el(
          "button",
          { class: "btn btn--primary", onClick: () => go("steps") },
          C.next,
        ),
      ),
    ),
  );

  paintStatusNote();
}

function radio(
  name: string,
  label: string,
  checked: boolean,
  onPick: () => void,
): HTMLElement {
  const input = el("input", { type: "radio", name, checked });
  input.addEventListener("change", onPick);
  return el("label", { class: "choice" }, input, el("span", {}, label));
}

function alternativesField(c: Case): HTMLElement {
  const box = el("textarea", {
    class: "field__input",
    rows: 3,
    placeholder: C.alternatives.placeholder,
  });
  box.value = c.alternatives_considered.join("\n");
  box.addEventListener("input", () =>
    touch((s) => {
      if (!s.project) return;
      s.project.case.alternatives_considered = box.value
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);
    }),
  );

  return el(
    "label",
    { class: "field" },
    el("span", { class: "field__label" }, C.alternatives.label),
    box,
    el("span", { class: "field__help" }, C.alternatives.help),
  );
}
