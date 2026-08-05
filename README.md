# Nelarvo

**Work changes. Human value carries forward.**
*Le travail change. La valeur humaine continue.*

Nelarvo maps how work changes when machines take part of it — and where the people go.

You describe one workflow as it runs today: each step, who does it, how many per week, how long each takes. You model what the technology takes over. Nelarvo computes what that does to every role, step by step and hour by hour, and turns the work that *grows* into the capabilities people will actually need.

---

## What it looks like

```
  THE WORKFLOW
    12 steps · 4 roles · 709.9 hrs/week · 18.9 FTE
    after: 442.4 hrs/week · 11.8 FTE  (-38%)
    of which 136.3 hrs/week is work nobody does today

  CLAIMS SPECIALIST — 12.2 FTE -> 7.2 FTE  (-185.2 hrs/week)
    Data handling       31% ->   4%   down
    Routine judgment    36% ->  19%   down
    Complex judgment    18% ->  23%   up
    Relationship        15% ->  26%   up
    Supervision          0% ->  28%   up

  WHAT MOVES
      -129.5 hrs  Extract facts from submitted documents
         +60 hrs  Handle additional AI-escalated exceptions  [new work]
         +35 hrs  Review AI extraction output  [new work]

  THE REAL TRAINING REQUIREMENT
    ai output evaluation — Claims Specialist, Senior Adjuster
```

Three things fall out of that which most transformation plans miss.

**Work does not vanish, it moves.** 136 of the 268 hours "saved" reappear as work nobody does today — reviewing what the machine produced, and absorbing the exceptions it escalates.

**The role does not disappear, it changes shape.** Data handling falls from 31% to 4%. Judgment, customer contact and supervision rise from 33% to 77%. That is the reskilling conversation, and it is now a number rather than an opinion.

**The training requirement is smaller and more specific than the headline.** Three of the four growing capabilities are things these people already have. Only one is genuinely new. That is plannable.

## Try it

```bash
node src/cli/index.ts studio
```

That opens the window. Requires Node 22.6+ — it runs the TypeScript directly, so
there is no build step and nothing to install.

**New here? [TUTO.md](TUTO.md) walks you through a complete analysis in about
thirty minutes**, using a small five-step example you can follow end to end.

Or stay in the terminal:

```bash
node src/cli/index.ts calc examples/expense-claims.nelarvo.json
node src/cli/index.ts report examples/claims-intake.nelarvo.json
```

## How it works

One plain JSON file per case, in your own folder, under your own version control. Nothing is sent anywhere. There is no server, no account, no database, and no AI in any calculation.

```
src/core/calc/     the engine — pure functions, no I/O, no AI, ever
src/core/types.ts  the data model
src/core/parse.ts  reading and writing the project file
src/cli/           the command line
examples/          a complete worked case
docs/METHOD.md     how to run one case in a room, and what to ask
docs/MEMORANDUM.md why this exists, what it refuses to do, how it is governed
docs/BUILD-SPEC.md what is being built, sprint by sprint
```

Every number traces back to one multiplication: **volume × duration = hours**. If those numbers were ever subtly wrong the product would be worthless, so the engine is deliberately dull and the tests use round figures anyone can check by hand.

The multiplication is exact. The inputs are estimates, so the numbers that decide the answer can carry a range — the lowest and highest you would defend. The report then shows a band instead of a single figure, and names the one number that decides most of its width. In the reference case that is the volume of escalations the machine creates: it alone decides 90 of the 150 hours the answer can move, which makes it the thing worth measuring rather than estimating.

```bash
npm test
```

## What it is not

Not an employee-ranking system, a layoff recommender, a job-loss oracle, a course marketplace, or an automated employment-decision tool. It never asks for an employee's name, and it will not tell you what your headcount should be — it tells you the size of the question.

Nelarvo produces counts, not a score. There is no grade, no badge, no maturity level. A run with no findings is not proof that a transformation is sound.

> Responsibility without authority is blame.
> Reskilling without opportunity is transferred risk.

## Licence

Code is Apache 2.0. The method in `docs/` is CC BY 4.0. The reference cases in `examples/` are CC BY-SA 4.0. You may use any of it commercially, including inside a closed product — see [LICENSES.md](LICENSES.md) for what that means in practice and why the three differ.

## Status

Early. The calculation engine, the command line, the guided interface and the report work, the workflow is drawn before and after, and the answer is reported as a band when you enter ranges. The ownership checks, the pathway analysis and measured parameters are deferred, each with a trigger rather than a date. See [docs/BUILD-SPEC.md](docs/BUILD-SPEC.md) for the sprint plan and [docs/MEMORANDUM.md](docs/MEMORANDUM.md) for the thesis, the refusal criteria, and the commercial model — stated openly rather than discovered later.

The strongest signal this is working will be someone producing a useful case file without the founder in the room.
