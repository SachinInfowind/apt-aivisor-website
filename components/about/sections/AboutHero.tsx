import { CloudBand } from "@/components/ui/CloudBand";
import { HeroGlow } from "@/components/ui/HeroGlow";
import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import type { AboutHeroSection } from "@/lib/cms/types";

/**
 * About hero — Figma "Frame 128" (3335:1499): same mesh + two glows + cloud
 * band as the Design Partner hero, with a two-line serif heading (roman, then
 * italic brand-blue accent) and a centred intro paragraph.
 */
/** `**bold**` markers in the CMS text become semi-bold runs. */
function renderRuns(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-semibold">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function AboutHero({ heading, headingAccent, intro }: AboutHeroSection) {
  return (
    <section
      className={`relative flex min-h-hero-about w-full flex-col items-center justify-center overflow-hidden bg-hero-mesh ${layout.sectionX} pb-[clamp(6rem,20vw,16rem)] pt-[clamp(7.5rem,14svh,12rem)] sm:pt-[clamp(8.5rem,15svh,13rem)] md:pt-[clamp(9.5rem,16svh,14rem)]`}
    >
      <HeroGlow />

      <div
        className={`${layout.inner} relative z-1 flex w-full max-w-hero flex-col items-center gap-9 text-center`}
      >
        <h1 className="flex w-full flex-col items-center gap-[0.1em]">
          <span
            className={`${homeSerif.className} block text-[clamp(2.5rem,6.9vw,6.25rem)] font-normal leading-none text-navy text-stroke-navy`}
          >
            {heading}
          </span>
          {headingAccent ? (
            <span
              className={`${homeSerif.className} block text-[clamp(2.5rem,6.9vw,6.25rem)] font-normal italic leading-[0.9] text-brand text-stroke-brand`}
            >
              {headingAccent}
            </span>
          ) : null}
        </h1>

        {intro ? (
          <p className="w-full text-base leading-7 text-ink sm:text-xl sm:leading-title-sm">
            {renderRuns(intro)}
          </p>
        ) : null}
      </div>

      <CloudBand priority variant="edge" />
    </section>
  );
}
