# WorkTransitionKit — Build Specification v2

**8 sprints · 8 weeks · local desktop application**

**Who uses it:** a business analyst tasked with leading the transformation of one workflow or process.

**What it does:** maps the workflow as it is today, models what changes when AI takes part of it, computes the before/after at task level, shows which work shrinks and which grows for every affected role, checks whether the resulting decisions have real owners, and turns the growing work into concrete capability requirements and transition pathways for the people affected.

**Companion documents:** `MEMORANDUM.md` (why, governance, business), `VISION.md` (beyond v1).

---

## 0. What changed from v1, and why

The previous spec built an accountability checker. It checked ownership well and analysed transformation not at all — no before/after, no task shift, no role composition change, no link from workflow analysis to reskilling. That was the wrong centre of gravity.

**The engine of this product is the task-level delta.** Every task carries a volume and a duration. That gives hours. Reallocate the task between human, AI, rule, or machine and you get hours after. Roll those hours up by role and by kind of work, and you get the chart that carries the entire argument:

> This role spends 68% of its time on data handling and routine judgment today. After the change, that becomes 22%. Complex judgment, exception handling, customer contact and supervision of the AI grow from 24% to 63%.

That single output is the transformation analysis, the reskilling brief, and the reason someone pays for this — because the work that grows *is* the capability requirement, and the capability requirement *is* the transition pathway. Ownership checking then sits on top of it, where it belongs.

**Constraints you relaxed, and how I've used them:**

| You said | What I'm doing |
|---|---|
| 6–12 weeks is fine | 8 sprints, 8 weeks. Usable product at end of Sprint 4. |
| SQLite is OK | JSON is the project file and the source of truth. SQLite appears once, in Sprint 6, only for snapshot history and the case library. Deferrable without loss. |
| Stay on JSON | The `.wtk.json` project file is portable, diffable, git-friendly, and the only thing that must exist. |
| Visual matters | Six specified visuals, all plain SVG. No chart library. |
| AI OK but tight control | AI never writes to the model directly. Everything lands in a suggestion tray, is accepted item by item, is marked `origin: ai`, and is visible as such in the report. No AI in any calculation or check, ever. Full function with AI switched off. |

Still absolute: **no hosted service, no accounts, no telemetry, no outbound calls except an AI request the user explicitly triggers with their own key.**

---

## 1. The final user path

Marc is a business analyst at a mid-size insurer. He has been asked to lead the transformation of auto claims intake, where the company is about to deploy a document-extraction and recommendation AI. He has three weeks and no framework.

This is his complete path through the product. Every screen, in order, with what he does and what the tool gives back.

---

### Step 1 — Frame the case *(10 min)*

**Screen: Case**

He names the workflow, its boundary, the technology being introduced, the sponsor's role, and answers one question the tool will not let him skip:

> **Has this already been decided?** Still open / Partly decided / Already decided

He picks "Partly decided" — the vendor is chosen, the scope isn't. The tool records it and will print it on the report's first page.

He sets the analysis period: **per week**. All volumes and hours will use it.

---

### Step 2 — Map the workflow as it is today *(2–4 hours, usually across two sessions)*

**Screen: Current state**

This is the longest step and the tool's real data-entry surface. Marc adds each step of the workflow. For each one:

| Field | Example |
|---|---|
| Step name | "Extract facts from submitted documents" |
| Who does it | Claims Specialist |
| How many per week | 1,400 |
| How long each | 12 minutes |
| Kind of work | Data handling |
| What could go wrong | Missed exclusion clause |
| Capabilities it needs | Document reading, policy knowledge |

The moment he enters volume and duration, the tool shows the derived number beside the step:

> **280 hrs/week · 7.0 FTE**

He adds twelve steps. As he goes, a running total builds at the top of the screen: **the workflow consumes 612 hrs/week across 4 roles.** A live bar shows the split by kind of work.

He marks three steps as **decision points** — places where a choice with consequences gets made, not just work performed. Those get a flag now; they get detailed in Step 5.

He also flags two steps as **invisible work**: things people actually do that appear in no procedure. The tool asks for these explicitly, because they are the ones that break automation plans.

**What he sees at the end of Step 2:**

A lane diagram of the current workflow — steps as cards in columns by role, sized proportionally to hours, coloured by kind of work. And a summary:

> **Current state: 612 hrs/week · 15.3 FTE across 4 roles**
> Data handling 44% · Routine judgment 24% · Complex judgment 13% · Relationship 11% · Coordination 8%

He has never seen his own process quantified this way. Neither has his sponsor. **This alone is often worth the engagement.**

---

### Step 3 — Assess what the technology can actually take *(1 hour)*

**Screen: Exposure**

The tool walks him through each step and asks four questions:

1. Can the technology do this today, in your environment? *(Yes / Partly / No / Unknown)*
2. What share of the volume, realistically? *(a percentage)*
3. What happens when it gets it wrong?
4. How sure are you? → `observed` / `documented` / `reported` / `inferred` / `proposed` / `disputed` / `unknown`

Marc marks document extraction as 85% feasible, `documented` (the vendor ran a pilot). He marks "explain the decision to an upset claimant" as No, `reported`, with a note.

If AI assist is enabled, the tool can pre-fill suggestions here. Every one arrives in the tray marked **AI suggestion**, and he accepts or rejects each individually. Nothing is applied silently.

**The tool does not tell him what to automate.** It records what he claims, how sure he is, and what it costs if wrong.

---

### Step 4 — Design the future state *(2 hours)*

**Screen: Future state**

Side by side with current. For each step Marc chooses an allocation:

- Stays human
- Human does it, AI assists
- AI does it, human reviews every one
- AI does it, human reviews exceptions only
- Automated by fixed rules
- Done by a machine or robot
- Handled outside
- Eliminated — the work stops
- Redesigned into something different

For AI allocations he sets a confidence floor and what happens below it. For human review he sets **how many per day and how long each** — the tool uses this to catch impossible review loads.

He can create **two or three named scenarios** and switch between them. The tool never suggests one is best.

**As he assigns each step, the deltas recompute live:**

> Document extraction: 280 → 42 hrs/week (−238)
> Exception handling: 46 → 118 hrs/week (+72)
> Reviewing AI output: 0 → 96 hrs/week (**new work**)
> Explaining decisions to claimants: 68 → 92 hrs/week (+24)

That last line is the one that changes conversations. The work does not simply vanish; it moves, and some of it is new work that did not exist before.

---

### Step 5 — Decide who owns the decisions *(1 hour)*

**Screen: Decisions**

The three steps flagged as decision points in Step 2 come back, and now the tool asks the questions that matter — in this order, because the order is the instrument:

1. What is the decision, and how often?
2. If this went badly for three months, how bad?
3. Who is accountable for it going well? *(a role — committee is a valid and revealing answer)*
4. How would you know this month if it was going badly?
5. Where does that number come from — can that person see it themselves, today?
6. When it goes badly, what can they change **by themselves, this week**?
7. What can they **not** change that they wish they could?
8. What part is done by software now? Does it recommend, or decide?
9. When the software is unsure, or someone disagrees — what happens?
10. **If this went badly and it hit the news, whose name would be in the article?**

When the answer to 10 differs from 3, or when 6 came back constrained, the tool says so on the spot:

> **Worth noticing.** The person who would be named cannot change the thing that would cause it. That gap has a name: responsibility without authority. It will be in your report.

---

### Step 6 — See what happens to each role *(the payoff)*

**Screen: Role impact**

No data entry. Everything here is computed from Steps 2–4. For each role, two stacked bars side by side:

```
CLAIMS SPECIALIST — 7.4 FTE → 4.1 FTE

Before                          After
Data handling        62%        Data handling         14%
Routine judgment     18%        Routine judgment       9%
Complex judgment     11%        Complex judgment      34%
Relationship          6%        Relationship          21%
Supervision           0%        Supervision (AI)      19%
Coordination          3%        Improvement            3%
```

Below it, in plain words:

> **What shrinks:** extracting facts from documents (−238 hrs), matching against policy tables (−61 hrs).
> **What grows:** resolving exceptions (+72 hrs), explaining decisions to claimants (+24 hrs).
> **What is new:** reviewing AI recommendations (+96 hrs) — work nobody does today.
> **Authority:** increases. This role will decide things it currently escalates.
> **Headcount signal:** 7.4 FTE of work becomes 4.1 FTE. **This tool does not tell you what to do about that.** It tells you the size of the question.

Then the tool asks two things it will not let him leave blank:

> **Have people doing this job seen this and confirmed it?** *(Yes / No)* — An honest no is worth more than an optimistic yes, and it is the most common reason these analyses get rejected later.
>
> **Has anyone disagreed?** Record it rather than resolving it silently.

---

### Step 7 — Turn growing work into capabilities *(30 min)*

**Screen: Capability shift**

Computed from the capabilities Marc tagged on each step, weighted by the hours those steps gain or lose.

```
DEMAND RISING                        DEMAND FALLING
Exception reasoning      +72 hrs     Document reading      −238 hrs
AI output evaluation     +96 hrs     Table lookup           −61 hrs
Claimant communication   +24 hrs
Fraud pattern awareness  +18 hrs
```

For each rising capability, one question:

> **Do people in this role already demonstrate this?** Already strong / Some do / Few do / Nobody does

"AI output evaluation" — nobody does. That is the real training requirement, and it emerged from the workflow rather than from a catalogue. It is also, notably, the smallest of the four to teach.

> **What this shows:** most of the growing work uses capabilities these people already have. Only *AI output evaluation* is genuinely new. The transition is smaller than the headline suggests — and it is specific enough to actually plan.

---

### Step 8 — Say where people actually go *(45 min)*

**Screen: Pathways**

The step most transformation plans skip. For each affected role:

- Redesigned version of the current role
- Move to a different internal role
- New role that this change creates
- Elsewhere, with support
- Protected arrangement while nothing credible exists

For each pathway: what experience carries over, what is genuinely missing, what a receiving manager would accept as proof, and:

> **Who is offering this opportunity?** A named team, employer, or funded program.
>
> **Status:** Confirmed / Conditional / Speculative
>
> **Who pays for the time? What happens to income during it?**
>
> **If this doesn't work, what then?**

Leave the provider empty and the tool marks it plainly:

> Marked **speculative**. Training being available is not the same as a job being available. Saying so now beats discovering it in month nine.

---

### Step 9 — Answer what the tool can't check *(20 min)*

**Screen: Open questions**

Ten judgment questions with no detection claimed (§6.2). Marc answers seven, skips three. The report will show which three.

---

### Step 10 — Findings and report *(20 min)*

**Screen: Findings**

Everything the tool can check, each with what it checked and what it could not:

```
ERRORS
  Claim settlement decision has no single owner (a committee owns it)
  Reviewer load: 190 reviews/day × 4 min = 12.7 hrs/day — not possible
  Pathway "Specialist → Fraud Analyst" names no opportunity provider

WARNINGS
  Quality Council reviews monthly but cannot change the AI thresholds
  Claims Specialist role impact not yet reviewed by anyone in that role
  Two steps marked "unknown" feasibility carry 84 hrs/week

COUNTS
  12 steps · 3 decisions · 4 roles · 2 pathways
  612 → 421 hrs/week (−31%)
  1 decision with no single owner
  2 pathways with no confirmed provider
  3 of 10 open questions unanswered
```

He clicks **Print report** and gets a document with the workflow diagram, the before/after by role, the capability shift, the decisions and their ownership gaps, the pathway reality check, everything unanswered, and what the analysis could not determine.

**Total: roughly 8–10 hours of work spread over two weeks.** He walks into the steering committee with numbers nobody in the room has.

---

## 2. The data model

`src/core/types.ts`. This is the contract.

```ts
export type Evidence =
  | "observed" | "documented" | "reported"
  | "inferred" | "proposed" | "disputed" | "unknown";

export type WorkType =
  | "data_handling"      // collecting, entering, extracting, moving information
  | "routine_judgment"   // applying clear rules to cases
  | "complex_judgment"   // weighing ambiguous evidence, handling exceptions
  | "relationship"       // communicating with, supporting, persuading people
  | "coordination"       // scheduling, chasing, handoffs
  | "supervision"        // checking machine or human output
  | "physical"           // moving, handling, inspecting things
  | "improvement";       // changing the process itself

export type Allocation =
  | "human"              // stays human
  | "human_ai_assisted"  // human does it, AI helps
  | "ai_full_review"     // AI does it, human reviews every one
  | "ai_exception_review"// AI does it, human reviews exceptions
  | "rule_automated"     // deterministic automation
  | "machine"            // robot or physical machine
  | "outsourced"
  | "eliminated"
  | "redesigned"
  | "unresolved";

export type Origin = "human" | "ai_suggested" | "ai_accepted";

export interface Project {
  spec_version: "1.0";
  case: Case;
  steps: Step[];
  scenarios: Scenario[];
  decisions: Decision[];
  role_impacts: RoleImpactNote[];   // human-entered notes only; numbers are computed
  capabilities: CapabilityNote[];   // human-entered readiness only
  pathways: Pathway[];
  answers: PromptAnswer[];
}

export interface Case {
  id: string;
  title: string;
  organization: string;
  scope: string;                    // one workflow, e.g. "Auto claims intake"
  boundary_start: string;           // what triggers the workflow
  boundary_end: string;             // what completes it
  technology: string;
  purpose: string;
  sponsor_role: string;
  decision_status: "open" | "partially_decided" | "already_decided";
  period: "week" | "month";         // all volumes use this
  participants: Participant[];
  updated: string;
  maintainer_role: string;
}

export interface Participant {
  role: string;
  group: "sponsor" | "operations" | "affected_worker" | "hr"
       | "risk_legal" | "union" | "technology" | "external";
  reviewed: boolean;
}

export interface Step {
  id: string;
  name: string;
  sequence: number;
  role: string;                     // who does it today
  volume_per_period: number;
  minutes_per_unit: number;
  work_type: WorkType;
  capabilities: string[];           // free-text tags, normalized lowercase
  failure_mode?: string;
  is_decision_point: boolean;
  is_invisible_work: boolean;       // done in practice, in no procedure
  exposure: Exposure;
  evidence: Evidence;
  origin: Origin;
  notes?: string;
}

export interface Exposure {
  feasible: "yes" | "partly" | "no" | "unknown";
  share_addressable: number;        // 0..1 — realistic share of volume
  cost_of_error?: string;
  evidence: Evidence;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  assignments: Assignment[];
}

export interface Assignment {
  step_id: string;
  allocation: Allocation;
  human_share: number;              // 0..1 — share of volume still touched by a human
  new_minutes_per_unit?: number;    // if the human part gets faster or slower
  agent_id?: string;
  confidence_floor?: number;        // required when allocation involves AI
  on_low_confidence?: "escalate_human" | "reject" | "defer" | "proceed_flagged";
  review_capacity?: { items_per_day: number; minutes_per_item: number };
  new_role?: string;                // if the work moves to a different role
  creates_steps?: NewStep[];        // work that did not exist before
  evidence: Evidence;
  origin: Origin;
}

export interface NewStep {
  name: string;
  role: string;
  volume_per_period: number;
  minutes_per_unit: number;
  work_type: WorkType;              // usually "supervision"
  capabilities: string[];
}

export interface Decision {
  id: string;
  step_id?: string;                 // links back to the workflow
  name: string;
  description: string;
  frequency: string;
  materiality: "low" | "medium" | "high" | "critical";
  evidence: Evidence;
  owner: { role: string; is_individual: boolean; person?: string };
  outcome: {
    statement: string;
    metrics: { name: string; definition: string; target?: string; source?: string }[];
    review_cadence: "daily" | "weekly" | "monthly" | "quarterly" | "annually";
  };
  authority: {
    information: "full" | "partial" | "none";
    act: "full" | "partial" | "none";
    resources: "full" | "partial" | "none";
    change_system: "full" | "partial" | "none";
    notes?: string;
  };
  escalation: { trigger: string; to: string; sla: string }[];
  trace?: { where: string; records: string[]; retention: string; contestable_by_subject?: boolean };
  loop?: { review: string; inputs: string[]; can_change: string[];
           last_change?: string; last_change_effect?: string };
}

export interface RoleImpactNote {
  role: string;
  headcount_current?: number;
  authority_change: "increases" | "unchanged" | "decreases" | "unknown";
  worker_reviewed: boolean;
  disputed_by: string[];
  notes?: string;
}

export interface CapabilityNote {
  capability: string;
  role: string;
  readiness: "already_strong" | "some_do" | "few_do" | "nobody_does" | "unknown";
  how_to_build?: string;
}

export interface Pathway {
  from_role: string;
  to_role: string;
  kind: "redesigned_current" | "internal_move" | "new_role"
      | "external_with_support" | "protected_arrangement";
  opportunity_provider?: string;
  opportunity_status: "confirmed" | "conditional" | "speculative";
  transferable_capabilities: string[];
  gaps: string[];
  required_evidence: string[];
  support?: { who_pays: string; time_estimate: string; income_impact: string };
  fallback?: string;
  evidence: Evidence;
}

export interface PromptAnswer {
  prompt_id: string;
  answer: string;
  answered_by_role?: string;
}
```

**Rules that must survive schema changes:**
- `person` is optional forever. A project naming zero individuals passes everything.
- Role impact numbers are **never stored** — always computed. Storing them lets them drift from the steps.
- Multiple futures are `scenarios`, each a set of assignments over the same steps. Never duplicate steps per scenario.
- A field no calculation reads and no view renders gets deleted.

---

## 3. The calculation engine

`src/core/calc/`. Pure functions, fully tested, no I/O. This is the heart — get it exactly right.

### 3.1 Current-state hours

```
hours(step) = (volume_per_period × minutes_per_unit) / 60
fte(step)   = hours(step) / (period === "week" ? 37.5 : 162.5)
```

### 3.2 Future-state hours

For each step with an assignment:

```
effective_minutes = new_minutes_per_unit ?? minutes_per_unit

future_human_hours(step) =
  switch (allocation) {
    "eliminated":            0
    "outsourced":            0
    "rule_automated":        0
    "machine":               0
    "human":                 hours(step)
    "human_ai_assisted":     volume × effective_minutes × human_share / 60
    "ai_full_review":        volume × effective_minutes × human_share / 60
    "ai_exception_review":   volume × effective_minutes × human_share / 60
    "redesigned":            volume × effective_minutes × human_share / 60
    "unresolved":            hours(step)        // unknown counts as unchanged
  }
```

`human_share` is the share of volume a human still touches. For `ai_exception_review` it is typically 0.05–0.20; for `ai_full_review` it is 1.00 but with a much smaller `new_minutes_per_unit`. **The tool must not guess these — the analyst enters them.**

New work created by an assignment is added as its own line, attributed to `NewStep.role`, with `origin` tracked so the report can show it as work that did not exist before.

### 3.3 Role composition

```
role_hours_before(role, work_type) = Σ hours(step) where step.role === role and step.work_type === work_type
role_hours_after(role, work_type)  = Σ future_human_hours(step) where target_role(step) === role
                                     + Σ new step hours where role matches
```

`target_role(step)` is `assignment.new_role ?? step.role`.

Composition percentages are of that role's own total, not of the workflow. **A role can shrink in absolute hours while a work type grows in percentage — the report must show both**, or it misleads.

### 3.4 Capability demand

```
capability_hours_before(cap) = Σ hours(step) for steps tagged cap
capability_hours_after(cap)  = Σ future_human_hours(step) for steps tagged cap
                               + Σ new step hours tagged cap
delta(cap) = after − before
```

Rank by delta. Rising capabilities with readiness `few_do` or `nobody_does` are the training requirement, and they are printed in that order.

### 3.5 Rounding and honesty rules

- Hours to one decimal; FTE to one decimal; percentages to whole numbers.
- **Never display more precision than the inputs support.** If `minutes_per_unit` was entered as a round number, the output is an estimate and the UI says so once per screen: *"These are estimates built from the volumes and durations you entered."*
- Any step with `evidence: "unknown"` or `exposure.feasible: "unknown"` is excluded from headline totals and reported separately as **hours of unassessed work**. Burying unknowns inside a confident total is the most damaging thing this tool could do.

---

## 4. The visuals

Six views. All plain SVG generated from computed data. **No chart library.** Each must render identically in the app and in the printed report, and each must degrade to a readable table when printed in black and white.

**V1 — Workflow lanes.** Steps as cards in columns by role, in sequence, card height proportional to hours, fill colour by work type. Current and future side by side; changed cards outlined. Decision points carry a marker.

**V2 — Role composition.** Two stacked horizontal bars per role, before and after, segmented by work type, with the FTE figure beside each. **The single most important visual in the product.**

**V3 — Task shift.** A horizontal diverging bar chart: steps sorted by hour delta, shrinking work left in one colour, growing right in another, new work in a third with a distinct label.

**V4 — Allocation matrix.** Steps as rows, the nine allocations as columns, one mark per step. Shows the shape of the future state at a glance and makes over-automation visible.

**V5 — Capability shift.** Two ranked lists, rising and falling, bar length by hour delta. Rising items carry a readiness badge.

**V6 — Decision ownership.** A table: decision, owner role, materiality, and four cells for the authority conditions — filled, half, or empty. Missing `change_system` cells are what the eye should land on.

**Colour rule:** work types get a fixed palette used identically everywhere. Never use red/green for good/bad — this tool does not grade. Use neutral hues and rely on labels and ordering.

---

## 5. Storage and architecture

### 5.1 The project file

`case-name.wtk.json` — one file, the entire project, formatted with stable key order and 2-space indent so `git diff` is meaningful. This is the source of truth and the only thing that must exist.

### 5.2 Local application

- **Electron-free.** A small Node process serves the UI to `localhost` and reads/writes files. `wtk studio` opens the browser.
- Also ships as `studio.html`, a single self-contained file that works when double-clicked, using the File System Access API where available and download/upload elsewhere.
- **TypeScript. No UI framework.** Plain DOM, plain CSS. Seven screens do not justify a five-year framework commitment.
- Production dependencies: **maximum six.** Expected: a JSON Schema validator, a Markdown renderer, and from Sprint 6 optionally `better-sqlite3`.

### 5.3 SQLite — Sprint 6, optional

One local file, `~/.wtk/library.db`, used for exactly two things:

1. **Case library** — list of known projects with last-opened time, so the analyst does not hunt for paths.
2. **Snapshot history** — a JSON blob per save, giving undo and "what did this look like last Tuesday." Genuinely useful over an 8-week engagement.

The database is a cache. **Deleting it must lose nothing but convenience.** Everything reconstructs from the `.wtk.json` files. `better-sqlite3` is a native module and can be awkward on Windows — if it costs more than half a day, ship Sprint 6 with JSON snapshot files in a folder instead and move on.

---

## 6. Checks and prompts

### 6.1 Checks — deterministic, sixteen of them

Stable IDs, never renumbered. Each declares a `limitation` string that the report prints.

| ID | Sev | Title | Logic |
|---|---|---|---|
| C01 | error | No owner | `decision.owner.role` empty |
| C02 | warning | A committee owns this | `is_individual === false` |
| C03 | error | Nothing is measured | `outcome.metrics.length === 0` |
| C04 | error | Metric can't be obtained | any metric with no `source` |
| C05 | error | Responsible but powerless | materiality ≥ high and any `authority` value is `none` |
| C06 | error | Machine decides, no way out | AI allocation present and `escalation.length === 0` |
| C07 | error | No confidence limit | AI allocation missing `confidence_floor` or `on_low_confidence` |
| C08 | error | Nobody can review this much | `items_per_day × minutes_per_item > 420` |
| C09 | error | The review can't change anything | `loop` missing or `can_change` empty |
| C10 | warning | The review changes nothing | `last_change` older than 4× cadence |
| C11 | error | No record kept | materiality ≥ high, AI involved, `trace` missing |
| C12 | error | Pathway nobody is offering | no `opportunity_provider` and status ≠ `speculative` |
| C13 | warning | Pathway with no fallback | `fallback` empty |
| C14 | warning | The people affected never saw this | any `worker_reviewed === false` |
| C15 | warning | Only one future considered | `decision_status === "open"` and `scenarios.length < 2` |
| C16 | warning | Unassessed work | total hours where `exposure.feasible === "unknown"` exceeds 10% of workflow hours |

Two more that only exist because of the calculation engine, and which are among the most valuable:

| C17 | warning | Work vanished without explanation | a step is `eliminated` but its capabilities appear in no future step and no note explains why the work stops being necessary |
| C18 | warning | New work with no owner | a `NewStep` exists whose `role` matches no `RoleImpactNote` — new work assigned to nobody in particular |

### 6.2 Prompts — ten judgment questions, no detection claimed

P01 Could any metric here reward behaviour that damages the outcome?
P02 Is work being removed from a role that still needs doing? Who does it now?
P03 Who captures the savings, and who carries the cost of the transition?
P04 Can the owner actually inspect and challenge what the system recommends, on a busy day?
P05 What would make us stop or reverse this? Who can call it?
P06 How many exceptions do you really expect, and who handles them?
P07 Has anyone materially disagreed? Is that recorded here?
P08 Could data gathered here later be used for discipline or dismissal? What prevents that?
P09 Is there real demand for the destination roles, or only training available?
P10 Six months from now, what result would tell us this was a mistake?

---

## 7. The report

Markdown and self-contained printable HTML. Same content from app or CLI.

1. **Header** — case, scope, boundary, technology, date, scenario. And if `decision_status === "already_decided"`, at the top, unsuppressible: *"This transformation is described as already decided. The findings below document conditions; they do not indicate that alternatives were open."*
2. **The workflow today** — V1 current, totals, split by work type.
3. **What changes** — V3 task shift, V4 allocation matrix, headline before/after hours and FTE, and separately the hours of unassessed work.
4. **What happens to each role** — V2 per role, plus prose: what shrinks, what grows, what is new, authority direction, the FTE question stated as a question.
5. **What people will need to be able to do** — V5, rising capabilities ordered by readiness gap.
6. **Decisions and who owns them** — V6, plus each authority gap in words.
7. **Where people go** — pathways labelled Confirmed / Conditional / Speculative, provider named or the word "none" printed.
8. **Findings** — errors then warnings, each with its remediation question and its limitation.
9. **Open questions** — the ten, answered or **"Not answered"** in bold.
10. **What we don't know** — everything `unknown` or `disputed`, collected, with its hours.
11. **Limitations** — fixed text: this describes what was entered; a clean report is not proof of a sound transformation.

**Language rules:** no sentence over 25 words. Banned words, enforced by a build test: *leverage, synergy, journey, roadmap, empower, unlock, holistic, seamless, best-in-class, robust framework.* Never name an individual — the renderer ignores `person` entirely, and a test proves it.

---

## 8. AI assist — the control rules

AI is **off by default**, enabled per project, using the user's own API key or a local model. It exists to reduce typing, never to decide.

**Where it may help:**
1. Turn interview notes or a transcript into draft steps with roles, volumes, and work types.
2. Suggest a `work_type` and capability tags for a step the analyst wrote.
3. Suggest exposure assessments with reasoning.
4. Draft the narrative prose of the report from computed numbers.
5. Explain a finding in plainer words.

**Hard rules, all enforced in code:**

- **Nothing AI produces enters the project directly.** It lands in a suggestion tray. The analyst accepts or rejects each item individually. Bulk accept is allowed only after previewing every item.
- Anything accepted from AI is stored `origin: "ai_accepted"`, shown with a marker in the UI, and listed in a report appendix: *"N items in this analysis originated as AI suggestions."*
- **No AI in `calc/` or `checks/`. Ever.** Numbers and findings are deterministic or they are worthless.
- The AI never proposes: who should be made redundant, headcount targets, an individual's suitability, or that a pathway is viable.
- Turning AI off leaves every feature functional. There is a test that runs the whole suite with the AI module removed from the build.
- Requests state, before sending, exactly what will be transmitted, with a preview. Nothing leaves the machine without that confirmation.
- Model name and prompt version are recorded with each accepted suggestion.
- No API key is bundled, ever.

---

## 9. Sprints

Eight sprints, one week each. **First genuinely usable product at the end of Sprint 4** — an analyst can produce the before/after by role, which is the thing worth paying for.

Give a coding agent **one sprint at a time**, with §2, §3 and §4 as ground truth, plus: *"Implement Sprint N only. Nothing from later sprints. Nothing from the Prohibited list in §10. Then verify each Definition of Done item and report which pass."* Check them yourself before moving on.

---

### Sprint 1 — Model and engine

Types, JSON Schema, project file read/write with stable key order, the entire calculation engine (§3), CLI: `wtk validate`, `wtk calc` (prints totals and per-role composition as a table), `wtk render --md`.

**Done when:**
- [ ] Every function in `calc/` has unit tests including zero, one-step, and 200-step projects
- [ ] A hand-computed 12-step example matches the engine exactly — verify with a spreadsheet
- [ ] Unknown-evidence steps are excluded from headline totals and reported separately
- [ ] `wtk calc` runs in under 1 second on 200 steps
- [ ] `core/` imports nothing touching fs or network
- [ ] Round-trip: load → save → load produces a byte-identical file

---

### Sprint 2 — Current state capture

Screens: Case, Current state. Step list, step editor, live derived hours, running workflow total, work-type split bar, decision-point and invisible-work flags. Save/open.

**Done when:**
- [ ] An analyst enters 12 steps in under 40 minutes with no help
- [ ] Derived hours appear within 100 ms of typing volume or duration
- [ ] Deleting a step used by a decision warns rather than silently orphaning
- [ ] Never shows the words JSON, schema, or any check ID in normal use
- [ ] Works at 1280 px; usable at 900 px

---

### Sprint 3 — Exposure and future state

Screens: Exposure, Future state. The nine allocations, human share, confidence floor, review capacity, new work creation, scenario create/switch/duplicate. Live delta beside every step.

**Done when:**
- [ ] Changing an allocation updates all deltas in under 100 ms
- [ ] Two scenarios over the same steps produce different results with no step duplication
- [ ] New work created by an assignment appears in future totals attributed to the right role
- [ ] Setting `human_share` to 0 on an `ai_exception_review` step raises a visible warning rather than silently reporting zero human hours

---

### Sprint 4 — The visuals · **first usable milestone**

V1 workflow lanes, V2 role composition, V3 task shift, V4 allocation matrix. The Role impact screen with computed numbers and generated prose. Print-to-PDF of these four views.

**Done when:**
- [ ] A stakeholder who has not seen the tool reads V2 and correctly states what grows and what shrinks
- [ ] All views render identically on screen and in print
- [ ] Black-and-white print is readable — verify on paper, not on screen
- [ ] Absolute hours and percentages both shown, so a shrinking role with a growing percentage cannot mislead
- [ ] **An analyst completes Steps 1–6 of §1 alone and produces a before/after by role**

At this point the product is worth using. Everything after makes it worth publishing.

---

### Sprint 5 — Decisions and ownership

Decisions screen, the ten questions in order, the inline "worth noticing" comparison between Q10 and Q3/Q6, checks C01–C11, V6.

**Done when:**
- [ ] Each check has a passing and a failing fixture; the failing fixture triggers that check and no other
- [ ] The Q10/Q3 mismatch prompt fires correctly and reads as an observation, not an accusation
- [ ] Findings link back to the exact field that caused them

---

### Sprint 6 — Capabilities, pathways, storage

Capability shift screen and V5, Pathways screen with the speculative labelling, checks C12–C18, SQLite case library and snapshot history (or JSON snapshots if the native module fights back).

**Done when:**
- [ ] Capability deltas reconcile exactly with step hour deltas
- [ ] A pathway with no provider is labelled speculative everywhere it appears
- [ ] Deleting `library.db` loses nothing but convenience — prove it
- [ ] Snapshot restore reproduces a prior state exactly

---

### Sprint 7 — Report and open questions

Open questions screen, Findings screen, the full report (§7), Markdown and printable HTML, `wtk render` parity.

**Done when:**
- [ ] Print to PDF from Chrome, Edge and Safari with no clipped content, A4 and Letter
- [ ] The banned-vocabulary test passes on every example
- [ ] A fixture with `person` populated produces output containing zero occurrences of that string
- [ ] A reader who has never seen the tool names the three biggest problems from the report alone
- [ ] Unanswered questions are visibly unanswered, not silently omitted

---

### Sprint 8 — AI assist, examples, publish

AI module with the suggestion tray and every rule in §8. Two full examples (claims intake, permit review). README, one-page interview guide, refusal criteria, licenses, packaging, `wtk init`.

**Done when:**
- [ ] Removing the AI module from the build leaves every test passing
- [ ] No suggestion can enter the project without an individual accept
- [ ] Accepted AI items are marked in UI and counted in the report appendix
- [ ] The pre-send preview shows exactly what would be transmitted
- [ ] `npx worktransitionkit init demo` works on a clean machine
- [ ] `studio.html` downloaded alone and double-clicked produces a working app with zero network requests

---

## 10. Prohibited

An agent that adds any of these has broken the project.

- Hosted service, deployment, anything that stays running
- Accounts, login, authentication
- Any database that is not a discardable local cache
- Telemetry, analytics, crash reporting
- Any network call except an AI request the user explicitly triggers
- AI anywhere in `calc/` or `checks/`
- A single overall score, grade, maturity level, or badge
- Any ranking of individuals; any required employee name
- Headcount reduction targets or recommendations of any kind
- Real-time collaboration, multi-user permissions
- Drag-and-connect node canvas — V1 is generated, not drawn by hand
- HR system, ATS, payroll, or process-mining integrations
- A plugin system or a rule DSL
- A UI framework

If something here seems necessary, write an issue describing the user need. Do not build it.

---

## 11. Where this plan is most likely to fail

**The analyst cannot get the numbers.** Volumes and durations may not exist anywhere. *Mitigation:* accept ranges and estimates, mark them `reported` or `inferred`, and make the report show how much of the total rests on estimates. An honest estimate beats a missing analysis. Test this in Sprint 2 with someone who does not have the data.

**Step 2 is too long and people quit.** Two to four hours of data entry is the real adoption risk. *Mitigation:* make the minimum viable step just name, role, volume, duration, work type — everything else optional. Let them get to a result fast, then deepen. Measure this in Sprint 2, not Sprint 8.

**Scope drift into a process-modelling tool.** BPMN, swimlane editing, integrations. *Mitigation:* V1 is generated from the step list, never hand-drawn. Say no.

**The engine gets subtly wrong numbers and nobody notices.** The most damaging failure available, because it destroys credibility permanently. *Mitigation:* Sprint 1's spreadsheet cross-check is not optional, and the golden-example test must be maintained forever.

**AI creeps into the calculations.** It will be tempting in Sprint 8. *Mitigation:* the build test that removes the AI module and expects everything to pass.
