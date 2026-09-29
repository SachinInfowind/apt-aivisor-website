"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { DesignPartnerTimelineSection } from "@/lib/cms/types";

/** Scroll distance given to each step while the panel is pinned, in vh
 * (same value as the home page "How it works"). */
const STEP_VH = 70;

/**
 * "From application to first insight" — Figma "How it works" (Frame 85 +
 * the four per-step states). Accordion of numbered steps; the open step is
 * highlighted and swaps the illustration on the left. Each step's
 * illustration is its `image` in Strapi.
 *
 * Scroll effect (same as the home "How it works"): from `lg` up the panel
 * pins under the header and scrolling advances through the steps; clicking a
 * step still opens it. Below `lg` it's a plain click accordion.
 */
function ArrowIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d={
          active
            ? "M12 16L8 12L12 8M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
            : "M16 12L12 16L8 12M12 16V8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        }
        className={active ? "stroke-brand-accent" : "stroke-navy"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TimelineSection({
  badgeLabel,
  heading,
  headingAccent,
  steps,
}: DesignPartnerTimelineSection) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const stepCount = steps?.length ?? 0;

  useEffect(() => {
    if (stepCount < 2) return;
    const lg = window.matchMedia("(min-width: 1024px)");
    const onScroll = () => {
      const el = trackRef.current;
      if (!el || !lg.matches) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      setActiveIndex(Math.min(stepCount - 1, Math.floor(progress * stepCount)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    lg.addEventListener("change", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      lg.removeEventListener("change", onScroll);
    };
  }, [stepCount]);
  const image = steps?.[activeIndex]?.image;
  const imageUrl = image?.url ? toAbsoluteMediaUrl(image.url) : null;

  return (
    <section
      className={`w-full bg-surface py-16 sm:py-20 md:py-section-y ${layout.sectionX}`}
    >
      <div
        className={`${layout.inner} flex w-full max-w-container flex-col gap-10`}
      >
        <div className="flex w-full flex-col items-start gap-6">
          {badgeLabel ? (
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-info-edge bg-info-bg py-1 pl-2.5 pr-3">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                <circle className="fill-info" cx="4" cy="4" r="3" />
              </svg>
              <span className="text-sm font-medium leading-5 text-info-fg">
                {badgeLabel}
              </span>
            </div>
          ) : null}
          <h2
            className={`${homeSerif.className} max-w-[63.8125rem] text-[clamp(2rem,3.4vw,3rem)] italic leading-heading tracking-heading text-navy`}
          >
            {heading}
            {headingAccent ? (
              <>
                {" "}
                <span className="text-brand-accent">{headingAccent}</span>
              </>
            ) : null}
          </h2>
        </div>

        <div
          ref={trackRef}
          className="relative lg:h-[var(--track)]"
          style={{ "--track": `${stepCount * STEP_VH}vh` } as CSSProperties}
        >
        <div className="grid w-full grid-cols-1 gap-6 lg:sticky lg:top-24 lg:grid-cols-2 lg:gap-[2.4375rem] xl:top-28">
          <div
            aria-hidden
            className="flex min-h-block w-full items-center justify-center rounded-3xl bg-linear-to-b from-brand-soft to-brand-light p-2.5 lg:min-h-[29.1875rem]"
          >
            {imageUrl ? (
              <Image
                key={imageUrl}
                src={imageUrl}
                alt=""
                width={image?.width ?? 504}
                height={image?.height ?? 447}
                sizes="(min-width: 1024px) 504px, 90vw"
                className="h-auto w-full max-w-copy"
                priority={activeIndex === 0}
              />
            ) : null}
          </div>

          <div className="flex w-full flex-col rounded-3xl bg-brand-soft p-4 sm:p-5">
            <ol className="flex w-full flex-1 flex-col gap-5">
              {steps?.map((step, index) => {
                const active = index === activeIndex;
                const panelId = `dp-step-panel-${index}`;
                return (
                  <li key={step.number} className="w-full">
                    <button
                      type="button"
                      aria-expanded={active}
                      aria-controls={panelId}
                      onClick={() => setActiveIndex(index)}
                      className="flex w-full cursor-pointer flex-col items-start gap-4 rounded-2xl bg-surface p-5 text-left transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
                    >
                      <span className="flex w-full items-center justify-between gap-3">
                        <span
                          className={`${homeSerif.className} flex items-center gap-2 text-2xl leading-8 ${
                            active ? "text-brand-accent" : "text-navy"
                          }`}
                        >
                          <span className="text-brand-accent">{step.number}</span>
                          <span>{step.title}</span>
                        </span>
                        <ArrowIcon active={active} />
                      </span>
                      {active && step.description ? (
                        <span
                          id={panelId}
                          className="max-w-[22.5rem] text-base leading-6 text-ink"
                        >
                          {step.description}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
