# WorkTransitionKit

## Founding and Execution Memorandum

**Document version:** 0.3  
**Project status:** Founding hypothesis  
**Working name:** WorkTransitionKit  
**Initial launch geography:** Toronto, Canada  
**Intended reach:** International  
**Document purpose:** Give a founder, contributor, partner, employer, government body, workforce organization, funder, or implementation team enough context to understand the project, challenge it intelligently, and begin executing it.

---

## 1. Executive summary

WorkTransitionKit is an open-source file specification and local toolkit for examining how artificial intelligence, software automation, and eventually robotics change work—and whether the proposed change gives both organizational outcomes and affected people credible owners, controls, and paths forward.

Version 0.1 is a two-week entry project. It has no server, accounts, database, visual editor, stored employee profiles, required AI provider, uptime obligation, or multi-user permissions. A team describes one transformation scenario in a readable `TRANSITION.yaml` file. A validator checks the file, ten deterministic checks identify structural gaps, twelve review prompts guide human judgment, and a local renderer creates a readable report.

The first release helps a team answer:

1. What consequential decisions are changing?
2. What outcome, work, and controls surround each decision?
3. What will humans, AI systems, software, or machines each do?
4. Who owns each decision and outcome?
5. Does that owner have stated authority and escalation rights?
6. Which roles carry the transition burden?
7. Do proposed pathways name real opportunity providers or admit that they are speculative?
8. Which claims are observed, documented, reported, inferred, proposed, disputed, or unknown?

The project begins from two linked market failures:

> Responsibility without authority is blame.
>
> Reskilling without opportunity is transferred risk.

The party carrying workforce-transition risk is often not the party choosing automation. An employer buys technology, a vendor earns revenue, and a training provider may be paid for enrolment while the worker still receives no viable opportunity. WorkTransitionKit makes that allocation visible and contestable before a transformation is treated as complete.

The adoption unit is a useful file, not an installed platform. The first distribution artifact is not a score claiming that a transformation is “responsible.” It is a factual completeness summary such as:

```text
14 decisions described
6 have no named owner
9 assign responsibility without stated authority
4 automate work without a stated escalation path
7 of 12 review prompts remain unanswered
2 of 3 pathways name no real opportunity provider
```

This arithmetic travels without pretending to measure quality.

The long-term vision remains a richer work-redesign and transition system. That destination may eventually include scenario comparison, collaborative editing, visualization, organizational integrations, or worker-held transition artifacts. It is not the initial engineering commitment. Each layer must earn its existence through independent use of the simpler layer.

The open-source project creates a shared notation, executable checks, durable questions, reference cases, and a practitioner community. A commercial practice can grow around diagnostics, facilitated redesign, transition programs, governance, assurance, integration, and outcome measurement.

### 1.1 The scope ladder

- **Layer 1 — Two-week v0.1:** four domain objects, two examples, ten checks, twelve prompts, four commands, and a one-page guide.
- **Layer 2 — Specification growth:** richer objects, reusable rule packs, and additional examples after real files reveal the need.
- **Layer 3 — Ecosystem:** third-party files, rules, prompts, translations, research, and integrations.
- **Layer 4 — Optional application:** collaborative editing or hosted services only after independent adoption and funded maintenance.
- **Layer 5 — Transition infrastructure:** worker-held evidence or credential services only after real opportunity providers commit to recognizing them.

### 1.2 Promotion gates

Do not build the next layer until the current layer produces evidence:

- Add a new top-level object only when at least three real files cannot express a necessary decision without it.
- Add a deterministic check only when it can be tested from the file alone with clear passing and failing fixtures.
- Promote a review prompt into a check only when reliable deterministic detection exists.
- Add scenario comparison only when users maintain multiple files and repeatedly find ordinary diff tools inadequate.
- Build a graphical editor only after a third party creates and uses a valid file without the founder and repeated users identify authoring—not methodology—as the main barrier.
- Add accounts or hosted storage only when collaboration needs cannot reasonably be met with ordinary files and version control.
- Build a Transition Passport service only when a real opportunity provider agrees to recognize its evidence.
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

WorkTransitionKit gives these parties a shared representation of the transition.

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

> WorkTransitionKit helps people and institutions redesign work across humans and machines—while ensuring that decisions, outcomes, and affected people have somewhere credible to land.

### Short description

> Open infrastructure for designing work and navigating workforce transitions in the age of AI and robotics.

### Category

WorkTransitionKit sits at the intersection of:

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

WorkTransitionKit must not provide a cosmetic “responsible transition” label for predetermined mass dismissal. It should reveal available alternatives, affected groups, unresolved risks, and the actual support offered.

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

## 7. The WorkTransitionKit v0.1 specification

The canonical artifact is a versioned, human-readable file named `TRANSITION.yaml`. YAML is the authoring format; JSON is supported through the schema. One file describes one scenario. Alternative futures are separate files and may be compared with ordinary version-control or diff tools.

Version 0.1 has four domain objects:

1. `case`
2. `decisions`
3. `role_impacts`
4. `pathways`

`spec_version` and `scenario` are top-level metadata, not additional domain objects. Outcomes, tasks, technology allocation, evidence, controls, escalation, metrics, participation, and pilot conditions are nested where they are used. This keeps the file readable from top to bottom and minimizes cross-references.

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

### 7.2 Example file

```yaml
spec_version: "0.1"
scenario: assisted-review

case:
  id: claims-pilot
  title: AI-assisted claims review
  purpose: Explore alternatives before deployment
  decision_status: open
  affected_participation:
    roles: [claims-specialist]
    reviewed_by_affected_people: true
  alternatives:
    companion_files: [human-led.yaml]
    no_alternative_reason: null
  pilot:
    stop_conditions: [appeal-rate-exceeds-baseline]
    rollback: restore-human-led-review
  prompt_responses:
    P001: answered
    P002: unanswered

decisions:
  - id: claim-disposition
    statement: Approve, reject, request evidence, or escalate
    outcome: Resolve eligible claims fairly within 48 hours
    owner_role: claims-outcome-specialist
    authority:
      may_decide: true
      may_override_ai: true
    current_work:
      - receive and interpret claim evidence
      - compare evidence with policy
    future_allocation:
      human: final decision and exceptions
      machine: extract documents and propose disposition
    controls:
      - second review above threshold
      - claimant appeal
    escalation: senior-claims-reviewer
    metrics: [resolution-time, appeal-rate, reversal-rate]
    evidence:
      status: proposed
      sources: [claims-workshop-2026-07]

role_impacts:
  - role: claims-specialist
    diminishing_work: [manual-document-extraction]
    emerging_work: [ai-output-validation, exception-resolution]
    evidence:
      status: proposed
      sources: [claims-workshop-2026-07]

pathways:
  - from_role: claims-specialist
    to_role: claims-outcome-specialist
    status: conditional
    opportunity_provider: pilot-employer
    required_evidence: [supervised-exception-casework]
    support_owner: claims-operations
    fallback: retain-current-role-during-pilot
    evidence:
      status: reported
      sources: [operations-sponsor]
```

### 7.3 Ten deterministic checks shipped in v0.1

A check fires only when the required condition can be determined from the file. Every finding points to a specific object path. Checks do not claim that filled-in content is substantively good.

- **C001 Missing owner:** a decision has no `owner_role`.
- **C002 Responsibility without stated authority:** an owner exists but `authority.may_decide` is absent or false.
- **C003 Missing escalation:** machine involvement is declared but no escalation path is stated.
- **C004 Missing metric:** a decision has no stated metric.
- **C005 Missing evidence status:** a consequential decision, role impact, or pathway lacks a valid evidence status.
- **C006 No alternative scenario:** neither a companion scenario file nor a reason for having no alternative is stated.
- **C007 Unsupported pathway status:** a pathway has no opportunity provider and is not explicitly `speculative`.
- **C008 Missing fallback:** a pathway has no fallback.
- **C009 Affected-worker review absent:** affected roles exist but no affected-person review is recorded.
- **C010 Pilot reversibility absent:** a pilot case lacks stop conditions or rollback information.

Passing these checks means required fields are present and internally consistent. It does not certify that a transition is responsible, safe, legal, or likely to succeed.

### 7.4 Twelve judgment prompts rendered in every report

These are questions, not detections. The toolkit reports whether each was answered, but never pretends to evaluate the quality of the answer automatically.

- **P001 Automation opacity:** Can affected people inspect, challenge, and override consequential machine output?
- **P002 Real authority and capacity:** Does the owner actually have the information, time, resources, and organizational permission required?
- **P003 Control adequacy:** Are the stated controls proportionate to consequence and failure modes?
- **P004 Human bottleneck:** Can human reviewers meaningfully review the expected volume within available time?
- **P005 Metric distortion:** Could a metric reward behavior that undermines the intended outcome?
- **P006 Invisible work:** Does removed or compressed work remain necessary, and who will perform it?
- **P007 Burden allocation:** Who receives automation benefits, and who bears transition costs and risks?
- **P008 Opportunity reality:** What evidence shows that the destination role or opportunity genuinely exists?
- **P009 Purpose conflict:** Could transition-support information be reused for discipline, ranking, or dismissal?
- **P010 Unequal impact:** Could errors, work intensification, or lost opportunity concentrate on a particular group?
- **P011 Scenario challenge:** What assumptions would make this scenario fail, and what alternative was considered?
- **P012 Pathway failure:** What happens to the person if the proposed pathway, training, or opportunity does not materialize?

A question that is always asked is more valuable than an unreliable automated judgment.

### 7.5 Completeness summary

The report contains counts, never a quality grade:

- decisions described;
- decisions without owners;
- owners without stated authority;
- automated decisions without escalation;
- decisions without metrics;
- claims without evidence status;
- affected roles without recorded review;
- pathways without real providers;
- pathways without fallback;
- unanswered judgment prompts.

Counts are factual descriptions of the file. They are not a “responsibility score,” maturity level, certification, or comparison of organizations.

### 7.6 Four commands

```text
wtk init <directory>          Create a documented starter file
wtk validate TRANSITION.yaml Validate structure and references
wtk lint TRANSITION.yaml     Run ten checks and count prompt responses
wtk render TRANSITION.yaml   Produce local Markdown or HTML
```

All commands run locally. Network access and AI are not part of version 0.1.

## 8. The Outcome Ownership Contract

The Outcome Ownership Contract is a core WorkTransitionKit method and data object.

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

### 9.5 Transition Passport — future artifact, not version 0.1

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

## 11. Version 0.1 workflow

### Step 1: Define the case

Record the purpose, scenario, sponsor, current decision status, affected roles, participant-review status, and whether the transformation decision is genuinely open.

### Step 2: Identify consequential decisions

Use a ten-question conversation, existing process documents, or ordinary notes. Identify decisions where AI or automation changes execution, recommendation, review, authority, or escalation. Version 0.1 does not require a visual editor or complete process graph.

### Step 3: Describe each decision in place

Nest its intended outcome, current work, proposed human/machine allocation, owner, authority, controls, escalation, metrics, and evidence together so a stranger can scan the file without chasing references.

### Step 4: Record role impacts and pathways

Describe diminishing and emerging work. For each pathway, identify its status, opportunity provider, support owner, required evidence, fallback, and evidence source. If no provider exists, label the pathway `speculative`.

### Step 5: Validate and lint

Run structural validation and ten deterministic checks. Correct missing or inconsistent fields. Do not interpret a clean result as approval of the transformation.

### Step 6: Answer judgment prompts

Discuss the twelve prompts with affected participants and responsible leaders. Record whether each prompt is answered, unanswered, or disputed. Preserve the substance in the rendered report or linked notes.

### Step 7: Render and decide

Generate a local report containing the completeness counts, findings, unanswered prompts, role impacts, pathways, and next actions. Compare alternative scenario files with ordinary diff tools when useful.

## 12. Version 0.1 outputs

The two-week release produces:

1. A documented `TRANSITION.yaml` starter
2. Structural validation results
3. Findings from ten deterministic checks
4. A twelve-prompt review section
5. A factual completeness summary
6. An ownership and escalation summary
7. A role-impact and pathway reality check
8. A local Markdown or HTML report
9. Two annotated reference cases: claims review and permit review
10. A one-page, ten-question facilitator guide

## 13. Two-week minimum viable project

### 13.1 MVP promise

> Describe one AI-related work-transition scenario in a readable file and receive an honest report showing missing ownership, authority, escalation, evidence, participation, reversibility, and real opportunity—plus twelve questions that require human judgment.

### 13.2 Required deliverables

- One concise v0.1 schema with four domain objects
- Two annotated examples: claims review and permit review
- `wtk init`
- `wtk validate`
- `wtk lint` with C001–C010
- `wtk render`
- Tests with one passing and one failing fixture per check
- One-page facilitator guide containing ten questions
- Short README, license, contribution guide, security policy, and refusal criteria

Anything else requires a promotion gate.

### 13.3 Ten-question facilitator guide

1. Which consequential decision is changing?
2. What outcome is that decision meant to produce?
3. What does the person do today that the proposed system changes?
4. What will the machine do, and what will the human still decide?
5. Who owns the decision, and what authority do they actually have?
6. What happens when the system is uncertain, wrong, or challenged?
7. Which role gains work, loses work, or absorbs hidden work?
8. Which affected people reviewed this description, and what do they dispute?
9. What real opportunity and support exist for anyone asked to transition?
10. What stops or reverses the pilot if operational or human outcomes deteriorate?

### 13.4 Explicitly excluded from version 0.1

- AI-assisted authoring
- Scenario-comparison command
- More than four top-level domain objects
- More than ten deterministic checks
- Full methodology manual
- Server or hosted service
- User accounts or database
- Visual editor or real-time collaboration
- Stored employee profiles
- Enterprise integrations or process mining
- Credential verification or Transition Passport service
- Job, course, or learning marketplace
- Individual ranking or layoff recommendation
- Automated performance or employment decisions
- Universal skills ontology

### 13.5 Maintenance budget

Version 0.1 must remain maintainable by one part-time founder:

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

### 14.1 Starter kit

`wtk init` creates a documented `TRANSITION.yaml`, one short field guide, and commands for validation, linting, and rendering.

### 14.2 Minimum valid file

A minimum file contains:

- `spec_version` and `scenario`;
- case purpose and participation status;
- one decision with its outcome and evidence status;
- one role impact;
- zero or more pathways.

A case with no pathway is allowed when no credible pathway has yet been identified. The report must make that absence visible.

### 14.3 Nontechnical participation

Participants do not need to edit YAML. A facilitator can use paper, a shared document, or a spreadsheet, then author the file. The rendered report uses ordinary language and is the primary workshop artifact.

### 14.4 Editor trigger

An editor enters the roadmap only after independent authorship occurs, repeated users identify YAML as the main barrier, the schema has stabilized through real cases, and maintenance has a funded owner.

## 15. Technical architecture for version 0.1

### 15.1 Implementation

Use one small TypeScript command-line package:

- Node.js long-term-support release;
- TypeScript;
- one YAML parser;
- JSON Schema validation;
- deterministic checks;
- Markdown rendering with optional static HTML;
- a conventional test runner.

### 15.2 Principles

- Local-first and offline-capable
- No server, database, accounts, or telemetry
- No AI or network requirement
- Human-readable inputs and outputs
- Deterministic core behavior
- Stable check and prompt identifiers
- Versioned schema
- Safe parsing of untrusted YAML
- Minimal dependencies

### 15.3 Repository structure

```text
worktransitionkit/
├── schema/v0.1.schema.json
├── src/
│   ├── init/
│   ├── validate/
│   ├── checks/
│   └── render/
├── examples/
│   ├── claims-review/
│   └── permit-review/
├── tests/fixtures/
├── FACILITATOR.md
├── REFUSAL-CRITERIA.md
├── VISION.md
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
└── README.md
```

### 15.4 Check contract

Each deterministic check defines:

- stable ID;
- precise file condition;
- affected object path;
- message;
- remediation question;
- passing fixture;
- failing fixture.

Prompts are stored separately and rendered regardless of whether a deterministic condition fires. The toolkit calculates completeness counts but no responsibility score, maturity grade, certification, or organizational ranking.

### 15.5 Deferred architecture

Richer schemas, scenario comparison, AI assistance, visual editing, collaboration, integrations, or Passport services belong after explicit promotion gates. They remain part of the long-term vision, not the v0.1 implementation contract.

## 16. AI design and governance — deferred

AI is not part of version 0.1. The validator, checks, prompts, completeness counts, and renderer work offline and deterministically.

A future optional authoring assistant may structure interview notes, suggest missing questions, or explain findings only after the core file convention is independently useful. It must:

- be deliberately invoked;
- mark inferred content;
- preserve source references;
- require human review;
- remain provider-replaceable;
- avoid transmitting protected data without explicit authority;
- never be required for validation or rendering;
- never decide that a worker is redundant, rank people, assign final accountability, fabricate labor demand, or approve a transformation.

Any AI extension requires its own promotion evidence, threat analysis, tests, maintenance owner, and clear statement of limitations.

## 17. Privacy, security, and data boundaries

Version 0.1 reduces risk by architecture: it does not operate a server, create accounts, collect telemetry by default, or store participant data on project infrastructure. Files remain with the user unless they intentionally share them.

Local-first does not make the data harmless. A `TRANSITION.yaml` file may contain commercially sensitive workflows and vulnerable people’s employment information.

### 17.1 Version 0.1 data principles

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

- validate untrusted YAML safely;
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

Version 0.1 keeps these open and useful without paid services:

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

WorkTransitionKit remains a working name. It is intentionally descriptive because v0.1 covers both halves of the problem: ownership of AI-changed decisions and credible pathways for affected roles. A decision-only name would misstate the scope; a broad future-of-work name would hide the executable transition focus. If pathways leave the v0.1 specification, revisit the name. Preliminary exact-name and registration-record checks found no obvious conflict and no RDAP record for `worktransitionkit.com` or `worktransitionkit.org` on July 27, 2026. This is not a trademark opinion, reservation, or guarantee. Repeat the check and obtain professional trademark advice before public commitment.

## 19. Business architecture

WorkTransitionKit should support a serious commercial venture without disguising that intention.

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

#### Offer E: WorkTransitionKit Practitioner Program

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

- Valid `TRANSITION.yaml` file or files
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

### Phase 0: Two manual examples — days 1–2

Write claims-review and permit-review files by hand. Use them to remove unnecessary fields and confirm that a stranger can scan the file in roughly sixty seconds.

**Exit evidence:** both cases can express ownership and transition questions using only four domain objects.

### Phase 1: Freeze the v0.1 draft — days 3–4

Publish the schema, evidence statuses, C001–C010, P001–P012, and completeness-count definitions.

**Exit evidence:** every required field supports a check, prompt, report statement, or actual example.

### Phase 2: Build the local toolkit — days 5–9

Implement `init`, `validate`, `lint`, and `render`. Add passing and failing fixtures for each check. Test malformed and hostile YAML.

**Exit evidence:** the commands operate offline, produce deterministic output, and require no account, model, or server.

### Phase 3: Package the front door — days 10–11

Write the sixty-second README, one-page facilitator guide, refusal criteria, license, contribution guide, and security policy.

**Exit evidence:** a fresh reader can understand the problem, create a file, run the toolkit, and interpret its limitations.

### Phase 4: Independent test — days 12–13

Give the repository to at least one external practitioner without facilitating the first attempt. Observe failures in language, installation, and file structure.

**Exit evidence:** the practitioner produces or meaningfully edits a file and explains at least one finding or prompt.

### Phase 5: Release v0.1 — day 14

Fix only release-blocking problems, tag v0.1, publish the examples, and record deferred requests against promotion gates.

### After v0.1: evidence, not calendar

Run real cases, seek independent authorship, and grow only where repeated evidence supports it. Scenario comparison, expanded schemas, AI assistance, editors, hosted services, integrations, and Passports have no scheduled date.

## 24. First 90 days

### Days 1–14: Ship v0.1

Complete the two-week roadmap above.

### Days 15–30: Observe independent use

- Recruit three external readers or practitioners
- Ask them to author or edit files without founder facilitation
- Record confusing fields and false expectations
- Fix documentation and schema defects
- Resist adding application features

### Days 31–60: Apply it to real work

- Secure one bounded Toronto case
- Agree on participation and data boundaries
- Create alternative scenario files where meaningful
- Produce a local report
- Determine whether pathways name real opportunities
- Publish only authorized, anonymized learning

### Days 61–90: Test community and business signals

- Invite a non-code contribution
- Test a paid Workflow Transition Diagnostic
- Measure whether findings changed a decision or conversation
- Decide whether to continue, narrow, or stop
- Promote no deferred feature without satisfying its gate

## 25. Initial public backlog

### Must ship in two weeks

1. Define the four-object schema.
2. Create claims-review example.
3. Create permit-review example.
4. Implement `wtk init`.
5. Implement schema validation.
6. Implement C001–C010.
7. Define P001–P012 and response statuses.
8. Render completeness counts and findings.
9. Render prompt responses and unanswered prompts.
10. Add passing and failing fixtures per check.
11. Test malformed and hostile YAML.
12. Write the ten-question facilitator page.
13. Write README, refusal criteria, security, contribution, and license files.
14. Conduct one unassisted external test.
15. Tag v0.1.

### Deferred behind promotion gates

- Scenario-comparison command
- Additional top-level objects
- Additional deterministic checks
- AI-assisted authoring
- Visual or form editor
- Hosted collaboration
- Integrations
- Transition Passport or credential service

Deferred items are not partially built during the v0.1 sprint.

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

**Response:** Version 0.1 describes one workflow, one technology change, a small number of scenarios, and one affected role group. Remove fields that do not change a decision or finding.

### Risk: The specification becomes an abstract ontology exercise

**Response:** Every required field must support a real question, lint rule, report section, or observed case. No universal skills ontology in version 0.1.

### Risk: YAML excludes nontechnical participants

**Response:** Participants use ordinary workshop materials; facilitators author the file. Keep the minimum file small, render plain-language reports, and allow community templates. Build an editor only after independent adoption proves authoring is the primary barrier.

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

**Response:** Enforce the maintenance budget: no server, accounts, persistent project data, required AI, or application layer in version 0.1. Every operational obligation needs evidence, funding, and an owner.

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

WorkTransitionKit exists to make this transformation visible and testable.

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

The public front door is maintained as a separate [`README.md`](README.md), not embedded in this memorandum. It should remain readable in roughly sixty seconds and describe only shipped or explicitly planned v0.1 behavior.

This memorandum explains the larger thesis, product boundaries, governance, commercial strategy, safeguards, and evidence-gated destination. The README explains why someone should care and how to try the smallest project.

## 33. Immediate founding decisions

The founder should make and record these decisions before active development:

1. Confirm the working name after professional trademark and domain review.
2. Confirm Apache 2.0 and documentation licensing with legal advice.
3. Select one first workflow and occupational group.
4. Decide which individual information will not be collected in version 0.1.
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

> Can WorkTransitionKit help one real group redesign one real workflow so that the organization makes a better technological decision, accountability becomes clearer, and affected people receive more credible futures than they had before?

If the answer is yes, repeat the method and build the institution around it.

If the answer is partly, identify which element created value and narrow the project around it.

If the answer is no, do not hide the result behind additional software. Revise the thesis.

---

## 35. Final definition

> **WorkTransitionKit is an open-source specification and local toolkit for describing how AI, automation, and robotics change work; checking whether decisions and outcomes have legitimate human ownership, authority, evidence, controls, and escalation; and testing whether affected people have credible, supported pathways rather than speculative reskilling promises.**

Its first product is a portable `TRANSITION.yaml` file, a validator, ten deterministic checks, twelve human-judgment prompts, factual completeness counts, and a local report generator. Alternative scenarios remain separate files in v0.1.

Its long-term public mission is to make technological transition understandable, contestable, measurable, and less brutal.

Its commercial opportunity is to support organizations, governments, workers, and communities with diagnostics, facilitated redesign, implementation, assurance, and transition programs—without turning the open project into a full-time software operation before adoption justifies it.
