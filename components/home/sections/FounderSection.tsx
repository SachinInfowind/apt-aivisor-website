import Image from "next/image";
import { SectionBadge } from "../../ui/SectionBadge";
import { homeAssets } from "../../ui/assets";
import { layout } from "../../ui/type";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { FounderSpotlightSection } from "@/lib/cms/types";
import { FounderIntro } from "./FounderIntro";

/** Fallback expanded copy when CMS `introMore` is empty (matches Figma). */
const FALLBACK_INTRO_MORE =
  "deals. We are now democratizing that institutional knowledge so startups and mid-market teams can negotiate with the same clarity enterprises have always had.";

/**
 * Founder Section — Figma 26193:18421 @1440, fluid up to 1920.
 */
export function FounderSection({
  badgeLabel,
  heading,
  headingAccent,
  intro,
  introMore,
  founderName,
  founderTitle,
  founderPhoto,
  quote,
  ctaLabel,
  ctaHref,
  highlights,
  partnersNote,
}: FounderSpotlightSection) {
  return (
    <section
      className={`bg-surface ${layout.sectionX} ${layout.sectionY}`}
      id="about"
    >
      <div
        className={`${layout.inner} flex flex-col gap-8 sm:gap-10 lg:gap-12`}
      >
        <div className="flex max-w-3xl flex-col gap-3 sm:gap-4">
          <div className="flex flex-col items-start gap-4 sm:gap-6">
            {badgeLabel && <SectionBadge>{badgeLabel}</SectionBadge>}
            <h2 className="font-display text-h2 font-normal tracking-[-0.02em] text-navy">
              {heading}{" "}
              {headingAccent && (
                <em className="italic text-brand-accent">{headingAccent}</em>
              )}
            </h2>
          </div>
          {intro && (
            <FounderIntro
              intro={intro}
              introMore={introMore?.trim() || FALLBACK_INTRO_MORE}
            />
          )}
        </div>

        <div className="flex flex-col gap-6 rounded-[20px] bg-founder-card p-5 sm:gap-8 sm:rounded-[24px] sm:p-8 md:p-10 lg:p-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-10 xl:gap-16">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8 lg:flex-1 lg:gap-12">
              <div className="relative flex w-[140px] shrink-0 flex-col gap-4 sm:w-[167px] sm:gap-5">
                <div className="relative h-[180px] w-full sm:h-[212px]">
                  <div
                    className="absolute inset-x-0 bottom-0 top-8 rounded-xl bg-brand-pale sm:top-[38px]"
                    aria-hidden
                  />
                  <Image
                    src={
                      founderPhoto
                        ? toAbsoluteMediaUrl(founderPhoto.url)
                        : homeAssets.founder.photo
                    }
                    alt={founderName ?? ""}
                    width={334}
                    height={423}
                    className="relative z-[1] h-full w-full rounded-b-xl object-cover object-top"
                    sizes="(max-width: 640px) 140px, 167px"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-display text-[1.5rem] leading-8 text-navy sm:text-[1.875rem] sm:leading-[2.375rem]">
                    {founderName}
                  </p>
                  <p className="text-sm leading-5 text-ink sm:text-lg sm:leading-7">
                    {founderTitle}
                  </p>
                </div>
              </div>

              {quote && (
                <p className="min-w-0 flex-1 font-display text-quote text-navy md:text-[clamp(1.25rem,2.4vw,1.875rem)]">
                  &quot;{quote}&quot;
                </p>
              )}
            </div>

            {ctaLabel && ctaHref && (
              <a
                href={ctaHref}
                className="inline-flex h-11 w-fit shrink-0 items-center gap-1.5 rounded-pill border border-brand bg-brand px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover active:scale-[0.98] sm:h-12 sm:text-base"
              >
                {ctaLabel}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 15L15 5M15 11.6667V5H8.33333"
                    stroke="white"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {highlights.map((h) => (
            <div
              key={h.value}
              className="flex flex-col gap-2.5 rounded-[20px] bg-surface-muted px-4 py-5 sm:rounded-[24px] sm:px-5 sm:pb-10 sm:pt-5"
            >
              <p className="font-display text-[1.5rem] leading-8 text-brand-accent sm:text-[1.875rem] sm:leading-[2.375rem]">
                {h.value}
              </p>
              <p className="text-sm leading-5 text-ink sm:text-lg sm:leading-7">
                {h.label}
              </p>
            </div>
          ))}

          <div className="flex flex-col justify-center gap-3 rounded-[20px] bg-surface-muted p-4 sm:rounded-[24px] sm:gap-4 sm:p-5 sm:col-span-2 lg:col-span-1">
            <div className="flex flex-wrap items-center gap-4">
              {homeAssets.founder.partners.map((logo) => (
                <Image
                  key={logo.src}
                  src={logo.src}
                  alt=""
                  width={logo.width}
                  height={logo.height}
                  className="h-7 w-auto object-contain sm:h-8"
                />
              ))}
            </div>
            {partnersNote && (
              <p className="text-sm leading-5 text-ink sm:text-lg sm:leading-7">
                {partnersNote}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
