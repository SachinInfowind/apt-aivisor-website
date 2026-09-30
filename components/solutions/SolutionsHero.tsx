"use client";

import { useEffect, useState } from "react";
import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import type {
  SolutionsAudienceKey,
  SolutionsHeroSection,
} from "@/lib/cms/types";
import { CloudBand } from "@/components/ui/CloudBand";

/**
 * Solutions hero — Figma Frame 1261154244 (26281:28584, 1440×896).
 * Copy comes from Strapi (`sections.solutions-hero`). Cloud band omitted.
 */

const audienceIcons: Record<
  SolutionsAudienceKey,
  "cart" | "both" | "building"
> = {
  buyer: "cart",
  both: "both",
  seller: "building",
};

function AudienceIcon({ name }: { name: "cart" | "both" | "building" }) {
  if (name === "cart") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M1 1H1.65308C1.77609 1 1.8376 1 1.88709 1.02262C1.93071 1.04255 1.96767 1.07461 1.99357 1.11497C2.02297 1.16077 2.03167 1.22166 2.04906 1.34343L2.28571 3M2.28571 3L2.81166 6.8657C2.8784 7.35626 2.91177 7.60154 3.02905 7.78617C3.13239 7.94886 3.28054 8.07822 3.45568 8.15869C3.65443 8.25 3.90197 8.25 4.39705 8.25H8.676C9.14727 8.25 9.38291 8.25 9.57548 8.16521C9.74527 8.09044 9.89092 7.96992 9.99614 7.81711C10.1155 7.64381 10.1596 7.41233 10.2477 6.94938L10.9096 3.47484C10.9406 3.3119 10.9561 3.23043 10.9336 3.16675C10.9139 3.11088 10.875 3.06384 10.8238 3.03401C10.7654 3 10.6825 3 10.5166 3H2.28571ZM5 10.5C5 10.7761 4.77614 11 4.5 11C4.22386 11 4 10.7761 4 10.5C4 10.2239 4.22386 10 4.5 10C4.77614 10 5 10.2239 5 10.5ZM9 10.5C9 10.7761 8.77614 11 8.5 11C8.22386 11 8 10.7761 8 10.5C8 10.2239 8.22386 10 8.5 10C8.77614 10 9 10.2239 9 10.5Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "both") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M4.5 3.5L2 6L4.5 8.5M7.5 3.5L10 6L7.5 8.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M7.5 10.5V7.8C7.5 7.51997 7.5 7.37996 7.4455 7.273C7.39757 7.17892 7.32108 7.10243 7.227 7.0545C7.12004 7 6.98003 7 6.7 7H5.3C5.01997 7 4.87996 7 4.773 7.0545C4.67892 7.10243 4.60243 7.17892 4.5545 7.273C4.5 7.37996 4.5 7.51997 4.5 7.8V10.5M1.5 3.5C1.5 4.32843 2.17157 5 3 5C3.82843 5 4.5 4.32843 4.5 3.5C4.5 4.32843 5.17157 5 6 5C6.82843 5 7.5 4.32843 7.5 3.5C7.5 4.32843 8.17157 5 9 5C9.82843 5 10.5 4.32843 10.5 3.5M3.1 10.5H8.9C9.46005 10.5 9.74008 10.5 9.95399 10.391C10.1422 10.2951 10.2951 10.1422 10.391 9.95399C10.5 9.74008 10.5 9.46005 10.5 8.9V3.1C10.5 2.53995 10.5 2.25992 10.391 2.04601C10.2951 1.85785 10.1422 1.70487 9.95399 1.60899C9.74008 1.5 9.46005 1.5 8.9 1.5H3.1C2.53995 1.5 2.25992 1.5 2.04601 1.60899C1.85785 1.70487 1.70487 1.85785 1.60899 2.04601C1.5 2.25992 1.5 2.53995 1.5 3.1V8.9C1.5 9.46005 1.5 9.74008 1.60899 9.95399C1.70487 10.1422 1.85785 10.2951 2.04601 10.391C2.25992 10.5 2.53995 10.5 3.1 10.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SolutionsHero({
  headline,
  headlineAccent,
  subhead,
  audiences,
}: SolutionsHeroSection) {
  const options = (audiences ?? []).filter((item) => item.label);
  const [index, setIndex] = useState(0);
  const audience: SolutionsAudienceKey = options[index]?.key ?? "buyer";

  useEffect(() => {
    if (options.length < 2) return;
    const count = options.length;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [options.length]);

  return (
    <section
      className={`relative flex min-h-[min(100svh,56rem)] w-full flex-col items-center justify-center overflow-hidden bg-hero-mesh ${layout.sectionX} pb-[clamp(6rem,20vw,16rem)] pt-[clamp(7.5rem,14svh,12rem)] sm:pt-[clamp(8.5rem,15svh,13rem)] md:pt-[clamp(9.5rem,16svh,14rem)] xl:min-h-[min(100svh,56rem)] xl:pt-[clamp(9.5rem,18svh,15rem)]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[8rem] -top-[10rem] h-[33rem] w-[33rem] rounded-full bg-platform-to opacity-70 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[6rem] top-[-8rem] h-[33rem] w-[33rem] rounded-full bg-brand-veil opacity-80 blur-[150px]"
      />

      <div className="relative z-[1] flex w-full max-w-[54.5rem] flex-col items-center gap-8 text-center sm:gap-10 md:gap-[2.625rem]">
        <div className="flex w-full flex-col items-center gap-6 sm:gap-8 md:gap-9">
          <h1
            className={`${homeSerif.className} flex w-full flex-col items-center tracking-[-0.02em]`}
          >
            <span className="text-hero-display block text-[clamp(2rem,6.5vw,6.25rem)] leading-none">
              {headline}
            </span>
            {headlineAccent ? (
              <span className="text-hero-negotiating mt-1 block overflow-visible pb-[0.08em] text-[clamp(2rem,6.5vw,6.25rem)] leading-[0.9] sm:mt-2">
                {headlineAccent}
              </span>
            ) : null}
          </h1>
          {subhead ? (
            <p className="max-w-[54.125rem] text-base leading-7 text-ink sm:text-body-lg">
              {subhead}
            </p>
          ) : null}
        </div>

        {options.length ? (
        <div
          role="tablist"
          aria-label="Who the platform is for"
          className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-pill border border-surface-muted bg-white p-1"
        >
          {options.map((item) => {
            const active = audience === item.key;
            return (
              <button
                key={item.id ?? item.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() =>
                  setIndex(options.findIndex((option) => option.key === item.key))
                }
                className={`inline-flex items-center gap-1 rounded-pill border py-2 pl-[1.125rem] pr-5 text-body-sm font-medium transition-colors ${
                  active
                    ? "border-brand-strong bg-brand text-surface-muted"
                    : "border-line-muted bg-surface text-ink"
                }`}
              >
                <span className={active ? "text-surface-muted" : "text-subtle"}>
                  <AudienceIcon name={audienceIcons[item.key] ?? "cart"} />
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
        ) : null}
      </div>

      <CloudBand priority variant="edge" />
    </section>
  );
}
