# Build specification

**Status: version 1 is built and usable.** Four sprints, complete. This document
describes what exists, what was deliberately left out, and the constraints
anyone working on it has to keep.

It used to describe an eight-sprint plan. That plan was cut in half after Sprint
2, on the reasoning that a tool an analyst can finish a case with beats a tool
with more features that nobody has run. What was cut is listed in §6, each with
the evidence that would justify building it.

For what the product is *for*, read [`MEMORANDUM.md`](MEMORANDUM.md). For how to
use it, read [`../TUTO.md`](../TUTO.md).

---

## 1. What it does

A business analyst describes one workflow as it runs today — each step, who does
it, how many per period, how long each takes. They say what the technology takes
over. The tool computes what that does to every role, and turns the work that
grows into the capabilities people will need.

Everything rests on one multiplication: **volume × duration = hours**.

```text
hours(step)   = volume_per_period × minutes_per_unit / 60
fte(hours)    = hours / 37.5 per week, or / 162.5 per month

future human hours, by allocation:
  eliminated, outsourced, rule_automated, machine   → 0
  human, unresolved                                 → unchanged
  everything else  → volume × effective_minutes × human_share / 60
```

`human_share` is entered by the analyst and never inferred. The whole analysis
rests on it, so guessing it would be inventing the answer.

Two honesty rules live in code, not in guidance:

- **Unassessed work is excluded from every headline figure and reported
  separately.** A step whose evidence or feasibility is `unknown` is real work
  someone does today, but its fate is unknown. Burying that inside a confident
  total is the most damaging thing this tool could do.
- **Absolute hours and percentages always travel together.** A role can shrink
  in hours while a kind of work grows as a share of what remains. The model
  returns both, and any view showing one without the other misleads.

## 2. What exists

| Sprint | Delivered |
|---|---|
| 1 | Data model, calculation engine, project file, command line, tests |
| 2 | Studio: case setup and current-state capture |
| 3 | Future-state assignment and the results screen |
| 4 | The printable report, in Studio and from the command line |

**Screens:** Start · The case · Work today · What changes · What it means · Report

**Commands:**

```text
nelarvo studio [--port N] [--no-open]   open the window
nelarvo new "Auto claims intake"        start a case from the terminal
nelarvo validate <file>                 check the file is structurally sound
nelarvo calc <file> [scenario]          the before and after
nelarvo report <file> [--out x]         write the printable report
```

**Examples:** `expense-claims` (5 steps, 2 roles — the tutorial) and
`claims-intake` (12 steps, 4 roles — closer to a real engagement).

## 3. Architecture

Three surfaces over one core.

```text
src/
  core/            pure logic. No filesystem, no network, no AI. Ever.
    brand.ts       the only place the product name appears
    types.ts       the data model
    parse.ts       project file read/write, stable key order
    calc/          hours, role composition, capability demand
    report/        the report, as one self-contained HTML string
  cli/             thin shell: file I/O and formatting only
    studio.ts      the local process behind the window
  studio/          the interface
    copy.ts        every word the analyst reads, in one file
    screens/
```

**Node runs the TypeScript directly.** There is no build step and no bundler:
`stripTypeScriptTypes` turns `.ts` into JavaScript as it is served, so the
browser imports the same core modules the tests run against. The interface and
the engine cannot drift apart.

**No UI framework.** Plain TypeScript, plain DOM, plain CSS. Six screens do not
justify a five-year dependency.

**The file is not the interface.** The analyst never sees JSON. One
`<case-id>.nelarvo.json` per case, in their own folder, with stable key order so
`git diff` stays readable.

### Rendering, and the trap in it

The interface re-renders on state change. Twice during these sprints that stole
the analyst's focus and caret mid-word and made a data-entry screen unusable.
Both times it was found only by running the thing.

State updates therefore carry a scope:

- `update()` — rebuilds the screen. For structural change: adding a step,
  deleting one, navigating.
- `touch()` — repaints only the saved indicator. For a field the user has
  already typed into, where the DOM is correct and rebuilding would take their
  cursor away.

Within a screen, follow the same split: a numbers-only repaint is safe during
typing; anything that replaces an input is reserved for structural change.

## 4. The data model

Defined in `src/core/types.ts`, which is the reference. Eight top-level keys:
`case`, `steps`, `scenarios`, `decisions`, `role_impacts`, `capabilities`,
`pathways`, `answers`.

Version 1 uses `case`, `steps` and `scenarios`. The rest are present, validated
and preserved on round-trip, but nothing reads them yet — they belong to the
deferred work in §6.

Three rules must survive any change:

- **`person` is optional forever.** A file naming zero individuals passes
  everything. The report ignores the field entirely even when populated, and a
  test proves it.
- **Role impact numbers are never stored.** Always computed from steps and
  assignments. A stored number drifts, and a drifted number is worse than none.
- **Alternative futures are scenarios, not duplicate steps.** Each scenario
  reassigns the same workflow, and the tool never implies one is optimal.

Two fixed vocabularies do the real work.

**Kind of work** — small on purpose. It is what makes the composition comparison
mean anything. Roughly, AI absorbs the first two and grows the middle three.

`data_handling` · `routine_judgment` · `complex_judgment` · `relationship` ·
`coordination` · `supervision` · `physical` · `improvement`

**Allocation** — what happens to a step. More automation is never treated as a
more mature state.

`human` · `human_ai_assisted` · `ai_full_review` · `ai_exception_review` ·
`rule_automated` · `machine` · `outsourced` · `eliminated` · `redesigned` ·
`unresolved`

An allocation may **create** steps — work that did not exist before, usually
supervision of the machine. This is how the tool refuses to let a saving quietly
absorb the work it generates. In both shipped examples it is a third to a half
of the remaining hours.

## 5. Constraints that do not move

Written down so that future-me, and any agent working here, cannot quietly break
them. `tests/boundaries.test.ts` enforces the ones a type system cannot.

- **No server, no accounts, no database, no telemetry.** The local process that
  serves the window binds to `127.0.0.1`, reads and writes case files in the
  folder it was launched from, and does nothing else.
- **No AI in `calc/` or `report/`.** Numbers and findings are deterministic or
  they are worthless.
- **No single score, grade, maturity level or badge.** Counts and measured hours
  only. A score invites gaming and implies an opinion the tool does not have.
- **No employee name is ever required, rendered, or ranked.** No headcount
  recommendation of any kind.
- **The core imports nothing touching the filesystem or network.** It has to run
  in a browser, and that is what makes it testable.
- **Six production dependencies, maximum.** Currently zero.
- **The product name lives only in `brand.ts`.** Renaming stays a one-file edit.
- **No consultancy vocabulary in anything the user reads.** Enforced by test:
  *leverage, synergy, journey, roadmap, empower, unlock, holistic, seamless,
  best-in-class, robust framework.*
- **The interface never says JSON, schema, lint or YAML.** Also enforced.

## 6. What was cut, and what would justify building it

None of this is needed for the tool to be useful. Each has a trigger, not a date.

| Deferred | Build it when |
|---|---|
| Decisions and ownership: the ten questions, the authority checks | An analyst has finished a case and asked who owns the decisions inside it |
| Transition pathways | A real opportunity provider is willing to be named in one |
| Deterministic checks | The condition can be tested from the file alone, with a passing and a failing fixture. An unreliable check is worse than an honest question. |
| The open questions | They earn their place in the report rather than lengthening it |
| AI assistance | The deterministic core has proven useful, and every suggestion can be accepted one at a time |
| Local case library, snapshot history | Someone loses work, or cannot find their files |
| Standalone `studio.html`, no install | Someone cannot install Node and needs to run it anyway |
| Switching scenarios inside the window | An analyst maintains two futures and finds two files inadequate |
| French translation | The first francophone user asks |

**The signal that matters more than any of them:** somebody produces a useful
case file without the founder in the room.

## 7. Working on this repo

Give a coding agent one piece of work at a time, with §3 to §5 as ground truth.

**Before adding a field to the model:** a real case must be undescribable
without it, and some calculation must read it or some view render it. A field
that neither reads nor renders gets deleted.

**Before adding a check:** it must be deterministic, explainable in one sentence
to a non-technical reader, detectable from the file alone, and shipped with two
fixtures. The failing fixture must trigger that check and no other.

**Before adding a dependency:** justify it in the pull request, against the cap
of six.

**Do not add:** a hand-drawn node canvas, a plugin system, a rule language, a UI
framework, a config file format, an ORM, or any feature not in §2 or triggered
in §6. If something seems necessary, open an issue describing the user need.

**When the specification and an example conflict,** the example is usually right
— it came from reality. Change the specification.

**Tone for anything a user reads:** plain language, short sentences, nothing
over twenty-five words. Say what the analyst would say to a colleague.

## 8. Testing

```bash
npm test          # 33 tests
npm run typecheck
npm run check     # both
```

- **The engine is verified by hand.** `tests/calc.test.ts` uses round figures —
  10 + 10 + 10 hours becoming 17 — so any reader can check them with a
  calculator and no trust in the code. The most damaging failure available is
  subtly wrong numbers, because it destroys credibility permanently.
- **The report is verified against its promises.** Names never render, an
  already-decided case says so and cannot hide it, unassessed work is excluded
  from headlines, user content is escaped, and the banned vocabulary is absent.
- **The boundaries are verified as boundaries.** Core purity, no AI in the
  calculation path, one home for the product name, and the words the interface
  is not allowed to say.
- No test may require the network, a fixture server, or an API key.

## 9. What is not proven

The acceptance criterion that matters most has not been met, and cannot be met
from inside the repository:

> An analyst who has never seen this completes a case with their own workflow,
> alone, in under an hour.

If that fails, the problem will almost certainly be the wording in
`src/studio/copy.ts` rather than the code. Rewrite the questions before touching
anything else.
