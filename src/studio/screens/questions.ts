/**
 * The questions this cannot answer.
 *
 * No data feeds a calculation here, and nothing on this screen is scored. The
 * only guarantee the product makes is the one it must not break: skipping is
 * allowed, hiding that it was skipped is not. So an unanswered question stays
 * visibly unanswered rather than quietly disappearing.
 *
 * The questions are ordered, and the order is deliberate. It runs from the
 * mechanical to the personal, because the last three are the ones people need
 * the first seven to be willing to answer.
 */

import { COPY, fill } from "../copy.ts";
import { el, mount } from "../dom.ts";
import { go, state, touch } from "../state.ts";
import { questionStates } from "../../core/questions.ts";
import type { Question } from "../../core/questions.ts";
import type { PromptAnswer } from "../../core/types.ts";

const C = COPY.questions;

/** Create the record lazily — an untouched question stays genuinely unanswered. */
function record(id: string): PromptAnswer {
  const project = state.project!;
  const existing = project.answers.find((a) => a.prompt_id === id);
  if (existing) return existing;

  const created: PromptAnswer = { prompt_id: id, answer: "" };
  project.answers.push(created);
  return created;
}

export function renderQuestions(root: HTMLElement): void {
  const project = state.project;
  if (!project) return go("start");

  const states = questionStates(project);
  const answered = states.filter((s) => s.answered).length;

  const counter = el(
    "p",
    { class: "muted" },
    fill(C.progress, { answered, total: states.length }),
  );

  /** Text only — safe to call while someone is typing into a box. */
  const repaint = () => {
    const now = questionStates(state.project!).filter((s) => s.answered).length;
    counter.textContent = fill(C.progress, { answered: now, total: states.length });
  };

  mount(
    root,
    el(
      "section",
      { class: "screen screen--narrow" },
      el("h1", {}, C.title),
      el("p", { class: "lede" }, C.lede),
      counter,
      ...states.map((s) => block(s.question, s.answer, repaint)),
      el(
        "div",
        { class: "screen__actions" },
        el(
          "button",
          { class: "btn btn--primary", onClick: () => go("report") },
          C.next,
        ),
      ),
    ),
  );
}

function block(
  question: Question,
  answer: PromptAnswer | undefined,
  repaint: () => void,
): HTMLElement {
  const status = el(
    "span",
    { class: `chip ${answer ? "chip--done" : "chip--flag"}` },
    answer ? C.answered : C.skipped,
  );

  const text = el("textarea", {
    class: "field__input field__input--area",
    rows: 3,
    placeholder: C.placeholder,
  });
  text.value = answer?.answer ?? "";
  text.addEventListener("input", () => {
    touch(() => {
      record(question.id).answer = text.value;
    });
    status.textContent = text.value.trim() === "" ? C.skipped : C.answered;
    status.className = `chip ${text.value.trim() === "" ? "chip--flag" : "chip--done"}`;
    repaint();
  });

  const role = el("input", {
    class: "field__input",
    type: "text",
    placeholder: C.byRolePlaceholder,
  });
  role.value = answer?.answered_by_role ?? "";
  role.addEventListener("input", () => {
    touch(() => {
      const target = record(question.id);
      if (role.value.trim() === "") delete target.answered_by_role;
      else target.answered_by_role = role.value;
    });
  });

  return el(
    "div",
    { class: "question" },
    el(
      "div",
      { class: "question__head" },
      el("span", { class: "question__name" }, question.name),
      status,
    ),
    el("p", { class: "question__ask" }, question.question),
    el("p", { class: "field__help" }, `${C.whyLabel}: ${question.why}`),
    el(
      "label",
      { class: "field" },
      el("span", { class: "field__label" }, C.answerLabel),
      text,
    ),
    el(
      "label",
      { class: "field field--half" },
      el("span", { class: "field__label" }, C.byRole),
      role,
      el("span", { class: "field__help" }, C.byRoleHelp),
    ),
  );
}
