import { homeSerif } from "../../ui/fonts";
import { HeroGlowAccent } from "../../ui/HeroGlowAccent";
import { layout } from "../../ui/type";
import type { TeamHeroSection as TeamHeroSectionData } from "@/lib/cms/types";

/**
 * Team hero — Figma Frame 1261154244 (26281:27795).
 * “Meet the minds behind aptAIvisor”
 */
export function TeamHeroSection({
  headline,
  headlineAccent,
  subhead,
}: TeamHeroSectionData) {
  return (
    <section
      className={`relative flex min-h-[min(100svh,56rem)] w-full flex-col items-center justify-center overflow-hidden bg-hero-mesh ${layout.sectionX} pb-[clamp(2.5rem,12svh,10.9375rem)] pt-[clamp(7.5rem,14svh,12rem)] sm:pt-[clamp(8.5rem,15svh,13rem)] md:pt-[clamp(9.5rem,16svh,14rem)] xl:min-h-[min(100svh,56rem)] xl:pb-[clamp(2.5rem,14svh,10.9375rem)] xl:pt-[clamp(9.5rem,18svh,13.75rem)]`}
    >
      <HeroGlowAccent />
      <div className="relative z-[1] flex w-full max-w-[54.125rem] flex-col items-center gap-6 text-center sm:gap-8 md:gap-[2.625rem]">
        <h1
          className={`${homeSerif.className} flex w-full flex-col items-center tracking-[-0.02em]`}
        >
          <span className="text-hero-display block text-[clamp(2rem,8vw,6.25rem)] leading-none sm:text-display">
            {headline}
          </span>
          {headlineAccent ? (
            <span className="text-hero-negotiating mt-1 block overflow-visible pb-[0.12em] text-[clamp(2rem,8vw,6.25rem)] italic leading-[0.9] sm:mt-2 sm:text-display-italic">
              {headlineAccent}
            </span>
          ) : null}
        </h1>

        {subhead ? (
          <p className="max-w-[54.125rem] text-base leading-7 text-ink sm:text-xl sm:leading-[1.875rem]">
            {subhead}
          </p>
        ) : null}
      </div>
    </section>
  );
}
