/**
 * What it means.
 *
 * No data entry. Every figure here is computed from the steps and the
 * assignments, which is the whole point: the analyst cannot argue with it, and
 * neither can their steering committee.
 *
 * The composition bars are the reason this product exists. The work that grows
 * is the capability requirement, and the capability requirement is the
 * transition. If a stakeholder reads one thing, it is this.
 */

import { COPY, fill } from "../copy.ts";
import { el, fmt, mount } from "../dom.ts";
import { go, state } from "../state.ts";
import { WORK_TYPE_LABELS } from "../../core/types.ts";
import type {
  RoleComposition,
  Sensitivity,
  WorkTypeSlice,
} from "../../core/calc/index.ts";
import {
  carriesMostDoubt,
  fallingCapabilities,
  PARAMETER_LABELS,
  risingCapabilities,
  roleComposition,
  sensitivity,
  stepShifts,
  workflowTotals,
} from "../../core/calc/index.ts";

const C = COPY.results;

export function renderResults(root: HTMLElement): void {
  const project = state.project;
  if (!project) return go("start");

  const period = project.case.period;
  const totals = workflowTotals(project);
  const band = sensitivity(project);
  const roles = roleComposition(project).filter(
    (r) => r.before.hours > 0 || r.after.hours > 0,
  );
  const shifts = stepShifts(project).filter((s) => Math.abs(s.delta) > 0.05);
  const rising = risingCapabilities(project);
  const falling = fallingCapabilities(project);

  const nothingAssigned = project.scenarios[0]?.assignments.length === 0;

  mount(
    root,
    el(
      "section",
      { class: "screen" },
      el("h1", {}, C.title),
      el("p", { class: "lede" }, C.lede),

      nothingAssigned
        ? el("p", { class: "muted" }, C.empty)
        : el(
            "div",
            {},
            headline(totals, band, period),
            roles.length > 0
              ? el(
                  "div",
                  {},
                  el("h2", {}, C.roles.heading),
                  ...roles.map((r) => roleCard(r, shifts, period)),
                )
              : null,
            shifts.length > 0 ? movesSection(shifts) : null,
            capabilitySection(rising, falling),
            uncertaintySection(band, period),
          ),
    ),
  );
}

// ---------------------------------------------------------------------------

function headline(
  t: ReturnType<typeof workflowTotals>,
  band: Sensitivity,
  period: string,
): HTMLElement {
  return el(
    "div",
    { class: "headline" },
    el("h2", { class: "headline__heading" }, C.headline.heading),
    el(
      "p",
      { class: "headline__figures" },
      el("strong", {}, fmt(t.hours_before)),
      ` hrs/${period} `,
      el("span", { class: "headline__arrow" }, "→"),
      " ",
      el("strong", {}, fmt(t.hours_after)),
      ` hrs/${period}`,
      el(
        "span",
        { class: `headline__change${t.change_pct < 0 ? " is-down" : " is-up"}` },
        `  ${t.change_pct > 0 ? "+" : ""}${t.change_pct}%`,
      ),
    ),
    el(
      "p",
      { class: "headline__sub" },
      `${fmt(t.fte_before)} → ${fmt(t.fte_after)} full-time equivalent`,
    ),
    band.has_ranges
      ? el(
          "p",
          { class: "headline__band" },
          fill(C.uncertainty.band, {
            low: fmt(band.hours_after.low),
            high: fmt(band.hours_after.high),
            period,
          }),
          " ",
          fill(C.uncertainty.bandChange, {
            lowPct: band.change_pct.low,
            highPct: band.change_pct.high,
          }),
        )
      : null,
    band.straddles_no_change
      ? el("p", { class: "note note--warn" }, C.uncertainty.straddles)
      : null,
    t.new_work_hours > 0
      ? el(
          "p",
          { class: "note" },
          el("strong", {}, `${fmt(t.new_work_hours)} hrs`),
          ` ${C.headline.newWork}`,
        )
      : null,
    t.unassessed_hours > 0
      ? el(
          "p",
          { class: "note note--warn" },
          fill(C.headline.unassessed, { hours: fmt(t.unassessed_hours) }),
        )
      : null,
  );
}

// ---------------------------------------------------------------------------

function bar(slices: WorkTypeSlice[]): HTMLElement {
  return el(
    "div",
    { class: "compbar" },
    ...slices.map((s) =>
      el(
        "span",
        {
          class: `compbar__seg compbar__seg--${s.work_type}`,
          style: `flex: ${s.hours}`,
          title: `${WORK_TYPE_LABELS[s.work_type]} — ${fmt(s.hours)} hrs (${s.share}%)`,
        },
        s.share >= 12 ? `${s.share}%` : "",
      ),
    ),
  );
}

function roleCard(
  r: RoleComposition,
  shifts: ReturnType<typeof stepShifts>,
  period: string,
): HTMLElement {
  const mine = shifts.filter(
    (s) => s.role_before === r.role || s.role_after === r.role,
  );
  const shrinking = mine.filter((s) => s.delta < 0).slice(0, 3);
  const growing = mine.filter((s) => s.delta > 0 && !s.is_new).slice(0, 3);
  const brandNew = mine.filter((s) => s.is_new);

  const types = [
    ...new Set([
      ...r.before.by_work_type.map((s) => s.work_type),
      ...r.after.by_work_type.map((s) => s.work_type),
    ]),
  ];

  return el(
    "div",
    { class: "rolecard" },
    el(
      "div",
      { class: "rolecard__head" },
      el("h3", { class: "rolecard__name" }, r.role),
      el(
        "span",
        { class: "rolecard__fte" },
        `${fmt(r.before.fte)} → ${fmt(r.after.fte)} FTE`,
        el(
          "span",
          { class: r.hours_delta < 0 ? "is-down" : "is-up" },
          `  ${r.hours_delta > 0 ? "+" : ""}${fmt(r.hours_delta)} hrs/${period}`,
        ),
      ),
    ),

    el(
      "div",
      { class: "rolecard__bars" },
      el("span", { class: "rolecard__barlabel" }, C.roles.before),
      bar(r.before.by_work_type),
      el("span", { class: "rolecard__barlabel" }, C.roles.after),
      bar(r.after.by_work_type),
    ),

    el(
      "ul",
      { class: "legend legend--inline" },
      ...types.map((t) => {
        const b = r.before.by_work_type.find((s) => s.work_type === t);
        const a = r.after.by_work_type.find((s) => s.work_type === t);
        return el(
          "li",
          { class: "legend__item" },
          el("span", { class: `legend__dot legend__dot--${t}` }),
          WORK_TYPE_LABELS[t],
          el(
            "span",
            { class: "legend__value" },
            `${b?.share ?? 0}% → ${a?.share ?? 0}%`,
          ),
        );
      }),
    ),

    el(
      "div",
      { class: "rolecard__prose" },
      shrinking.length > 0 ? proseList(C.roles.shrinks, shrinking) : null,
      growing.length > 0 ? proseList(C.roles.grows, growing) : null,
      brandNew.length > 0 ? proseList(C.roles.brandNew, brandNew) : null,
    ),

    Math.abs(r.fte_delta) >= 0.5
      ? el("p", { class: "muted small" }, C.roles.authorityNote)
      : null,
  );
}

function proseList(
  heading: string,
  items: ReturnType<typeof stepShifts>,
): HTMLElement {
  return el(
    "p",
    { class: "prose" },
    el("strong", {}, `${heading}: `),
    items
      .map((s) => `${s.name} (${s.delta > 0 ? "+" : ""}${fmt(s.delta)} hrs)`)
      .join(", "),
  );
}

// ---------------------------------------------------------------------------

function movesSection(shifts: ReturnType<typeof stepShifts>): HTMLElement {
  return el(
    "div",
    {},
    el("h2", {}, C.moves.heading),
    el(
      "ul",
      { class: "moves" },
      ...shifts.slice(0, 15).map((s) =>
        el(
          "li",
          { class: "moves__item" },
          el(
            "span",
            { class: `moves__delta ${s.delta < 0 ? "is-down" : "is-up"}` },
            `${s.delta > 0 ? "+" : ""}${fmt(s.delta)} hrs`,
          ),
          el("span", { class: "moves__name" }, s.name),
          s.is_new ? el("span", { class: "chip chip--flag" }, C.moves.newTag) : null,
          el("span", { class: "moves__role" }, s.role_after),
        ),
      ),
    ),
  );
}

/**
 * What the answer rests on.
 *
 * The list is ordered by how many hours each number decides on its own, so the
 * top row is the one worth measuring rather than estimating. That ordering is
 * the finding — everything else on this screen assumes the estimates are right.
 */
function uncertaintySection(band: Sensitivity, period: string): HTMLElement {
  if (!band.has_ranges) {
    return el(
      "div",
      {},
      el("h2", {}, C.uncertainty.heading),
      el("p", { class: "muted" }, C.uncertainty.none),
    );
  }

  const doubt = carriesMostDoubt(band);
  const decisive = band.parameters.filter((x) => x.swing > 0.05);

  return el(
    "div",
    {},
    el("h2", {}, C.uncertainty.heading),
    el(
      "p",
      { class: "headline__figures" },
      el(
        "strong",
        {},
        `${fmt(band.hours_after.low)} to ${fmt(band.hours_after.high)}`,
      ),
      ` hrs/${period}`,
    ),
    el("p", { class: "muted small" }, C.uncertainty.bothEnds),

    doubt
      ? el(
          "p",
          { class: "note" },
          el(
            "strong",
            {},
            fill(C.uncertainty.carries, {
              name: doubt.name,
              hours: fmt(doubt.swing),
            }),
          ),
          ` ${C.uncertainty.carriesHint}`,
        )
      : null,

    decisive.length > 0
      ? el(
          "div",
          {},
          el("h3", {}, C.uncertainty.swingHeading),
          el(
            "ul",
            { class: "moves" },
            ...decisive.map((x) =>
              el(
                "li",
                { class: "moves__item" },
                el("span", { class: "moves__delta" }, `${fmt(x.swing)} hrs`),
                el(
                  "span",
                  { class: "moves__name" },
                  `${x.name} — ${PARAMETER_LABELS[x.kind]}`,
                ),
                el("span", { class: "moves__role" }, x.role),
              ),
            ),
          ),
        )
      : null,
  );
}

function capabilitySection(
  rising: ReturnType<typeof risingCapabilities>,
  falling: ReturnType<typeof fallingCapabilities>,
): HTMLElement {
  if (rising.length === 0 && falling.length === 0) {
    return el(
      "div",
      {},
      el("h2", {}, C.capabilities.heading),
      el("p", { class: "muted" }, C.capabilities.none),
    );
  }

  const column = (
    heading: string,
    items: ReturnType<typeof risingCapabilities>,
  ) =>
    el(
      "div",
      { class: "caps__col" },
      el("h3", {}, heading),
      el(
        "ul",
        { class: "caps" },
        ...items.slice(0, 8).map((c) =>
          el(
            "li",
            { class: "caps__item" },
            el(
              "span",
              { class: `caps__delta ${c.delta < 0 ? "is-down" : "is-up"}` },
              `${c.delta > 0 ? "+" : ""}${fmt(c.delta)} hrs`,
            ),
            el("span", { class: "caps__name" }, c.capability),
            c.roles_after.length > 0
              ? el("span", { class: "caps__roles" }, c.roles_after.join(", "))
              : null,
          ),
        ),
      ),
    );

  return el(
    "div",
    {},
    el("h2", {}, C.capabilities.heading),
    el(
      "div",
      { class: "caps__cols" },
      rising.length > 0 ? column(C.capabilities.rising, rising) : null,
      falling.length > 0 ? column(C.capabilities.falling, falling) : null,
    ),
  );
}
