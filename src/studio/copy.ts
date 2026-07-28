/**
 * Every word the user reads. All of it, in one place.
 *
 * This file is product, not decoration. The plain language is most of the
 * value here — an analyst who meets consultancy vocabulary on screen three
 * stops trusting the numbers on screen six.
 *
 * Rules for anything added here:
 *   - No sentence over 25 words.
 *   - Banned: leverage, synergy, journey, roadmap, empower, unlock, holistic,
 *     seamless, best-in-class, robust framework.
 *   - Never say JSON, schema, lint, validate, or a check identifier.
 *   - Say what the analyst would say out loud to a colleague.
 */

import { BRAND } from "../core/brand.ts";

export const COPY = {
  app: {
    name: BRAND.name,
    tagline: BRAND.tagline_en,
    unsaved: "Unsaved changes",
    saved: "Saved",
    saving: "Saving...",
    saveError: "Could not save. Your work is still here — try again.",
    back: "Back",
    save: "Save",
    estimateNote:
      "These are estimates built from the volumes and durations you enter.",
  },

  nav: {
    start: "Start",
    caseSetup: "The case",
    currentState: "Work today",
    futureState: "What changes",
    results: "What it means",
  },

  future: {
    title: "What changes",
    lede:
      "For each step, say what happens to it. Nothing here is a recommendation — " +
      "the tool records what you decide and shows you what it costs.",
    noSteps: "Add some steps under “Work today” first.",
    unassigned: "Not yet decided — counted as unchanged",
    totals: {
      heading: "Before and after",
      before: "Today",
      after: "After",
      newWork: "of that, work nobody does today",
      unchanged: "No changes assigned yet.",
    },
    allocation: {
      label: "What happens to this step?",
      options: {
        human: "Stays human, unchanged",
        human_ai_assisted: "Human does it, the tool assists",
        ai_full_review: "Tool does it, a human reviews every one",
        ai_exception_review: "Tool does it, a human reviews exceptions",
        rule_automated: "Automated by fixed rules",
        machine: "Done by a machine",
        outsourced: "Handled outside",
        eliminated: "The work stops",
        redesigned: "Redesigned into something different",
        unresolved: "Not yet decided",
      },
    },
    humanShare: {
      label: "What share still passes through a person?",
      help:
        "Out of 100. This is the number the whole analysis rests on, so use " +
        "what you actually believe, not what the vendor claims.",
    },
    newMinutes: {
      label: "How long does the human part take now?",
      help: "Minutes. Leave empty if it is unchanged.",
    },
    creates: {
      heading: "Does this create work nobody does today?",
      help:
        "Reviewing what the tool produced, handling what it escalates. This is " +
        "where automation savings usually go, and it is almost always missed.",
      add: "Add work this creates",
      remove: "Remove",
      name: "What is the new work?",
      role: "Who does it?",
      volume: "How many per {period}?",
      minutes: "How long each?",
    },
  },

  results: {
    title: "What it means",
    lede: "Everything here is computed from what you entered. Nothing is added.",
    empty:
      "Assign what happens to a few steps under “What changes”, and the picture " +
      "will appear here.",
    headline: {
      heading: "The workflow",
      newWork: "of that is work nobody does today",
      unassessed:
        "{hours} hrs is marked as not yet known. It is kept out of every figure above.",
    },
    roles: {
      heading: "What happens to each role",
      before: "Today",
      after: "After",
      shrinks: "What shrinks",
      grows: "What grows",
      brandNew: "What is new",
      authorityNote:
        "This tool does not tell you what to do about a change in headcount. " +
        "It tells you the size of the question.",
    },
    moves: {
      heading: "What moves",
      newTag: "new work",
    },
    capabilities: {
      heading: "What people will need to be able to do",
      rising: "Needed more",
      falling: "Needed less",
      none: "Tag some steps with capabilities and this will fill in.",
    },
  },

  start: {
    title: "What is changing at work, and does anyone actually own it?",
    lede:
      "Describe one workflow as it runs today, model what the technology takes over, " +
      "and see what it does to every role — what shrinks, what grows, and what people " +
      "will need to be able to do.",
    privacy:
      "Everything stays on your computer. Nothing is sent anywhere.",
    newCase: "Start a new case",
    openExisting: "Open a case",
    lookAtExample: "Look at an example first",
    noCases: "No cases in this folder yet.",
    recentTitle: "Cases in this folder",
    newPrompt: "What workflow are you looking at?",
    newPlaceholder: "Auto claims intake",
    newHelp:
      "One area of work, not a whole department. You can change this later.",
    create: "Create",
  },

  caseScreen: {
    title: "First, the basics",
    lede: "About five minutes. Nothing here is permanent.",
    fields: {
      scope: {
        label: "What work are we talking about?",
        help:
          "One area, not the whole organization. “Personal auto claims”, " +
          "not “the insurance company”.",
        placeholder: "Personal auto claims intake",
      },
      organization: {
        label: "Organization",
        help: "",
        placeholder: "Northwind Insurance",
      },
      boundary_start: {
        label: "What starts this work?",
        help: "The event that begins the workflow.",
        placeholder: "First notice of loss received",
      },
      boundary_end: {
        label: "What finishes it?",
        help: "The point where this workflow is done.",
        placeholder: "Settlement communicated and claim closed",
      },
      technology: {
        label: "What is being introduced?",
        help: "The tool, model, or automation under consideration.",
        placeholder: "Document extraction and recommendation assistant",
      },
      purpose: {
        label: "Why are you doing this analysis?",
        help: "",
        placeholder: "Understand what changes before committing to a rollout",
      },
      sponsor_role: {
        label: "Whose budget or decision is this?",
        help:
          "A job title. Not a person's name — this file never needs names.",
        placeholder: "VP Claims Operations",
      },
      maintainer_role: {
        label: "Who is keeping this analysis honest?",
        help: "Usually you. A role, not a name.",
        placeholder: "Business Analyst, Claims Transformation",
      },
    },
    decisionStatus: {
      label: "Has this already been decided?",
      help:
        "Answer honestly. A report that says “already decided” is more " +
        "useful than one that pretends otherwise, and everyone in the room " +
        "already knows which it is.",
      options: {
        open: "Still open",
        partially_decided: "Partly decided",
        already_decided: "Already decided",
      },
      warnAlreadyDecided:
        "Noted. The report will say this on its first page, and that cannot be " +
        "turned off. The findings will describe conditions, not alternatives.",
    },
    period: {
      label: "Count the work per week or per month?",
      help: "Pick whichever your volumes come in. Everything will use it.",
      options: { week: "Per week", month: "Per month" },
    },
    alternatives: {
      label: "What other options were looked at?",
      help:
        "One per line. Leave it empty if none were — that is worth knowing too.",
      placeholder: "Keep it fully human\nBuy a different tool\nDo nothing",
    },
    next: "Next: the work as it is today",
  },

  steps: {
    title: "The work as it is today",
    lede:
      "Add each step of the workflow. Most workflows have between eight and " +
      "twenty steps worth describing. Start with the ones that take the most time.",
    minimumNote:
      "A step only needs a name, who does it, how many, how long, and what kind of " +
      "work it is. Everything else can wait.",
    addStep: "Add a step",
    empty: "No steps yet. Add the first thing that happens.",
    editing: "Editing step",
    deleteStep: "Delete this step",
    deleteConfirm: "Delete this step? This cannot be undone.",
    deleteBlockedByDecision:
      "This step is linked to a decision you have described. Deleting it will " +
      "leave that decision without a home in the workflow. Delete anyway?",
    done: "Done",

    fields: {
      name: {
        label: "What happens in this step?",
        help: "Start with a verb. “Extract facts from submitted documents”.",
        placeholder: "Extract facts from submitted documents",
      },
      role: {
        label: "Who does it?",
        help: "A job title. Several steps can share the same role.",
        placeholder: "Claims Specialist",
      },
      volume: {
        label: "How many per {period}?",
        help: "An estimate is fine. Mark how sure you are below.",
        placeholder: "700",
      },
      minutes: {
        label: "How long does each one take?",
        help: "Minutes. Again, an estimate is fine.",
        placeholder: "12",
      },
      workType: {
        label: "What kind of work is this?",
        help:
          "This is what lets us show how each role changes shape. Pick the closest.",
      },
      capabilities: {
        label: "What does someone need to be able to do this?",
        help:
          "Comma separated. These become the training picture later, so use " +
          "ordinary words: “document reading, policy knowledge”.",
        placeholder: "document reading, policy knowledge",
      },
      failureMode: {
        label: "What goes wrong when this step goes wrong?",
        help: "Optional, but it is usually the most interesting answer.",
        placeholder: "Missed exclusion clause",
      },
      evidence: {
        label: "How do you know this?",
        help: "Be honest. Unknowns are reported separately, never hidden.",
      },
      decisionPoint: {
        label: "This is a decision point",
        help:
          "A choice with consequences, not just work performed. We will come " +
          "back to these and ask who owns them.",
      },
      invisibleWork: {
        label: "This appears in no procedure",
        help:
          "Something people actually do that is written down nowhere. " +
          "Automation plans usually break here.",
      },
      notes: { label: "Anything else worth recording?", help: "", placeholder: "" },
    },

    workTypes: {
      data_handling: {
        label: "Data handling",
        help: "Collecting, entering, extracting, moving information",
      },
      routine_judgment: {
        label: "Routine judgment",
        help: "Applying clear rules to cases",
      },
      complex_judgment: {
        label: "Complex judgment",
        help: "Weighing ambiguous evidence, handling exceptions",
      },
      relationship: {
        label: "Relationship",
        help: "Communicating with, supporting, or persuading people",
      },
      coordination: {
        label: "Coordination",
        help: "Scheduling, chasing, handoffs",
      },
      supervision: {
        label: "Supervision",
        help: "Checking what a machine or another person produced",
      },
      physical: {
        label: "Physical",
        help: "Moving, handling, inspecting things",
      },
      improvement: {
        label: "Improvement",
        help: "Changing the process itself",
      },
    },

    evidenceLevels: {
      observed: "I have watched this happen",
      documented: "It is in a document or system record",
      reported: "Someone who does the work told me",
      inferred: "I worked it out from other information",
      proposed: "It is part of a proposed design",
      disputed: "People disagree about this",
      unknown: "I do not know yet",
    },

    totals: {
      heading: "This workflow, as it stands",
      steps: "steps",
      roles: "roles",
      hours: "hrs",
      fte: "FTE",
      splitHeading: "Where the time goes",
      firstStepHint:
        "Add a few steps and the shape of this workflow will appear here.",
      unassessedNote:
        "{hours} hrs of this is marked as not yet known. It will be reported " +
        "separately and kept out of any headline figure.",
    },
  },
} as const;

/** Replace {name} placeholders. */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? String(values[key]) : whole,
  );
}
