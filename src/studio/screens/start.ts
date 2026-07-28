/**
 * The first thing anyone sees. It has one job: make the problem recognizable
 * in about ten seconds, then get out of the way.
 */

import { COPY } from "../copy.ts";
import { el, mount } from "../dom.ts";
import { go, state, update } from "../state.ts";
import { listCases, loadCase, loadExample, type CaseSummary } from "../api.ts";
import { emptyProject } from "../../core/parse.ts";

const C = COPY.start;

export function renderStart(root: HTMLElement): void {
  const cases = el("div", { class: "cases" });

  mount(
    root,
    el(
      "section",
      { class: "screen screen--start" },
      el("h1", { class: "start__title" }, C.title),
      el("p", { class: "start__lede" }, C.lede),
      el("p", { class: "start__privacy" }, C.privacy),
      el(
        "div",
        { class: "start__actions" },
        el(
          "button",
          { class: "btn btn--primary", onClick: () => showNewForm(root) },
          C.newCase,
        ),
        el(
          "button",
          { class: "btn", onClick: () => openExample() },
          C.lookAtExample,
        ),
      ),
      el("h2", { class: "cases__heading" }, C.recentTitle),
      cases,
    ),
  );

  void fillCases(cases);
}

async function fillCases(target: HTMLElement): Promise<void> {
  let items: CaseSummary[] = [];
  try {
    items = await listCases();
  } catch {
    // No process to ask, or nothing readable. An empty list says enough.
  }

  if (items.length === 0) {
    mount(target, el("p", { class: "muted" }, C.noCases));
    return;
  }

  mount(
    target,
    ...items.map((c) =>
      el(
        "button",
        { class: "case-card", onClick: () => void open(c.file) },
        el("span", { class: "case-card__title" }, c.title || c.file),
        el("span", { class: "case-card__scope" }, c.scope),
        el(
          "span",
          { class: "case-card__meta" },
          `${c.steps} steps · updated ${c.updated}`,
        ),
      ),
    ),
  );
}

function showNewForm(root: HTMLElement): void {
  const input = el("input", {
    class: "field__input",
    type: "text",
    placeholder: C.newPlaceholder,
    autofocus: true,
  });

  const submit = () => {
    const scope = input.value.trim();
    if (!scope) {
      input.focus();
      return;
    }
    const project = emptyProject(scope, scope);
    update((s) => {
      s.project = project;
      s.file = `${project.case.id}.nelarvo.json`;
      s.screen = "case";
    });
  };

  mount(
    root,
    el(
      "section",
      { class: "screen screen--narrow" },
      el("h1", {}, C.newPrompt),
      el(
        "div",
        { class: "field" },
        input,
        el("p", { class: "field__help" }, C.newHelp),
      ),
      el(
        "div",
        { class: "start__actions" },
        el("button", { class: "btn btn--primary", onClick: submit }, C.create),
        el(
          "button",
          { class: "btn", onClick: () => renderStart(root) },
          COPY.app.back,
        ),
      ),
    ),
  );

  input.addEventListener("keydown", (e) => {
    if ((e as KeyboardEvent).key === "Enter") submit();
  });
  input.focus();
}

async function open(file: string): Promise<void> {
  const project = await loadCase(file);
  update(
    (s) => {
      s.project = project;
      s.file = file;
      s.screen = "steps";
    },
    { dirty: false },
  );
}

async function openExample(): Promise<void> {
  const { file, project } = await loadExample();
  update(
    (s) => {
      s.project = project;
      s.file = file;
      s.screen = "steps";
    },
    { dirty: false },
  );
}

export { go, state };
