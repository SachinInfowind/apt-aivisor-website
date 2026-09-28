import { homeSerif } from "../../ui/fonts";
import { layout } from "../../ui/type";
import type { HeroSection } from "@/lib/cms/types";

/**
 * Career hero — Figma Frame 128 (24576:4444).
 * Matches other marketing heroes: fill the first viewport on desktop
 * (capped so ultra-tall windows don’t leave a huge empty band).
 */
export function CareerHero({ headline, headlineAccent, subhead }: HeroSection) {
  return (
    <section
      className={`relative flex min-h-[min(100svh,56rem)] w-full flex-col items-center justify-center overflow-hidden bg-hero-mesh ${layout.sectionX} pb-[clamp(2.5rem,12svh,10rem)] pt-[clamp(7.5rem,14svh,12rem)] sm:pt-[clamp(8.5rem,15svh,13rem)] md:pt-[clamp(9.5rem,16svh,14rem)] xl:min-h-[min(100svh,56rem)] xl:pb-[clamp(2.5rem,14svh,10rem)] xl:pt-[clamp(9.5rem,18svh,15rem)]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[8rem] -top-[10rem] h-[33rem] w-[33rem] rounded-full bg-platform-to opacity-70 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[6rem] top-[-8rem] h-[33rem] w-[33rem] rounded-full bg-brand-veil opacity-80 blur-[150px]"
      />

      <div className="relative z-[1] flex w-full max-w-[54.125rem] flex-col items-center gap-5 text-center sm:gap-8 md:gap-[2.625rem]">
        <h1
          className={`${homeSerif.className} flex w-full flex-col items-center tracking-[-0.02em]`}
        >
          <span className="text-hero-display block text-[clamp(2rem,8vw,6.25rem)] leading-none sm:text-display">
            {headline}
          </span>
          {headlineAccent && (
            <span className="text-hero-negotiating mt-1 block overflow-visible pb-[0.12em] text-[clamp(2rem,8vw,6.25rem)] italic leading-[0.9] sm:mt-2 sm:text-display-italic">
              {headlineAccent}
            </span>
          )}
        </h1>

        {subhead && (
          <p className="max-w-[54.125rem] text-base leading-7 text-ink sm:text-xl sm:leading-[1.875rem]">
            {subhead}
          </p>
        )}
      </div>
    </section>
  );
}
