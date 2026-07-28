# WorkTransitionKit

**An open specification for examining who owns AI-changed work—and whether affected people have a real path forward.**

AI transformation is often documented as a technology plan. The organization chooses a tool, predicts efficiency, and discusses training later. Responsibility may be assigned without authority, nominal human review may be impossible at real volume, and proposed career pathways may have no employer waiting at the other end.

WorkTransitionKit makes those gaps visible in a portable `TRANSITION.yaml` file.

> Responsibility without authority is blame.  
> Reskilling without opportunity is transferred risk.

## Planned v0.1

Version 0.1 is a two-week, local-only project:

- four domain objects: `case`, `decisions`, `role_impacts`, and `pathways`;
- ten deterministic structural checks;
- twelve questions requiring human judgment;
- factual completeness counts instead of a quality score;
- claims-review and permit-review examples;
- no server, accounts, database, telemetry, or required AI provider.

Planned commands:

```text
wtk init my-transition
wtk validate my-transition/TRANSITION.yaml
wtk lint my-transition/TRANSITION.yaml
wtk render my-transition/TRANSITION.yaml
```

## What the report says

A report may say:

```text
14 decisions described
6 have no named owner
9 assign responsibility without stated authority
4 automate work without a stated escalation path
7 of 12 review prompts remain unanswered
2 of 3 pathways name no real opportunity provider
```

These are completeness facts, not a responsibility score, certification, maturity grade, or automated verdict.

## What it asks

The toolkit checks whether required information is present, including ownership, authority, escalation, metrics, evidence status, affected-worker review, pathway providers, fallback, and pilot reversibility.

It also makes people answer questions software cannot honestly decide:

- Can humans meaningfully review the expected volume?
- Could the chosen metric reward the wrong behavior?
- Does supposedly removed work still need doing?
- Who receives the automation benefit and who carries transition cost?
- Does the destination opportunity genuinely exist?
- What happens if the pathway fails?

## What it is not

WorkTransitionKit is not an employee-ranking system, layoff recommender, job-loss oracle, course marketplace, credential platform, or autonomous employment-decision tool. Passing its checks does not prove that a transformation is responsible, safe, legal, or likely to succeed.

## Project status

The project is currently a founding specification. The first release is deliberately constrained. The strongest early success signal will be a third party producing a useful file without the founder in the room.

Contributions will be welcome from operations, workforce development, labor, education, public policy, AI governance, security, software, and people with lived experience of career transition.

See [`MEMORANDUM.md`](MEMORANDUM.md) for the complete thesis, specification, safeguards, commercial model, and evidence-gated roadmap.