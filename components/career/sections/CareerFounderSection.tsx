"use client";

import Image from "next/image";
import { homeSerif } from "../../ui/fonts";
import { SectionBadge } from "../../ui/SectionBadge";
import { layout } from "../../ui/type";
import type { FounderHighlightSection } from "@/lib/cms/types";

/**
 * Career Founder Section — Figma 24631:7494 (1440×581).
 * Right visual is Frame 269 SVG (exported asset), not hand-built CSS cards.
 */
export function CareerFounderSection({
  badgeLabel,
  heading,
  headingAccent,
  body,
  cardTitle,
}: FounderHighlightSection) {
  return (
    <section
      id="careers"
      className={`relative isolate z-0 bg-white ${layout.sectionX} pb-12 pt-8 sm:pb-16 sm:pt-10 md:pb-20 md:pt-12`}
    >
      <div className={`${layout.inner} relative`}>
        <div className="bg-career-founder-panel relative overflow-hidden rounded-[24px] border-2 border-brand-veil px-4 py-8 sm:overflow-visible sm:px-8 sm:py-12 md:px-12 md:py-14 lg:overflow-hidden lg:px-16 lg:pb-[4.375rem] lg:pt-[3.75rem]">
          {/* Subtract rings */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-[18rem] -right-[14rem] hidden h-[49.1875rem] w-[49.1875rem] opacity-10 sm:block lg:-bottom-[18.25rem] lg:-right-[23.5rem]"
          >
            <Image
              src="/assets/career/subtract-0.svg"
              alt=""
              width={787}
              height={787}
              className="h-full w-full"
            />
            <Image
              src="/assets/career/subtract-1.svg"
              alt=""
              width={440}
              height={440}
              className="absolute left-[22%] top-[22%] h-[56%] w-[56%]"
            />
          </div>

          <div className="relative z-[1] flex flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            {/* Left copy */}
            <div className="flex w-full flex-col items-start gap-5 sm:gap-6 lg:max-w-[37.5rem] lg:flex-1 lg:pr-4">
              {badgeLabel && <SectionBadge>{badgeLabel}</SectionBadge>}

              <div className="flex w-full flex-col gap-5 sm:gap-6">
                <h2
                  className={`${homeSerif.className} text-[clamp(1.75rem,6vw,3rem)] font-normal italic leading-[1.2] tracking-[-0.02em]`}
                >
                  <span className="text-navy">{heading} </span>
                  {headingAccent && (
                    <span className="text-brand-accent">{headingAccent}</span>
                  )}
                </h2>

                <p className="max-w-[37.5rem] text-sm leading-6 text-ink sm:text-base">
                  {body.split("\n\n").map((paragraph, index) => (
                    <span key={index}>
                      {index > 0 && (
                        <>
                          <br />
                          <br />
                        </>
                      )}
                      {paragraph}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            {/* Right visual — Frame 269 export */}
            <div className="relative mx-auto w-full max-w-[37.5625rem] shrink-0 lg:mx-0 lg:ml-auto lg:w-[min(100%,37.5625rem)]">
              <Image
                src="/assets/career/founding-team-card.svg"
                alt={cardTitle || "Join the Founding Team"}
                width={601}
                height={402}
                className="h-auto w-full"
                unoptimized
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
