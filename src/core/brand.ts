/**
 * The only place the product name appears.
 * Renaming the product is a one-file edit. Do not hardcode these anywhere else.
 */

export const BRAND = {
  name: "Nelarvo",
  command: "nelarvo",
  fileExtension: ".nelarvo.json",
  specVersion: "1.0",

  tagline_en: "Work changes. Human value carries forward.",
  tagline_fr: "Le travail change. La valeur humaine continue.",

  /**
   * What the product does, in the words used on screen and in reports.
   * Deliberately concrete — no "transformation journey" language.
   */
  description:
    "Map how work changes when machines take part of it, and where the people go.",

  /**
   * Printed at the foot of every generated report. Non-negotiable:
   * the tool describes what was entered. It does not certify anything.
   */
  reportDisclaimer:
    "This report describes what was entered into it. A report with no findings " +
    "is not proof that a transformation is sound, safe, legal, or likely to " +
    "succeed. Most of what matters is in the open questions, and in whether the " +
    "people described agree with the description.",
} as const;
