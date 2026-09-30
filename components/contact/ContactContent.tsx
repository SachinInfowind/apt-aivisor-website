"use client";

import { CmsImage } from "../ui/CmsImage";
import { homeSerif } from "../ui/fonts";
import { layout } from "../ui/type";
import type { ContactHeroSection, StrapiImage } from "@/lib/cms/types";

/**
 * Contact Us content — Figma 24641:106432 (1440×2012).
 * Hero + vector map + Support / Sales / Phone columns.
 */

function MapMarker({ flag }: { flag?: StrapiImage | null }) {
  return (
    <div
      className="absolute left-[19.5%] top-[40.4%] z-[1] -translate-x-1/2 -translate-y-1/2"
      aria-hidden
    >
      {/* Tooltip — Figma State=Hover */}
      <div className="absolute bottom-[calc(100%+0.5rem)] left-1/2 flex w-max max-w-[16rem] -translate-x-1/2 flex-col items-center">
        <div className="flex items-start gap-1.5 rounded-lg bg-white px-3 py-2 shadow-[0_4px_8px_-2px_rgba(16,24,40,0.1),0_2px_4px_-2px_rgba(16,24,40,0.06)]">
          <CmsImage
            image={flag}
            width={20}
            height={20}
            className="mt-0.5 h-5 w-5 shrink-0"
          />
          <div className="flex flex-col items-start gap-0.5 text-left">
            <p className="text-xs font-semibold leading-[1.125rem] text-heading">
              Austin, Texas, United States
            </p>
            <p className="text-xs font-normal leading-[1.125rem] text-nav">
              Austin, Texas Metropolitan Area
            </p>
          </div>
        </div>
        <svg
          width="16"
          height="6"
          viewBox="0 0 16 6"
          fill="none"
          className="-mt-px drop-shadow-sm"
        >
          <path
            d="M14.0711 -2.51471C14.962 -2.51471 15.4081 -1.43757 14.7782 -0.807603L8.70711 5.26347C8.31658 5.654 7.68342 5.654 7.29289 5.26347L1.22183 -0.807603C0.591867 -1.43757 1.03803 -2.51471 1.92894 -2.51471L14.0711 -2.51471Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Concentric pin */}
      <div className="relative h-10 w-10">
        <span className="absolute -left-1 -top-1 h-12 w-12 rounded-full bg-brand-active opacity-10" />
        <span className="absolute left-2 top-2 h-7 w-7 rounded-full bg-brand-active opacity-20" />
        <span className="absolute left-4 top-4 h-2 w-2 rounded-full bg-brand-active" />
      </div>
    </div>
  );
}

export function ContactContent({
  badgeLabel,
  heading,
  headingAccent,
  subhead,
  contactMethods,
  mapImage,
  flagImage,
}: ContactHeroSection) {
  return (
    <section
      className={`relative w-full bg-white ${layout.sectionX} pb-16 pt-[clamp(9.5rem,18vw,15rem)] sm:pb-20 md:pb-24`}
    >
      <div
        className={`${layout.inner} flex max-w-[80rem] flex-col items-center gap-12 sm:gap-16 md:gap-20`}
      >
        {/* Hero */}
        <div className="flex w-full max-w-[56.5625rem] flex-col items-center gap-6 text-center sm:gap-8 md:gap-9">
          {badgeLabel && (
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white px-2.5 py-1 text-[0.875rem] font-medium leading-5 text-ink shadow-sm">
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-badge-dot"
                aria-hidden
              />
              {badgeLabel}
            </div>
          )}

          <div className="flex w-full flex-col items-center gap-6 sm:gap-8 md:gap-9">
            <h1
              className={`${homeSerif.className} text-display-italic leading-none tracking-[-0.02em]`}
            >
              <span className="text-hero-display-italic">{heading} </span>
              {headingAccent && (
                <span className="text-hero-negotiating">{headingAccent}</span>
              )}
            </h1>
            {subhead && (
              <p className="max-w-[40rem] text-base leading-[1.875rem] text-nav sm:text-xl sm:leading-[1.875rem]">
                {subhead}
              </p>
            )}
          </div>
        </div>

        {/* Map + contact methods */}
        <div className="flex w-full flex-col items-center gap-10 sm:gap-12 md:gap-16">
          <div className="relative w-full max-w-[64rem]">
            <CmsImage
              image={mapImage}
              alt={mapImage?.alternativeText || "World map showing aptAI office locations"}
              width={mapImage?.width ?? 1025}
              height={mapImage?.height ?? 484}
              className="h-auto w-full"
              priority
            />
            <MapMarker flag={flagImage} />
          </div>

          <ul className="grid w-full grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10 md:gap-16">
            {contactMethods.map((item) => (
              <li
                key={item.title}
                className="flex min-w-0 flex-col items-center gap-5 text-center"
              >
                <div className="flex w-full flex-col items-center gap-2">
                  <h2 className="text-xl font-semibold leading-[1.875rem] text-heading">
                    {item.title}
                  </h2>
                  <p className="text-base leading-6 text-nav">
                    {item.description}
                  </p>
                </div>
                <a
                  href={item.href}
                  className="text-base font-semibold leading-6 text-brand-deep transition-colors hover:text-brand"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
