# Nelarvo

## Founding and Execution Memorandum

**Document version:** 1.0  
**Project status:** In build — calculation engine and command line working  
**Product name:** Nelarvo  
**Initial launch geography:** Toronto, Canada  
**Intended reach:** International  
**Repository:** `C:\dev\nelarvo` (private during Sprints 1-8)  
**Document purpose:** Give a founder, contributor, partner, employer, government body, workforce organization, funder, or implementation team enough context to understand the project, challenge it intelligently, and begin executing it.

---

## 1. Executive summary

Nelarvo is an open-source specification and local application for mapping how artificial intelligence, software automation, and eventually robotics change work — and where the people affected go.

A business analyst describes one workflow as it runs today: each step, who does it, how many per period, how long each takes. They model what the technology takes over. Nelarvo computes what that does to every role, and turns the work that *grows* into the capabilities people will actually need.

**The engine is one multiplication.** Every step carries a volume and a duration, which gives hours. Reallocate the step between human, AI, rule, or machine and you get hours after. Roll those up by role and by kind of work, and you get the output that carries the entire argument:

```text
CLAIMS SPECIALIST — 12.2 FTE -> 7.2 FTE  (-185.2 hrs/week)
  Data handling       31% ->   4%   down
  Routine judgment    36% ->  19%   down
  Complex judgment    18% ->  23%   up
  Relationship        15% ->  26%   up
  Supervision          0% ->  28%   up
```

That single output is the transformation analysis and the reskilling brief at once, because the work that grows *is* the capability requirement, and the capability requirement *is* the transition pathway. Decision ownership then sits on top of the analysis, where it belongs.

The first release helps a team answer:

1. What work is actually performed today, and at what cost in hours?
2. Which parts can the technology realistically take, and how sure are we?
3. What will humans, AI systems, software, or machines each do?
4. What does that do to each role — what shrinks, what grows, what is entirely new?
5. What will people need to be able to do that they cannot do today?
6. Who owns the consequential decisions, and do they have real authority?
7. Do proposed pathways name real opportunity providers, or admit they are speculative?
8. Which claims are observed, documented, reported, inferred, proposed, disputed, or unknown?

Version 1 is a local application. It has no server, accounts, hosted service, stored employee profiles, uptime obligation, or multi-user permissions. One plain JSON file per case lives in the analyst's own folder under their own version control. No AI participates in any calculation or check — ever.

Three findings fall out of the arithmetic that most transformation plans miss:

- **Work does not vanish, it moves.** In the reference case, half the hours "saved" reappear as work nobody does today: reviewing what the machine produced, and absorbing the exceptions it escalates.
- **The role does not disappear, it changes shape.** That is the reskilling conversation, and it becomes a number instead of an opinion.
- **The training requirement is smaller and more specific than the headline.** Most growing work uses capabilities people already have. Usually only one or two are genuinely new — which makes the transition plannable.

The project begins from two linked market failures:

> Responsibility without authority is blame.
>
> Reskilling without opportunity is transferred risk.

The party carrying workforce-transition risk is often not the party choosing automation. An employer buys technology, a vendor earns revenue, and a training provider may be paid for enrolment while the worker still receives no viable opportunity. Nelarvo makes that allocation visible and contestable before a transformation is treated as complete.

The adoption unit is a useful case file, not an installed platform. The distribution artifact is never a score claiming a transformation is “responsible.” It is measured hours plus a factual completeness summary:

```text
12 steps · 4 roles · 709.9 hrs/week -> 442.4 hrs/week  (-38%)
  of which 136.3 hrs/week is work nobody does today
  84 hrs/week not yet assessed — excluded from any claim above

1 decision with no single owner
2 pathways name no real opportunity provider
3 of 10 open questions unanswered
```

This arithmetic travels without pretending to measure quality. Hours are derived from what the analyst entered; counts describe what is present in the file. Neither is a judgment about whether the transformation is wise.

The long-term vision remains a richer work-redesign and transition system. That destination may eventually include collaborative editing, organizational integrations, or worker-held transition artifacts. It is not the current engineering commitment. Each layer must earn its existence through independent use of the simpler layer.

The open-source project creates a shared notation, executable checks, durable questions, reference cases, and a practitioner community. A commercial practice can grow around diagnostics, facilitated redesign, transition programs, governance, assurance, integration, and outcome measurement.

### 1.1 The scope ladder

- **Layer 1 — The engine:** the data model and the calculation of hours, role composition, and capability demand. Pure functions, fully tested, no I/O.
- **Layer 2 — Authoring:** the guided screens through which an analyst describes a workflow and models a future state without seeing the file format.
- **Layer 3 — Judgment:** ownership checks, the questions software cannot answer, pathways, and the report.
- **Layer 4 — Ecosystem:** third-party case files, sector rule packs, translations, research, and independent practitioners.
- **Layer 5 — Optional services:** collaboration, integrations, or worker-held transition artifacts, only after independent adoption and funded maintenance.

### 1.2 Promotion gates

Do not build the next layer until the current layer produces evidence:

- Add a field to the model only when a real case cannot be described without it, and only when some calculation reads it or some view renders it. Any field that neither reads nor renders gets deleted.
- Add a deterministic check only when it can be tested from the file alone with clear passing and failing fixtures.
- Promote an open question into a check only when reliable deterministic detection exists. An unreliable check is worse than an honest question.
- Add AI assistance only after the deterministic core is proven useful, and only behind a suggestion tray where every item is accepted individually.
- Add local storage beyond the case file only when it is a discardable cache — deleting it must lose nothing but convenience.
- Add accounts or hosted storage only when collaboration needs cannot reasonably be met with ordinary files and version control.
- Build a worker-held Transition Passport only when a real opportunity provider agrees to recognize its evidence and affected people help define its governance.
- Accept any feature creating ongoing operational duty only when it has evidence, funding, and a named maintenance owner.

These gates protect the founder from becoming a part-time maintainer of a full-time software product.

## 2. The founding thesis

AI is making many forms of execution faster and cheaper. Robotics may later extend this transformation to more physical tasks. As execution changes, human value will increasingly concentrate around:

- defining meaningful outcomes;
- making contextual decisions;
- exercising judgment under uncertainty;
- managing exceptions and escalation;
- coordinating people and systems;
- maintaining trust and relationships;
- supervising automated systems;
- identifying when a model or process is wrong;
- accepting responsibility with legitimate authority;
- learning from results and changing the system.

This does not mean every worker should become a manager or abstract “decision owner.” Societies still need craft, care, physical presence, technical execution, service, creation, maintenance, and coordination. The thesis is narrower:

> When technology absorbs a task, the surrounding decisions, responsibilities, and outcomes must be deliberately reassigned. If they are not, organizations may automate activity while creating ambiguity, fragility, and human displacement.

The project therefore treats AI transformation as a work-design problem before treating it as a training problem.

Reskilling is not separated from organizational demand. A transition pathway is credible only when it connects a real person’s existing capabilities to work that an organization or market genuinely needs.

---

## 3. The problem

### 3.1 The worker’s problem

A person experiencing technological disruption needs more than a prediction that their occupation is exposed to AI. They need credible answers:

- Which parts of my work are changing?
- Which parts remain valuable?
- What capabilities have I accumulated that can travel with me?
- Can my present role be redesigned?
- What nearby roles are realistically accessible?
- What must I learn, practice, or demonstrate?
- How long might the transition take?
- Who will finance it?
- What evidence will an employer accept?
- What happens to my income and responsibilities during the transition?
- Can I inspect and challenge the assumptions being made about me?

### 3.2 The organizational problem

Organizations adopting AI often focus on tools or isolated use cases without redesigning the surrounding system. They may automate tasks while leaving unclear:

- who owns the resulting decision;
- who checks model output;
- who can override the system;
- who handles exceptions;
- where accountability lies;
- which roles should change;
- which employees can be redeployed;
- which new capabilities are actually required;
- which measurements indicate genuine improvement;
- what harms or hidden costs the transformation creates.

### 3.3 The institutional problem

Governments, workforce agencies, educators, unions, and communities often work with different vocabularies, data, incentives, and time horizons. They struggle to connect:

- employer demand;
- technological change;
- occupational information;
- individual circumstances;
- educational supply;
- transition financing;
- worker protection;
- measurable employment outcomes.

Nelarvo gives these parties a shared representation of the transition.

### 3.4 The market failure

The person who carries the greatest transition risk is often not the party making the automation decision. The employer may purchase technology, the vendor may collect revenue, the training provider may be paid for enrolment, and the worker may still fail to find viable work.

The project must therefore make the allocation of transition costs and responsibilities visible.

---

## 4. Vision, mission, and promise

### Vision

A world in which technological progress expands human capability and shared prosperity without treating people as disposable remnants of an old operating model.

### Mission

Build open infrastructure that enables people and institutions to understand how work is changing, redesign it responsibly, assign meaningful ownership, and create credible pathways into viable work.

### Public promise

> Nelarvo helps people and institutions redesign work across humans and machines—while ensuring that decisions, outcomes, and affected people have somewhere credible to land.

### Short description

> Open infrastructure for designing work and navigating workforce transitions in the age of AI and robotics.

### Category

Nelarvo sits at the intersection of:

- decision-support systems;
- organizational and operating-model design;
- workforce transformation;
- AI governance;
- career-transition infrastructure;
- skills and capability intelligence;
- responsible automation.

It should not initially claim to be a complete platform in any of these categories.

---

## 5. Values and non-negotiable principles

### 5.1 People are participants, not inventory

Workers affected by a transformation should participate in describing their work, correcting the model, exploring alternatives, and evaluating proposed futures.

### 5.2 Responsibility requires authority

A person cannot meaningfully own an outcome unless they possess appropriate information, authority, resources, time, and escalation rights.

Responsibility without these conditions is not ownership. It is blame exposure.

### 5.3 Preserve accumulated human value

Transition design should begin with what a person already knows and has demonstrated. It should not automatically force experienced people to restart at the bottom of another profession.

### 5.4 No false certainty

Predictions about technology, jobs, and career pathways are hypotheses. The system must expose assumptions, evidence, uncertainty, and alternatives.

### 5.5 Multiple viable futures

The system should generate several plausible options rather than presenting a single supposedly optimal future.

### 5.6 Explainability before persuasion

Every consequential recommendation should include a comprehensible explanation and be open to challenge.

### 5.7 Measure outcomes, not activity

Course enrolment, assessments completed, AI tools deployed, and workflows documented are activities. They are not final outcomes.

### 5.8 Human and operational outcomes belong together

A transformation that lowers cost while creating unacceptable errors, insecurity, work intensification, or arbitrary exclusion is not automatically successful.

### 5.9 Privacy and proportionality

The system should collect the minimum information needed for the declared purpose. Individual data should not silently become performance-surveillance data.

### 5.10 Do not become layoff-washing infrastructure

Nelarvo must not provide a cosmetic “responsible transition” label for predetermined mass dismissal. It should reveal available alternatives, affected groups, unresolved risks, and the actual support offered.

### 5.11 Open standards and portability

People and institutions should be able to export their information in documented, non-proprietary formats.

### 5.12 Local context matters

The system should measure organizational conditions and regional opportunities. It should not infer individual potential from nationality or rely on simplistic cultural rankings.

---

## 6. Core concepts

### 6.1 Work

Work is the coordinated application of human and machine capabilities to produce outcomes under constraints.

### 6.2 Outcome

An observable change or maintained condition that the work exists to produce.

Examples:

- A customer claim is resolved fairly and promptly.
- A patient receives safe follow-up care.
- A building permit is assessed consistently.
- Inventory reaches the required location without unacceptable loss.

An outcome is not merely “complete the task.”

### 6.3 Task

A bounded activity performed by a human, software system, AI model, machine, or combination of actors.

### 6.4 Decision

A commitment to a course of action based on information, judgment, rules, or prediction.

### 6.5 Capability

The demonstrated ability to perform a task, make a decision, maintain a relationship, operate a system, or produce an outcome in a defined context.

### 6.6 Role

A changing bundle of expected outcomes, decisions, tasks, relationships, authority, and capabilities. A role is not identical to a job title.

### 6.7 Actor

A participant in the work graph. An actor may be:

- a person;
- a team;
- an organizational unit;
- deterministic software;
- an AI model or agent;
- a robot or physical machine;
- an external partner.

The model must never imply that all actors possess equivalent moral or legal status.

### 6.8 Control

A rule, review, limit, verification, permission, or monitoring mechanism intended to keep work within acceptable boundaries.

### 6.9 Exception

A case that cannot safely or correctly follow the default path.

### 6.10 Evidence

Information supporting a claim about a capability, decision, pathway, risk, or result.

### 6.11 Transition

A supported movement from a current configuration of work toward a viable future configuration. It may involve role redesign, internal redeployment, learning, a new employer, entrepreneurship, reduced hours, or another negotiated arrangement.

---

## 7. The Nelarvo specification

The canonical artifact is a versioned JSON file named `<case-id>.nelarvo.json`, written with stable key order so ordinary `git diff` stays meaningful over the life of an engagement. It is the source of truth. Any cache or snapshot store is discardable by definition.

**JSON is the save format, not the interface.** A business analyst never sees it. They work through guided screens; the file is what gets committed, diffed, and handed over. Engineers and version control see the file, and can check it in continuous integration.

The model has eight top-level keys:

| Key | Holds |
|---|---|
| `case` | scope, boundary, technology, sponsor role, period, participants, and whether the decision is already made |
| `steps` | the workflow as it runs today — the unit everything is computed from |
| `scenarios` | proposed futures, each a set of assignments over the *same* steps |
| `decisions` | consequential choices inside the workflow, with owner, authority, escalation, trace, loop |
| `role_impacts` | human notes only — headcount, authority direction, worker review, disputes |
| `capabilities` | human notes only — how ready people are for each capability |
| `pathways` | where affected people go, and who is actually offering it |
| `answers` | responses to the questions software cannot decide |

Three model rules that must survive any future change:

- **`person` is optional forever.** A file naming zero individuals must pass every check and render a complete report. The renderer ignores the field entirely even when populated, and a test proves it.
- **Role impact numbers are never stored.** They are always computed from steps and assignments. Storing them lets them drift from reality, and a drifted number is worse than no number.
- **Alternative futures are scenarios, not duplicate steps.** Each scenario reassigns the same workflow. The tool never implies one future is optimal.

### 7.0 The two vocabularies that make the analysis work

**Kind of work.** Fixed, small, and deliberately so — it is what makes the composition comparison mean anything. Roughly, AI absorbs the first two and grows the middle three.

`data_handling` · `routine_judgment` · `complex_judgment` · `relationship` · `coordination` · `supervision` · `physical` · `improvement`

**Allocation.** What happens to a step in a proposed future. More automation is never treated as a more mature state.

`human` · `human_ai_assisted` · `ai_full_review` · `ai_exception_review` · `rule_automated` · `machine` · `outsourced` · `eliminated` · `redesigned` · `unresolved`

An allocation may also *create* steps — work that did not exist before, usually supervision of the machine. This is how the tool refuses to let savings quietly absorb the work they generate.

### 7.1 Evidence vocabulary

Every consequential claim uses one status:

- `observed` — directly witnessed under identified conditions;
- `documented` — supported by a named document or system record;
- `reported` — stated by an identified participant or group;
- `inferred` — derived by a person, rule, or AI from other evidence;
- `proposed` — part of a possible future design;
- `disputed` — materially challenged by a participant;
- `unknown` — evidence is insufficient.

The status applies to automation feasibility, ownership, role impacts, expected benefits, risks, and pathway demand.

### 7.2 The calculation rules

Every number the product shows must be reproducible by hand with a spreadsheet. The rules are deliberately dull, and the tests use round figures so a reader can verify them with a calculator and no trust in the code.

```text
hours(step)        = volume_per_period x minutes_per_unit / 60
fte(hours)         = hours / 37.5 per week, or / 162.5 per month

future human hours, by allocation:
  eliminated, outsourced, rule_automated, machine   -> 0
  human, unresolved                                 -> unchanged
  everything else  -> volume x effective_minutes x human_share / 60

capability demand  = sum of the hours of every step that needs it
role composition   = those hours grouped by role and by kind of work
```

`human_share` — the share of volume a human still touches — is entered by the analyst and never guessed by the tool. The whole analysis rests on it, so inventing it would be inventing the answer.

Two honesty rules are enforced in code rather than left to discipline:

- **Unassessed work is excluded from every headline figure and reported on its own.** A step whose evidence or feasibility is `unknown` is real work someone does today, but we do not know its fate. Burying that inside a confident total is the most damaging thing this tool could do.
- **Absolute hours and percentages always travel together.** A role can shrink in hours while a kind of work grows as a share of what remains. A view showing one without the other misleads, so the model returns both.

The complete data model, worked example, and per-sprint acceptance criteria are in `BUILD-SPEC.md`. A reference case ships in `examples/`.

### 7.3 Deterministic checks

A check fires only when its condition can be determined from the file alone. Every finding points to a specific path, carries a remediation question, and — this is not optional — **declares what it could not check**. Identifiers are stable forever; a retired check keeps its number reserved.

Ownership and authority: missing owner · committee owner · no metric · metric with no obtainable source · responsible without authority on a high-consequence decision · machine involvement with no escalation path · no confidence limit set · no record kept · a review forum with no power to change anything · a review that has changed nothing in four cycles.

Review capacity: **declared review volume multiplied by time per item exceeding a working day.** A human reviewing four hundred recommendations a day is not oversight, and the file now contains enough to prove it.

Transition: a pathway with no opportunity provider that is not marked speculative · a pathway with no fallback · role impacts never reviewed by anyone doing the job · a single future considered while the decision is still open · unassessed work above a tenth of the workflow.

Two checks exist only because of the calculation engine, and are among the most valuable: **work eliminated whose capabilities appear nowhere in the future and whose disappearance is unexplained**, and **new work assigned to no identified role**.

Passing every check means required information is present and internally consistent. It does not certify that a transition is responsible, safe, legal, or likely to succeed.

### 7.4 Questions rendered in every report

These are questions, not detections. Several were once candidate checks and were demoted on purpose: no deterministic rule can detect whether a metric rewards the wrong behaviour. A question that is always asked beats a check that fires unreliably.

- **Metric distortion:** could any metric here reward behaviour that damages the outcome?
- **Invisible work:** is work being removed from a role that still needs doing? Who does it now?
- **Burden allocation:** who captures the savings, and who carries the cost of the transition?
- **Automation opacity:** can the owner actually inspect and challenge the recommendation, on a busy day?
- **Reversibility:** what would make us stop or reverse this? Who can call it?
- **Exception reality:** how many exceptions do you really expect, and who handles them?
- **Dispute:** has anyone materially disagreed? Is that recorded here?
- **Purpose conflict:** could data gathered here later be used for discipline or dismissal? What prevents that?
- **Opportunity reality:** is there real demand for the destination roles, or only training available?
- **Falsification:** six months from now, what result would tell us this was a mistake?

The report shows which were answered and which were not. Skipping a question is permitted; hiding that it was skipped is not.

### 7.5 Counts, never a grade

The report reports measured hours and factual counts. It never produces a responsibility score, maturity level, certification, badge, or comparison between organizations. Aggregate scores invite gaming and manufacture precision that the inputs do not support; counts point at specific work to do.

If a stakeholder asks for one number, the honest answer is a count — *six decisions have no owner* travels perfectly well.

### 7.6 Commands

```text
nelarvo new "Auto claims intake"    start a case
nelarvo validate <file>             check the file is structurally sound
nelarvo calc <file> [scenario]      the before and after
nelarvo check <file>                run the deterministic checks
nelarvo render <file>               local Markdown or printable HTML
```

All commands run offline. There is no network access in any command, and no AI in `calc` or `check` at any point.

## 8. The Outcome Ownership Contract

The Outcome Ownership Contract is a core Nelarvo method and data object.

It specifies:

- the outcome being owned;
- the named person or team responsible;
- the decisions the owner may make;
- the information the owner can access;
- the resources available;
- the constraints that apply;
- the controls that must be respected;
- the timeframe;
- the success and harm metrics;
- the circumstances requiring escalation;
- the person or body receiving escalation;
- the record of decisions;
- the review and learning cycle.

### 8.1 Ownership test

A valid ownership arrangement should answer “yes” to these questions:

1. Is the outcome explicit?
2. Is an owner identifiable?
3. Does the owner possess real decision authority?
4. Can the owner access necessary information?
5. Are adequate resources and time available?
6. Are constraints and controls understandable?
7. Can the owner challenge an automated recommendation?
8. Is there an escalation path?
9. Are success and harm both measured?
10. Can learning change the workflow?

### 8.2 Ownership warnings

The system may flag:

- **Unowned outcome:** no accountable human or legitimate governing body is identified.
- **Shared ambiguity:** several parties appear responsible, but their authority is unclear.
- **Blame risk:** responsibility is assigned without sufficient authority or resources.
- **Automation opacity:** a consequential machine recommendation cannot be adequately explained or challenged.
- **Escalation void:** an exception exists without a reachable escalation path.
- **Metric distortion:** the stated metric may reward behavior contrary to the desired outcome.
- **Control gap:** automation has expanded without equivalent verification.
- **Human bottleneck:** nominal human review exists but workload makes meaningful review impossible.

---

## 9. The Role Transition Map

Every future-state design that affects a role should produce a Role Transition Map.

### 9.1 Current-state profile

- Current role and context
- Outcomes contributed to
- Decisions made
- Tasks performed
- Tools used
- Relationships maintained
- Demonstrated capabilities
- Constraints and preferences
- Evidence supporting the profile

### 9.2 Transformation impact

- Tasks likely to diminish
- Tasks likely to grow
- New forms of assistance
- New decisions or authority
- New controls and responsibilities
- Capabilities whose value is changing
- Estimated uncertainty
- Assumptions requiring validation

### 9.3 Future options

Each person should receive several classes of option:

- redesigned version of the current role;
- adjacent internal role;
- emerging internal role;
- role with another employer or sector;
- independent or entrepreneurial path where realistic;
- a protected transition arrangement if no credible immediate pathway exists.

### 9.4 Pathway requirements

Each proposed pathway must identify:

- why the pathway is plausible;
- which existing capabilities transfer;
- what gaps exist;
- what learning is necessary;
- what learning is unnecessary;
- what work-based practice can build evidence;
- what evidence a receiving employer or manager will accept;
- who is responsible for providing opportunity;
- estimated time, cost, and income implications;
- major risks;
- a fallback or alternative path.

### 9.5 Transition Passport — future artifact, not version 1

A worker-facing, portable version of a validated Role Transition Map may eventually become a **Transition Passport**. It is a separate product and governance problem, not an MVP feature.

No credential service, selective-disclosure system, revocation infrastructure, verification network, or person-level account should be built until a real opportunity provider agrees to recognize the evidence and affected people help define the governance.

Until then, the toolkit may render a simple local role-transition report containing:

- current and transferable capabilities;
- pathway status and evidence;
- required opportunity provider;
- support and fallback commitments;
- disputed or unknown claims.

The report is not a permanent score, verified credential, or prediction of employability.

## 10. Target users and their jobs to be done

**One of these is the user. The rest are audiences.** The product is designed, screen by screen, for the business analyst. Everyone else reads what that analyst produces. Conflating the two is how tools like this become unusable by everyone.

### 10.0 Business analyst leading a workflow transformation — the user

> I have been asked to lead the transformation of one process, I have three weeks, and I have no framework. Show me what the technology actually changes, what it does to every role, and what I owe the people affected.

They open the application, enter the workflow, model the future state, and produce the report. A first complete case takes roughly eight to ten hours spread over two weeks. Everything below describes people who read that output, not people who operate the tool.

### 10.1 Worker or jobholder

> Help me understand what is changing, preserve the value of my experience, and construct a credible route toward viable work.

### 10.2 Operational leader

> Help me introduce technology without creating unclear decisions, broken controls, hidden labor, or operational fragility.

### 10.3 Transformation leader

> Give multiple stakeholders a shared model of the present state, proposed future, assumptions, risks, and measures.

### 10.4 HR and workforce leader

> Identify role impacts early enough to redesign, redeploy, and support people before displacement becomes irreversible.

### 10.5 Government or workforce agency

> Help us connect technological change, employer demand, individual pathways, and public investment to measurable outcomes.

### 10.6 Union or worker representative

> Make the proposed redistribution of work, authority, risk, and reward visible and contestable.

### 10.7 Educator or training provider

> Show which capabilities and evidence are actually required by a specific transition rather than selling broad, disconnected curricula.

### 10.8 AI vendor or implementation partner

> Understand the human workflow, controls, exception handling, and role changes required for a responsible deployment.

### 10.9 Researcher or policy analyst

> Use a documented representation for studying how technological change affects work and transitions.

---

## 11. The analyst's path, start to finish

Ten steps. Roughly eight to ten hours of analyst time, spread across two weeks.

**1. Frame the case** *(10 min)* — the workflow and its boundary, the technology, the sponsor's role, the analysis period. And one question the tool will not let them skip: *has this already been decided?* If the honest answer is yes, the report says so on its first page and the banner cannot be suppressed.

**2. Map the workflow as it runs today** *(2–4 hours)* — the longest step and the real data-entry surface. Each step gets who does it, how many per period, how long each takes, what kind of work it is, and what capabilities it needs. Derived hours appear beside each step as they type. Steps that are decision points get flagged; so does invisible work — the things people actually do that appear in no procedure, which is where automation plans usually break.

**3. Assess what the technology can actually take** *(1 hour)* — per step: can it do this today in your environment, what share of the volume realistically, what happens when it is wrong, and how sure are you. The tool records claims and confidence. **It never tells anyone what to automate.**

**4. Design the future state** *(2 hours)* — assign each step an allocation, set the human share, set confidence floors and what happens below them, declare review capacity, and name work the change creates. Deltas recompute live. Two or three named scenarios can be held side by side; none is ever marked best.

**5. Decide who owns the decisions** *(1 hour)* — the flagged decision points return, and the ten questions get asked in a fixed order. When the answer to *"whose name would be in the article?"* differs from *"who is accountable?"*, or when *"what can you change by yourself this week?"* came back constrained, the tool says so on the spot.

**6. See what happens to each role** — no data entry; everything computed. Composition before and after, what shrinks, what grows, what is entirely new, the direction of authority, and the FTE change stated as a question rather than a recommendation. Then two things the analyst cannot leave blank: **have people doing this job seen and confirmed it**, and **has anyone disagreed**.

**7. Turn growing work into capabilities** *(30 min)* — computed from the capability tags weighted by the hours that gain or lose them, with one question per rising capability: do people in this role already do this?

**8. Say where people actually go** *(45 min)* — the step most transformation plans skip. Per pathway: what carries over, what is missing, what a receiving manager would accept as proof, who pays, what happens to income — and *who is actually offering this*. Leave the provider empty and the pathway is labelled speculative everywhere it appears.

**9. Answer what the tool cannot check** *(20 min)* — the ten questions from §7.4. Skipping is allowed; the report shows what was skipped.

**10. Findings and report** *(20 min)* — everything checkable, each with its limitation, plus the counts. Print to PDF and take it to the steering committee.

## 12. Version 1 outputs

1. A validated, portable `.nelarvo.json` case file the client keeps
2. The workflow today: hours, FTE, and split by kind of work
3. Before and after totals, with unassessed work reported separately
4. Per-step task shift, including work that did not exist before
5. Role composition before and after, in hours and in shares
6. Capability demand rising and falling, ranked by readiness gap
7. Ownership and authority summary for every consequential decision
8. Pathway reality check, each labelled confirmed, conditional, or speculative
9. Findings with remediation questions and stated limitations
10. The ten open questions, answered or visibly unanswered
11. Everything recorded as unknown or disputed, collected with its hours
12. A local Markdown or printable HTML report

## 13. Version 1: eight sprints

### 13.1 The promise

> Describe one workflow as it runs today, model what the technology takes over, and receive measured before-and-after by role — what shrinks, what grows, what is new — plus what people will need to be able to do, whether the decisions have real owners, and whether anyone is actually offering the pathways proposed.

### 13.2 Sprint sequence

A usable product exists at the end of Sprint 4. Sprints 5 to 8 make it presentable and publishable. Each sprint is given to a coding agent on its own, with acceptance criteria verified before the next begins.

| Sprint | Delivers |
|---|---|
| 1 | Data model, calculation engine, project file, command line, tests |
| 2 | Case setup and current-state capture — the analyst's main data-entry surface |
| 3 | Exposure assessment and future-state design, with live deltas and scenarios |
| 4 | **The visuals and role impact — first usable milestone** |
| 5 | Decisions, the ten questions, ownership and authority checks |
| 6 | Capability shift, pathways, local case library and snapshots |
| 7 | Open questions, findings, and the printable report |
| 8 | Controlled AI assistance, examples, packaging, publication |

Sprint 1 delivers something only an engineer can use, and that is correct: the checks must be right before an interface wraps them, and it is far cheaper to change a check than a screen that depends on it. The most likely way this plan fails is building the interface first because it feels like progress.

Per-sprint acceptance criteria are in `BUILD-SPEC.md`. Anything not listed there requires a promotion gate.

### 13.3 The ten-question decision guide

Asked in this order. The order is the instrument, not a formatting preference.

1. What is the decision, and how often is it made?
2. If this went badly for three months, how bad would it be?
3. Who is accountable for this going well?
4. How would you know, this month, if it was going badly?
5. Where does that number come from — can they see it themselves, today, without asking anyone?
6. When it goes badly, what can they change **by themselves, this week**?
7. What can they **not** change that they wish they could?
8. What part is already done by software? Does it recommend, or decide?
9. When the software is unsure, or someone disagrees — what happens?
10. **If this went badly and it hit the news, whose name would be in the article?**

Question 10 against questions 3 and 6 is the whole instrument. The answers are rarely the same, and people feel the distance between them physically when they notice it.

### 13.4 Explicitly excluded from version 1

- Server, hosted service, or anything that stays running
- User accounts, login, authentication
- Any database that is not a discardable local cache
- Telemetry, analytics, crash reporting
- Any network call except an AI request the user explicitly triggers with their own key
- AI anywhere in the calculation or checking path
- A single overall score, grade, maturity level, or badge
- Any ranking of individuals; any required employee name
- Headcount reduction targets or recommendations of any kind
- Real-time collaboration, multi-user permissions
- A hand-drawn node canvas — diagrams are generated from the step list
- HR system, applicant tracking, payroll, or process-mining integrations
- Credential verification or a Transition Passport service
- Job, course, or learning marketplace
- A plugin system, a rule language, or a UI framework
- Universal skills ontology

### 13.5 Maintenance budget

Version 1 must remain maintainable by one part-time founder:

- one runtime;
- minimal dependencies;
- no infrastructure uptime;
- no persistent project data;
- no external API;
- deterministic test fixtures;
- no automatic data transmission;
- one predictable monthly dependency-review window.

If a feature creates ongoing operational duty, it requires evidence, funding, and a named owner.

## 14. Authoring experience

### 14.1 The file is not the interface

An analyst never edits JSON. They work through guided screens that ask plain questions — *how many of these per week, and how long does each take?* — and the file is what results. Engineers and version control see the file; the analyst sees their workflow.

All user-facing wording lives in one module and is treated as product, not decoration. An implementer left to invent it produces consultancy vocabulary, and the plain language is most of the value here. No sentence in generated output runs past twenty-five words, and a build test fails on a banned-word list: *leverage, synergy, journey, roadmap, empower, unlock, holistic, seamless, best-in-class, robust framework.*

### 14.2 Minimum viable entry

A step needs only a name, a role, a volume, a duration, and a kind of work. Everything else is optional and can be deepened later. This matters more than it looks: two to four hours of data entry is the single largest adoption risk in the product, so an analyst must be able to reach a first result quickly and refine afterwards.

A case with no pathway is permitted when no credible pathway has been identified. The report makes that absence visible rather than quietly omitting it.

### 14.3 When the numbers do not exist

Volumes and durations often live nowhere. The tool accepts estimates, records them as `reported` or `inferred`, and shows in the report how much of the total rests on estimation. **An honest estimate beats a missing analysis.** This must be tested with someone who does not have good data, early, not discovered late.

### 14.4 Non-technical participation

Workshop participants never touch the application. A facilitator can work on paper, a shared document, or a spreadsheet and transfer the agreed structure afterwards. The rendered report uses ordinary language and is the primary workshop artifact.

## 15. Technical architecture

### 15.1 Implementation

TypeScript on Node, one runtime, no parallel implementation in another language. Current Node runs the TypeScript directly, so there is no build step in development.

Three surfaces over one core:

- **Studio** — guided local screens. What the analyst uses. Served to `localhost`, and also shipped as a single self-contained HTML file that works when double-clicked with no install at all.
- **Command line** — for engineers, git hooks, and continuous integration.
- **Core** — the model, the calculation engine, the checks, the report. Pure logic. Both surfaces call it; everything is tested here.

**No UI framework.** Plain TypeScript, plain DOM, plain CSS. Seven screens do not justify a five-year framework commitment. Production dependencies are capped at six, and each one needs a written justification.

### 15.2 Principles

- Local-first and fully offline-capable
- No server, database, accounts, or telemetry
- The core imports nothing that touches the filesystem or the network — which is what lets the same code run in a browser, and what makes it testable
- Deterministic core behaviour; no AI in any calculation or check
- Stable check identifiers, never renumbered
- Human-readable inputs and outputs
- Safe parsing of untrusted input, with size and depth limits
- Every check has one passing and one failing fixture — that is the whole test strategy
- Runs air-gapped, in under two seconds, on a fifty-step case. Government and banking buyers require exactly this, and being able to say yes immediately removes weeks of procurement friction.

### 15.3 Repository structure

```text
nelarvo/
  src/
    core/
      brand.ts       the only place the product name appears
      types.ts       the data model
      parse.ts       project file read/write, stable key order
      calc/          hours, role composition, capability demand
      checks/        one file per check, each with its limitation
      report/
    cli/
    studio/
      copy.ts        all user-facing wording, in one place
  examples/
  tests/fixtures/
  docs/
    MEMORANDUM.md    this document
    BUILD-SPEC.md    what is being built, sprint by sprint
  README.md
```
### 15.4 Check contract

Each deterministic check defines a stable identifier, a precise condition, the affected path, a plain message, a remediation question, **a statement of what it cannot determine**, and two fixtures. The failing fixture must trigger that check and no other — a constraint that keeps checks independent of one another.

Open questions are stored separately and rendered whether or not any check fires. The engine produces measured hours and factual counts. It produces no responsibility score, maturity grade, certification, or ranking between organizations.

### 15.5 Deferred architecture

Collaboration, hosted services, integrations, credential infrastructure, and worker-held artifacts sit behind explicit promotion gates. They belong to the long-term vision, not the version 1 implementation contract, and they must not silently re-enter it.

## 16. AI design and governance

AI arrives in Sprint 8, after the deterministic core has proven useful. It exists to reduce typing, never to decide.

**It may help with:** turning interview notes into draft steps; suggesting a kind of work and capability tags for a step the analyst wrote; suggesting exposure assessments with reasoning; drafting the narrative prose of the report from computed numbers; explaining a finding in plainer words.

**Hard rules, enforced in code rather than left to policy:**

- **Nothing AI produces enters the project directly.** It lands in a suggestion tray and is accepted item by item. Bulk accept is permitted only after previewing every item.
- Anything accepted is stored with its origin marked, shown as such in the interface, and counted in a report appendix: *N items in this analysis originated as AI suggestions.*
- **No AI in the calculation engine or the checks. Ever.** Numbers and findings are deterministic or they are worthless.
- The AI never proposes who should be made redundant, headcount targets, an individual's suitability, or that a pathway is viable.
- Turning AI off leaves every feature working. A build test removes the module entirely and expects the full suite to pass.
- Before any request leaves the machine, the analyst sees exactly what would be transmitted and confirms it.
- Model name and prompt version are recorded with each accepted suggestion.
- No API key is ever bundled. The user brings their own, or runs a local model.

Any further AI capability requires its own promotion evidence, threat analysis, tests, maintenance owner, and stated limitations.

## 17. Privacy, security, and data boundaries

Version 1 reduces risk by architecture: it does not operate a server, create accounts, collect telemetry by default, or store participant data on project infrastructure. Files remain with the user unless they intentionally share them.

Local-first does not make the data harmless. A case file may contain commercially sensitive workflows and vulnerable people’s employment information.

### 17.1 Data principles

- Prefer role-level analysis over named-person analysis
- Do not include personal data unless the purpose requires it
- Use pseudonymous identifiers in examples and shared cases
- Keep transition-support data separate from performance management
- Identify purpose and audience in the file
- Mark disputed and unknown claims
- Do not publish real files without participant authorization and review
- Provide a redaction guide
- Disable telemetry by default
- Make optional AI transmission explicit
- Never send protected content to a model merely to validate or lint a file

### 17.2 Sensitive data excluded from examples and normal use

- Medical information
- Immigration status
- Protected demographic characteristics
- Detailed financial information
- Psychological profiles
- Unrelated employee communications
- Individual performance ratings
- Names of affected workers unless strictly necessary

### 17.3 Security scope

The project must:

- validate untrusted input safely;
- prevent arbitrary code execution through input files;
- limit file-system access;
- escape rendered output;
- pin and review dependencies;
- publish a security-reporting process;
- test malicious and oversized inputs;
- make network use opt-in and visible.

### 17.4 Future services

Any future hosted editor, account system, enterprise integration, Passport, or credential service requires a new threat model, privacy design, retention policy, access model, incident process, and funded maintenance owner. Approval of the file specification does not pre-authorize those systems.

## 18. Open-source strategy

### 18.1 Why open source

The open layer creates inspectability, a common vocabulary, low-friction file adoption, reusable checks and prompts, independent criticism, international adaptation, and a practitioner network.

### 18.2 Recommended licenses

Use **Apache License 2.0** for code and schema and **CC BY 4.0** for general methodology documentation, subject to qualified legal review. Real cases and contributed data require separate provenance and authority.

### 18.3 Public commitment

These remain open and useful without paid services:

- schema and file convention;
- starter command;
- validator;
- ten checks;
- twelve prompts;
- completeness counts;
- local renderer;
- two examples;
- one-page facilitator guide;
- local import and export.

### 18.4 Commercial work

A business may provide facilitated diagnostics, transformation workshops, workforce-transition programs, assurance, implementation, sector expertise, training, integrations, and supported deployments when justified. It should not trap files in proprietary formats or deliberately weaken local use.

### 18.5 Adoption strategy

The adoption unit is a useful file, not an installed platform.

The first target behavior is:

1. copy an example;
2. describe one scenario;
3. validate and lint it;
4. discuss findings and prompts with affected people;
5. render a report;
6. contribute a correction, example, check, prompt, or translation.

The strongest early signal is a third party producing a useful file without founder facilitation.

### 18.6 Contribution model

Start with a public roadmap, small issues, contribution guide, code of conduct, security policy, lightweight Developer Certificate of Origin, and documented maintainer decisions. Invite non-code contributions. Do not create ceremonial governance before a real community exists.

### 18.7 Trademark and domains

Nelarvo is a coined proper noun with no literal meaning, chosen deliberately. Good marks acquire their sense from what gets built under them, and a descriptive name would have forced a choice between the two halves of the problem — ownership of AI-changed decisions, and credible pathways for affected people — when the product covers both.

The story it carries is simple: **Nelarvo is the value people carry with them when work changes.** Publicly it stays a proper noun with one idea attached — do not let people's accumulated value disappear when their work is transformed.

Earlier candidates were discarded for reasons worth recording. Descriptive names in this space are crowded and hard to own in search. One promising option sat too close to a well-known enterprise product to be safe. Another was rejected on a point that shapes the whole product vocabulary: **name the destination, never the departure.** A name built on handing work over primes loss and reads as quitting, which is the precise fear this project exists to reduce. Every screen and report follows the same rule — the role screen leads with what a person moves into, not what they lose.

Preliminary exact-name and registration-record checks found no obvious conflict, but this is not a trademark opinion, reservation, or guarantee. Search the Canadian and United States registers for the software classes, secure the domains and repository name, and obtain professional clearance before any public commitment or printed material.

## 19. Business architecture

Nelarvo should support a serious commercial venture without disguising that intention.

### 19.1 What customers pay for

Customers do not primarily pay for a graph editor. They pay for:

- resolving ambiguity;
- bringing conflicting stakeholders into one process;
- redesigning operational work;
- reducing transformation risk;
- integrating with existing systems;
- operating transition programs;
- demonstrating defensible governance;
- producing measurable outcomes;
- maintaining the system over time.

### 19.2 Initial commercial offers

#### Offer A: Workflow Transformation Diagnostic

A short engagement focused on one workflow.

Deliverables:

- validated current-state decision description;
- AI transformation scenarios;
- ownership and control analysis;
- role impacts;
- prioritized experiments;
- initial transition pathways.

#### Offer B: Responsible AI Work Redesign Pilot

Design and operate a controlled pilot with operational and workforce measurement.

#### Offer C: Workforce Transition Program

Support an affected workforce segment through role redesign, pathway creation, work-based learning, redeployment, and outcome tracking.

#### Offer D: Independent Transition Assurance

Review whether an organization’s proposed transformation has credible ownership, controls, participation, transition support, and measurement.

#### Offer E: Nelarvo Practitioner Program

Train internal transformation leaders, consultants, workforce professionals, and public-sector practitioners to use the methodology.

### 19.3 Long-term defensibility

The durable advantage will not be code alone. It may come from:

- trusted methodology;
- high-quality transformation cases;
- outcome evidence;
- institutional relationships;
- a practitioner network;
- cross-sector implementation knowledge;
- carefully governed benchmarks;
- reputation for independence;
- ability to connect operational redesign with real worker transitions.

### 19.4 Conflict-of-interest management

Commercial pressure could corrupt the public mission. Safeguards should include:

- published principles;
- disclosed sponsor and purpose for each case;
- separation between assessment evidence and sales claims;
- worker participation requirements for worker-impact claims;
- refusal criteria;
- transparent limitations;
- independent advisors when scale justifies them.

---

## 20. Refusal criteria

The project or company should refuse or narrowly constrain an engagement when:

- the client requests individual layoff rankings;
- the transition exercise is purely cosmetic and the material decision is being misrepresented as open;
- affected people are deliberately denied any voice while the client seeks a “human-centered” label;
- data collected for support will secretly be used for discipline;
- the requested analysis violates law or fundamental rights;
- the organization refuses to identify accountable decision-makers;
- the client demands fabricated certainty or misleading impact claims;
- security and privacy conditions are unacceptable.

Refusal will sometimes cost revenue. Without this boundary, the project’s trust and long-term business value will disappear.

---

## 21. Success metrics

### 21.1 Open-source health

- Meaningful external contributors
- Organizations independently running the tool
- Quality of documented cases
- Time required to model a workflow
- Percentage of generated graphs substantially corrected by participants
- Schema adoption outside the core application
- Responsiveness to issues and security reports
- Geographic and occupational diversity of contributors

GitHub stars may be observed but should not be treated as the primary outcome.

### 21.2 Product quality

- Participants can understand the graph
- Important ownership gaps are discovered
- Competing scenarios can be compared
- AI claims contain usable provenance
- Reports remain editable and exportable
- A nontechnical facilitator can complete a case
- Workers can identify and correct inaccurate role descriptions

### 21.3 Transformation outcomes

- Operational quality
- Cycle time
- Error, appeal, and reversal rates
- Safety and compliance events
- Customer or citizen outcomes
- Employee workload
- Exception volume
- Automation-related incidents
- Speed of organizational learning

### 21.4 Human transition outcomes

- Internal redeployment rate
- External placement where appropriate
- Income continuity
- Time to viable work
- Job quality
- Retention after transition
- Capability evidence earned
- Worker-reported agency
- Percentage of pathways accepted by a real opportunity provider
- Distribution of outcomes across affected groups

### 21.5 Anti-metrics

The project should not optimize:

- number of people declared reskilled;
- number of courses completed;
- number of tasks labeled automatable;
- short-term headcount reduction;
- volume of AI-generated recommendations;
- superficial participation.

---

## 22. Initial Toronto application

Toronto is a relationship-rich launch environment, not a permanent geographic restriction.

### 22.1 Recommended first case

Begin with one bounded administrative or customer-operations decision experiencing visible AI pressure. Suitable examples include insurance claims, permit review, financial-services operations, public-service application processing, healthcare administration, or customer-support escalation.

Choose a case with accessible participants, consequential decisions, plausible AI involvement, identifiable affected roles, and a sponsor willing to explore alternatives rather than justify a closed decision.

### 22.2 Participants

Seek an operational sponsor, affected worker or worker group, workforce representative, technology practitioner, and relevant risk or governance perspective. Add a union, educational provider, or public body where the context requires it.

### 22.3 First application scope

- One case
- Two scenario files when a meaningful alternative exists
- One to five consequential decisions
- One affected role group
- Ten deterministic checks
- Twelve review prompts
- One local report

### 22.4 Deliverables

- Validated case file, with competing future states where meaningful
- Completeness counts
- Check findings
- Answered, unanswered, and disputed prompts
- Decision ownership, authority, control, and escalation summary
- Role impacts
- Pathways labeled real, conditional, or speculative
- Pilot stop and rollback conditions
- An anonymized lesson only if participants authorize publication

### 22.5 Success condition

The first application succeeds if it reveals a material ownership, oversight, evidence, burden, or pathway problem that participants can act on. It does not need to prove the entire long-term platform vision.

## 23. Evidence-gated roadmap

Sprints are one week each. Each is given to a coding agent alone, and its acceptance criteria are verified before the next begins. The full criteria are in `BUILD-SPEC.md`.

### Sprint 1 — Model and engine ✅ complete

Data model, project file with stable key order, the full calculation engine, and a command line that prints the before and after.

**Exit evidence:** a hand-computed example matches the engine exactly, verified against a spreadsheet; the core imports nothing touching the filesystem or network; round-trip through save and load is byte-identical. *Achieved: 17 tests on round figures, type-check clean, worked claims case running.*

### Sprint 2 — Current-state capture

Case setup and the workflow screen: step list, step editor, live derived hours, running totals, decision-point and invisible-work flags.

**Exit evidence:** an analyst enters twelve steps in under forty minutes with no help, and never sees the words JSON, schema, or any check identifier.

### Sprint 3 — Exposure and future state

The nine allocations, human share, confidence floors, review capacity, created work, and named scenarios. Live deltas beside every step.

**Exit evidence:** two scenarios over the same steps produce different results with no step duplication; created work appears in future totals attributed to the right role.

### Sprint 4 — Visuals and role impact — **first usable milestone**

Workflow lanes, role composition, task shift, allocation matrix, and the computed role-impact screen with generated prose.

**Exit evidence:** a stakeholder who has not seen the tool reads the composition chart and correctly states what grows and what shrinks; an analyst completes steps 1–6 of §11 alone and produces a before-and-after by role.

### Sprint 5 — Decisions and ownership

The ten questions in order, the inline comparison between "whose name would be in the article" and "who can change it", and the ownership checks.

### Sprint 6 — Capabilities, pathways, storage

Capability shift, pathways with speculative labelling, the remaining checks, and a discardable local case library.

### Sprint 7 — Report

Open questions, findings, and the printable report.

**Exit evidence:** the banned-vocabulary test passes on every example; a fixture with a name populated produces output containing zero occurrences of it; a reader who has never seen the tool names the three biggest problems from the report alone.

### Sprint 8 — AI assistance, examples, publication

The suggestion tray with every rule in §16, two full examples, packaging, licences, and the public front door.

**Exit evidence:** removing the AI module from the build leaves every test passing.

### After version 1: evidence, not calendar

Run real cases, seek independent authorship, and grow only where repeated evidence supports it. Collaboration, hosted services, integrations, and worker-held artifacts have no scheduled date.

## 24. First 90 days

### Weeks 1–8: Build version 1

Complete the sprint sequence above. Do not start a sprint until the previous one's criteria pass.

### Weeks 9–10: Observe independent use

- Recruit three external analysts or practitioners
- Ask them to run a case without founder facilitation
- Record confusing fields, false expectations, and where they stall
- Fix documentation and model defects
- Resist adding features

### Weeks 11–12: Apply it to real work

- Secure one bounded Toronto case
- Agree on participation and data boundaries
- Model two competing future states
- Produce a report
- Determine whether any pathway names a real opportunity provider
- Publish only authorized, anonymized learning

### Then: test community and business signals

- Invite a non-code contribution
- Test a paid Workflow Transition Diagnostic
- Measure whether findings changed a decision or a conversation
- Decide whether to continue, narrow, or stop
- Promote no deferred feature without satisfying its gate

## 25. Initial public backlog

### Version 1

1. ~~Data model and calculation engine~~ ✅
2. ~~Project file, stable key order, round-trip test~~ ✅
3. ~~Command line: new, validate, calc~~ ✅
4. ~~Worked claims example~~ ✅
5. Case setup and current-state capture screens
6. Exposure assessment screen
7. Future-state design with the nine allocations and scenarios
8. Workflow lanes, role composition, task shift, allocation matrix
9. Role impact screen with generated prose
10. Decisions screen and the ten questions in order
11. Deterministic checks, each with two fixtures
12. Capability shift and pathway screens
13. Open questions screen
14. Findings and the printable report
15. Second worked example: permit review
16. Controlled AI assistance behind a suggestion tray
17. One-page interview guide, refusal criteria, licences, contribution guide
18. One unassisted external test

### Deferred behind promotion gates

- Hand-drawn process editing
- Additional top-level model objects
- Hosted collaboration or accounts
- Enterprise integrations
- Transition Passport or credential service

Deferred items are not partially built during the sprints.

## 26. Team and contributor roles

The founder does not need a large permanent team initially. The project benefits from a network of contributors with different forms of expertise.

### Core responsibilities

- Product and methodology steward
- Technical maintainer
- Work-design or operations practitioner
- Workforce-transition practitioner
- Worker-participation advocate
- Privacy and security reviewer
- AI governance reviewer
- Research and evaluation lead
- Community and documentation lead

One person may hold several responsibilities early, but the perspectives should not remain permanently concentrated in the founder.

### Contributor paths

People should be able to contribute through:

- code;
- documentation;
- translations;
- example workflows;
- occupation and capability mappings;
- facilitation methods;
- accessibility;
- security review;
- evaluation research;
- worker feedback;
- policy and legal analysis;
- local ecosystem building.

This broadens the community beyond software developers.

---

## 27. Decision-making and governance

### Early stage

The founder or named maintainers make final product decisions while:

- documenting important architecture decisions;
- publishing roadmap changes;
- explaining rejected proposals;
- disclosing commercial conflicts;
- protecting the non-negotiable principles.

### Later stage

If a genuine community develops, governance may evolve toward:

- maintainers by module;
- a public technical steering process;
- a methodology and ethics council;
- formal release procedures;
- independent security and impact review.

Governance should follow real participation. It should not simulate democracy while the founder privately controls every consequential decision.

---

## 28. Major risks and responses

### Risk: The project is still too broad

**Response:** Version 1 describes one workflow, one technology change, a small number of scenarios, and one affected role group. Remove fields that do not change a decision or finding.

### Risk: The specification becomes an abstract ontology exercise

**Response:** Every required field must support a real question, lint rule, report section, or observed case. No universal skills ontology.

### Risk: data entry is too long and analysts abandon it

**Response:** Two to four hours of workflow capture is the single largest adoption risk in the product. Keep the minimum step to name, role, volume, duration, and kind of work, with everything else optional, so an analyst reaches a first result quickly and deepens afterwards. Measure this in Sprint 2 with someone who does not have good volume data — do not discover it in Sprint 8.

### Risk: the numbers are subtly wrong and nobody notices

**Response:** The most damaging failure available, because it destroys credibility permanently. Cross-check the engine against a hand-built spreadsheet in Sprint 1, keep the worked example as a golden test forever, and use round figures in fixtures so any reader can verify them with a calculator.

### Risk: It becomes compliance theater

**Response:** Do not issue a universal score or badge. Preserve disputes and unknowns, require evidence statuses, and publish limitations. A valid file is not proof of a responsible transformation.

### Risk: Organizations use it to justify layoffs

**Response:** Prohibit individual dismissal ranking, expose whether decisions are already closed, require transition alternatives for human-centered claims, and apply refusal criteria.

### Risk: Workers do not trust it

**Response:** Prefer role-level data, require an affected-participant review mechanism, preserve corrections and disputes, and separate transition support from performance management.

### Risk: Local files leak sensitive information

**Response:** Minimize personal data, provide redaction guidance, validate safely, escape reports, use pseudonymous public examples, and make optional network transmission explicit.

### Risk: AI generates plausible nonsense

**Response:** Keep AI optional. Require evidence status, source references, human validation, deterministic checks, and multiple scenarios.

### Risk: No employer demand exists for recommended roles

**Response:** Require an identified opportunity provider or mark the pathway explicitly speculative. Training demand is not employment demand.

### Risk: The business cannot capture value because the code is open

**Response:** Build revenue around responsibility, facilitation, integration, operation, assurance, and evidence—not artificial software scarcity.

### Risk: Consultants copy the methodology

**Response:** Treat legitimate adoption as success. Compete through trust, implementation quality, relationships, outcome evidence, learning speed, and stewardship.

### Risk: The founder becomes trapped maintaining software

**Response:** Enforce the maintenance budget: no server, accounts, persistent project data, or required AI. Every operational obligation needs evidence, funding, and an owner.

### Risk: The repository never develops a community

**Response:** Optimize for useful examples, rules, translations, and non-code contributions. The first community objective is not stars; it is independent authorship of a useful file.

### Risk: Cultural generalizations damage credibility

**Response:** Measure observable organizational practices instead of assigning capability or ownership based on nationality.

### Risk: The project promises social transformation without economic realism

**Response:** Connect every pathway to demand, authority, financing, opportunity, and measured outcomes.

### Risk: Commercial clients control the public agenda

**Response:** Publish principles, decisions, refusal criteria, and limitations; diversify partners; and protect the usefulness of the open tools.

## 29. Positioning

### Founder positioning

> AI Decision and Workforce Transformation Architect

Alternative:

> Work and Decision Systems Architect for the AI transition

The founder helps organizations:

- identify how AI decomposes jobs and processes;
- redistribute tasks across people, agents, software, and machines;
- redesign roles around decisions, systems, relationships, and outcomes;
- establish authority, controls, escalation, and accountability;
- construct viable pathways for affected workers;
- measure whether transformation genuinely improved performance and transition outcomes.

### Unit of value

The unit of value is not an AI deployment.

> It is a redesigned system of work capable of producing better measurable outcomes while giving affected people credible paths forward.

### Three diagnostic questions

1. Which human activities are becoming cheaper or less scarce?
2. Which decisions, relationships, exceptions, and outcomes still require meaningful human ownership?
3. How should workflows, roles, authority, capabilities, and transitions be redesigned around that ownership?

---

## 30. Communication guide

### Say

- “We model work at the level of tasks, decisions, and outcomes.”
- “The system supports decisions; it does not determine a person’s future.”
- “Transition pathways are hypotheses that require evidence and real opportunities.”
- “Workers participate in describing and redesigning their work.”
- “Operational and human outcomes are measured together.”
- “Open source creates a shared, inspectable foundation.”

### Avoid

- “We know which jobs AI will eliminate.”
- “Everyone can simply reskill.”
- “AI will free people to do higher-value work.”
- “The system objectively determines potential.”
- “Human in the loop” when the human has no time or authority.
- “Responsible AI” without concrete controls and outcomes.
- “Future-proof career.”
- National or cultural stereotypes presented as individual prediction.

---

## 31. Founding manifesto

Technological progress should not require people to discard the value they have built throughout their working lives.

Reskilling without a real opportunity is not a transition. It is a transfer of risk to the individual.

Artificial intelligence is changing cognitive work. Robotics may later transform more physical work. The speed, scope, and final destination remain uncertain, but the transition has already begun.

Jobs are not indivisible objects that simply survive or disappear. They combine tasks, decisions, relationships, knowledge, authority, and responsibility. When technology changes those combinations, work must be redesigned. If it is not redesigned deliberately, organizations may gain automation while losing accountability, resilience, trust, and people.

Nelarvo exists to make this transformation visible and testable.

We are building an open specification and local tools that help people and institutions describe work as it exists, compare possible futures, decide what humans and machines should each do, assign meaningful ownership, and expose whether affected people have credible paths forward.

We believe responsibility without authority is not ownership. It is blame.

We believe workers are participants in transformation, not data points to be optimized.

We believe AI recommendations should be inspectable, contestable, and bounded by evidence.

We believe uncertainty and disagreement should be recorded rather than hidden behind a score.

We believe a nominal human reviewer without sufficient time or authority is not meaningful oversight.

We believe organizations must measure human consequences alongside operational gains.

We believe open source can create the shared language, scrutiny, and cooperation required for a transition that no company, government, school, or community can manage alone.

We are not opposed to business. Durable institutions, serious implementation, and economic value are necessary. The open project establishes common infrastructure and trust. Businesses around it may provide facilitation, implementation, assurance, integration, and accountability for results.

Our first product is deliberately small: a readable file, an open specification, executable checks, and useful reports. We will not create a permanent software burden before real adoption earns it.

Our goal is not to preserve every existing task. It is to preserve human agency, accumulated capability, and the possibility of a dignified future while better systems of work are built.

The future of work should not be something done to people.

It should be something people can understand, influence, and enter.

---

## 32. Public README

The public front door is maintained as a separate [`README.md`](README.md), not embedded in this memorandum. It should remain readable in roughly sixty seconds and describe only shipped or explicitly planned behaviour.

This memorandum explains the larger thesis, product boundaries, governance, commercial strategy, safeguards, and evidence-gated destination. The README explains why someone should care and how to try the smallest project.

## 33. Immediate founding decisions

The founder should make and record these decisions before active development:

1. Complete professional trademark clearance for the name before public launch.
2. Confirm Apache 2.0 and documentation licensing with legal advice.
3. Select one first workflow and occupational group.
4. Confirm which individual information will never be collected.
5. Recruit two design partners, including affected workers.
6. Define the first paid offer independently of software features.
7. Define refusal criteria publicly.
8. Set a six-month limit for evidence of real demand.
9. Decide which outcome would justify continuing, narrowing, or stopping.
10. Publish progress honestly, including invalidated assumptions.

---

## 34. The first decisive test

The project should not initially be judged by code volume, funding, followers, or conceptual elegance.

Its first decisive test is:

> Can Nelarvo help one real group redesign one real workflow so that the organization makes a better technological decision, accountability becomes clearer, and affected people receive more credible futures than they had before?

If the answer is yes, repeat the method and build the institution around it.

If the answer is partly, identify which element created value and narrow the project around it.

If the answer is no, do not hide the result behind additional software. Revise the thesis.

---

## 35. Final definition

> **Nelarvo is an open-source specification and local application for measuring how AI, automation, and robotics change work; checking whether decisions and outcomes have legitimate human ownership, authority, evidence, controls, and escalation; and testing whether affected people have credible, supported pathways rather than speculative reskilling promises.**

Its first product is a local application built on one multiplication — volume times duration equals hours — which measures what a proposed change does to every role, turns the work that grows into the capabilities people will need, checks whether the resulting decisions have owners with real authority, and refuses to let a pathway be called real when nobody is offering it.

Its long-term public mission is to make technological transition understandable, contestable, measurable, and less brutal.

Its commercial opportunity is to support organizations, governments, workers, and communities with diagnostics, facilitated redesign, implementation, assurance, and transition programs—without turning the open project into a full-time software operation before adoption justifies it.
