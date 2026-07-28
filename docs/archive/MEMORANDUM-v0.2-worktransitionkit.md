# WorkTransitionKit

## Founding and Execution Memorandum

**Document version:** 0.2  
**Project status:** Founding hypothesis  
**Working name:** WorkTransitionKit  
**Initial launch geography:** Toronto, Canada  
**Intended reach:** International  
**Document purpose:** Give a founder, contributor, partner, employer, government body, workforce organization, funder, or implementation team enough context to understand the project, challenge it intelligently, and begin executing it.

---

## 1. Executive summary

WorkTransitionKit is an open-source specification and small set of local tools for documenting how artificial intelligence, software automation, and eventually robotics change work—and for testing whether the proposed transition gives both organizational outcomes and affected people credible owners, controls, and paths forward.

The first release is deliberately not a platform. It has no server, accounts, database, visual graph editor, stored employee profiles, uptime obligation, or multi-user permissions. A team describes one transformation in a human-readable `TRANSITION.yaml` file. A lightweight validator and linter check the file, and a local report generator turns it into readable Markdown or HTML.

The first release helps a team answer:

1. What outcome is the work intended to produce?
2. Which tasks and decisions are changing?
3. What will humans, AI systems, software, or machines each do?
4. Who owns consequential decisions and outcomes?
5. Does that owner possess the necessary authority, information, resources, controls, and escalation rights?
6. Which people or roles carry the transition risk?
7. What real opportunities, support, evidence, and fallback paths exist for them?
8. Which claims are observed, documented, reported, inferred, proposed, disputed, or unknown?

The project begins from two linked market failures:

> Responsibility without authority is blame.
>
> Reskilling without opportunity is transferred risk.

The party carrying workforce-transition risk is often not the party choosing automation. An employer buys technology, a vendor earns revenue, and a training provider is paid for enrolment while the worker may still receive no viable opportunity. WorkTransitionKit makes that allocation visible and contestable before a transformation is treated as complete.

The long-term vision remains a richer work-redesign and transition system. That destination may eventually include collaborative editing, scenario visualization, organizational integrations, and worker-held transition artifacts. It is not the initial engineering commitment. Each larger layer must earn its existence through independent use of the simpler layer.

The open-source project creates a shared notation, executable checks, reference cases, and a practitioner community. A commercial practice can grow around diagnostics, facilitated redesign, transition programs, governance, assurance, integration, and outcome measurement.

### 1.1 The scope ladder

The project must grow through evidence, not calendar ambition:

- **Layer 1 — Method:** workshop guide, definitions, examples, and refusal criteria.
- **Layer 2 — Specification:** versioned `TRANSITION.yaml` schema.
- **Layer 3 — Local tools:** initialize, validate, lint, compare, and render files.
- **Layer 4 — Ecosystem:** third-party files, rules, examples, translations, and integrations.
- **Layer 5 — Optional application:** collaborative editor or hosted service only after adoption proves the need.

### 1.2 Promotion gates

Do not build the next layer until the current layer produces evidence:

- Build the validator after at least three complete files have been written manually.
- Stabilize version 0.1 only after an external practitioner understands a file without founder explanation.
- Consider an editor only after a third party creates and uses a valid file without the founder in the room.
- Consider accounts or hosted storage only when users explicitly require collaboration that version control or shared files cannot reasonably provide.
- Consider a Transition Passport service only when a real opportunity provider agrees to recognize its evidence.

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

## 7. The WorkTransitionKit specification

The canonical project artifact is a versioned, human-readable file named `TRANSITION.yaml`. YAML is the authoring format; JSON is a supported machine format. The specification represents enough of a transformation to expose ownership, evidence, risk, and transition gaps without attempting to reproduce an entire organization.

A file may describe several competing future scenarios. The tool must never imply that one machine-generated future is optimal.

### 7.1 Minimum objects

Version 0.1 contains nine primary objects:

- engagement;
- outcomes;
- scenarios;
- roles;
- tasks;
- decisions and mandates;
- controls and risks;
- role impacts and pathways;
- evidence, assumptions, disputes, and unknowns.

A **mandate** is the executable form of an Outcome Ownership Contract: a named owner, defined outcome or decision, legitimate authority, required information, resources, constraints, metrics, controls, escalation, and review loop.

A conceptual graph can always be derived from the relationships in the file. Users do not need to operate a graph database or visual editor.

### 7.2 Evidence vocabulary

Every consequential claim must carry one of these statuses:

- `observed` — directly witnessed under identified conditions;
- `documented` — supported by a named document or system record;
- `reported` — stated by an identified participant or group;
- `inferred` — derived by a person, rule, or AI from other evidence;
- `proposed` — part of a possible future design;
- `disputed` — materially challenged by a participant;
- `unknown` — evidence is currently insufficient.

The status applies to automation feasibility, role impacts, capability claims, expected benefits, risks, and pathway demand—not only to source documents.

### 7.3 Example file

```yaml
spec_version: "0.1"
case:
  id: claims-pilot
  title: AI-assisted claims review
  purpose: Explore alternatives before deployment
  sponsor: claims-operations
  decision_status: open

outcomes:
  - id: fair-resolution
    statement: Resolve eligible claims fairly within 48 hours
    evidence_status: reported
    metrics:
      - median-resolution-time
      - appeal-rate
      - reversal-rate

scenarios:
  - id: assisted-review
    status: proposed
    tasks:
      - id: extract-documents
        current_actor: claims-specialist
        future_allocation: ai_led_human_review
        evidence_status: proposed
      - id: decide-claim
        current_actor: claims-specialist
        future_allocation: human_led_ai_assisted
        evidence_status: proposed

mandates:
  - id: claim-decision-mandate
    outcome: fair-resolution
    owner_role: claims-outcome-specialist
    authority:
      may_approve: true
      may_override_ai: true
      may_escalate: true
    information:
      - policy
      - claimant-evidence
      - model-rationale
    controls:
      - second-review-above-threshold
      - claimant-appeal
    metrics:
      - appeal-rate
      - reversal-rate
    review_cycle: monthly

role_impacts:
  - role: claims-specialist
    diminishing_tasks: [manual-document-extraction]
    emerging_tasks: [ai-output-validation, exception-resolution]
    evidence_status: proposed
    disputed_by: []

pathways:
  - from_role: claims-specialist
    to_role: claims-outcome-specialist
    opportunity_provider: pilot-employer
    opportunity_status: conditional
    transferable_capabilities:
      - contextual-policy-interpretation
      - claimant-communication
    required_evidence:
      - supervised-exception-casework
    fallback: retain-current-role-during-pilot
```

### 7.4 Transformation states

Each task may be described as:

- retained human work;
- human-led and AI-assisted;
- AI-led with meaningful human review;
- AI-led with exception-based human review;
- deterministically automated;
- robotically performed;
- externally provided;
- eliminated;
- redesigned;
- unresolved.

More automation is not automatically a more mature state.

### 7.5 Initial commands

The command-line interface should remain small:

```text
wtk init <directory>          Create a documented example file
wtk validate TRANSITION.yaml Validate structure and references
wtk lint TRANSITION.yaml     Detect ownership, evidence, and transition gaps
wtk compare a.yaml b.yaml    Explain material scenario differences
wtk render TRANSITION.yaml   Produce local Markdown or HTML
```

The commands must run locally. Network access and AI are optional extensions, never requirements for validation.

### 7.6 Initial lint catalogue

Stable identifiers make findings discussable and allow organizations to adopt the rules incrementally.

- **M001 Unowned outcome:** no human or legitimate governing body owns a consequential outcome.
- **M002 Responsibility without authority:** an owner lacks required decision rights.
- **M003 Missing information:** the owner cannot access information required by the mandate.
- **M004 Missing resources:** responsibility is assigned without identified time, capacity, or resources.
- **M005 Automation opacity:** a consequential machine recommendation cannot be adequately inspected or challenged.
- **M006 Escalation void:** an exception exists without a reachable escalation path.
- **M007 Control gap:** automation expands while necessary verification is absent.
- **M008 Unmeasured outcome:** no success or harm measure is attached to the outcome.
- **M009 Unsupported claim:** a consequential claim lacks evidence status or source.
- **M010 Dispute suppression:** a disputed claim is presented as settled.
- **M011 Single-future assumption:** a high-consequence transformation presents no alternative scenario or rationale.
- **M012 Unassigned transition cost:** time, income, training, or support costs have no owner.
- **M013 Speculative pathway presented as real:** no opportunity provider is identified and the pathway is not marked speculative.
- **M014 Missing fallback:** a pathway has no response if its main hypothesis fails.
- **M015 Worker voice absent:** affected roles have no identified participation or review mechanism.
- **M016 Purpose conflict:** data collected for transition support is also proposed for performance or dismissal use without an explicit lawful boundary.
- **M017 Invisible work risk:** work removed from the formal role appears to remain necessary but has no future actor.
- **M018 Automation concentration risk:** savings and transition burdens are allocated to different parties without acknowledgment.
- **M019 Reversibility gap:** a pilot lacks stop, rollback, or correction conditions.
- **M020 Opportunity evidence absent:** destination-role demand is asserted without a provider, vacancy, funded program, or documented market basis.
- **M021 Human bottleneck:** nominal human review volume or timing makes meaningful oversight implausible.
- **M022 Metric distortion:** a metric rewards behavior that may undermine the stated outcome.

Lint findings are prompts for judgment, not automated verdicts. Rules should state their assumptions and offer documented suppression with rationale.

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

## 11. Product workflow

The initial product supports one complete journey.

### Step 1: Define the engagement

Record:

- workflow boundary;
- intended outcome;
- sponsor;
- participating workers;
- purpose of the analysis;
- technologies being considered;
- decisions already made;
- decisions still open;
- data use and consent conditions.

### Step 2: Capture the current state

Participants describe the workflow through a structured interview and visual editor.

The system captures:

- triggers;
- tasks;
- decisions;
- roles;
- handoffs;
- information;
- systems;
- exceptions;
- controls;
- delays;
- failures;
- informal or invisible work;
- desired outcomes and current measurements.

AI may help structure notes or suggest missing questions. Humans approve the resulting graph.

### Step 3: Establish evidence and confidence

Every important statement should be labeled as one of:

- observed;
- documented;
- reported by a participant;
- inferred by AI;
- proposed;
- disputed;
- unknown.

Confidence must not be presented as scientific precision when it is merely qualitative judgment.

### Step 4: Explore transformation options

For each task and decision, the team evaluates:

- technical feasibility;
- economic value;
- quality impact;
- safety and legal constraints;
- human relationship requirements;
- exception frequency;
- reversibility;
- effect on workload;
- effect on affected roles;
- new failure modes;
- need for human authority.

The product should support multiple scenarios instead of immediately selecting one.

### Step 5: Design the future state

The team creates a future workflow showing:

- human and machine allocation;
- decision ownership;
- controls;
- exception paths;
- changed roles;
- new capabilities;
- metrics;
- unresolved questions.

### Step 6: Generate role impacts

Compare current and future states to identify:

- retained work;
- augmented work;
- diminishing work;
- new work;
- eliminated work;
- changed authority;
- new capability requirements;
- role-consolidation or fragmentation risks.

### Step 7: Co-create transition pathways

Affected people review their role impacts and participate in constructing future options. The system proposes pathways, but a pathway is not considered accepted until relevant human participants validate it.

### Step 8: Define the experiment

Before broad deployment, specify:

- pilot population;
- duration;
- baseline;
- operational metrics;
- human metrics;
- stop conditions;
- appeal and correction channels;
- review cadence;
- responsible owners.

### Step 9: Measure and learn

Record actual outcomes, compare them with assumptions, revise the graph, and publish appropriately anonymized lessons where permission exists.

---

## 12. Version 0.1 outputs

The first release produces only local, portable artifacts:

1. A validated `TRANSITION.yaml` file
2. A list of schema errors
3. A lint report with stable rule identifiers
4. A human-readable transformation summary
5. A scenario comparison
6. An Outcome Ownership or Mandate summary
7. A role-impact summary
8. A pathway reality check
9. An assumptions, evidence, disputes, and unknowns register
10. A pilot and measurement checklist

A conceptual current-state or future-state graph may be rendered later from the file, but it is not required for version 0.1.

## 13. Minimum viable project

### 13.1 MVP promise

> Describe one proposed AI-related work transition in a readable file and receive an evidence-aware report identifying unclear ownership, weak oversight, unsupported claims, transition burdens, and pathways that lack real opportunity.

### 13.2 Required deliverables

- A concise methodology guide
- Version 0.1 YAML and JSON Schema
- One fully annotated reference file
- Three smaller example files
- A local validator
- A local linter with stable rule IDs
- A local Markdown or HTML report renderer
- A scenario comparison command
- Tests for every lint rule
- A six-week facilitator guide
- Contribution, security, governance, and refusal documents

### 13.3 Optional AI assistance

An optional command may turn workshop notes into a draft file or explain lint findings. It must:

- run only when deliberately invoked;
- visibly mark inferred content;
- preserve source references;
- require human review;
- remain replaceable across model providers;
- never be necessary for validation, linting, comparison, or rendering.

### 13.4 Explicitly excluded from version 0.1

- Server or hosted service
- User accounts
- Database
- Stored employee profiles
- Visual graph editor
- Drag-and-connect interface
- Real-time collaboration
- Role-based permissions
- Enterprise integrations
- Process mining
- Credential verification
- Transition Passport service
- Job or course marketplace
- Individual ranking
- Layoff recommendations
- Automated performance evaluation
- Autonomous employment decisions
- Universal skills ontology
- Complex multi-agent system

### 13.5 Maintenance budget

The initial project should be maintainable by one part-time founder. The target is:

- one small runtime;
- few dependencies;
- no infrastructure uptime;
- no persistent user data;
- no required external API;
- deterministic test fixtures;
- backward-compatible schema changes where practical;
- a predictable monthly dependency-review window.

If a proposed feature creates ongoing operational duty, it requires explicit evidence, funding, and an owner.

## 14. Authoring experience

Version 0.1 is file-first but must not be hostile to non-developers.

### 14.1 Starter kit

`wtk init` creates:

- a documented `TRANSITION.yaml` template;
- a short field guide;
- an example transformation;
- instructions for validation and rendering.

### 14.2 Progressive complexity

A minimum valid file should require only:

- case purpose;
- one outcome;
- one scenario;
- one changed task or decision;
- one owner or explicit ownership gap;
- one affected role;
- evidence status.

Advanced controls, pathways, and metrics are added only when relevant.

### 14.3 Reports for nontechnical participants

The rendered report should use ordinary language and include:

- what is changing;
- what remains uncertain;
- who owns what;
- where authority or oversight is weak;
- who carries transition risk;
- which pathways are real, conditional, or speculative;
- what must happen next.

### 14.4 Workshop use

Participants do not need to edit YAML directly. A facilitator can use paper, a shared document, or a spreadsheet during discussion and transfer the agreed structure into the file afterward. Community-created templates may later simplify this step.

### 14.5 Editor trigger

A graphical or form-based editor enters the roadmap only when:

- at least one third party authors a valid file without the founder;
- repeated users report that file authoring is the main adoption barrier;
- the schema is stable enough that an editor will not freeze premature concepts;
- maintenance has a funded owner or contributor group.

## 15. Technical architecture for version 0.1

### 15.1 Recommended implementation

A small TypeScript command-line package is sufficient:

- Node.js current long-term-support release
- TypeScript
- YAML parser
- JSON Schema validator
- Deterministic rule engine
- Markdown renderer
- Optional static HTML output
- Conventional test runner

Python is also viable, but the project should choose one runtime rather than maintaining parallel implementations.

### 15.2 Architectural principles

- Local-first and offline-capable
- No server
- No database
- No accounts
- No telemetry by default
- No required AI provider
- Human-readable inputs and outputs
- Deterministic core behavior
- Stable lint identifiers
- Versioned schema
- Explicit evidence provenance
- Documented rule suppression
- Portable files
- Minimal dependencies

### 15.3 Repository structure

```text
worktransitionkit/
├── schema/
│   ├── v0.1.schema.json
│   └── examples/
├── src/
│   ├── commands/
│   ├── rules/
│   ├── compare/
│   └── render/
├── methodology/
│   ├── field-guide.md
│   ├── interview-guide.md
│   └── refusal-criteria.md
├── examples/
│   ├── claims-assisted-review/
│   ├── customer-support/
│   └── administrative-processing/
├── tests/
│   ├── fixtures/
│   └── rules/
├── VISION.md
├── CONTRIBUTING.md
├── GOVERNANCE.md
├── SECURITY.md
├── LICENSE
└── README.md
```

### 15.4 Rule engine

Each lint rule should define:

- stable ID;
- short title;
- problem statement;
- affected object path;
- severity or advisory level;
- detection logic;
- limitations;
- remediation question;
- test fixtures;
- allowed suppression syntax and required rationale.

The engine should not calculate a single “responsibility score.” Aggregated scores create false precision and invite superficial compliance.

### 15.5 Future architecture

The original collaborative platform concept belongs in `VISION.md`. It may later include a visual graph, collaboration, private deployments, integrations, or Passport services. Those components are independent products with independent privacy, security, and maintenance obligations. They must not silently re-enter the MVP.

## 16. AI design and governance

### 16.1 Appropriate AI uses

AI can reduce the cost of:

- structuring interviews;
- drafting graph elements;
- finding inconsistencies;
- generating questions;
- comparing scenarios;
- translating between technical and ordinary language;
- proposing pathways;
- summarizing evidence;
- producing reports.

### 16.2 Inappropriate AI authority

AI must not independently:

- decide that a worker is redundant;
- rank individuals for dismissal;
- determine a person’s employability;
- assign final accountability;
- conceal uncertainty;
- fabricate labor demand;
- infer sensitive traits;
- turn participation data into performance surveillance;
- approve a consequential future-state design.

### 16.3 Required AI controls

- Identify generated content
- Record model and prompt-template version where appropriate
- Preserve source evidence
- Allow rejection and correction
- Distinguish extraction from inference
- Avoid sending protected data to an external model without authorization
- Support a no-AI workflow for sensitive cases
- Evaluate recurring errors and group-level harms
- Make deterministic rules inspectable
- Never imply that an LLM explanation proves correctness

---

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

The open-source layer creates:

- trust through inspectability;
- a common language across employers, workers, governments, educators, and vendors;
- low-friction adoption through ordinary files;
- independent research and criticism;
- reusable lint rules;
- international and sector adaptation;
- a practitioner and contributor network;
- proof that the methodology is more than sales material.

### 18.2 Recommended licenses

Use **Apache License 2.0** for code and schema, and **CC BY 4.0** for general methodology documentation, subject to qualified legal review.

Examples and contributed data require clear provenance and separate attention. Real organizational cases must not be relicensed or published without authority.

### 18.3 Public commitment

The following remain open and useful without paid services:

- schema;
- file convention;
- validator;
- lint rules;
- comparison logic;
- report renderer;
- methodology;
- examples;
- local use;
- import and export.

### 18.4 Commercial additions may include

- facilitated diagnostics;
- transformation workshops;
- supported sector rule packs;
- private organizational integrations;
- managed deployment if later justified;
- program-level measurement;
- regulatory or assurance modules;
- practitioner training;
- workforce-transition operations;
- guaranteed support.

### 18.5 Adoption strategy

The adoption unit is a useful file, not an installed platform.

The project should encourage people to:

1. copy an example;
2. describe one real transformation;
3. run validation and linting;
4. discuss findings with affected participants;
5. contribute a rule, example, translation, or correction.

The strongest early adoption signal is a third party producing a valid and useful file without founder facilitation.

### 18.6 Contribution model

Begin with:

- public roadmap;
- small, well-specified issues;
- architecture decisions;
- code of conduct;
- security policy;
- contribution guide;
- lightweight Developer Certificate of Origin;
- public rule-design discussions;
- documented maintainer decisions.

Avoid a foundation or complex committee structure before a real contributor community exists.

### 18.7 Trademark and domains

WorkTransitionKit is a working name. Preliminary exact-name and registration-record checks found no obvious conflict and no current RDAP record for `worktransitionkit.com` or `worktransitionkit.org` on July 27, 2026. This is not a trademark opinion, guarantee of registrability, or reservation. Perform professional trademark review and register appropriate domains before public launch.

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

- current-state graph;
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

## 22. Initial Toronto pilot

Toronto should be treated as a relationship-rich launch environment, not a permanent geographic restriction.

### 22.1 Recommended first use case

Start with one administrative or customer-operations workflow experiencing visible AI pressure.

Strong candidates:

- insurance claims;
- financial-services operations;
- customer-support escalation;
- public-service application processing;
- healthcare administration;
- logistics coordination.

The preferred first case has:

- a bounded workflow;
- accessible participants;
- clear outcomes;
- material but manageable risk;
- plausible AI assistance;
- several affected roles;
- realistic internal transition options;
- a sponsor willing to test rather than merely announce.

### 22.2 Pilot coalition

Recruit:

- one operational sponsor;
- one frontline worker group;
- one HR or workforce representative;
- one AI or technology practitioner;
- one risk, legal, or governance representative;
- one workforce-development or educational partner;
- where relevant, a union or worker representative.

### 22.3 Pilot size

- One workflow
- Two or three future-state scenarios
- Five to fifteen participating workers
- One controlled experiment
- Eight to twelve weeks of active work
- A follow-up measurement period

### 22.4 Pilot deliverables

- Validated current-state graph
- Alternative future-state graphs
- Outcome Ownership Contracts
- Risk and control analysis
- Role-impact assessment
- Individual or role-level transition pathways
- Pilot measurement plan
- Anonymized public case, if participants authorize it
- Product and methodology improvement log

### 22.5 Pilot success condition

The first pilot succeeds if participants can make a better, more explicit transformation decision and at least some affected workers receive a credible opportunity—not merely a training recommendation.

---

## 23. Evidence-gated roadmap

### Phase 0: Manual cases — weeks 1–2

Objectives:

- test the ideas before freezing the notation;
- observe real work;
- identify the minimum information needed;
- verify that affected workers recognize the description.

Actions:

- interview workers and operational leaders;
- write three complete transformations manually;
- use at least two competing future scenarios in each;
- apply the ownership and pathway questions by hand;
- record concepts that repeatedly matter;
- remove fields that do not change a decision.

Exit evidence:

- three complete files;
- at least one ownership or transition problem discovered in each;
- at least one affected participant corrects a material assumption;
- a reader can understand the case without a presentation.

### Phase 1: Version 0.1 specification — weeks 2–3

Actions:

- publish the YAML convention and JSON Schema;
- publish evidence statuses;
- publish the first lint catalogue;
- create an annotated claims example;
- publish methodology, refusal criteria, and anti-metrics;
- create repository governance and licenses.

Exit evidence:

- examples validate;
- fields have plain-language definitions;
- every required field supports a real question or lint rule.

### Phase 2: Local toolkit — weeks 3–6

Actions:

- implement `init`;
- implement `validate`;
- implement the first lint rules;
- implement Markdown rendering;
- implement scenario comparison;
- test malicious and malformed files;
- package a simple installation path.

Exit evidence:

- a fresh user can install the tool, copy an example, modify it, validate it, and read the report;
- no network or account is required;
- every lint rule has passing and failing fixtures;
- the project can be maintained within the declared budget.

### Phase 3: Independent adoption — timing determined by evidence

Actions:

- recruit practitioners to author files without founder facilitation;
- observe where the specification is confusing;
- accept examples and rule proposals;
- run a small Toronto case using the toolkit;
- refine rather than broaden.

Exit evidence:

- at least one third party authors a useful valid file without the founder in the room;
- at least three real cases produce decisions or questions users value;
- at least one external contribution improves the specification, rules, or examples.

### Phase 4: Repeatable practice and business — timing determined by evidence

Actions:

- offer a paid Workflow Transition Diagnostic;
- train a small number of practitioners;
- publish anonymized cases with permission;
- measure operational and transition outcomes;
- add sector packs only where repeated patterns exist.

### Phase 5: Optional application layer — not scheduled

Consider a collaborative editor, hosted service, integrations, or Passport infrastructure only when promotion gates are satisfied and maintenance has a funded owner. The long-horizon system remains documented in `VISION.md` so ambition is preserved without turning it into an immediate obligation.

## 24. First 90 days

### Days 1–14: Prove the notation

- Confirm the working name after professional review
- Create the public repository
- Publish this memorandum and a shorter manifesto
- Interview at least ten workers and five organizational participants
- Write three transformations manually
- Test the evidence vocabulary and lint questions
- Remove unnecessary fields

### Days 15–30: Publish the specification

- Publish `TRANSITION.yaml` version 0.1 draft
- Publish JSON Schema
- Publish the annotated claims example
- Publish lint rules M001–M022
- Publish refusal criteria and anti-metrics
- Invite review from operations, workforce, labor, security, and governance perspectives

### Days 31–45: Ship the local tools

- Ship `wtk init`
- Ship `wtk validate`
- Ship the highest-value lint rules
- Ship local Markdown rendering
- Add deterministic tests and security fixtures
- Document installation and uninstallation

### Days 46–60: Test independent use

- Give the toolkit to three external practitioners
- Do not facilitate their first attempt
- Observe documentation failures
- Revise the schema without adding platform features
- Publish version 0.1

### Days 61–90: Connect the project to real work

- Secure one bounded Toronto design case
- Agree on worker participation and data boundaries
- Create multiple future scenarios
- Produce a local report
- Identify whether any proposed pathway has a real opportunity provider
- Publish an anonymized lesson if authorized
- Decide whether evidence supports continuing, narrowing, or stopping

## 25. Initial public backlog

### Specification

1. Define the minimum valid `TRANSITION.yaml`.
2. Define IDs and cross-reference behavior.
3. Define the seven evidence statuses.
4. Define multiple-scenario representation.
5. Define mandates and decision authority.
6. Define role impacts and transition burdens.
7. Define real, conditional, and speculative pathways.
8. Define versioning and compatibility policy.

### Rules

9. Implement M001 unowned outcome.
10. Implement M002 responsibility without authority.
11. Implement M006 escalation void.
12. Implement M009 unsupported claim.
13. Implement M013 speculative pathway presented as real.
14. Implement M015 worker voice absent.
15. Implement M019 reversibility gap.
16. Implement M021 human bottleneck.
17. Implement M022 metric distortion.
18. Create the lint-rule authoring guide.

### Tools

19. Implement `wtk init`.
20. Implement schema validation.
21. Implement lint output in text and JSON.
22. Implement Markdown rendering.
23. Implement scenario comparison.
24. Test untrusted and oversized YAML.
25. Package a one-command local install.

### Method and community

26. Write the facilitator interview guide.
27. Write the affected-worker review guide.
28. Write the redaction and publication guide.
29. Create the annotated claims example.
30. Create two contrasting future scenarios.
31. Document refusal criteria.
32. Document anti-metrics.
33. Create a contribution path for non-developers.
34. Ask an external practitioner to author a file without assistance.

Issues must describe user value, acceptance criteria, and maintenance impact—not only implementation.

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

## 32. Draft public README

### WorkTransitionKit

**An open specification for testing whether an AI-driven work transition has credible ownership, oversight, evidence, and paths for affected people.**

WorkTransitionKit lets a team describe one proposed transformation in `TRANSITION.yaml`, validate the file, detect structural risks, compare scenarios, and render a readable report locally.

```text
wtk init my-transition
wtk validate my-transition/TRANSITION.yaml
wtk lint my-transition/TRANSITION.yaml
wtk render my-transition/TRANSITION.yaml
```

#### What it checks

- Who owns consequential decisions and outcomes
- Whether responsibility comes with authority and resources
- Whether human review is actually possible at the expected volume
- Whether metrics may distort the intended outcome
- Whether important claims are observed, documented, reported, inferred, proposed, disputed, or unknown
- Whether affected roles participated
- Whether transition costs have owners
- Whether a pathway names a real opportunity provider or is honestly marked speculative
- Whether the pilot has controls, escalation, fallback, and stop conditions

#### What it produces

- A validated portable file
- Lint findings with stable rule IDs
- A scenario comparison
- An ownership and control summary
- A role-impact and pathway reality check
- A local Markdown or HTML report

#### What it is not

WorkTransitionKit is not an employee-ranking system, layoff recommender, job-loss oracle, course marketplace, credential platform, or autonomous employment-decision tool. Version 0.1 has no server, accounts, database, or stored employee profiles.

#### Project status

The project is at the founding-hypothesis stage. The first test is intentionally narrow: can an external practitioner describe one real AI-related work transition and discover a material ownership, evidence, oversight, or pathway problem using the specification and local tools?

We welcome contributors from software, operations, workforce development, labor, education, policy, research, design, privacy, security, and lived experience of career transition.

#### Core principle

> Responsibility without authority is blame. Reskilling without opportunity is transferred risk.

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

Its first product is a portable `TRANSITION.yaml` file, a validator, an evidence-aware linter, a scenario comparator, and a local report generator.

Its long-term public mission is to make technological transition understandable, contestable, measurable, and less brutal.

Its commercial opportunity is to support organizations, governments, workers, and communities with diagnostics, facilitated redesign, implementation, assurance, and transition programs—without turning the open project into a full-time software operation before adoption justifies it.
