/**
 * The workflow, before and after, as one picture.
 *
 * This is the thing people point at in a meeting. It is generated from the step
 * list and never drawn by hand — an analyst arranging boxes would be describing
 * a diagram rather than a workflow, and the diagram would stop matching the
 * numbers the moment either changed.
 *
 * What it has to be honest about, or it is worse than no picture at all:
 *
 *   - Blocks are strictly proportional to hours, and both lanes share one
 *     scale. A workflow that halves must look halved.
 *   - Work that did not exist before is marked as new and enters from nowhere.
 *     It is not a saving being reinvested.
 *   - Work whose fate is not known is hatched, because it is excluded from
 *     every headline figure and the picture must not quietly include it.
 *   - Nothing implies that more automation is a better shape. The right lane is
 *     shorter or it is not; the drawing takes no view.
 *
 * Plain SVG, no dependencies, no measurement of text. Every label is truncated
 * by character count, which is approximate on purpose: a diagram that needs a
 * layout engine is a diagram this project will not maintain.
 */

import type { Project, WorkType } from "../types.ts";
import { WORK_TYPE_LABELS } from "../types.ts";
import {
  assessedCreatedSteps,
  findScenario,
  isUnassessed,
  stepHours,
  stepShifts,
  toFte,
} from "../calc/index.ts";
import { esc } from "./escape.ts";

/** One colour per kind of work, used by every view that shows composition. */
export const WORK_TYPE_FILL: Record<WorkType, string> = {
  data_handling: "#6b83a8",
  routine_judgment: "#4f9d94",
  complex_judgment: "#6f5fa8",
  relationship: "#c08a4a",
  coordination: "#4d90a8",
  supervision: "#8f6aa0",
  physical: "#7d8a5c",
  improvement: "#b06a80",
};

const INK = "#1b1f24";
const INK_SOFT = "#55606d";
const INK_FAINT = "#8a95a3";
const LINE = "#dfe4ea";

// Geometry. One row of arithmetic, so a change here cannot desynchronise.
const W = 820;
const LABEL_W = 288;
const GUTTER = 20; // where return arcs live
const LANE_W = 78;
const RIBBON_W = 156;
const HEAD_H = 40;
const BODY_H = 430;
const GAP = 2; // between blocks in a lane
const MIN_BLOCK = 2; // so a tiny step is a visible sliver, not nothing
const LABEL_MIN = 13; // below this a block is too thin to write on
const LABEL_TWO_LINE = 26; // below this one line only, or neighbours collide

const X_BEFORE = LABEL_W + GUTTER;
const X_AFTER = X_BEFORE + LANE_W + RIBBON_W;
const X_RIGHT = X_AFTER + LANE_W + 10;

const f = (n: number, places = 1): string => {
  const factor = 10 ** places;
  return String(Math.round(n * factor) / factor);
};

/** Approximate truncation. No text measurement, on purpose. */
function clip(text: string, chars: number): string {
  const t = text.trim();
  return t.length <= chars ? t : `${t.slice(0, chars - 1).trimEnd()}…`;
}

interface Item {
  key: string;
  name: string;
  role: string;
  work_type: WorkType;
  hours: number;
  /** True only for work the change creates. Never a saving being reinvested. */
  is_new: boolean;
}

interface Block extends Item {
  y: number;
  h: number;
}

/** Stack blocks down a lane at a shared scale. Zero-hour work takes no space. */
function stack(items: Item[], scale: number, top: number): Block[] {
  const out: Block[] = [];
  let y = top;
  for (const item of items) {
    const h = item.hours > 0 ? Math.max(item.hours * scale, MIN_BLOCK) : 0;
    out.push({ ...item, y, h });
    if (h > 0) y += h + GAP;
  }
  return out;
}

function ribbon(
  x1: number,
  yb: number,
  hb: number,
  x2: number,
  ya: number,
  ha: number,
): string {
  const mid = (x1 + x2) / 2;
  return (
    `M${f(x1, 2)},${f(yb, 2)} ` +
    `C${f(mid, 2)},${f(yb, 2)} ${f(mid, 2)},${f(ya, 2)} ${f(x2, 2)},${f(ya, 2)} ` +
    `L${f(x2, 2)},${f(ya + ha, 2)} ` +
    `C${f(mid, 2)},${f(ya + ha, 2)} ${f(mid, 2)},${f(yb + hb, 2)} ` +
    `${f(x1, 2)},${f(yb + hb, 2)} Z`
  );
}

/**
 * The whole diagram, or an empty string when there is nothing to draw.
 *
 * An empty string rather than an empty frame: a picture of no workflow tells a
 * reader nothing and takes up a page.
 */
export function renderFlowSvg(project: Project, scenarioId?: string): string {
  const steps = [...project.steps].sort((a, b) => a.sequence - b.sequence);
  if (steps.length === 0) return "";

  const period = project.case.period;
  const shifts = stepShifts(project, scenarioId);
  const byId = new Map(shifts.map((s) => [s.step_id, s]));
  const unassessed = new Set(
    project.steps.filter(isUnassessed).map((s) => s.id),
  );

  // Created work keeps the order it was declared in, after the steps it
  // belongs to — it is consequence, not sequence.
  const assessedCreatedIds = new Set(
    assessedCreatedSteps(project, findScenario(project, scenarioId)).map((step) => step.id),
  );
  const created = shifts.filter(
    (shift) => shift.is_new && assessedCreatedIds.has(shift.step_id),
  );

  const beforeItems: Item[] = steps.map((s) => ({
    key: s.id,
    name: s.name,
    role: s.role,
    work_type: s.work_type,
    hours: byId.get(s.id)?.hours_before ?? 0,
    is_new: false,
  }));

  const afterItems: Item[] = [
    ...steps.map((s) => ({
      key: s.id,
      name: s.name,
      role: unassessed.has(s.id) ? s.role : (byId.get(s.id)?.role_after ?? s.role),
      work_type: s.work_type,
      // Unknown work is carried unchanged only to keep the drawing complete.
      // The hatching says its future has not been claimed.
      hours: unassessed.has(s.id) ? stepHours(s) : (byId.get(s.id)?.hours_after ?? 0),
      is_new: false,
    })),
    ...created.map((s) => ({
      key: s.step_id,
      name: s.name,
      role: s.role_after,
      work_type: s.work_type,
      hours: s.hours_after,
      is_new: true,
    })),
  ];

  const visible = (items: Item[]) => items.filter((i) => i.hours > 0).length;
  const gaps = Math.max(visible(beforeItems), visible(afterItems)) * GAP;
  const beforeHours = beforeItems.reduce((sum, item) => sum + item.hours, 0);
  const afterHours = afterItems.reduce((sum, item) => sum + item.hours, 0);
  const peak = Math.max(beforeHours, afterHours, 1);
  const scale = Math.max(BODY_H - gaps, 1) / peak;

  const top = HEAD_H + 14;
  const before = stack(beforeItems, scale, top);
  const after = stack(afterItems, scale, top);
  const afterByKey = new Map(after.map((b) => [b.key, b]));

  const bottom = [...before, ...after].reduce(
    (y, b) => Math.max(y, b.y + b.h),
    top,
  );

  const parts: string[] = [];

  // --- ribbons first, so blocks and text sit on top ------------------------
  for (const b of before) {
    if (b.h === 0) continue;
    const a = afterByKey.get(b.key);
    const fill = WORK_TYPE_FILL[b.work_type];

    if (!a || a.h === 0) {
      // The work stops. It tapers to a point rather than fading out.
      const landing = a ? a.y : top;
      parts.push(
        `<path d="${ribbon(X_BEFORE + LANE_W, b.y, b.h, X_AFTER, landing, 0)}" ` +
          `fill="${fill}" opacity=".13"/>`,
      );
      continue;
    }
    parts.push(
      `<path d="${ribbon(X_BEFORE + LANE_W, b.y, b.h, X_AFTER, a.y, a.h)}" ` +
        `fill="${fill}" opacity=".26"/>`,
    );
  }

  // --- the two lanes -------------------------------------------------------
  const lane = (blocks: Block[], x: number, side: "before" | "after") =>
    blocks
      .filter((b) => b.h > 0)
      .map((b) => {
        const hatch = side === "before" && unassessed.has(b.key);
        const title =
          `${b.name} — ${b.role} — ${f(b.hours)} hrs/${period}` +
          (hatch ? " — not yet assessed" : "") +
          (b.is_new ? " — work nobody does today" : "");

        return (
          `<g><title>${esc(title)}</title>` +
          `<rect x="${x}" y="${f(b.y, 2)}" width="${LANE_W}" height="${f(b.h, 2)}" ` +
          `rx="2" fill="${WORK_TYPE_FILL[b.work_type]}"` +
          (b.is_new ? ` stroke="${INK}" stroke-width="1.2" stroke-dasharray="3 2"` : "") +
          `/>` +
          (hatch
            ? `<rect x="${x}" y="${f(b.y, 2)}" width="${LANE_W}" height="${f(b.h, 2)}" ` +
              `rx="2" fill="url(#nlv-unassessed)"/>`
            : "") +
          `</g>`
        );
      })
      .join("");

  parts.push(lane(before, X_BEFORE, "before"));
  parts.push(lane(after, X_AFTER, "after"));

  // --- rework, drawn in the gutter beside today's lane ---------------------
  // The hours are already counted: a chase that happens for 210 of 700 claims
  // is a step of 210. This only stops the picture from reading as a straight
  // line through a workflow that plainly loops.
  const beforeByKey = new Map(before.map((b) => [b.key, b]));
  for (const step of steps) {
    if (!step.returns_to) continue;
    const from = beforeByKey.get(step.id);
    const to = beforeByKey.get(step.returns_to);
    if (!from || !to || from.h === 0 || to.h === 0) continue;

    const ys = from.y + from.h / 2;
    const yt = to.y + to.h / 2;
    const bend = X_BEFORE - GUTTER + 2;

    parts.push(
      `<g><title>${esc(`${step.name} sends work back to ${to.name}`)}</title>` +
        `<path d="M${X_BEFORE},${f(ys, 2)} C${bend},${f(ys, 2)} ${bend},${f(yt, 2)} ` +
        `${X_BEFORE},${f(yt, 2)}" fill="none" stroke="${INK_FAINT}" ` +
        `stroke-width="1" stroke-dasharray="3 2"/>` +
        `<path d="M${X_BEFORE - 5},${f(yt - 3, 2)} L${X_BEFORE},${f(yt, 2)} ` +
        `L${X_BEFORE - 5},${f(yt + 3, 2)} Z" fill="${INK_FAINT}"/>` +
        `</g>`,
    );
  }

  // --- labels --------------------------------------------------------------
  // A block only gets the second line when it is tall enough to hold one.
  // Otherwise two neighbouring labels collide, and a diagram whose text
  // overlaps is read as sloppy arithmetic.
  for (const b of before) {
    if (b.h < LABEL_MIN) continue;
    const mid = b.y + b.h / 2;
    const x = LABEL_W - 12;

    if (b.h >= LABEL_TWO_LINE) {
      parts.push(
        `<text x="${x}" y="${f(mid - 1, 2)}" text-anchor="end" font-size="11" ` +
          `fill="${INK}">${esc(clip(b.name, 40))}</text>` +
          `<text x="${x}" y="${f(mid + 11, 2)}" text-anchor="end" font-size="9.5" ` +
          `fill="${INK_FAINT}">${esc(clip(b.role, 28))} · ${f(b.hours)} hrs</text>`,
      );
      continue;
    }
    parts.push(
      `<text x="${x}" y="${f(mid + 3.5, 2)}" text-anchor="end" font-size="10" ` +
        `fill="${INK_SOFT}">${esc(clip(b.name, 34))} · ${f(b.hours)} hrs</text>`,
    );
  }

  for (const b of after) {
    if (b.h < LABEL_MIN) continue;
    const mid = b.y + b.h / 2;

    if (b.is_new && b.h >= LABEL_TWO_LINE) {
      parts.push(
        `<text x="${X_RIGHT}" y="${f(mid - 1, 2)}" font-size="10.5" ` +
          `fill="${INK_SOFT}">${f(b.hours)} hrs · new work</text>` +
          `<text x="${X_RIGHT}" y="${f(mid + 11, 2)}" font-size="9.5" ` +
          `fill="${INK_FAINT}">${esc(clip(b.name, 30))}</text>`,
      );
      continue;
    }
    parts.push(
      `<text x="${X_RIGHT}" y="${f(mid + 3.5, 2)}" font-size="10" fill="${INK_SOFT}">` +
        `${f(b.hours)} hrs${b.is_new ? " · new work" : ""}</text>`,
    );
  }

  // --- lane headings -------------------------------------------------------
  const heading = (x: number, label: string, hours: number) =>
    `<text x="${x}" y="18" font-size="10" font-weight="600" fill="${INK_SOFT}" ` +
    `letter-spacing=".06em">${esc(label.toUpperCase())}</text>` +
    `<text x="${x}" y="34" font-size="12" fill="${INK}">${f(hours)} hrs/${esc(period)} ` +
    `· ${f(toFte(hours, period))} FTE</text>`;

  parts.push(
    heading(X_BEFORE, unassessed.size > 0 ? "Today — recorded" : "Today", beforeHours),
  );
  parts.push(
    heading(X_AFTER, unassessed.size > 0 ? "After — unknown held" : "After", afterHours),
  );

  // --- legend, wrapping rather than running off the page -------------------
  const kinds = [
    ...new Set([...before, ...after].filter((b) => b.h > 0).map((b) => b.work_type)),
  ];

  const LEGEND_X = 4;
  let lx = LEGEND_X;
  let ly = bottom + 30;

  for (const k of kinds) {
    // Character count stands in for text measurement, with room to be wrong.
    const width = 18 + WORK_TYPE_LABELS[k].length * 5.6;
    if (lx > LEGEND_X && lx + width > W) {
      lx = LEGEND_X;
      ly += 15;
    }
    parts.push(
      `<rect x="${f(lx, 1)}" y="${f(ly - 8, 1)}" width="9" height="9" rx="2" ` +
        `fill="${WORK_TYPE_FILL[k]}"/>` +
        `<text x="${f(lx + 14, 1)}" y="${f(ly, 1)}" font-size="9.5" fill="${INK_SOFT}">` +
        `${esc(WORK_TYPE_LABELS[k])}</text>`,
    );
    lx += width;
  }

  const notes: string[] = [];
  if (created.length > 0) notes.push("dashed outline is work nobody does today");
  if (unassessed.size > 0) {
    notes.push("hatched work is not yet assessed and is held unchanged only in this drawing");
  }
  if (steps.some((s) => s.returns_to)) notes.push("an arrow is work coming back");
  if (notes.length > 0) {
    parts.push(
      `<text x="${LEGEND_X}" y="${f(ly + 20, 1)}" font-size="9.5" fill="${INK_FAINT}">` +
        `${esc(notes.join(" · "))}</text>`,
    );
    ly += 20;
  }

  const height = ly + 12;

  return (
    `<svg class="flow" viewBox="0 0 ${W} ${f(height, 1)}" width="100%" ` +
    `role="img" aria-label="The workflow today and after the change, by hours" ` +
    `font-family="ui-sans-serif, system-ui, Segoe UI, Roboto, sans-serif" ` +
    `xmlns="http://www.w3.org/2000/svg">` +
    `<defs><pattern id="nlv-unassessed" width="6" height="6" ` +
    `patternUnits="userSpaceOnUse" patternTransform="rotate(45)">` +
    `<rect width="6" height="6" fill="#ffffff" opacity=".55"/>` +
    `<line x1="0" y1="0" x2="0" y2="6" stroke="${LINE}" stroke-width="2"/>` +
    `</pattern></defs>` +
    parts.join("") +
    `</svg>`
  );
}
