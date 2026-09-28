import Link from "next/link";
import type { CtaSection as CtaSectionData } from "@/lib/cms/types";

/**
 * Generic CTA block for CMS-only pages that don't map to a specific Figma
 * design. Kept intentionally simple/neutral.
 */
export function CtaSection({ heading, subheading, ctaLabel, ctaHref }: CtaSectionData) {
  return (
    <section className="w-full bg-brand-wash px-6 py-16 text-center sm:py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
        <h2 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
          {heading}
        </h2>
        {subheading && (
          <p className="text-base leading-7 text-ink sm:text-lg">
            {subheading}
          </p>
        )}
        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
