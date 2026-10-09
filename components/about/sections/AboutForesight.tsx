"use client";

import Image from "next/image";
import { useState } from "react";
import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import { QuoteMark } from "../QuoteMark";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { AboutForesightSection } from "@/lib/cms/types";

/**
 * "Institutional-grade foresight. For everyone." — Figma "Frame 207" + "Carts"
 * (3335:1543 / 3335:1631): heading row, a fixed quote card, and a card row that
 * bleeds off the right edge of the viewport (native horizontal scroll, snap).
 *
 * "Read more" expands `introExpanded` in place (no scroll/navigation) — toggled
 * by `readMoreLabel` / `readLessLabel`. `readMoreHref` is ignored once
 * `introExpanded` is set; it's kept for older content that only has a link.
 */
export function AboutForesight({
  heading,
  headingAccent,
  intro,
  readMoreLabel,
  readMoreHref,
  introExpanded,
  readLessLabel,
  quoteBefore,
  quoteAccent,
  quoteAfter,
  quoteLogo,
  items,
}: AboutForesightSection) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={`w-full bg-white/50 py-16 sm:py-20 md:py-section-y ${layout.sectionX}`}>
      <div className={`${layout.inner} flex w-full max-w-container flex-col gap-12`}>
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <h2
            className={`${homeSerif.className} w-full max-w-title-col text-h2 font-normal leading-heading tracking-heading text-navy`}
          >
            {heading}{" "}
            {headingAccent ? (
              <span className="italic text-brand-accent">{headingAccent}</span>
            ) : null}
          </h2>
          <div className="flex w-full max-w-intro flex-col gap-3 text-base leading-7 text-navy sm:text-xl sm:leading-title-sm">
            <p>
              {intro}{" "}
              {!expanded && readMoreLabel && introExpanded ? (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="text-brand-accent hover:underline"
                >
                  {readMoreLabel}
                </button>
              ) : !expanded && readMoreLabel && readMoreHref ? (
                <a href={readMoreHref} className="text-brand-accent hover:underline">
                  {readMoreLabel}
                </a>
              ) : null}
            </p>
            {expanded && introExpanded ? (
              <p>
                {introExpanded}{" "}
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="text-brand-accent hover:underline"
                >
                  {readLessLabel || "Less More."}
                </button>
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <div className="relative flex w-full shrink-0 flex-col justify-between gap-16 overflow-hidden rounded-3xl bg-brand-soft p-6 sm:p-12.5 sm:pt-22 lg:min-h-feature lg:w-quote-card">
            <p
              className={`${homeSerif.className} relative z-1 max-w-[30.4375rem] text-quote-md font-normal text-navy`}
            >
              {quoteBefore}
              <span className="text-brand">{quoteAccent}</span>
              {quoteAfter}
            </p>
            {quoteLogo?.url ? (
              <Image
                src={toAbsoluteMediaUrl(quoteLogo.url)}
                alt={quoteLogo.alternativeText ?? ""}
                width={quoteLogo.width ?? 159}
                height={quoteLogo.height ?? 68}
                className="relative z-1 h-17 w-auto self-start"
              />
            ) : (
              <span />
            )}
            <QuoteMark className="pointer-events-none absolute bottom-0 right-6 h-auto w-40 sm:w-53.5" />
          </div>

          {/* Bleeds to the viewport's right edge; pt/pb + negative margins leave
              room for the hover lift + shadow without the scroller clipping it. */}
          <div className="-mb-14 -mt-3 flex min-w-0 snap-x snap-mandatory gap-6 overflow-x-auto pb-16 pt-3 [scrollbar-width:none] lg:mr-[calc(50%-50vw)] [&::-webkit-scrollbar]:hidden">
            {items?.map((card) => (
              <article
                key={card.title}
                className="flex h-feature w-feature shrink-0 snap-start flex-col rounded-3xl shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-lg"
              >
                <div className="relative h-feature-media shrink-0 overflow-hidden rounded-t-3xl bg-linear-to-b from-brand-vivid to-brand-fade">
                  {card.icon?.url ? (
                    <Image
                      src={toAbsoluteMediaUrl(card.icon.url)}
                      alt={card.icon.alternativeText ?? ""}
                      width={card.icon.width ?? 233}
                      height={card.icon.height ?? 186}
                      className="absolute left-1/2 top-13 h-auto w-[77.7%] -translate-x-1/2"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-3 rounded-b-3xl bg-surface p-5 pb-13">
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
      </div>
    </section>
  );
}
