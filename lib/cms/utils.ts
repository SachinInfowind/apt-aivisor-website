import type { PageSection } from "./types";

/**
 * Finds the first section of a given `__component` type in a page's section
 * list. Used by pages that interleave CMS-driven sections with sections that
 * are still hardcoded, at fixed positions in the layout.
 */
export function findSection<T extends PageSection>(
  sections: PageSection[],
  component: T["__component"],
): T | undefined {
  return sections.find((section) => section.__component === component) as
    | T
    | undefined;
}
