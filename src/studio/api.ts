/**
 * Talking to the local process that started this window.
 *
 * The only network this application ever performs is to 127.0.0.1, to read and
 * write files in the folder where it was launched. Nothing leaves the machine.
 */

import type { Project } from "../core/types.ts";

export interface CaseSummary {
  file: string;
  title: string;
  scope: string;
  updated: string;
  steps: number;
}

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export function listCases(): Promise<CaseSummary[]> {
  return json<CaseSummary[]>("/api/cases");
}

export function loadCase(file: string): Promise<Project> {
  return json<Project>(`/api/case/${encodeURIComponent(file)}`);
}

export function saveCase(file: string, project: Project): Promise<{ file: string }> {
  return json<{ file: string }>(`/api/case/${encodeURIComponent(file)}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(project),
  });
}

export function loadExample(): Promise<{ file: string; project: Project }> {
  return json<{ file: string; project: Project }>("/api/example");
}
