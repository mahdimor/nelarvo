/**
 * Application state.
 *
 * One project in memory, a dirty flag, and a save path. There is no store, no
 * reducer, and no persistence layer — the case file on disk is the only
 * durable thing, exactly as an unsaved text document works.
 */

import type { Project, Step } from "../core/types.ts";

export type ScreenName =
  | "start"
  | "case"
  | "steps"
  | "future"
  | "results"
  | "questions"
  | "report";

export interface AppState {
  project: Project | null;
  /** File name in the working folder, e.g. "claims-intake.nelarvo.json". */
  file: string | null;
  screen: ScreenName;
  /** Step being edited, or null when showing the list. */
  editingStepId: string | null;
  dirty: boolean;
  /** Increments on every user-visible edit, so a save cannot clear a later edit. */
  revision: number;
  saving: boolean;
  saveError: string | null;
}

export const state: AppState = {
  project: null,
  file: null,
  screen: "start",
  editingStepId: null,
  dirty: false,
  revision: 0,
  saving: false,
  saveError: null,
};

/**
 * How much of the interface a change needs to repaint.
 *
 * "status" exists because rebuilding the screen while someone is typing throws
 * away their focus and their caret. When the user's own keystroke is already
 * in the input, the DOM is correct — only the saved indicator needs to move.
 */
export type RenderScope = "all" | "status";

type Listener = (scope: RenderScope) => void;
const listeners = new Set<Listener>();

export function subscribe(fn: Listener): void {
  listeners.add(fn);
}

export function update(
  mutate: (s: AppState) => void,
  options: { dirty?: boolean; render?: RenderScope } = {},
): void {
  mutate(state);
  if (options.dirty !== false) {
    state.dirty = true;
    state.revision += 1;
  }
  const scope = options.render ?? "all";
  for (const fn of listeners) fn(scope);
}

/**
 * Record a field edit the user has already made with their own keyboard.
 * Marks the project dirty without disturbing what they are typing into.
 */
export function touch(mutate: (s: AppState) => void): void {
  update(mutate, { render: "status" });
}

/**
 * Finish a save without erasing edits made while its request was in flight.
 * Returns true when the caller should immediately save the newer revision.
 */
export function completeSave(startedRevision: number): boolean {
  const changedWhileSaving = state.revision !== startedRevision;
  update(
    (s) => {
      s.saving = false;
      s.dirty = changedWhileSaving;
    },
    { dirty: false },
  );
  return changedWhileSaving;
}

/** Change screen without marking the project as edited. */
export function go(screen: ScreenName, stepId: string | null = null): void {
  update(
    (s) => {
      s.screen = screen;
      s.editingStepId = stepId;
    },
    { dirty: false },
  );
}

export function currentStep(): Step | undefined {
  if (!state.project || !state.editingStepId) return undefined;
  return state.project.steps.find((s) => s.id === state.editingStepId);
}

/** Stable, readable ids derived from the step name. */
export function makeStepId(name: string, existing: Step[]): string {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "step";

  const taken = new Set(existing.map((s) => s.id));
  if (!taken.has(base)) return base;

  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
