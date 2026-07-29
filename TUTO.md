# Nelarvo, start to finish

A complete walkthrough for someone who has never seen this before. About
thirty minutes. No prior knowledge assumed.

By the end you will have built a small analysis from scratch and be able to
read what it tells you.

---

## What this is for

Someone in your organization is about to put an AI tool into a process. The
usual questions get asked — what will it cost, how fast is it, when can we
start. The question that rarely gets asked is: **what does this do to the
people currently doing that work?**

Not as a feeling. As a number.

Nelarvo answers it by doing something dull and reliable. You describe the work
as it happens today: each step, who does it, how many per week, how long each
one takes. Multiply volume by duration and you have hours. Then you say what
the technology takes over, and it recomputes the hours.

Out of that falls something most transformation plans miss entirely:

- work does not vanish, it **moves** — often into new work nobody does yet;
- a role does not disappear, it **changes shape**;
- the training people actually need turns out to be **smaller and more
  specific** than the headline suggests.

## What this is not

It will not tell you whether to automate anything. It will not tell you what
your headcount should be. It never asks for an employee's name and it cannot
rank anybody.

It tells you the size of the question. You still have to answer it.

---

## Before you start

You need [Node.js](https://nodejs.org) version 22.6 or newer. Check with:

```bash
node --version
```

Then, from the project folder:

```bash
node src/cli/index.ts studio
```

A window opens at `http://127.0.0.1:7777`. Everything stays on your machine —
there is no account, no server, and nothing is sent anywhere.

---

## The example: expense claims

We will analyse something small enough to hold in your head. A 200-person
company processes about **200 expense claims a week**. Finance is looking at an
assistant that reads receipts and checks them against the expense policy.

Today, five things happen to every claim.

Click **Start a new case**, type `Employee expense claims`, and press Create.

### Step 1 — Fill in the basics

You land on **The case**. Fill in what you know. Two fields matter more than
the rest.

**Has this already been decided?** Answer honestly. Choose *Still open* here.
If you ever pick *Already decided*, the report says so on its first page and
you cannot switch that off — a report that admits the decision was already made
is more useful than one pretending otherwise, and everyone in the room already
knows which it is.

**Count the work per week or per month?** Leave it on *per week*. Every number
after this uses it.

Click **Next: the work as it is today**.

### Step 2 — Describe the work as it happens now

This is the longest part, and the only part that needs real thinking. Add five
steps with **Add a step**. For each one you need five things: what happens, who
does it, how many per week, how long each takes, and what kind of work it is.

| What happens | Who | Per week | Minutes each | Kind of work |
|---|---|---|---|---|
| Check the receipts are attached and readable | Admin Assistant | 200 | 5 | Data handling |
| Match each line against the expense policy | Admin Assistant | 200 | 8 | Routine judgment |
| Decide the unusual and borderline claims | Finance Officer | 35 | 15 | Complex judgment |
| Explain a refusal to the employee | Finance Officer | 20 | 12 | Relationship |
| Enter approved claims into payroll | Admin Assistant | 200 | 3 | Data handling |

As you type the volume and the duration, the hours appear next to the step. The
panel on the right builds up a running total.

**Two things worth doing properly.**

*Capabilities.* On each step there is a box asking what someone needs to be able
to do this. Use ordinary words, separated by commas — `reading receipts,
attention to detail`. This is what later turns into the training picture, and it
is worthless if you skip it.

*Decision points.* On "Decide the unusual and borderline claims", tick **This is
a decision point**. It is a choice with consequences, not just work being
performed.

When you have all five, the panel shows **66.1 hrs/week · 1.8 FTE**. That is
already something most managers have never seen about their own process.

### Step 3 — Say what changes

Click **What changes**. Every step is listed with a dropdown.

| Step | Choose | Then |
|---|---|---|
| Check the receipts | Tool does it, a human reviews exceptions | Human share: **10** |
| Match against policy | Tool does it, a human reviews exceptions | Human share: **20** |
| Decide unusual claims | Stays human, unchanged | — |
| Explain a refusal | Stays human, unchanged | — |
| Enter into payroll | Automated by fixed rules | — |

**Human share** is the portion of the volume a person still touches. It is the
single most important number you will enter, and the tool will never guess it
for you — guessing it would be inventing the answer. Use what you actually
believe, not what the vendor's slide says.

Now the part everyone forgets. On **Match against policy**, open *Does this
create work nobody does today?* and add:

> Review what the assistant flagged — Admin Assistant — 200 per week — 2 minutes

And on **Decide unusual claims**, add:

> Handle claims the assistant escalates — Finance Officer — 30 per week — 15 minutes

Reviewing what a machine produced is real work. So is absorbing what it pushes
back to a human. If you leave these out, your analysis will show a saving that
will not appear.

### Step 4 — Read what it means

Click **What it means**. Nothing to fill in — everything here is computed from
what you already entered.

```
66.1 hrs/week → 33.9 hrs/week   -49%
1.8 → 0.9 full-time equivalent
14.2 hrs of that is work nobody does today
```

---

## How to read this

**The headline is not the story.** Yes, 49%. But look at the second line: of the
33.9 hours remaining, **14.2 are work that did not exist before**. Nearly half
the "new" workload is supervising the assistant and handling what it escalates.
A plan built on the 49% alone would be wrong by that much.

**Now the part that matters.**

```
ADMIN ASSISTANT          1.4 → 0.4 FTE
  Data handling           50% → 12%
  Routine judgment        50% → 39%
  Supervision              0% → 49%

FINANCE OFFICER          0.3 → 0.5 FTE
  Complex judgment        69% → 80%
  Relationship            31% → 20%
```

Read those two blocks slowly, because between them they contain the whole
argument.

The **Admin Assistant** role shrinks by roughly a full person's worth of hours —
that is a real question and the tool does not pretend otherwise. But look at
what the *remaining* work is. Today the job is 100% data handling and routine
judgment. After, half of it is **supervision**: judging whether the assistant
got it right. That is a different job requiring different confidence, and it did
not exist last month.

The **Finance Officer** role *grows*, in a workflow that shrank by half. Because
the assistant escalates more than the old process did. This is extremely common
and almost never in the business case.

And look at the Relationship row: 31% → 20%. Explaining refusals to employees
did not change at all — it is still 4 hours a week, exactly as before. Its share
fell only because everything around it shrank. **This is why hours and
percentages are always shown together.** A percentage on its own will mislead
you.

**What people will need to be able to do**

```
+14.2 hrs   judging assistant output
 +7.5 hrs   judgement under ambiguity

-36.3 hrs   attention to detail
-15.0 hrs   reading receipts
-10.0 hrs   data entry
```

This is the reskilling conversation, and it is now specific. Not "upskill the
finance team" — one named thing, *judging assistant output*, worth 14 hours a
week, that nobody in this process currently does.

That is teachable in an afternoon and provable in a month. Which is the point:
the transition is almost always smaller and more concrete than the headline
makes it sound. You just have to compute it instead of arguing about it.

### Step 5 — The report

Click **Report**, then **Print or save as PDF**. Choose "Save as PDF" as the
destination.

You now have a document with the workflow before and after, each role's
composition in both hours and shares, what moves, the capability shift, and —
deliberately — everything the analysis does *not* know.

That last section matters. A report with nothing flagged is not proof that a
transformation is sound. It only means the things this tool can check are in
place.

---

## Doing this with your own workflow

**Start with one process, not a department.** "Expense claims", not "Finance".
Between five and fifteen steps is the right size.

**You will not have the numbers.** Almost nobody does. Estimate, and mark each
step honestly under *How do you know this?* — the tool keeps unknowns out of
every headline figure and reports them separately. An honest estimate beats a
missing analysis; a confident wrong number is much worse than an admitted gap.

**Ask the person who does the work, not only their manager.** The gap between
those two accounts is usually the most interesting finding of the whole
exercise.

**Do the "work this creates" part.** It is the one people skip and the one that
changes the answer.

**Model more than one future.** Doing nothing is a future. Simplifying the
policy so fewer claims need judgement is a future. The tool will never tell you
which is best, and neither will anyone honest.

---

## Common questions

**Where is my file?** In the folder where you started the tool, named after your
case. It is plain text — you can put it in version control, mail it, or read it
in any editor.

**Do I have to use the window?** No. Everything works from the terminal too:

```bash
node src/cli/index.ts calc examples/expense-claims.nelarvo.json
node src/cli/index.ts report examples/expense-claims.nelarvo.json
```

**Can I compare two futures?** Yes, by keeping two case files and running each.
Switching between them inside the window is not built yet.

**Is my data sent anywhere?** No. There is no account, no database, no analytics,
and no AI involved in any calculation. The only network the tool uses is to
`127.0.0.1` — your own machine talking to itself.

**Why does it refuse to give one score?** Because a single number would be gamed
within a year, and it would imply the tool has an opinion about whether your
transformation is wise. It does not. It counts hours.

---

## The two examples that ship with it

- `examples/expense-claims.nelarvo.json` — this walkthrough, five steps
- `examples/claims-intake.nelarvo.json` — insurance claims, twelve steps and
  four roles, closer to a real engagement

```bash
node src/cli/index.ts calc examples/claims-intake.nelarvo.json
```

---

## Where to go next

[`README.md`](README.md) for what the project is.
[`docs/MEMORANDUM.md`](docs/MEMORANDUM.md) for why it exists, what it refuses to
do, and how it is meant to be used with people rather than on them.
