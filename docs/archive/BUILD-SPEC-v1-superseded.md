# WorkTransitionKit — Build Specification v0.1

**Purpose of this document:** hand it to an AI coding agent, sprint by sprint, and get a product a non-technical person can use from start to finish. Everything an implementer would otherwise invent — data model, check logic, screen flow, and the exact wording shown to users — is specified here.

**Companion documents:** `MEMORANDUM.md` (why the project exists, governance, business), `VISION.md` (the destination beyond v0.1). This document is only *what to build and in what order*.

---

## 0. How to use this with an AI agent

Work one sprint at a time. For each sprint, give the agent:

1. This entire document (it needs §2, §3 and §4 as ground truth).
2. The sentence: *"Implement Sprint N only. Do not implement anything from later sprints. Do not add anything from the Prohibited list in §1.4. When done, verify every acceptance criterion in the sprint's Definition of Done and report which ones pass."*
3. After it finishes, run the acceptance criteria yourself before starting the next sprint.

Do not let one agent run through all four sprints unattended. The failure mode is scope drift — an agent that "helpfully" adds a database in sprint 2 because it seemed useful.

**The name** appears only in `src/core/brand.ts`. Changing the product name is a one-file edit. Do not hardcode it anywhere else.

---

## 1. What we are building

### 1.1 The product in one sentence

A local application that walks an HR lead, operations manager, or transformation lead through describing one proposed AI-driven change to work, tells them where accountability, oversight, and worker pathways are broken, and prints a report they can take into a meeting.

### 1.2 The user's job, start to finish

This is the complete journey. Everything in this spec exists to serve it.

| Step | What the user does | Time |
|---|---|---|
| 1 | Opens the app. Picks "Start a new case" or opens an example. | 1 min |
| 2 | Answers six questions about the case: what work, who sponsors it, what technology, is the decision already made. | 5 min |
| 3 | Adds their decisions one at a time. For each, the app asks ten plain-language questions. No jargon, no YAML. | 20 min each |
| 4 | Lists the roles affected and what is growing or shrinking in each. | 15 min |
| 5 | For each affected role, describes where those people go — and the app asks who is actually offering that opportunity. | 15 min |
| 6 | Answers ten judgment questions the app cannot check automatically. | 15 min |
| 7 | Reads the findings. Fixes what they can. Prints the report. | 10 min |

A first complete case takes about 90 minutes. That is the design target.

### 1.3 Three delivery surfaces, one core

- **Studio** — a guided local web app. This is what HR and managers use. Runs at `localhost`, or as one self-contained HTML file that can be double-clicked with no install at all.
- **CLI** — `wtk validate` / `wtk check` / `wtk render`. For engineers, git hooks, and CI.
- **Core** — pure logic, no I/O. Both surfaces call it. All checks live here and are tested here.

The file the user saves is `TRANSITION.yaml`. It stays on their machine. Studio reads and writes it directly.

### 1.4 Prohibited — do not build any of this

An agent that adds any of these has broken the project. There is no "small version" of these that is acceptable.

- Any server that stays running, any hosted component, any deployment
- User accounts, login, authentication, sessions
- A database of any kind, including SQLite or IndexedDB for persistence
- Telemetry, analytics, crash reporting, or any outbound network call
- Any required AI/LLM call — including inside `check`. The core must be fully deterministic.
- Real-time collaboration, multi-user editing, permissions
- A drag-and-connect graph editor or node canvas
- A single overall "score", "grade", "maturity level", or badge (see §4.4 — counts only)
- Employee names as a required field anywhere
- Any ranking of individuals
- Integrations with HR systems, ATS, payroll, or process mining
- A plugin system, a config file format, or a rule DSL

If the agent believes something here is needed, it writes an issue describing the user need. It does not build it.

### 1.5 Technical constraints

- **TypeScript**, Node 20 LTS. One runtime. No parallel Python implementation.
- **Dependencies: maximum five in production.** Expected: a YAML parser, a JSON Schema validator, a Markdown renderer. Every additional dependency needs a written justification in the PR.
- Studio uses **no UI framework**. Plain TypeScript, plain DOM, plain CSS. The whole UI is under 2,000 lines. A framework is a five-year maintenance commitment for seven screens.
- **The core imports nothing that touches the filesystem or network.** It takes a parsed object, returns findings. This is what makes it testable and what lets the same code run in the browser.
- `wtk check` must run offline, air-gapped, in under 2 seconds on a 50-decision file.
- Output must be readable on a phone and print cleanly to PDF from a browser.
- Every check has exactly two test fixtures: one file that triggers it, one that does not.

---

## 2. The data model

This is the contract. Implement it exactly. `src/core/types.ts`:

```ts
export type Evidence =
  | "observed"     // directly witnessed under identified conditions
  | "documented"   // supported by a named document or system record
  | "reported"     // stated by an identified participant
  | "inferred"     // derived by a person or system from other evidence
  | "proposed"     // part of a possible future design
  | "disputed"     // materially challenged by a participant
  | "unknown";     // evidence is currently insufficient

export type Materiality = "low" | "medium" | "high" | "critical";
export type AuthorityLevel = "full" | "partial" | "none";
export type DecisionStatus = "open" | "partially_decided" | "already_decided";

export interface TransitionFile {
  spec_version: "0.1";
  case: Case;
  decisions: Decision[];
  role_impacts: RoleImpact[];
  pathways: Pathway[];
  answers: PromptAnswer[];
}

export interface Case {
  id: string;                      // kebab-case, stable
  title: string;
  organization: string;
  scope: string;                   // one domain, e.g. "Personal auto claims"
  purpose: string;                 // why this analysis is being done
  sponsor_role: string;            // a role, never a person
  technology: string;              // what is being introduced
  decision_status: DecisionStatus; // has the decision already been made?
  scenario: string;                // "current" | any name, e.g. "assisted-review"
  alternatives_considered: string[]; // other futures examined; may be empty
  participants: Participant[];
  updated: string;                 // YYYY-MM-DD
  maintainer_role: string;
}

export interface Participant {
  role: string;
  group: "sponsor" | "operations" | "affected_worker" | "hr"
       | "risk_legal" | "union" | "technology" | "external";
  reviewed: boolean;               // did they review and confirm this file?
}

export interface Decision {
  id: string;                      // dotted.lowercase, unique
  name: string;                    // verb first
  description: string;
  frequency: string;               // free text, e.g. "~1,400 / week"
  materiality: Materiality;
  evidence: Evidence;
  owner: Owner;
  outcome: Outcome;
  authority: Authority;
  allocation: Allocation[];
  escalation: Escalation[];
  trace?: Trace;
  loop?: Loop;
}

export interface Owner {
  role: string;                    // required, non-empty
  is_individual: boolean;          // false = a committee owns it
  person?: string;                 // OPTIONAL. Never required. Never validated.
}

export interface Outcome {
  statement: string;
  metrics: Metric[];
  review_cadence: "daily" | "weekly" | "monthly" | "quarterly" | "annually";
}

export interface Metric {
  name: string;
  definition: string;
  target?: string;
  source?: string;                 // where the number comes from
}

export interface Authority {
  information: AuthorityLevel;
  act: AuthorityLevel;
  resources: AuthorityLevel;
  change_system: AuthorityLevel;
  notes?: string;
}

export interface Allocation {
  actor: "human" | "agent" | "rule";
  id?: string;                     // required when actor is "agent"
  does: string;
  share?: number;                  // 0..1
  confidence_floor?: number;       // required when actor is "agent"
  on_low_confidence?: "escalate_human" | "reject" | "defer" | "proceed_flagged";
  review_capacity?: ReviewCapacity; // for humans doing review
}

export interface ReviewCapacity {
  items_per_day: number;
  minutes_per_item: number;
}

export interface Escalation {
  trigger: string;
  to: string;
  sla: string;
}

export interface Trace {
  where: string;
  records: string[];
  retention: string;
  contestable_by_subject?: boolean;
}

export interface Loop {
  review: string;                  // named forum
  inputs: string[];
  can_change: string[];            // what this forum can actually change
  last_change?: string;            // YYYY-MM-DD
  last_change_effect?: string;
}

export interface RoleImpact {
  role: string;
  headcount_approx?: number;
  diminishing_tasks: string[];
  emerging_tasks: string[];
  authority_change: "increases" | "unchanged" | "decreases" | "unknown";
  evidence: Evidence;
  worker_reviewed: boolean;        // did people in this role review this?
  disputed_by: string[];           // roles that materially disagree
}

export interface Pathway {
  from_role: string;
  to_role: string;
  opportunity_provider?: string;   // WHO is actually offering this?
  opportunity_status: "confirmed" | "conditional" | "speculative";
  transferable_capabilities: string[];
  gaps: string[];
  required_evidence: string[];     // what a receiving manager will accept
  support?: PathwaySupport;
  fallback?: string;
  evidence: Evidence;
}

export interface PathwaySupport {
  who_pays: string;
  time_estimate: string;
  income_impact: string;
}

export interface PromptAnswer {
  prompt_id: string;               // "P01" .. "P10"
  answer: string;
  answered_by_role?: string;
}
```

**Design rules to preserve when the schema evolves:**

- `person` is optional forever. A file naming zero individuals must pass every check.
- Nothing cross-references between top-level arrays except `pathways.from_role` matching a `role_impacts.role`. Keep the file readable top to bottom.
- Multiple futures are represented as **separate files** with different `scenario` values. Do not build a scenario object.
- A field that no check reads and no report section renders must be deleted.

---

## 3. The checks

Twelve deterministic checks. Stable IDs — never renumber, never reuse. To retire one, mark deprecated and leave the ID reserved.

`src/core/checks/` — one file per check, each exporting:

```ts
export interface Check {
  id: string;              // "C01"
  title: string;           // short, plain
  severity: "error" | "warning";
  question: string;        // the remediation question shown to the user
  limitation: string;      // what this check CANNOT tell you
  run(file: TransitionFile): Finding[];
}

export interface Finding {
  check_id: string;
  severity: "error" | "warning";
  path: string;            // "decisions[2].authority"
  subject: string;         // human label, e.g. "Settle auto claim under $10k"
  message: string;         // one sentence, plain language
}
```

| ID | Sev | Title | Detection logic |
|---|---|---|---|
| C01 | error | No owner | `decision.owner.role` is missing or empty |
| C02 | warning | A committee owns this | `owner.is_individual === false` |
| C03 | error | Nothing is measured | `outcome.metrics.length === 0` |
| C04 | error | Metric can't be obtained | any metric with missing/empty `source` |
| C05 | error | Responsible but powerless | `materiality` is high or critical AND any of the four `authority` values is `"none"` |
| C06 | error | Machine decides, no way out | any `allocation.actor === "agent"` AND `escalation.length === 0` |
| C07 | error | No confidence limit set | an `agent` allocation missing `confidence_floor` or `on_low_confidence` |
| C08 | warning | Nobody can review this much | for any human allocation with `review_capacity`: `items_per_day × minutes_per_item > 420` |
| C09 | error | The review can't change anything | `loop` missing, or `loop.can_change.length === 0` |
| C10 | warning | The review changes nothing | `loop.last_change` older than 4 × `review_cadence` in days (daily=1, weekly=7, monthly=30, quarterly=91, annually=365) |
| C11 | error | No record kept | `materiality` high or critical, an `agent` in allocation, and `trace` missing |
| C12 | error | Pathway with nobody offering it | `pathway.opportunity_provider` empty AND `opportunity_status !== "speculative"` |
| C13 | warning | Pathway with no fallback | `pathway.fallback` missing or empty |
| C14 | warning | The people affected never saw this | any `role_impact.worker_reviewed === false` |
| C15 | warning | Only one future considered | `case.decision_status === "open"` AND `alternatives_considered.length === 0` |
| C16 | warning | Claim with no evidence status | any decision, role_impact, or pathway with missing `evidence` |

That is sixteen. Ship all sixteen — they are each under 20 lines.

**Every check must declare its limitation, and the report must print it.** Example for C08: *"This only checks the numbers you entered. It cannot tell whether the review is genuinely careful."* This is what keeps the tool from being read as a verdict.

### 3.1 The prompts

Ten questions the tool **cannot** detect and does not pretend to. They appear in Studio as a screen, and in the report as a section — answered or visibly unanswered.

`src/core/prompts.ts`:

| ID | Question | Why it matters |
|---|---|---|
| P01 | Could any metric here reward behaviour that damages the actual outcome? | Fast-closing tickets is not resolving problems. |
| P02 | Is there work being removed from a role that still needs doing? Who does it now? | Work does not disappear because it left a job description. |
| P03 | Who captures the savings from this change, and who carries the cost of the transition? | If these are different parties, say so out loud. |
| P04 | Can the owner actually inspect and challenge what the system recommends, in practice, on a busy day? | "Override allowed" in a policy is not the same as override happening. |
| P05 | What would make us stop or reverse this? Who can call it? | A pilot with no stop condition is a rollout. |
| P06 | How many exceptions do you really expect, and who handles them? | Exception volume is where automation plans usually break. |
| P07 | Has anyone materially disagreed with this description? Is that recorded here? | Suppressed disagreement resurfaces later, expensively. |
| P08 | Could data gathered here be used later for discipline or dismissal? What prevents that? | Answer this before someone else answers it for you. |
| P09 | Is there real demand for the destination roles, or only training available for them? | Training supply is not employment demand. |
| P10 | Six months from now, what result would tell us this was a mistake? | If nothing could, this is not a decision. |

---

## 4. The report

Generated by `src/core/report/`. Same content for CLI and Studio. Markdown and a self-contained HTML file that prints cleanly to PDF.

### 4.1 Structure

1. **Header** — case title, organization, scope, date, `scenario`, and — prominently — the `decision_status`. If it is `already_decided`, print at the top: *"This transformation is described as already decided. The findings below document conditions; they do not indicate that alternatives were open."* That single line is the anti-layoff-washing measure and it must not be suppressible.
2. **What is changing** — plain prose generated from `role_impacts`: what shrinks, what grows, in which roles.
3. **The counts** (§4.4).
4. **Findings** — grouped by severity, each with its subject, message, remediation question, and stated limitation.
5. **Ownership summary** — a table: decision, owner role, materiality, and which of the four authority conditions are missing.
6. **Who is affected** — role impacts table, with a visible marker where `worker_reviewed` is false and where `disputed_by` is non-empty.
7. **Pathway reality check** — every pathway labelled **Confirmed** / **Conditional** / **Speculative**, with the opportunity provider named or the word "none" printed.
8. **Open questions** — the ten prompts, with answers, or the words *"Not answered"* in bold.
9. **What we do not know** — every item with evidence `unknown` or `disputed`, collected.
10. **Limitations** — fixed text: this report describes what was entered; a clean report is not proof of a responsible transformation.

### 4.2 Language rules for all generated text

- Short sentences. No sentence over 25 words.
- No consultancy vocabulary. Banned in output: *leverage, synergy, journey, transformation roadmap, empower, unlock, holistic, best-in-class, seamless, robust framework.*
- Never state a conclusion the file does not support. "Six decisions have no named owner" — yes. "Governance is weak" — no.
- Never name an individual, even if `person` was filled in. The renderer must ignore that field entirely.

### 4.3 The counts — not a score

Print exactly this shape:

```
14 decisions described.

  6  have no named owner
  9  are owned by someone missing at least one authority condition
  4  involve a machine with no escalation path
  3  have a review that cannot change anything
  2  pathways name no opportunity provider
  7  of 10 open questions unanswered
```

Every number links to the specific items. **No total, no percentage, no grade, no colour rating of the whole case.** Aggregate scores invite gaming and false precision; counts point at work to do. If a stakeholder asks for one number, the answer is "six decisions have no owner" — that travels perfectly well.

---

## 5. Repository layout

```
worktransitionkit/
├── src/
│   ├── core/                     # pure logic — no fs, no network
│   │   ├── types.ts
│   │   ├── brand.ts              # product name, the ONLY place it appears
│   │   ├── schema.ts             # JSON Schema, generated from types
│   │   ├── parse.ts
│   │   ├── checks/
│   │   │   ├── index.ts
│   │   │   └── c01.ts … c16.ts
│   │   ├── prompts.ts
│   │   ├── counts.ts
│   │   └── report/
│   │       ├── markdown.ts
│   │       └── html.ts
│   ├── cli/
│   │   └── index.ts              # init, validate, check, render
│   └── studio/
│       ├── index.html
│       ├── app.ts
│       ├── screens/              # s1_start … s7_report
│       ├── copy.ts               # ALL user-facing text (see §7)
│       └── style.css
├── examples/
│   ├── claims-assisted-review/TRANSITION.yaml
│   └── permit-review/TRANSITION.yaml
├── tests/
│   ├── fixtures/                 # c01-pass.yaml, c01-fail.yaml, …
│   └── checks.test.ts
├── methodology/
│   ├── interview-guide.md        # the ten questions, one page
│   └── refusal-criteria.md
├── dist/
│   └── studio.html               # built single-file Studio
├── README.md
├── MEMORANDUM.md
├── VISION.md
└── LICENSE
```

---

## 6. Sprints

Four sprints, one week each. **A usable-by-HR product exists at the end of Sprint 2.** Sprints 3 and 4 make it presentable and publishable.

---

### Sprint 1 — The core and the CLI

**Goal:** a technical user can validate a file, get findings, and render a report.

Build:
- `types.ts`, `brand.ts`, `schema.ts`, `parse.ts`
- All sixteen checks, each in its own file, each with its `limitation` string
- `prompts.ts`, `counts.ts`
- `report/markdown.ts`
- CLI: `wtk validate <file>`, `wtk check <file>`, `wtk render <file> [--html]`
- The claims example, hand-written, complete
- Two fixtures per check

**Definition of done — every item must pass:**
- [ ] `wtk check examples/claims-assisted-review/TRANSITION.yaml` prints findings and counts
- [ ] All 32 fixtures pass; each check fires on its fail fixture and stays silent on its pass fixture
- [ ] `wtk check` completes in under 2 seconds on a 50-decision file
- [ ] Running with the network disabled produces identical output
- [ ] `src/core/` contains zero imports of `fs`, `path`, `http`, or any network module
- [ ] Production dependency count ≤ 5
- [ ] Malformed YAML produces a clear error naming the line, never a stack trace
- [ ] A 10 MB input file and a deeply nested file are both rejected safely without crashing

---

### Sprint 2 — Studio: the guided app

**Goal:** an HR lead completes a whole case without seeing YAML or a terminal.

Build the seven screens in §7, with the exact copy given there.

- Runs two ways: `wtk studio` opens the browser at `localhost:7777`, **and** `dist/studio.html` works when opened directly from disk with no install.
- File handling: "Open" and "Save" via the browser file picker. Where the File System Access API is available, "Save" writes back to the same file silently.
- Autosave into the page's memory every 20 seconds with a visible *"Unsaved changes"* indicator. **Nothing is written to browser storage** — losing the tab loses unsaved work, exactly like an unsaved text document. This is the correct trade for having no persistence layer.
- Findings recompute live and appear inline beside the field that caused them.

**Definition of done:**
- [ ] A person who has never seen the project completes a case with two decisions, one role impact, one pathway, and reaches a report — **with no verbal help from you** — in under 45 minutes
- [ ] They never see the words YAML, schema, lint, or any check ID during normal use
- [ ] Open → edit → save → reopen preserves everything exactly
- [ ] `dist/studio.html` is a single file under 500 KB with no external requests. Verify: open it with the network disabled; the browser network panel shows zero requests.
- [ ] Usable at 375 px width
- [ ] Every screen is reachable and leavable by keyboard alone

---

### Sprint 3 — The report people take to a meeting

**Goal:** the output is something an executive reads without a translator.

Build:
- `report/html.ts` — self-contained, print-optimized. A4 and Letter, no cut-off tables, no dark backgrounds that eat toner.
- The prose generator for "What is changing" (§4.1 item 2)
- The prominent `already_decided` banner
- The pathway reality check with its three visible labels
- The unanswered-questions section
- `wtk render --html` and a Print button in Studio
- The second example: permit review

**Definition of done:**
- [ ] Printing to PDF from Chrome, Edge, and Safari produces a clean document with no clipped content
- [ ] Every sentence in the generated prose is traceable to a field in the file
- [ ] The banned-vocabulary list from §4.2 appears nowhere in any output — enforce with a test that greps the rendered report
- [ ] The `person` field is populated in a test fixture and appears nowhere in the rendered output
- [ ] A reader who has not seen the tool can state, from the report alone, the three biggest problems in the case

---

### Sprint 4 — Publish

**Goal:** a stranger can find it, install it, and use it.

Build:
- `README.md` — the sixty-second front door: problem, the example, the commands, what it is not
- `methodology/interview-guide.md` — one page, the ten questions
- `methodology/refusal-criteria.md`
- `wtk init <dir>` — writes a documented starter file plus a short field guide
- Packaging: `npx worktransitionkit` works; `dist/studio.html` is attached to the GitHub release
- Licenses: Apache 2.0 on `src/`, CC BY 4.0 on `methodology/`, CC BY-SA 4.0 on `examples/`
- `CONTRIBUTING.md` — must explain how to contribute **without using git**
- Security: a documented YAML-safe-load policy, input size limits, HTML escaping in the renderer

**Definition of done:**
- [ ] `npx worktransitionkit init demo && npx worktransitionkit check demo/TRANSITION.yaml` works on a clean machine
- [ ] Downloading only `studio.html` from the release and double-clicking it produces a working app
- [ ] README is under 400 words above the fold and contains the claims example
- [ ] Three people outside the project have read the example report and correctly named the main problem, unprompted

---

## 7. Studio screens and exact copy

**Every user-facing string lives in `src/studio/copy.ts`.** No strings inline in screen code. The copy below is the product — an agent left to invent it will produce HR-speak, and the plain language is most of the value.

### S1 — Start

> **What is changing at work, and does anyone actually own it?**
>
> Describe one planned change — a new AI tool, an automation, a redesigned process — and this will show you where accountability, oversight, and people's next steps are unclear.
>
> Everything stays on your computer. Nothing is sent anywhere.
>
> `[Start a new case]` `[Open a file]` `[Look at an example first]`

### S2 — The case

> **First, the basics.** About five minutes.

| Field | Label | Helper text |
|---|---|---|
| scope | What work are we talking about? | One area, not the whole organization. "Personal auto claims", not "the insurance company". |
| organization | Organization | |
| technology | What is being introduced? | The tool, model, or automation. |
| purpose | Why are you doing this analysis? | |
| sponsor_role | Whose budget or decision is this? | A job title. Not a person's name — this file never needs names. |
| decision_status | Has this already been decided? | **Still open** / **Partly decided** / **Already decided.** Answer honestly. A report that says "already decided" is more useful than one that pretends otherwise. |
| alternatives_considered | What other options were looked at? | Leave empty if none were. That is itself worth knowing. |

### S3 — Decisions

> **Now the decisions.** A decision is a choice that gets made over and over, where the result matters. "Review the file" is a task. "Approve or deny the claim" is a decision.
>
> Most cases have between three and ten worth describing. Start with the one that would hurt most if it went wrong.

Ten questions per decision, asked in this order. **The order is deliberate — Q10 before Q4 loses the effect.**

| # | Question | Fills |
|---|---|---|
| 1 | What is the decision, and how often is it made? | `name`, `description`, `frequency` |
| 2 | If this went badly for three months, how bad would it be? | `materiality` — *Minor / Noticeable / Serious / Severe* |
| 3 | Who is accountable for this going well? | `owner.role`, `owner.is_individual` — with helper: *If your answer is a committee, say so. That is a real finding, not a failure.* |
| 4 | How would you know, this month, if it was going badly? | `outcome.statement`, `outcome.metrics` |
| 5 | Where does that number come from? Can that person see it themselves, today, without asking anyone? | `metrics[].source`, `authority.information` |
| 6 | When it goes badly, what can that person change **by themselves, this week**? | `authority.act`, `authority.resources` |
| 7 | What can they **not** change that they wish they could? | `authority.change_system`, `authority.notes` |
| 8 | What part of this is already done by software? Does it recommend, or does it decide? | `allocation` — with follow-ups on `confidence_floor`, `on_low_confidence`, and for human reviewers: *"How many of these does one person review per day, and how long does each take?"* → `review_capacity` |
| 9 | When the software is unsure, or someone disagrees — what happens? | `escalation` |
| 10 | **If this went badly and it ended up in the news, whose name would be in the article?** | compared against Q3 and Q6 |

After Q10, if the answer differs from Q3, or if Q6 was heavily constrained, show this inline:

> **Worth noticing.** The person who would be named is not the person who can change things. That gap has a name: responsibility without authority. It will appear in your report.

Then two follow-ups: *"Is there a record of how each case was decided, that someone could look at six months later?"* → `trace`. *"Who reviews how this is going, how often, and what are they allowed to change?"* → `loop`.

### S4 — Roles affected

> **Who does this change, and how?**
>
> Describe roles, not people. This tool never asks for names and never ranks anyone.

Per role: what shrinks, what grows, does their authority go up, down, or stay the same, how many people roughly, and:

> **Have people doing this job seen this description and confirmed it?**
>
> If not, tick no. An honest no is worth more than an optimistic yes — and it is the single most common reason these exercises are later rejected by the people they describe.

> **Has anyone disagreed with this?** Record it here rather than resolving it silently.

### S5 — Where do these people go?

> **This is the part most transformation plans skip.**
>
> For each affected role: what is the realistic next step, and — the question that matters — **who is actually offering it?**

Per pathway: from, to, what experience carries over, what's genuinely missing, what a receiving manager would accept as proof, and:

> **Who is offering this opportunity?** A named team, employer, or funded program. If nobody yet, leave it empty — the report will mark this pathway *speculative*, which is honest and useful.
>
> **Status:** Confirmed / Conditional / Speculative
>
> **Who pays for the time and training? What happens to income during it?**
>
> **If this pathway doesn't work, what then?**

Inline, when no provider is named:

> Marked speculative. Training availability is not the same as a job being available. Saying so now is better than discovering it later.

### S6 — Ten questions nobody can check for you

> **These are judgment calls. This tool cannot check them and will not pretend to.**
>
> You can skip any of them — the report will show which ones went unanswered, which is itself information.

The ten prompts from §3.1, each with a text box.

### S7 — Findings

> **Here is what stands out.**
>
> These are things to look at, not verdicts. Each one tells you what it checked and what it could not.

- Errors, then warnings, each with subject, message, the remediation question, the limitation, and a link back to the field
- The counts block from §4.3
- `[Print report]` `[Save file]`

If the file is clean:

> Nothing flagged. That means the things this tool can check are in place. It does not mean the transformation is sound — most of what matters is in the ten questions, and in whether the people affected agree with what you wrote.

---

## 8. Testing

- **Per check:** two fixtures. The fail fixture must trigger that check and no other. This constraint keeps checks independent.
- **Golden report test:** the claims example renders to a committed snapshot. Any diff must be reviewed deliberately.
- **Vocabulary test:** render every example, grep for the banned words in §4.2, fail the build on any hit.
- **Privacy test:** a fixture with `person` populated must produce output containing zero occurrences of that string.
- **Determinism test:** run `check` twice on the same file, byte-identical output.
- **Offline test:** run the full suite with networking disabled. Everything passes.
- **Hostile input:** 10 MB file, 10,000-element array, YAML anchor bomb, `!!js/function` tag, 200-level nesting. All must fail safely with a readable message.

No test may require the network, a fixture server, or an API key.

---

## 9. Sequencing note

Sprint 1 produces something only an engineer can use. That is fine and correct — the checks have to be right before the interface wraps them, and it is far cheaper to change a check than to change a screen that depends on it.

**Do not start Sprint 2 until every Sprint 1 acceptance criterion passes.** The most likely failure of this whole plan is building the interface first because it feels like progress, then discovering in week 3 that a check needs a field the screens do not collect.

And the real test of the product is not in any of these criteria. It is in Sprint 2: **someone who has never seen this completes a case alone in 45 minutes.** If that fails, the problem is the questions in §7, not the code — rewrite the questions before touching anything else.
