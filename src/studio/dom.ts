/**
 * Twelve lines of DOM helpers instead of a framework.
 *
 * Seven screens do not justify a five-year dependency. If this file ever grows
 * past a hundred lines, that is the signal to reconsider — not before.
 */

type Attrs = Record<string, string | number | boolean | EventListener | undefined>;
type Child = Node | string | number | null | undefined | false;

/** el("div", { class: "x" }, "text", el("span", {}, "more")) */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) continue;
    if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else if (key === "value" && "value" in node) {
      (node as unknown as { value: string }).value = String(value);
    } else if (value === true) {
      node.setAttribute(key, "");
    } else {
      node.setAttribute(key, String(value));
    }
  }

  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function clear(node: Element): void {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function mount(target: Element, ...children: Child[]): void {
  clear(target);
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    target.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

export function $(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

/** Debounce, for recomputing totals while someone is still typing. */
export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  ms: number,
): (...args: T) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: T) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/** Round for display only. Arithmetic finishes first. */
export function fmt(n: number, places = 1): string {
  const factor = 10 ** places;
  const rounded = Math.round(n * factor) / factor;
  return String(rounded);
}
