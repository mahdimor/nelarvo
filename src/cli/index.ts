#!/usr/bin/env node
/**
 * The command line. A thin shell around the core — it does file I/O and
 * formatting, nothing else. Every number it prints comes from src/core/calc.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

import { BRAND } from "../core/brand.ts";
import {
  emptyProject,
  parseProject,
  ProjectFileError,
  serializeProject,
} from "../core/parse.ts";
import {
  capabilityGaps,
  carriesMostDoubt,
  fallingCapabilities,
  PARAMETER_LABELS,
  risingCapabilities,
  roleComposition,
  round1,
  sensitivity,
  stepShifts,
  workflowTotals,
} from "../core/calc/index.ts";
import { WORK_TYPE_LABELS } from "../core/types.ts";
import { startStudio } from "./studio.ts";
import { renderReportHtml } from "../core/report/html.ts";

const argv = process.argv.slice(2);
const command = argv[0];

function fail(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function loadOrExit(path: string | undefined) {
  if (!path) fail(`Which file? Try: ${BRAND.command} calc <file>`);
  if (!existsSync(path)) fail(`No file at ${path}`);
  try {
    return parseProject(readFileSync(path, "utf8"));
  } catch (e) {
    if (e instanceof ProjectFileError) {
      process.stderr.write(`\n${path} could not be read:\n\n`);
      for (const p of e.problems) {
        process.stderr.write(`  ${p.path}\n    ${p.message}\n`);
      }
      process.stderr.write("\n");
      process.exit(1);
    }
    throw e;
  }
}

function bar(share: number, width = 24): string {
  const filled = Math.round((share / 100) * width);
  return "#".repeat(filled).padEnd(width, ".");
}

function signed(n: number): string {
  const r = round1(n);
  return r > 0 ? `+${r}` : `${r}`;
}

// ---------------------------------------------------------------------------

function cmdNew(): void {
  const scope = argv[1];
  if (!scope) fail(`What workflow? Try: ${BRAND.command} new "Auto claims intake"`);

  const project = emptyProject(scope, scope);
  const file = `${project.case.id}${BRAND.fileExtension}`;
  if (existsSync(file)) fail(`${file} already exists — not overwriting it.`);

  mkdirSync(dirname(join(".", file)), { recursive: true });
  writeFileSync(file, serializeProject(project), "utf8");

  process.stdout.write(
    `\nCreated ${file}\n\n` +
      `  Next: add the steps of the workflow as it is today.\n` +
      `  Each step needs who does it, how many per week, and how long each takes.\n\n` +
      `  Then: ${BRAND.command} calc ${file}\n\n`,
  );
}

function cmdValidate(): void {
  const path = argv[1]!;
  loadOrExit(path);
  process.stdout.write(`${path} is readable and structurally sound.\n`);
}

function cmdCalc(): void {
  const path = argv[1];
  const project = loadOrExit(path);
  const scenarioId = argv[2];

  const t = workflowTotals(project, scenarioId);
  const band = sensitivity(project, scenarioId);
  const per = `/${t.period}`;
  const out: string[] = [];

  out.push("");
  out.push(`  ${project.case.title}`);
  out.push(`  ${project.case.scope} — ${project.case.organization}`);

  if (project.case.decision_status === "already_decided") {
    out.push("");
    out.push("  NOTE: this transformation is recorded as already decided.");
    out.push("  The figures below describe conditions. They do not indicate");
    out.push("  that alternatives were open.");
  }
  out.push("");

  out.push(`  THE WORKFLOW`);
  out.push(
    `    ${t.step_count} steps · ${t.role_count} roles · ` +
      `${round1(t.hours_before)} hrs${per} · ${round1(t.fte_before)} FTE`,
  );
  out.push(
    `    after: ${round1(t.hours_after)} hrs${per} · ` +
      `${round1(t.fte_after)} FTE  (${t.change_pct}%)`,
  );
  if (t.new_work_hours > 0) {
    out.push(
      `    of which ${round1(t.new_work_hours)} hrs${per} is work nobody does today`,
    );
  }
  if (t.unassessed_hours > 0) {
    out.push(
      `    ${round1(t.unassessed_hours)} hrs${per} (${t.unassessed_share}%) ` +
        `not yet assessed — excluded from any claim above`,
    );
  }
  if (band.has_ranges) {
    out.push(
      `    between ${round1(band.hours_after.low)} and ` +
        `${round1(band.hours_after.high)} hrs${per} ` +
        `(${band.change_pct.low}% to ${band.change_pct.high}%) ` +
        `if every estimate lands at the same end`,
    );
    if (band.straddles_no_change) {
      out.push("    that band reaches no change at all — the direction is not settled");
    }
  }
  out.push("");

  for (const c of roleComposition(project, scenarioId)) {
    out.push(
      `  ${c.role.toUpperCase()} — ${round1(c.before.fte)} FTE -> ` +
        `${round1(c.after.fte)} FTE  (${signed(c.hours_delta)} hrs${per})`,
    );
    const types = new Set([
      ...c.before.by_work_type.map((s) => s.work_type),
      ...c.after.by_work_type.map((s) => s.work_type),
    ]);
    for (const wt of types) {
      const b = c.before.by_work_type.find((s) => s.work_type === wt);
      const a = c.after.by_work_type.find((s) => s.work_type === wt);
      const bs = b?.share ?? 0;
      const as = a?.share ?? 0;
      const flag = as > bs ? " up" : as < bs ? " down" : "";
      out.push(
        `    ${WORK_TYPE_LABELS[wt].padEnd(18)} ` +
          `${String(bs).padStart(3)}% -> ${String(as).padStart(3)}%  ` +
          `${bar(as)}${flag}`,
      );
    }
    out.push("");
  }

  const shifts = stepShifts(project, scenarioId).filter(
    (s) => Math.abs(s.delta) > 0.05,
  );
  if (shifts.length > 0) {
    out.push("  WHAT MOVES");
    for (const s of shifts.slice(0, 12)) {
      const tag = s.is_new ? "  [new work]" : "";
      out.push(
        `    ${signed(s.delta).padStart(8)} hrs  ${s.name}${tag}`,
      );
    }
    out.push("");
  }

  const rising = risingCapabilities(project, scenarioId);
  const falling = fallingCapabilities(project, scenarioId);
  if (rising.length > 0 || falling.length > 0) {
    out.push("  WHAT PEOPLE WILL NEED TO BE ABLE TO DO");
    for (const c of rising.slice(0, 8)) {
      const gap = c.readiness ? `  (${c.readiness.replace(/_/g, " ")})` : "";
      out.push(`    ${signed(c.delta).padStart(8)} hrs  ${c.capability}${gap}`);
    }
    if (falling.length > 0) {
      out.push("  NEEDED LESS");
      for (const c of falling.slice(0, 5)) {
        out.push(`    ${signed(c.delta).padStart(8)} hrs  ${c.capability}`);
      }
    }
    out.push("");
  }

  const decisive = band.parameters.filter((x) => x.swing > 0.05);
  if (decisive.length > 0) {
    out.push("  WHAT THE ANSWER RESTS ON");
    for (const x of decisive.slice(0, 6)) {
      out.push(
        `    ${round1(x.swing).toString().padStart(8)} hrs  ` +
          `${x.name} — ${PARAMETER_LABELS[x.kind]}`,
      );
    }
    const doubt = carriesMostDoubt(band);
    if (doubt) {
      out.push("");
      out.push(`    Worth measuring rather than estimating: ${doubt.name}.`);
    }
    out.push("");
  }

  const gaps = capabilityGaps(project, scenarioId).filter((c) => c.is_gap);
  if (gaps.length > 0) {
    out.push("  THE REAL TRAINING REQUIREMENT");
    for (const c of gaps) {
      out.push(`    ${c.capability} — ${c.roles_after.join(", ")}`);
    }
    out.push("");
  }

  out.push("  These are estimates built from the volumes and durations entered.");
  out.push("");

  process.stdout.write(out.join("\n"));
}

function cmdReport(): void {
  const path = argv[1];
  const project = loadOrExit(path);

  // Only a bare word is a scenario name. Without this, `report file --out x`
  // would look up a scenario called "--out", find nothing, and quietly report
  // on an unchanged workflow.
  const second = argv[2];
  const scenario = second && !second.startsWith("--") ? second : undefined;
  if (scenario && !project.scenarios.some((s) => s.id === scenario)) {
    fail(
      `No scenario called "${scenario}". This file has: ` +
        project.scenarios.map((s) => s.id).join(", "),
    );
  }
  const html = renderReportHtml(project, scenario);

  const flag = argv.indexOf("--out");
  const out = flag >= 0 ? argv[flag + 1] : `${project.case.id}-report.html`;
  if (!out) fail("--out needs a file name.");

  writeFileSync(out, html, "utf8");
  process.stdout.write(`\n  Wrote ${out}\n  Open it in a browser and print to PDF.\n\n`);
}

function cmdStudio(): void {
  const flag = argv.indexOf("--port");
  const port = flag >= 0 ? Number(argv[flag + 1]) : 7777;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    fail("--port needs a whole number between 1 and 65535.");
  }
  startStudio(port, !argv.includes("--no-open"));
}

function cmdHelp(): void {
  process.stdout.write(
    `\n  ${BRAND.name} — ${BRAND.description}\n` +
      `  ${BRAND.tagline_en}\n\n` +
      `  ${BRAND.command} studio                     open the window (start here)\n` +
      `  ${BRAND.command} new "Auto claims intake"   start a case from the terminal\n` +
      `  ${BRAND.command} validate <file>            check the file is sound\n` +
      `  ${BRAND.command} calc <file> [scenario]     the before and after\n` +
      `  ${BRAND.command} report <file> [--out x]    write the printable report\n\n`,
  );
}

switch (command) {
  case "studio":
    cmdStudio();
    break;
  case "new":
    cmdNew();
    break;
  case "validate":
    cmdValidate();
    break;
  case "calc":
    cmdCalc();
    break;
  case "report":
    cmdReport();
    break;
  case "help":
  case "--help":
  case "-h":
  case undefined:
    cmdHelp();
    break;
  default:
    fail(`Unknown command "${command}". Try: ${BRAND.command} help`);
}
