import { test } from "node:test";
import assert from "node:assert/strict";

import { completeSave, state, touch } from "../src/studio/state.ts";

test("an edit made during a save remains dirty and requests another save", () => {
  state.revision = 10;
  state.dirty = true;
  state.saving = true;
  const startedRevision = state.revision;

  touch(() => undefined);

  assert.equal(completeSave(startedRevision), true);
  assert.equal(state.dirty, true);
  assert.equal(state.saving, false);
});

test("a completed save clears dirty when no later edit exists", () => {
  state.revision = 20;
  state.dirty = true;
  state.saving = true;

  assert.equal(completeSave(state.revision), false);
  assert.equal(state.dirty, false);
  assert.equal(state.saving, false);
});
