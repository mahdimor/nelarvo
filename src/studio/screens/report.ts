/**
 * The report screen.
 *
 * The document itself is built by the core, so what Studio previews and what
 * the command line writes are the same bytes. The preview lives in an iframe
 * so the report's own stylesheet cannot leak into the application, and so
 * printing prints the report rather than the surrounding window.
 */

import { COPY } from "../copy.ts";
import { el, mount } from "../dom.ts";
import { go, state } from "../state.ts";
import { renderReportHtml } from "../../core/report/html.ts";

const C = COPY.report;

export function renderReport(root: HTMLElement): void {
  const project = state.project;
  if (!project) return go("start");

  const hasSomething =
    project.steps.length > 0 && (project.scenarios[0]?.assignments.length ?? 0) > 0;

  if (!hasSomething) {
    mount(
      root,
      el(
        "section",
        { class: "screen" },
        el("h1", {}, C.title),
        el("p", { class: "muted" }, C.empty),
      ),
    );
    return;
  }

  const html = renderReportHtml(project);
  const frame = el("iframe", {
    class: "report__frame",
    title: C.title,
    srcdoc: html,
  });

  const print = () => {
    const win = (frame as HTMLIFrameElement).contentWindow;
    if (!win) return;
    win.focus();
    win.print();
  };

  const download = () => {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = el("a", {
      href: url,
      download: `${project.case.id}-report.html`,
    });
    link.click();
    // Revoking immediately can cancel the download in some browsers.
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  };

  mount(
    root,
    el(
      "section",
      { class: "screen" },
      el(
        "div",
        { class: "report__head" },
        el(
          "div",
          {},
          el("h1", {}, C.title),
          el("p", { class: "lede" }, C.lede),
        ),
        el(
          "div",
          { class: "report__actions" },
          el("button", { class: "btn btn--primary", onClick: print }, C.print),
          el("button", { class: "btn", onClick: download }, C.download),
        ),
      ),
      el("p", { class: "muted small" }, C.hint),
      frame,
    ),
  );
}
