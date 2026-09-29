"use client";

import { useRef } from "react";
import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { DesignPartnerCardsSection as DesignPartnerCardsSectionData } from "@/lib/cms/types";

// Benefits + commitment sit on the light-blue gradient (Frame 50 / 255);
// the security section (Frame 254) has no background — plain white, with the
// cards themselves carrying the #E8F0FF / #4F8DFF colours.
const SECTION_BG = {
  benefits: "bg-linear-to-b from-brand-soft to-brand-light",
  commitment: "bg-linear-to-b from-brand-soft to-brand-light",
  security: "bg-white",
} as const;

/**
 * Badge palette for the benefit cards. The colour is picked per card in
 * Strapi (`badgeColor`); the text is the card's `meta`.
 */
type BadgeSpec = { badge: string; dot: string };
const BADGE_COLORS: Record<string, BadgeSpec> = {
  purple: {
    badge: "border-1.5 border-chip-purple-edge bg-transparent text-chip-purple-fg",
    dot: "fill-chip-purple-dot",
  },
  orange: {
    badge: "border-1.5 border-chip-orange-strong bg-transparent text-chip-orange-fg",
    dot: "fill-chip-orange-dot",
  },
  blue: {
    badge: "border border-brand-light bg-brand-soft text-brand-deep",
    dot: "fill-brand-active",
  },
  green: {
    badge: "border border-chip-success-edge bg-chip-success-bg text-chip-success-fg",
    dot: "fill-metric",
  },
  pink: {
    badge: "border border-chip-pink-edge bg-chip-pink-bg text-chip-pink-fg",
    dot: "fill-chip-pink-dot",
  },
  yellow: {
    badge: "border border-chip-yellow-edge bg-chip-yellow-bg text-chip-yellow-fg",
    dot: "fill-chip-yellow-dot",
  },
};

/**
 * Shared card-row renderer for the Design Partner page's three card
 * sections (benefits / security / commitment) — same data shape, different
 * layout/badge treatment per `variant`, matching the exact Figma exports for
 * each. Renders as a horizontally scrollable carousel (peek of the next
 * card, snap-to-card, arrow controls).
 */
export function DesignPartnerCardsSection({
  variant,
  badgeLabel,
  heading,
  headingAccent,
  subheading,
  items,
}: DesignPartnerCardsSectionData) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isSecurity = variant === "security";

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const step = (card?.offsetWidth ?? 320) + 24;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section
      className={`w-full py-16 sm:py-20 ${
        variant === "security" ? "pb-10 md:pb-[3.75rem] md:pt-section-y" : "md:py-24"
      } ${SECTION_BG[variant] ?? SECTION_BG.benefits}`}
    >
      <div className={`${layout.inner} flex w-full max-w-[90rem] flex-col gap-10 md:gap-12`}>
        <div className={`flex w-full flex-col gap-6 sm:flex-row sm:items-end sm:justify-between ${layout.sectionX}`}>
          <div className="flex min-w-0 max-w-[70.5rem] flex-1 flex-col gap-3">
            {badgeLabel ? (
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-info-edge bg-info-bg px-2.5 py-1">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                  <circle className="fill-info" cx="4" cy="4" r="3" />
                </svg>
                <span className="text-sm font-medium leading-5 text-info-fg">{badgeLabel}</span>
              </div>
            ) : null}
            {heading ? (
              <h2
                className={`${homeSerif.className} leading-heading tracking-heading ${
                  isSecurity
                    ? "text-[clamp(1.75rem,3.4vw,3rem)] italic text-navy"
                    : "text-[clamp(1.75rem,3.5vw,2.5rem)] text-navy"
                }`}
              >
                {heading}{" "}
                {headingAccent ? (
                  <span className="italic text-brand-accent">
                    {headingAccent}
                  </span>
                ) : null}
              </h2>
            ) : null}
            {subheading ? (
              <p
                className={
                  isSecurity
                    ? "text-base font-medium leading-7 text-ink sm:text-xl sm:leading-title-sm"
                    : "text-base leading-7 text-ink"
                }
              >
                {subheading}
              </p>
            ) : null}
          </div>

          {items && items.length > 1 ? (
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="Scroll left"
                className={`grid place-items-center rounded-full border bg-white shadow-field transition-colors ${isSecurity ? "h-14 w-14" : "h-11 w-11"} border-brand-accent`}
              >
                <svg width={isSecurity ? 24 : 20} height={isSecurity ? 24 : 20} viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path className="stroke-brand-strong" d="M15 18L9 12L15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="Scroll right"
                className={`grid place-items-center rounded-full border bg-white shadow-field transition-colors ${isSecurity ? "h-14 w-14" : "h-11 w-11"} border-brand-accent`}
              >
                <svg width={isSecurity ? 24 : 20} height={isSecurity ? 24 : 20} viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path className="stroke-brand-strong" d="M9 18L15 12L9 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>

        <div
          ref={scrollerRef}
          // scroll-padding mirrors layout.sectionX so the first card snaps to
          // the same left edge as the heading instead of the scroller's edge.
          className={`flex w-full snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto -mt-3 -mb-14 pt-3 pb-16 sm:scroll-px-6 ${isSecurity ? "sm:gap-8" : "sm:gap-6"} md:scroll-px-10 lg:scroll-px-14 xl:scroll-px-16 2xl:scroll-px-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${layout.sectionX}`}
        >
          {items?.map((item, index) => {
            if (variant === "security") {
              const securityImageUrl = item.icon?.url
                ? toAbsoluteMediaUrl(item.icon.url)
                : undefined;
              return (
                <article
                  key={`${item.title}-${index}`}
                  data-carousel-card
                  className="flex w-rail shrink-0 snap-start flex-col items-stretch overflow-hidden rounded-3xl shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-lg sm:h-media sm:w-modal sm:flex-row bg-brand-soft"
                >
                  <div
                    className="flex h-52 w-full shrink-0 items-center justify-center overflow-hidden sm:h-auto sm:w-rail-xl bg-brand-accent"
                  >
                    {securityImageUrl ? (
                      // Figma-supplied illustration — external asset URL, not
                      // part of the Next.js image domain allowlist.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={securityImageUrl}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-2.5 px-5 py-6 sm:px-12 sm:py-0">
                    <h3
                      className={`${homeSerif.className} text-title leading-title text-navy`}
                    >
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className="text-base leading-6 text-nav">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            }

            if (variant === "benefits") {
              const benefitImageUrl = item.icon?.url
                ? toAbsoluteMediaUrl(item.icon.url)
                : undefined;
              const badge =
                item.meta ? BADGE_COLORS[item.badgeColor ?? "blue"] : undefined;
              return (
                <article
                  key={`${item.title}-${index}`}
                  data-carousel-card
                  className="flex w-rail shrink-0 snap-start flex-col overflow-hidden rounded-card shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-lg sm:w-rail-lg"
                >
                  <div
                    className="flex h-64 w-full items-center justify-center rounded-t-card bg-linear-to-b from-brand-vivid to-brand-fade"
                  >
                    {benefitImageUrl ? (
                      // Figma-supplied illustration / placeholder — external
                      // asset URL, not part of the Next.js image domain allowlist.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={benefitImageUrl}
                        alt=""
                        className="h-[70%] w-[70%] object-contain"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col items-start justify-between gap-5 rounded-b-card bg-white p-5">
                    <div className="flex flex-col items-start gap-2.5">
                      <h3
                        className={`${homeSerif.className} text-title leading-title text-navy`}
                      >
                        {item.title}
                      </h3>
                      {item.description ? (
                        <p className="text-base leading-6 text-nav">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    {badge ? (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${badge.badge}`}
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                          <circle className={badge.dot} cx="4" cy="4" r="3" />
                        </svg>
                        {item.meta}
                      </span>
                    ) : null}
                  </div>
                </article>
              );
            }

            // commitment: white card — bordered rounded photo, title + body below
            const commitmentImageUrl = item.icon?.url
              ? toAbsoluteMediaUrl(item.icon.url)
              : undefined;
            return (
              <article
                key={`${item.title}-${index}`}
                data-carousel-card
                className="flex w-rail shrink-0 snap-start flex-col items-start gap-5 rounded-3xl bg-white p-5 pb-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-lg sm:w-rail-lg"
              >
                {commitmentImageUrl ? (
                  // Figma-supplied illustration — external asset URL, not
                  // part of the Next.js image domain allowlist.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={commitmentImageUrl}
                    alt=""
                    className="h-[12.5rem] w-full rounded-2xl border object-cover border-line-strong"
                    loading="lazy"
                  />
                ) : null}
                <div className="flex flex-col items-start gap-4">
                  <h3
                    className={`${homeSerif.className} text-title leading-title text-navy`}
                  >
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="text-base leading-6 text-ink">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
          {/* Trailing spacer so the last real card can snap fully into view
              past the section's own right padding. */}
          <div aria-hidden className="w-px shrink-0" />
        </div>
      </div>
    </section>
  );
}
