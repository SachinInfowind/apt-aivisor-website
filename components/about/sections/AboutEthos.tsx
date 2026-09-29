import Image from "next/image";
import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { AboutEthosSection } from "@/lib/cms/types";

/**
 * "How every aptAIsian shows up." — Figma "Frame 158" (3335:1598): centred
 * header, then three equal-height cards (gradient illustration panel + light
 * blue text panel) with the shared card hover lift.
 */
export function AboutEthos({
  badgeLabel,
  heading,
  headingAccent,
  headingAfter,
  subheading,
  items,
}: AboutEthosSection) {
  return (
    <section className={`w-full bg-white py-16 sm:py-20 md:py-section-y ${layout.sectionX}`}>
      <div className={`${layout.inner} flex w-full max-w-container flex-col gap-12`}>
        <div className="flex w-full flex-col items-center gap-3 text-center">
          <div className="flex w-full max-w-narrow flex-col items-center gap-6">
            {badgeLabel ? (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-info-edge bg-info-bg py-1 pl-2.5 pr-3">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                  <circle className="fill-info" cx="4" cy="4" r="3" />
                </svg>
                <span className="text-sm font-medium leading-5 text-info-fg">{badgeLabel}</span>
              </div>
            ) : null}
            <h2
              className={`${homeSerif.className} w-full text-h2 font-normal leading-heading tracking-heading text-navy`}
            >
              {heading}{" "}
              {headingAccent ? (
                <span className="italic text-brand-accent">{headingAccent} </span>
              ) : null}
              {headingAfter}
            </h2>
          </div>
          {subheading ? (
            <p className="w-full text-base font-medium leading-7 text-ink sm:text-xl sm:leading-title-sm">
              {subheading}
            </p>
          ) : null}
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:gap-10">
          {items?.map((card) => (
            <article
              key={card.title}
              className="flex flex-col rounded-card shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-lg"
            >
              <div className="flex aspect-[25/24] w-full items-center justify-center rounded-t-card bg-linear-to-b from-brand-vivid to-brand-fade">
                {card.icon?.url ? (
                  <Image
                    src={toAbsoluteMediaUrl(card.icon.url)}
                    alt={card.icon.alternativeText ?? ""}
                    width={card.icon.width ?? 350}
                    height={card.icon.height ?? 206}
                    className="h-auto w-[87.5%]"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-4 rounded-b-card bg-brand-soft px-5 pb-13 pt-8">
                <h3 className={`${homeSerif.className} text-2xl font-normal leading-8 text-navy`}>
                  {card.title}
                </h3>
                {card.description ? (
                  <p className="text-base leading-6 text-ink">{card.description}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
