"use client";

import { useState } from "react";
import Image from "next/image";
import { homeSerif } from "@/components/ui/fonts";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { SolutionsFeaturesSection } from "@/lib/cms/types";

/**
 * Solutions features — Figma FEATURES (26281:28633).
 * Copy and the preview image come from Strapi (`sections.solutions-features`).
 * The two-second highlight loop stays in the component.
 */

function CheckIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={`mt-[5px] shrink-0 ${active ? "text-brand" : "text-faint"}`}
    >
      <path
        d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z"
        className="fill-current"
      />
      <path
        d="M6.25 10L8.75 12.5L13.75 7.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SolutionsFeatures({
  moduleLabel,
  audienceLabel,
  headline,
  headlineAccent,
  body,
  points,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  image,
  imageAlt,
  surface,
}: SolutionsFeaturesSection) {
  const items = (points ?? []).filter((point) => point.text);
  const [active, setActive] = useState(0);
  const selectedIndex = items.length ? active % items.length : 0;
  const imageUrl = image?.url ? toAbsoluteMediaUrl(image.url) : null;

  return (
    <section
      className={`w-full px-4 py-16 sm:px-8 sm:py-20 md:px-10 xl:px-20 xl:py-[6.25rem] ${
        surface === "blue" ? "bg-brand-soft" : "bg-white"
      }`}
    >
      <div className="mx-auto grid w-full max-w-[80rem] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,31.25rem)_minmax(0,43.5rem)] lg:justify-between lg:gap-x-[5.25rem] lg:gap-y-[3.3125rem]">
        <div className="flex flex-col items-start gap-6">
          {moduleLabel || audienceLabel ? (
            <div className="inline-flex items-center gap-3 rounded-pill border border-line-muted bg-surface-muted py-1 pl-1 pr-2.5">
              {moduleLabel ? (
                <span className="inline-flex items-center rounded-pill border border-badge-edge bg-badge-bg px-2.5 py-0.5 text-body-sm font-medium text-badge-text">
                  {moduleLabel}
                </span>
              ) : null}
              {audienceLabel ? (
                <span className="text-body-sm font-medium text-ink">
                  {audienceLabel}
                </span>
              ) : null}
            </div>
          ) : null}
          <h2
            className={`${homeSerif.className} text-[clamp(2.25rem,4vw,3rem)] italic leading-[1.2] tracking-[-0.02em]`}
          >
            <span className="text-navy">
              {headline}
              {headlineAccent ? " " : ""}
            </span>
            {headlineAccent ? (
              <span className="text-brand-accent">{headlineAccent}</span>
            ) : null}
          </h2>
        </div>

        {body ? (
          <p className="max-w-[43.5rem] text-base leading-7 text-ink sm:text-body-lg lg:self-center">
            {body}
          </p>
        ) : (
          <div />
        )}

        <div className="flex flex-col items-start gap-10 sm:gap-12">
          <ul className="flex w-full flex-col gap-6">
            {items.map((point, index) => {
              const selected = index === selectedIndex;
              return (
                <li key={point.id ?? point.text} className="relative flex items-start gap-2.5 pt-3">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-line-strong"
                  />
                  {selected ? (
                    <span
                      key={selectedIndex}
                      aria-hidden
                      className="solutions-feature-progress absolute inset-x-0 top-0 h-px bg-brand-accent"
                      onAnimationEnd={() => {
                        setActive((current) => (current + 1) % items.length);
                      }}
                    />
                  ) : null}
                  <CheckIcon active={selected} />
                  <p
                    className={`${homeSerif.className} text-xl leading-8 transition-colors duration-300 sm:text-2xl ${
                      selected ? "text-black" : "text-nav"
                    }`}
                  >
                    {point.text}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center gap-4">
            {primaryLabel && primaryHref ? (
              <a
                href={primaryHref}
                className="inline-flex items-center justify-center rounded-pill border border-brand bg-brand px-[1.375rem] py-4 text-body-md font-semibold text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]"
              >
                {primaryLabel}
              </a>
            ) : null}
            {secondaryLabel && secondaryHref ? (
              <a
                href={secondaryHref}
                className="inline-flex items-center justify-center rounded-pill border border-brand-accent bg-white px-[1.375rem] py-4 text-body-md font-semibold text-brand-deep shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]"
              >
                {secondaryLabel}
              </a>
            ) : null}
          </div>
        </div>

        {imageUrl ? (
        <div className="relative flex w-full items-center justify-center overflow-hidden rounded-3xl bg-[linear-gradient(180deg,var(--color-brand-soft)_0%,var(--color-platform-to)_100%)] px-[1.9375rem] py-16 lg:min-h-[33.9375rem]">
          <Image
            src={imageUrl}
            alt={imageAlt || image?.alternativeText || ""}
            width={image?.width || 634}
            height={image?.height || 422}
            className="h-auto w-full rounded-2xl shadow-[0_12px_16px_-4px_rgba(16,24,40,0.08),0_4px_6px_-2px_rgba(16,24,40,0.03)]"
          />
        </div>
        ) : (
          <div />
        )}
      </div>
    </section>
  );
}
