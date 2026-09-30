"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { homeSerif } from "../ui/fonts";
import { CloudBand } from "../ui/CloudBand";
import { HeroGlowAccent } from "../ui/HeroGlowAccent";
import { layout } from "../ui/type";
import type { ConfirmationSection } from "@/lib/cms/types";

/**
 * Thank-you content — Figma 24794:14598.
 * Centered confirmation + “What happens next?” step cards.
 */

function FileCheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 12.5V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H12M14 11H8M10 15H8M16 7H8M14.5 19L16.5 21L21 16.5"
        className="stroke-brand"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 21V19C22 17.1362 20.7252 15.5701 19 15.126M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M17 21C17 19.1362 17 18.2044 16.6955 17.4693C16.2895 16.4892 15.5108 15.7105 14.5307 15.3045C13.7956 15 12.8638 15 11 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z"
        stroke="#067647"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21.5 18L14.8571 12M9.14286 12L2.50003 18M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z"
        stroke="#4E5BA6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STEP_STYLES: { iconBg: string; icon: ReactNode }[] = [
  { iconBg: "bg-brand-soft", icon: <FileCheckIcon /> },
  { iconBg: "bg-success-bg", icon: <UsersIcon /> },
  { iconBg: "bg-[#EAECF5]", icon: <MailIcon /> },
];

export function ThankYouContent({
  heading,
  headingAccent,
  leadText,
  bodyText,
  stepsHeading,
  steps,
  ctaLabel,
  ctaHref,
}: ConfirmationSection) {
  return (
    <>
      {/* Hero band — mesh + cloud edge, same treatment as the other page heroes */}
      <section
        className={`relative flex w-full flex-col items-center overflow-hidden bg-hero-mesh ${layout.sectionX} pb-[clamp(6rem,20vw,16rem)] pt-[clamp(9.5rem,18vw,15rem)]`}
      >
        <HeroGlowAccent />
        <div className={`${layout.inner} relative z-[1] flex max-w-[80rem] flex-col items-center text-center`}>
          <div className="flex w-full flex-col items-center gap-4 sm:gap-6">
            <h1
              className={`${homeSerif.className} text-display-italic leading-none tracking-[-0.02em]`}
            >
              <span className="text-hero-display-italic">{heading} </span>
              {headingAccent && (
                <span className="text-hero-negotiating">{headingAccent}</span>
              )}
            </h1>
            {leadText && (
              <p className="text-lg font-semibold leading-[1.5] text-ink sm:text-xl sm:leading-[1.875rem]">
                {leadText}
              </p>
            )}
            {bodyText && (
              <p className="max-w-[47.125rem] text-sm italic leading-6 text-ink sm:text-base sm:leading-6">
                {bodyText}
              </p>
            )}
          </div>

        </div>
        <CloudBand priority variant="edge" />
      </section>

      <section className={`relative bg-white ${layout.sectionX} pb-16 sm:pb-20 md:pb-24`}>
        <div
          className={`${layout.inner} flex max-w-[80rem] flex-col items-center gap-8 sm:gap-10 md:gap-12`}
        >
          <div className="flex w-full flex-col items-center gap-8 text-center sm:gap-10 md:gap-12">
            {stepsHeading && (
              <h2
                className={`${homeSerif.className} text-hero-display w-full text-h2 leading-[1.25] tracking-[-0.02em]`}
              >
                {stepsHeading}
              </h2>
            )}

            <ul className="grid w-full grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 md:gap-6 lg:gap-8">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="flex items-start gap-4 rounded-[24px] border border-line-strong bg-white p-5 sm:gap-6 sm:p-8"
                >
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-[10px] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] ${STEP_STYLES[index % STEP_STYLES.length].iconBg}`}
                  >
                    {STEP_STYLES[index % STEP_STYLES.length].icon}
                  </span>
                  <p className="pt-1 text-base font-semibold leading-[1.5] text-ink sm:text-xl sm:leading-[1.875rem]">
                    {step.title}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="inline-flex min-w-[13.125rem] items-center justify-center rounded-pill border border-brand bg-brand px-[1.375rem] py-4 text-lg font-semibold leading-7 text-white shadow-[0_20px_24px_-4px_rgba(16,24,40,0.08),0_8px_8px_-4px_rgba(16,24,40,0.03)] transition-colors hover:bg-brand-hover active:scale-[0.98]"
          >
            {ctaLabel}
          </Link>
          )}
        </div>
      </section>
    </>
  );
}
