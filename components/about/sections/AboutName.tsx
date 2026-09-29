import Image from "next/image";
import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { AboutNameSection } from "@/lib/cms/types";

/**
 * "The name aptAI" — Figma "Frame 206" (3335:1566): white panel on the blue
 * gradient band; the word + meaning on the left, three name tiles on the right.
 * Carries the `#the-name` anchor the intro's "Read more." link targets.
 */
export function AboutName({
  anchorId,
  badgeLabel,
  word,
  wordScript,
  meaningPrefix,
  meaning,
  tiles,
}: AboutNameSection) {
  return (
    <section
      id={anchorId || "the-name"}
      className={`w-full bg-linear-to-b from-brand-veil to-brand-strong py-16 sm:py-20 md:py-section-y ${layout.sectionX}`}
    >
      <div
        className={`${layout.inner} flex w-full max-w-container flex-col gap-8 rounded-3xl bg-white p-6 sm:p-10 lg:flex-row lg:items-stretch lg:gap-10`}
      >
        <div className="flex w-full shrink-0 flex-col items-start gap-8 lg:w-77.75 lg:pt-6.25">
          {badgeLabel ? (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-info-edge bg-info-bg py-1 pl-2.5 pr-3">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                <circle className="fill-info" cx="4" cy="4" r="3" />
              </svg>
              <span className="text-sm font-medium leading-5 text-info-fg">{badgeLabel}</span>
            </div>
          ) : null}
          <div className="flex flex-col gap-4">
            <p
              className={`${homeSerif.className} font-normal leading-heading tracking-heading text-navy`}
            >
              <span className="text-5xl">{word} </span>
              <span className="text-4xl">{wordScript}</span>
            </p>
            <p className="text-2xl italic leading-title-sm">
              <span className="block font-medium not-italic text-ink">{meaningPrefix}</span>
              <span className="block font-normal text-brand-accent">{meaning}</span>
            </p>
          </div>
        </div>

        <div className="grid w-full flex-1 grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-7.5">
          {tiles?.map((tile) => (
            <div
              key={tile.name}
              className="flex flex-col items-center gap-4 rounded-2xl bg-surface p-6"
            >
              {tile.image?.url ? (
                <Image
                  src={toAbsoluteMediaUrl(tile.image.url)}
                  alt={tile.image.alternativeText ?? ""}
                  width={tile.image.width ?? 100}
                  height={tile.image.height ?? 102}
                  className="h-25.5 w-25 rounded-full border border-brand-veil object-cover"
                />
              ) : null}
              <div className="flex w-full flex-col gap-2.5">
                <div className="flex justify-center border-b border-line-strong pb-2.5">
                  <p
                    className={`${homeSerif.className} text-center text-2xl font-normal leading-8 text-brand-strong`}
                  >
                    <span className="text-3xl">{tile.name} </span>
                    <span>{tile.script}</span>
                  </p>
                </div>
                <p className="text-center text-base leading-6 text-ink">
                  <span className="block text-xl font-semibold">{tile.label}</span>
                  {tile.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
