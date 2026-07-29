/**
 * The shell: header, save state, and which screen is showing.
 *
 * Autosave keeps nothing in browser storage. Losing the tab loses unsaved work,
 * exactly like an unsaved text document — which is the honest trade for having
 * no persistence layer at all.
 */

import { COPY } from "./copy.ts";
import { el, mount } from "./dom.ts";
import { go, state, subscribe, update } from "./state.ts";
import { saveCase } from "./api.ts";
import { renderStart } from "./screens/start.ts";
import { renderCase } from "./screens/case.ts";
import { renderSteps } from "./screens/steps.ts";
import { renderFuture } from "./screens/future.ts";
import { renderResults } from "./screens/results.ts";
import { renderReport } from "./screens/report.ts";

const AUTOSAVE_MS = 20_000;

function header(): HTMLElement {
  const project = state.project;

  const status = state.saveError
    ? el("span", { class: "status status--error" }, COPY.app.saveError)
    : state.saving
      ? el("span", { class: "status" }, COPY.app.saving)
      : state.dirty
        ? el("span", { class: "status status--dirty" }, COPY.app.unsaved)
        : el("span", { class: "status status--clean" }, COPY.app.saved);

  return el(
    "header",
    { class: "header" },
    el(
      "button",
      { class: "header__brand", onClick: () => go("start") },
      COPY.app.name,
    ),
    project
      ? el(
          "nav",
          { class: "header__nav" },
          tab(COPY.nav.caseSetup, "case"),
          tab(COPY.nav.currentState, "steps"),
          tab(COPY.nav.futureState, "future"),
          tab(COPY.nav.results, "results"),
          tab(COPY.nav.report, "report"),
        )
      : el("span", { class: "header__tagline" }, COPY.app.tagline),
    project
      ? el(
          "div",
          { class: "header__right" },
          status,
          el("button", { class: "btn btn--small", onClick: () => void save() }, COPY.app.save),
        )
      : null,
  );
}

function tab(
  label: string,
  screen: "case" | "steps" | "future" | "results" | "report",
): HTMLElement {
  return el(
    "button",
    {
      class: `header__tab${state.screen === screen ? " is-active" : ""}`,
      onClick: () => go(screen),
    },
    label,
  );
}

export async function save(): Promise<void> {
  if (!state.project || !state.file || state.saving) return;

  update((s) => {
    s.saving = true;
    s.saveError = null;
  }, { dirty: false });

  try {
    state.project.case.updated = new Date().toISOString().slice(0, 10);
    await saveCase(state.file, state.project);
    update((s) => {
      s.saving = false;
      s.dirty = false;
    }, { dirty: false });
  } catch (e) {
    update((s) => {
      s.saving = false;
      s.saveError = e instanceof Error ? e.message : String(e);
    }, { dirty: false });
  }
}

/**
 * Header and main live in separate hosts so the saved indicator can move
 * without rebuilding the screen underneath someone's cursor.
 */
const app = document.getElementById("app")!;
const headerHost = el("div");
const mainHost = el("main", { class: "main" });
app.append(headerHost, mainHost);

function renderStatus(): void {
  mount(headerHost, header());
}

function render(scope: "all" | "status" = "all"): void {
  renderStatus();
  if (scope === "status") return;

  switch (state.screen) {
    case "start":
      renderStart(mainHost);
      break;
    case "case":
      renderCase(mainHost);
      break;
    case "steps":
      renderSteps(mainHost);
      break;
    case "future":
      renderFuture(mainHost);
      break;
    case "results":
      renderResults(mainHost);
      break;
    case "report":
      renderReport(mainHost);
      break;
  }
}

subscribe(render);
render();

setInterval(() => {
  if (state.dirty && !state.saving) void save();
}, AUTOSAVE_MS);

globalThis.addEventListener("beforeunload", (e) => {
  if (state.dirty) e.preventDefault();
});

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    void save();
  }
});
