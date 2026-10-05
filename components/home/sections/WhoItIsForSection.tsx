"use client";

import Link from "next/link";
import { useState } from "react";
import { SectionBadge } from "../../ui/SectionBadge";
import { CmsImage } from "../../ui/CmsImage";
import { QuoteMarkIcon } from "../../ui/icons";
import { layout } from "../../ui/type";
import type { StrapiImage, WhoItIsForSectionData } from "@/lib/cms/types";

/**
 * Chevron — Figma "Buttons/Button" (node 24336:222367, Icon=Only, Size=2xl).
 * The button component itself (circle, border, background) is the CSS button
 * below; this only carries the arrow path so it can inherit color/size via
 * `currentColor` and Tailwind classes instead of baking a second circle into
 * a raster/SVG asset (which is what produced the double-ring artifact here).
 */
function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`h-4 w-4 shrink-0 sm:h-[1.125rem] sm:w-[1.125rem] lg:h-5 lg:w-5 ${direction === "left" ? "-scale-x-100" : ""}`}
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type PersonaView = {
  quote: string;
  role: string;
  meta: string;
  avatars: StrapiImage[];
  more: number;
};

function toPersonas(data: Partial<WhoItIsForSectionData>): PersonaView[] {
  return (data.personas ?? []).map((p) => ({
    quote: p.quote ?? "",
    role: p.role ?? "",
    meta: p.meta ?? "",
    avatars: (p.avatars ?? []).filter((img) => Boolean(img?.url)),
    more: p.moreCount ?? 0,
  }));
}

export function WhoItIsForSection(props: Partial<WhoItIsForSectionData> = {}) {
  const personas = toPersonas(props);
  const [idx, setIdx] = useState(0);
  const p = personas[idx] ?? personas[0];

  const { badgeLabel, heading, headingAccent, ctaLabel, ctaHref } = props;

  if (!p) return null;

  return (
    <section
      id="who"
      className={`relative overflow-hidden bg-who-section ${layout.sectionX} ${layout.sectionY}`}
    >
      {/* No forced min-height here: with the blockquote/CTA row below using
          `items-end`, an oversized min-height pushes ALL the extra empty
          space above that row (i.e. between the heading and the quote mark)
          instead of at the section's natural bottom — content should drive
          the height, not a fixed value tuned for a taller reference canvas. */}
      <div className={`relative ${layout.inner} flex flex-col`}>
        <div className="flex items-start justify-between gap-6">
          {badgeLabel ? <SectionBadge tone="onBlue">{badgeLabel}</SectionBadge> : <span />}
          <div className="flex gap-2.5">
            <button
              type="button"
              aria-label="Previous persona"
              onClick={() =>
                setIdx((i) => (i - 1 + personas.length) % personas.length)
              }
              className="grid h-9 w-9 shrink-0 place-items-center rounded-pill border border-white/70 text-white transition-colors hover:bg-white/15 sm:h-10 sm:w-10 lg:h-btn lg:w-btn"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              aria-label="Next persona"
              onClick={() => setIdx((i) => (i + 1) % personas.length)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-pill border border-white/70 text-white transition-colors hover:bg-white/15 sm:h-10 sm:w-10 lg:h-btn lg:w-btn"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
        </div>

        <h2 className="mt-7 max-w-who font-display text-h2 font-normal tracking-[-0.02em] text-white">
          {heading}{" "}
          <em className="italic">{headingAccent}</em>
        </h2>

        <div className="mt-10 flex flex-1 flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <blockquote className="max-w-prose">
            <QuoteMarkIcon width={48} height={40} className="mb-2 h-10 w-auto opacity-80" />
            <p className="font-display text-quote text-white">{p.quote}</p>
            <footer className="mt-6">
              <p className="text-body-15 font-semibold text-white">{p.role}</p>
              <p className="text-body-xs text-white/80">{p.meta}</p>
            </footer>
            <div className="mt-5.5 flex items-center">
              {p.avatars.map((avatar, i) => (
                <span
                  key={`${idx}-${avatar.url}-${i}`}
                  className={`relative h-9 w-9 overflow-hidden rounded-pill border-2 border-white ${
                    i === 0 ? "" : "-ml-2.5"
                  }`}
                >
                  <CmsImage
                    image={avatar}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </span>
              ))}
              <span className="relative -ml-2.5 grid h-9 w-9 place-items-center rounded-pill border-2 border-white bg-white text-caption font-semibold text-brand">
                +{p.more}
              </span>
            </div>
          </blockquote>

          {ctaLabel && ctaHref ? <Link
            href={ctaHref}
            className="inline-flex h-btn-lg shrink-0 items-center self-start rounded-pill bg-white px-6 text-body font-semibold text-navy transition-transform hover:scale-[1.02] active:scale-[0.98] lg:self-end"
          >
            {ctaLabel}
          </Link> : null}
        </div>
      </div>
    </section>
  );
}
