import { WaitlistSection } from "@/components/home/sections/WaitlistSection";
import { WaitlistTrustBar } from "@/components/home/sections/WaitlistTrustBar";
import { getPageBySlug } from "@/lib/cms/queries";
import { findSection } from "@/lib/cms/utils";
import type { WaitlistSectionData } from "@/lib/cms/types";

/**
 * Shared bottom CTA band for /blogs pages — matches the home waitlist band.
 * Copy comes from the waitlist section on the CMS `blogs` page.
 */
export async function BlogWaitlistCta() {
  const page = await getPageBySlug("blogs").catch(() => null);
  const waitlist = page ? findSection<WaitlistSectionData>(page.sections, "sections.waitlist") : undefined;
  if (!waitlist) return null;

  return (
    <>
      <WaitlistSection {...waitlist} />
      <WaitlistTrustBar {...waitlist} />
    </>
  );
}
