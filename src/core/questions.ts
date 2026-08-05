/**
 * The ten questions.
 *
 * These are questions, not checks, and several of them were once candidate
 * checks that got demoted on purpose. No deterministic rule can detect whether
 * a measure rewards the wrong behaviour, or whether anyone actually disagreed.
 * A question that is always asked beats a check that fires unreliably, because
 * an unreliable check teaches people to ignore findings.
 *
 * Nothing here is scored. An answer is not marked good or bad, and answering
 * all ten proves nothing about the transformation. What the report guarantees
 * is narrower and more useful: **skipping a question is allowed, hiding that it
 * was skipped is not.**
 *
 * Identifiers are stable forever. A retired question keeps its number reserved,
 * so an old case file never has its answers silently re-pointed at a different
 * question.
 */

import type { Project, PromptAnswer } from "./types.ts";

export interface Question {
  /** Stable forever. Never renumbered, never reused. */
  id: string;
  /** Short name, for a list or a heading. */
  name: string;
  /** What actually gets asked, in a room, out loud. */
  question: string;
  /** Why this is a question and not a check. */
  why: string;
}

export const QUESTIONS: readonly Question[] = [
  {
    id: "P01",
    name: "Measure distortion",
    question: "Could any measure here reward behaviour that damages the outcome?",
    why: "No rule can detect a target that quietly rewards the wrong thing.",
  },
  {
    id: "P02",
    name: "Invisible work",
    question:
      "Is work being taken off a role that still needs doing? Who does it now?",
    why: "Work written down nowhere cannot be counted, only asked about.",
  },
  {
    id: "P03",
    name: "Who carries the cost",
    question: "Who captures the savings, and who carries the cost of the change?",
    why: "The party choosing the change is often not the party carrying it.",
  },
  {
    id: "P04",
    name: "Can it be challenged",
    question:
      "Can the person accountable inspect and challenge what the machine recommended, on a busy day?",
    why: "Oversight nobody has time to exercise is oversight on paper only.",
  },
  {
    id: "P05",
    name: "Reversibility",
    question: "What would make you stop or reverse this, and who is allowed to call it?",
    why: "A change with no stopping condition has no owner, whatever the plan says.",
  },
  {
    id: "P06",
    name: "Exception reality",
    question: "How many exceptions do you really expect, and who handles them?",
    why: "The estimate in the room is usually lower than the first month proves.",
  },
  {
    id: "P07",
    name: "Disagreement",
    question: "Has anyone materially disagreed with this? Is that written down here?",
    why: "Disagreement that leaves no trace comes back later as resistance.",
  },
  {
    id: "P08",
    name: "Purpose conflict",
    question:
      "Could anything gathered here later be used for discipline or dismissal? What prevents that?",
    why: "Support data becoming performance data is the fastest way to lose trust.",
  },
  {
    id: "P09",
    name: "Opportunity reality",
    question:
      "Is there real demand for the roles people would move into, or only training available?",
    why: "Training demand is not employment demand, and the difference lands on a person.",
  },
  {
    id: "P10",
    name: "Falsification",
    question: "Six months from now, what result would tell you this was a mistake?",
    why: "A plan that cannot be wrong cannot be checked.",
  },
];

export interface QuestionState {
  question: Question;
  /** The recorded answer, if there is one worth showing. */
  answer?: PromptAnswer;
  answered: boolean;
}

/** An answer is only an answer when it has something in it. */
function usable(a: PromptAnswer | undefined): PromptAnswer | undefined {
  return a && a.answer.trim() !== "" ? a : undefined;
}

/** Every question, in order, with whatever the analyst recorded against it. */
export function questionStates(project: Project): QuestionState[] {
  const byId = new Map((project.answers ?? []).map((a) => [a.prompt_id, a]));
  return QUESTIONS.map((question) => {
    const answer = usable(byId.get(question.id));
    return { question, answer, answered: answer !== undefined };
  });
}

export function unansweredQuestions(project: Project): Question[] {
  return questionStates(project)
    .filter((s) => !s.answered)
    .map((s) => s.question);
}
