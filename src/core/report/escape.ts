/**
 * Escaping, in one place.
 *
 * Everything rendered from a project file is user content: step names, roles,
 * case titles. It reaches HTML and SVG documents that people print and mail
 * around, so it goes through here first, without exception.
 */

/** Escape for HTML and SVG text and attribute contexts. */
export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
