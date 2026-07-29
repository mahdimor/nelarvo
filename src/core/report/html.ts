/**
 * The report.
 *
 * A pure function from a project to one self-contained HTML document. No
 * filesystem, no network, no template engine — the same string is previewed in
 * Studio and written by the command line, so there is only ever one report.
 *
 * Two rules are enforced here rather than trusted:
 *   - The `person` field is never rendered. Not once, not anywhere.
 *   - A case recorded as already decided says so at the top, and there is no
 *     parameter that turns that off.
 */

import { BRAND } from "../brand.ts";
import type { Project, WorkType } from "../types.ts";
import { WORK_TYPE_LABELS } from "../types.ts";
import {
  fallingCapabilities,
  risingCapabilities,
  roleComposition,
  stepShifts,
  workflowTotals,
  type RoleComposition,
  type StepShift,
  type WorkTypeSlice,
} from "../calc/index.ts";

/** Escape for HTML text and attribute contexts. */
export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const f = (n: number, places = 1): string => {
  const factor = 10 ** places;
  return String(Math.round(n * factor) / factor);
};

const signed = (n: number): string => (n > 0 ? `+${f(n)}` : f(n));

const WORK_TYPE_FILL: Record<WorkType, string> = {
  data_handling: "#6b83a8",
  routine_judgment: "#4f9d94",
  complex_judgment: "#6f5fa8",
  relationship: "#c08a4a",
  coordination: "#4d90a8",
  supervision: "#8f6aa0",
  physical: "#7d8a5c",
  improvement: "#b06a80",
};

function bar(slices: WorkTypeSlice[]): string {
  if (slices.length === 0) return `<div class="bar bar--empty"></div>`;
  const segments = slices
    .map(
      (s) =>
        `<span class="seg" style="flex:${s.hours};background:${WORK_TYPE_FILL[s.work_type]}"` +
        ` title="${esc(WORK_TYPE_LABELS[s.work_type])}">` +
        `${s.share >= 10 ? `${s.share}%` : ""}</span>`,
    )
    .join("");
  return `<div class="bar">${segments}</div>`;
}

function roleSection(r: RoleComposition, shifts: StepShift[], period: string): string {
  const mine = shifts.filter(
    (s) => s.role_before === r.role || s.role_after === r.role,
  );
  const shrinking = mine.filter((s) => s.delta < -0.05).slice(0, 4);
  const growing = mine.filter((s) => s.delta > 0.05 && !s.is_new).slice(0, 4);
  const brandNew = mine.filter((s) => s.is_new);

  const types = [
    ...new Set([
      ...r.before.by_work_type.map((s) => s.work_type),
      ...r.after.by_work_type.map((s) => s.work_type),
    ]),
  ];

  const rows = types
    .map((t) => {
      const b = r.before.by_work_type.find((s) => s.work_type === t);
      const a = r.after.by_work_type.find((s) => s.work_type === t);
      const bs = b?.share ?? 0;
      const as = a?.share ?? 0;
      const dir = as > bs ? "up" : as < bs ? "down" : "same";
      return `<tr>
        <td><span class="dot" style="background:${WORK_TYPE_FILL[t]}"></span>${esc(WORK_TYPE_LABELS[t])}</td>
        <td class="num">${f(b?.hours ?? 0)}</td>
        <td class="num">${bs}%</td>
        <td class="num">${f(a?.hours ?? 0)}</td>
        <td class="num dir-${dir}">${as}%</td>
      </tr>`;
    })
    .join("");

  const list = (label: string, items: StepShift[]) =>
    items.length === 0
      ? ""
      : `<p class="prose"><strong>${esc(label)}:</strong> ${items
          .map((s) => `${esc(s.name)} (${signed(s.delta)} hrs)`)
          .join(", ")}</p>`;

  return `<section class="role">
    <h3>${esc(r.role)}</h3>
    <p class="role__fte">${f(r.before.fte)} &rarr; ${f(r.after.fte)} full-time equivalent
      <span class="muted">(${signed(r.hours_delta)} hrs/${esc(period)})</span></p>
    <div class="bars">
      <span class="barlabel">Today</span>${bar(r.before.by_work_type)}
      <span class="barlabel">After</span>${bar(r.after.by_work_type)}
    </div>
    <table>
      <thead><tr><th>Kind of work</th><th class="num">Hrs today</th><th class="num">%</th>
        <th class="num">Hrs after</th><th class="num">%</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${list("What shrinks", shrinking)}
    ${list("What grows", growing)}
    ${list("What is new", brandNew)}
  </section>`;
}

export function renderReportHtml(project: Project, scenarioId?: string): string {
  const c = project.case;
  const period = c.period;
  const totals = workflowTotals(project, scenarioId);
  const roles = roleComposition(project, scenarioId).filter(
    (r) => r.before.hours > 0 || r.after.hours > 0,
  );
  const shifts = stepShifts(project, scenarioId).filter(
    (s) => Math.abs(s.delta) > 0.05,
  );
  const rising = risingCapabilities(project, scenarioId);
  const falling = fallingCapabilities(project, scenarioId);

  const unknowns = [
    ...project.steps
      .filter((s) => s.evidence === "unknown" || s.evidence === "disputed")
      .map((s) => `${s.name} — recorded as ${s.evidence}`),
    ...project.steps
      .filter((s) => s.exposure.feasible === "unknown")
      .map((s) => `${s.name} — we do not know what the technology can take`),
  ];

  const decidedBanner =
    c.decision_status === "already_decided"
      ? `<p class="banner">This transformation is recorded as already decided.
         The figures below describe conditions. They do not indicate that
         alternatives were open.</p>`
      : "";

  const alternatives =
    c.alternatives_considered.length > 0
      ? `<p><strong>Other options examined:</strong> ${c.alternatives_considered
          .map(esc)
          .join("; ")}</p>`
      : c.decision_status === "open"
        ? `<p class="flag">No alternative future was recorded while the decision
           is still open.</p>`
        : "";

  const movesRows = shifts
    .slice(0, 20)
    .map(
      (s) => `<tr>
        <td class="num ${s.delta < 0 ? "dir-down" : "dir-up"}">${signed(s.delta)}</td>
        <td>${esc(s.name)}${s.is_new ? ' <span class="tag">new work</span>' : ""}</td>
        <td class="muted">${esc(s.role_after)}</td>
      </tr>`,
    )
    .join("");

  const capRows = (items: typeof rising) =>
    items
      .slice(0, 10)
      .map(
        (x) => `<tr>
          <td class="num ${x.delta < 0 ? "dir-down" : "dir-up"}">${signed(x.delta)}</td>
          <td>${esc(x.capability)}</td>
          <td class="muted">${esc(x.roles_after.join(", "))}</td>
        </tr>`,
      )
      .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(c.title)} — ${esc(BRAND.name)}</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body { font: 11pt/1.45 ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif;
         color: #1b1f24; margin: 0; padding: 24px; max-width: 860px; }
  h1 { font-size: 18pt; margin: 0 0 .2rem; }
  h2 { font-size: 12pt; margin: 1.8rem 0 .6rem; padding-bottom: .25rem;
       border-bottom: 1px solid #dfe4ea; }
  h3 { font-size: 11pt; margin: 0 0 .2rem; }
  p { margin: .4rem 0; }
  .muted { color: #6b7683; }
  .sub { color: #55606d; margin: 0 0 1rem; }
  .meta { color: #55606d; font-size: 9.5pt; }
  .banner { background: #fdf6e7; border: 1px solid #e4cf9a; padding: .6rem .8rem;
            border-radius: 5px; font-weight: 600; }
  .flag { background: #fdf6e7; border-left: 3px solid #e4cf9a; padding: .4rem .7rem; }
  .note { background: #eef2f6; padding: .5rem .8rem; border-radius: 5px; }
  .headline { font-size: 15pt; font-variant-numeric: tabular-nums; margin: .3rem 0; }
  table { width: 100%; border-collapse: collapse; margin: .5rem 0; font-size: 10pt; }
  th, td { text-align: left; padding: .28rem .4rem; border-bottom: 1px solid #eceff2; }
  th { font-size: 8.5pt; text-transform: uppercase; letter-spacing: .05em; color: #55606d; }
  .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .dir-up { font-weight: 600; }
  .dir-down { font-weight: 600; }
  .dot { display: inline-block; width: 9px; height: 9px; border-radius: 2px;
         margin-right: .4rem; vertical-align: baseline; }
  .tag { font-size: 8pt; background: #eef2f6; padding: .05rem .35rem; border-radius: 8px; }
  .role { break-inside: avoid; page-break-inside: avoid; margin: 1rem 0 1.4rem; }
  .role__fte { font-variant-numeric: tabular-nums; margin: 0 0 .5rem; }
  .bars { display: grid; grid-template-columns: auto 1fr; gap: .3rem .6rem;
          align-items: center; margin: .4rem 0 .7rem; }
  .barlabel { font-size: 8.5pt; color: #6b7683; }
  .bar { display: flex; height: 16px; border-radius: 3px; overflow: hidden;
         gap: 1px; border: 1px solid #dfe4ea; }
  .bar--empty { background: #f2f4f6; }
  .seg { display: flex; align-items: center; justify-content: center; min-width: 2px;
         color: #fff; font-size: 7.5pt; font-variant-numeric: tabular-nums; }
  .prose { font-size: 10pt; color: #55606d; }
  footer { margin-top: 2rem; padding-top: .7rem; border-top: 1px solid #dfe4ea;
           font-size: 9pt; color: #6b7683; }
  @media print {
    body { padding: 0; max-width: none; }
    .seg { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .dot, .bar, .banner, .flag { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style></head><body>

<h1>${esc(c.title)}</h1>
<p class="sub">${esc(c.scope)}${c.organization ? ` — ${esc(c.organization)}` : ""}</p>
<p class="meta">
  ${c.boundary_start ? `From ${esc(c.boundary_start)} to ${esc(c.boundary_end)}. ` : ""}
  ${c.technology ? `Technology considered: ${esc(c.technology)}. ` : ""}
  ${c.sponsor_role ? `Sponsor: ${esc(c.sponsor_role)}. ` : ""}
  Prepared ${esc(c.updated)}${c.maintainer_role ? ` by ${esc(c.maintainer_role)}` : ""}.
</p>
${decidedBanner}

<h2>The workflow</h2>
<p class="headline">${f(totals.hours_before)} hrs/${esc(period)} &rarr;
   ${f(totals.hours_after)} hrs/${esc(period)}
   <strong>${totals.change_pct > 0 ? "+" : ""}${totals.change_pct}%</strong></p>
<p>${f(totals.fte_before)} &rarr; ${f(totals.fte_after)} full-time equivalent,
   across ${totals.step_count} steps and ${totals.role_count} roles.</p>
${
  totals.new_work_hours > 0
    ? `<p class="note"><strong>${f(totals.new_work_hours)} hrs/${esc(period)}</strong>
       of the work after this change is work nobody does today — reviewing what the
       technology produces, and handling what it escalates.</p>`
    : ""
}
${
  totals.unassessed_hours > 0
    ? `<p class="flag">${f(totals.unassessed_hours)} hrs/${esc(period)}
       (${totals.unassessed_share}% of the workflow) is recorded as not yet known.
       It is excluded from every figure above.</p>`
    : ""
}
${alternatives}

<h2>What happens to each role</h2>
${roles.map((r) => roleSection(r, shifts, period)).join("")}

${
  shifts.length > 0
    ? `<h2>What moves</h2>
       <table><thead><tr><th class="num">Hrs</th><th>Step</th><th>Who does it after</th></tr></thead>
       <tbody>${movesRows}</tbody></table>`
    : ""
}

${
  rising.length > 0 || falling.length > 0
    ? `<h2>What people will need to be able to do</h2>
       ${
         rising.length > 0
           ? `<h3>Needed more</h3><table><tbody>${capRows(rising)}</tbody></table>`
           : ""
       }
       ${
         falling.length > 0
           ? `<h3>Needed less</h3><table><tbody>${capRows(falling)}</tbody></table>`
           : ""
       }`
    : ""
}

${
  unknowns.length > 0
    ? `<h2>What we do not know</h2><ul>${unknowns
        .map((u) => `<li>${esc(u)}</li>`)
        .join("")}</ul>`
    : ""
}

<footer>
  <p>These are estimates built from the volumes and durations entered into this
     analysis. ${esc(BRAND.reportDisclaimer)}</p>
  <p>Produced with ${esc(BRAND.name)}.</p>
</footer>
</body></html>`;
}
