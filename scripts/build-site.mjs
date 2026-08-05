import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

import { parseProject } from "../src/core/parse.ts";
import { renderReportHtml } from "../src/core/report/html.ts";

const root = new URL("../", import.meta.url);
const source = new URL("site/", root);
const output = new URL("dist-site/", root);
const examples = new URL("examples/", output);

await rm(output, { recursive: true, force: true });
await cp(source, output, { recursive: true });
await mkdir(examples, { recursive: true });

for (const name of [
  "expense-claims.nelarvo.json",
  "claims-intake.nelarvo.json",
]) {
  await cp(new URL(`examples/${name}`, root), new URL(name, examples));
}

const project = parseProject(
  await readFile(new URL("examples/claims-intake.nelarvo.json", root), "utf8"),
);
await writeFile(
  new URL("demo-report.html", output),
  renderReportHtml(project),
  "utf8",
);
await writeFile(new URL(".nojekyll", output), "", "utf8");

process.stdout.write("Built dist-site with the public demo report.\n");
