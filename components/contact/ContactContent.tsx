"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { CmsImage } from "../ui/CmsImage";
import { HeroGlowAccent } from "../ui/HeroGlowAccent";
import { homeSerif } from "../ui/fonts";
import { layout } from "../ui/type";
import type { ContactHeroSection } from "@/lib/cms/types";

/**
 * Contact Us content — Figma 24641:106432 (1440×2012).
 * Hero + vector map + Support / Sales / Phone columns.
 */

const INDIA_FLAG = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <circle cx="10" cy="10" r="10" fill="#F0F0F0" />
    <path d="M10 0C6.035 0 2.61 2.307.992 5.651h18.016C17.39 2.307 13.965 0 10 0Z" fill="#FF9811" />
    <path d="M10 20c3.965 0 7.39-2.307 9.008-5.652H.992C2.61 17.693 6.035 20 10 20Z" fill="#6DA544" />
    <circle cx="10" cy="10" r="3.48" fill="#0052B4" />
    <circle cx="10" cy="10" r="2.17" fill="#F0F0F0" />
  </svg>
);

/** Office pin — Figma "_Map location marker" (State=Hover). Position is a % of the 1024×488 map. */
function MapMarker({
  left,
  top,
  flag,
  title,
  subtitle,
}: {
  left: string;
  top: string;
  flag: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className="absolute z-[1] -translate-x-1/2 -translate-y-1/2"
      style={{ left, top }}
      aria-hidden
    >
      {/* Tooltip */}
      <div className="absolute bottom-[calc(100%+0.25rem)] left-1/2 flex w-max max-w-[14rem] -translate-x-1/2 flex-col items-center drop-shadow-[0_12px_16px_rgba(16,24,40,0.08)]">
        <div className="flex flex-col items-center gap-2 rounded-lg bg-white px-4 py-3">
          {flag}
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-xs font-semibold leading-[1.125rem] text-heading">{title}</p>
            <p className="text-xs font-normal leading-[1.125rem] text-nav">{subtitle}</p>
          </div>
        </div>
        <svg width="16" height="6" viewBox="0 0 16 6" fill="none" className="-mt-px">
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
  flagImage,
}: ContactHeroSection) {
  return (
    <>
      {/* Hero + map share one surface (Figma "Contact page header"): the blue wash fades to
          white behind the map instead of ending in a hard edge. */}
      <section className="relative w-full overflow-hidden bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[min(46rem,85%)] bg-[linear-gradient(180deg,#C4DCFF_0%,#E4EFFF_45%,#FFFFFF_100%)]"
        />
        <HeroGlowAccent />
        <div className={`relative z-[1] ${layout.sectionX} pb-16 pt-[clamp(9.5rem,18vw,15rem)] sm:pb-20 md:pb-24`}>
        <div
          className={`${layout.inner} flex max-w-[80rem] flex-col items-center gap-12 sm:gap-16 md:gap-20`}
        >
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
              <span className="text-hero-display">{heading} </span>
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
          <div className="relative aspect-[1024/488] w-full max-w-[64rem]">
            <Image
              src="/assets/contact/world-map.png"
              alt="World map showing aptAI office locations in Austin, United States and Indore, India"
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-contain"
              priority
            />
            <MapMarker
              left="21.48%"
              top="44.47%"
              flag={
                <CmsImage image={flagImage} width={20} height={20} className="h-5 w-5 shrink-0" />
              }
              title="Austin, Texas, United States"
              subtitle="Austin, Texas Metropolitan Area"
            />
            <MapMarker
              left="69.43%"
              top="50%"
              flag={INDIA_FLAG}
              title="Indore, Madhya Pradesh, India"
              subtitle="New Palasia Area"
            />
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
        </div>
      </section>
    </>
  );
}
