import { homeSerif } from "../../ui/fonts";
import { layout } from "../../ui/type";
import type { TrustCtaSection as TrustCtaSectionData } from "@/lib/cms/types";

/**
 * Trust NDA / security overview CTA — Figma Frame 1261154140 (26281:26700).
 * Gradient band below the FAQ: “Want the long-form version?”
 */
export function TrustCtaSection({
  heading,
  headingAccent,
  subhead,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: TrustCtaSectionData) {
  const primary = primaryLabel?.trim() && primaryHref?.trim();
  const secondary = secondaryLabel?.trim() && secondaryHref?.trim();

  return (
    <section
      className={`bg-waitlist-section ${layout.sectionX} py-16 sm:py-20 md:py-[6.25rem]`}
    >
      <div className="mx-auto flex w-full max-w-[54.125rem] flex-col items-center gap-10 text-center sm:gap-14 md:gap-20">
        <div className="flex w-full flex-col items-center gap-5 sm:gap-[1.875rem]">
          <h2
            className={`${homeSerif.className} w-full text-[clamp(1.75rem,4vw,3rem)] italic leading-[1.2] tracking-[-0.02em] text-white`}
          >
            <span>{heading}</span>
            {headingAccent ? (
              <>
                <br />
                <span>{headingAccent}</span>
              </>
            ) : null}
          </h2>
          {subhead ? (
            <p className="w-full max-w-[54.125rem] text-base font-medium leading-7 text-white sm:text-xl sm:leading-[1.875rem]">
              {subhead}
            </p>
          ) : null}
        </div>

        {primary || secondary ? (
          <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-start sm:gap-3">
            {primary ? (
              <a
                href={primaryHref}
                className="inline-flex items-center justify-center rounded-pill border border-line-strong bg-white px-[1.125rem] py-3 text-base font-semibold leading-6 text-ink shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {primaryLabel}
              </a>
            ) : null}
            {secondary ? (
              <a
                href={secondaryHref}
                className="inline-flex min-w-[10.1875rem] items-center justify-center rounded-pill border border-line-strong bg-transparent px-[1.125rem] py-3 text-base font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-white/10 active:scale-[0.98]"
              >
                {secondaryLabel}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
