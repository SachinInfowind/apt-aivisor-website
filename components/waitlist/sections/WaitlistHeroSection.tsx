import { homeSerif } from "../../ui/fonts";
import { HeroGlowAccent } from "../../ui/HeroGlowAccent";
import { layout } from "../../ui/type";
import type { WaitlistHeroSection as WaitlistHeroSectionData } from "@/lib/cms/types";
import { CloudBand } from "@/components/ui/CloudBand";

/**
 * Waitlist hero — Figma Frame 128 (26281:29767, 1440×868).
 * Badge + “Be First to Stop Overpaying / for Technology”
 */
export function WaitlistHeroSection({
  eyebrow,
  headline,
  headlineAccent,
  headlineAfter,
  subhead,
}: WaitlistHeroSectionData) {
  const size =
    "text-[clamp(2rem,8vw,6.25rem)] leading-none sm:text-display";

  return (
    <section
      className={`relative flex min-h-[min(100svh,54.25rem)] w-full flex-col items-center justify-center overflow-hidden bg-hero-mesh ${layout.sectionX} pb-[clamp(6rem,20vw,16rem)] pt-[clamp(7.5rem,14svh,12rem)] sm:pt-[clamp(8.5rem,15svh,13rem)] md:pt-[clamp(9.5rem,16svh,14rem)] xl:pb-[clamp(2.5rem,14svh,10rem)] xl:pt-[clamp(9.5rem,18svh,13.75rem)]`}
    >
      <HeroGlowAccent />
      <div className="relative z-[1] flex w-full flex-col items-center gap-6 text-center sm:gap-8 md:gap-9">
        {eyebrow ? (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white px-2.5 py-1 text-[0.875rem] font-medium leading-5 text-ink shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-badge-dot"
              aria-hidden
            />
            {eyebrow}
          </div>
        ) : null}

        <div className="flex w-full flex-col items-center gap-6 sm:gap-8 md:gap-[2.25rem]">
          <h1
            className={`${homeSerif.className} flex w-full flex-col items-center tracking-[-0.02em]`}
          >
            {/* Figma: “Be First to Stop Overpaying” / “for Technology” — two lines */}
            <span className={`block whitespace-nowrap ${size}`}>
              <span className="text-hero-display">{headline}</span>
              {headlineAccent ? (
                <>
                  {" "}
                  <span className="text-hero-negotiating">{headlineAccent}</span>
                </>
              ) : null}
            </span>
            {headlineAfter ? (
              <span
                className={`text-hero-display mt-1 block ${size} sm:mt-[0.625rem]`}
              >
                {headlineAfter}
              </span>
            ) : null}
          </h1>

          {subhead ? (
            <p className="max-w-[54.125rem] text-base leading-7 text-ink sm:text-xl sm:leading-[1.875rem]">
              {subhead}
            </p>
          ) : null}
        </div>
      </div>

      <CloudBand priority variant="edge" />
    </section>
  );
}
