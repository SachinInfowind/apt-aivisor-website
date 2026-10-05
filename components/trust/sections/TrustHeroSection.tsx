"use client";

import Image from "next/image";
import { homeSerif } from "../../ui/fonts";
import { layout } from "../../ui/type";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { TrustHeroSection as TrustHeroSectionData } from "@/lib/cms/types";
import { CloudBand } from "@/components/ui/CloudBand";

/** Half of card row (~235px) — mesh stops here so cards straddle hero / white. */
const MESH_END_FROM_BOTTOM = "7.375rem";

/**
 * Trust & Security hero — Figma Frame 1261154183 / 1261154178 (26281:26711).
 * Mesh fill ends mid-card; cards stay in normal flow (no overlap with next section).
 */
export function TrustHeroSection({
  headline,
  headlineAccent,
  headlineAfter,
  subhead,
  features,
}: TrustHeroSectionData) {
  const line =
    `${homeSerif.className} block tracking-[-0.02em] ` +
    `text-[clamp(1.75rem,6.94vw,6.25rem)] leading-none ` +
    `w-full sm:w-max sm:max-w-full sm:whitespace-nowrap`;

  return (
    <section className="relative w-full overflow-visible pb-0 pt-[clamp(9.5rem,calc(47svh-8.75rem),26rem)]">
      {/* Full-bleed mesh stops at mid-card — bottom half sits on page white */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden bg-hero-mesh"
        style={{ bottom: MESH_END_FROM_BOTTOM }}
      >
        <CloudBand priority variant="edge" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[8rem] -top-[10rem] h-[33rem] w-[33rem] rounded-full bg-platform-to opacity-70 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[6rem] top-[-8rem] h-[33rem] w-[33rem] rounded-full bg-brand-veil opacity-80 blur-[150px]"
      />

      <div
        className={`relative z-[1] flex w-full flex-col items-center ${layout.sectionX}`}
      >
        <div
          className={`${layout.inner} flex w-full max-w-[80rem] flex-col items-center gap-10 md:gap-12`}
        >
          <div className="flex w-full flex-col items-center gap-6 text-center sm:gap-8 md:gap-9">
            <h1 className="flex w-full flex-col items-center">
              <span className={`${line} text-navy`}>{headline}</span>
              {headlineAccent ? (
                <span className={`${line} mt-1 italic text-brand sm:mt-1.5`}>
                  {headlineAccent}
                </span>
              ) : null}
              {headlineAfter ? (
                <span className={`${line} mt-1 text-navy sm:mt-1.5`}>
                  {headlineAfter}
                </span>
              ) : null}
            </h1>

            {subhead ? (
              <p className="max-w-[59.625rem] text-base leading-7 text-nav sm:text-xl sm:leading-[1.875rem]">
                {subhead}
              </p>
            ) : null}
          </div>

          {features?.length ? (
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4">
              {features.map((feature) => {
                const iconUrl = feature.icon?.url
                  ? toAbsoluteMediaUrl(feature.icon.url)
                  : null;
                return (
                  <article
                    key={`${feature.title}-${feature.id}`}
                    className="flex min-h-[10.125rem] flex-col items-start gap-6 rounded-3xl border border-line-strong bg-white p-8"
                  >
                    <div className="flex flex-col items-start gap-[0.9375rem]">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-[0.625rem] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]"
                        style={{
                          backgroundColor: feature.iconBg || "var(--color-brand-soft)",
                        }}
                      >
                        {iconUrl ? (
                          <Image
                            src={iconUrl}
                            alt=""
                            width={24}
                            height={24}
                            className="h-6 w-6"
                            unoptimized
                          />
                        ) : null}
                      </div>
                      <div className="flex flex-col items-start gap-1.5">
                        <h2 className="text-xl font-semibold leading-[1.875rem] text-navy">
                          {feature.title}
                        </h2>
                        {feature.description ? (
                          <p className="text-sm leading-5 text-ink">
                            {feature.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
