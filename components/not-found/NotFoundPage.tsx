import { NotFoundContent } from "./NotFoundContent";
import { getPageBySlug } from "@/lib/cms/queries";
import { findSection } from "@/lib/cms/utils";
import type { NotFoundSection } from "@/lib/cms/types";

/**
 * 404 page — Figma “404 error” (1:19276).
 * Content only — no Header / Footer. Copy comes from the CMS page `not-found`.
 */
export default async function NotFoundPage() {
  const page = await getPageBySlug("not-found").catch(() => null);
  const content = page ? findSection<NotFoundSection>(page.sections, "sections.not-found") : undefined;

  return (
    <div
      id="top"
      className="relative min-h-screen w-full overflow-x-clip bg-white font-body antialiased"
    >
      <main className="w-full">
        <NotFoundContent {...content} />
      </main>
    </div>
  );
}
