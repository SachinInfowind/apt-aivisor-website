import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import type { CtaSection as CtaSectionData } from "@/lib/cms/types";

/**
 * CTA block. `variant: "default"` is the neutral one for CMS-only pages;
 * `variant: "panel"` is the rounded grey card with a serif italic heading
 * (Figma Frame 254 — design-partner "Mutual Non-Disclosure Agreement").
 */
export function CtaSection({
  heading,
  headingAccent,
  subheading,
  ctaLabel,
  ctaHref,
  variant,
}: CtaSectionData) {
  if (variant === "panel") {
    return (
      <section className={`w-full bg-white pb-16 pt-0 sm:pb-20 md:pb-section-y ${layout.sectionX}`}>
        <div
          className={`${layout.inner} flex w-full max-w-container flex-col items-center gap-7.5 rounded-3xl bg-surface px-6 py-14 text-center sm:px-10 md:px-20 md:py-section-y`}
        >
          <div className="flex w-full flex-col items-center gap-5">
            <h2
              className={`${homeSerif.className} text-[clamp(1.75rem,3.4vw,3rem)] leading-heading tracking-heading text-navy`}
            >
              {heading}
              {headingAccent ? (
                <>
                  {heading.endsWith("-") ? "" : " "}
                  <span className="italic text-brand-accent">{headingAccent}</span>
                </>
              ) : null}
            </h2>
            {subheading ? (
              <p className="max-w-[67.25rem] text-base font-medium leading-7 text-navy sm:text-xl sm:leading-title-sm">
                {subheading}
              </p>
            ) : null}
          </div>
          {ctaLabel && ctaHref ? (
            <a
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-full border border-brand bg-brand px-5.5 py-4 text-lg font-semibold leading-7 text-white shadow-field transition-colors hover:bg-brand-deep active:scale-98"
            >
              {ctaLabel}
            </a>
          ) : null}
        </div>
      </section>
    );
  }

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
          <a
            href={ctaHref}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}
