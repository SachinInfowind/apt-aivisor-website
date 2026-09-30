"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SectionBadge } from "../../ui/SectionBadge";
import { CmsImage } from "../../ui/CmsImage";
import { ArrowCircleDownIcon, ArrowCircleLeftIcon } from "../../ui/icons";
import { layout } from "../../ui/type";
import type { ContentItem, HowItWorksSectionData } from "@/lib/cms/types";

/**
 * How it works — Figma "Steps" component set (24418:21073).
 * Artboard stage is 769×544; frame % below are relative to that box so the
 * composition scales fluidly. Accordion + integrations match the Steps column.
 *
 * Copy and images come from the CMS (`sections.how-it-works`). Each step's `variant`
 * picks the preview composition:
 *   dropzone            — centred illustration on a dashed drop area
 *   panel-a/b/c         — a single screenshot panel at the Figma crop for that step
 *   govern              — main card + floating renewals metric + chart badge
 */
const PANELS: Record<string, { frame: string; shadow: string }> = {
  /** 523×382 @ left 123 / top 81 */
  "panel-a": { frame: "left-[16%] top-[14.9%] h-[70.2%] w-[68%]", shadow: "shadow-modal" },
  /** 518×420 @ left 125 / top 62 */
  "panel-b": {
    frame: "left-[16.3%] top-[11.4%] h-[77.2%] w-[67.4%]",
    shadow: "shadow-panel sm:shadow-panel-far",
  },
  /** 607×439 @ left 81 / top 53 */
  "panel-c": {
    frame: "left-[10.5%] top-[9.7%] h-[80.7%] w-[78.9%]",
    shadow: "shadow-panel sm:shadow-panel-far",
  },
};

/**
 * Figma Property 1=Step 5 stage (769×544). Positions are % of that box.
 */
function GovernPreview({ step }: { step: ContentItem }) {
  return (
    <div className="absolute inset-0">
      {/* Main obligations card — 507×376 @ left 131 / top 84 */}
      <div className="absolute left-[17%] top-[15.4%] h-[69.1%] w-[65.9%] overflow-hidden rounded-2xl bg-white shadow-modal sm:rounded-card">
        <CmsImage
          image={step.image}
          alt={`${step.title ?? "Govern"} preview`}
          fill
          sizes="(max-width: 1024px) 92vw, 55vw"
          className="object-cover object-top"
        />
      </div>

      {/* Renewals metric — 276×69 @ left 424 / top 60 */}
      <div className="absolute left-[55.1%] top-[11%] z-10 w-[35.9%] drop-shadow-hero">
        <div className="relative aspect-[4/1] w-full overflow-hidden rounded-lg sm:rounded-field">
          <CmsImage
            image={step.imageSecondary}
            fill
            sizes="(max-width: 1024px) 30vw, 18vw"
            className="object-cover"
          />
          {/* Cover strip over truncated “vs. last quarter” — 50×13 @ left 226 / top 44 of 276×69 */}
          <span
            aria-hidden
            className="absolute left-[81.9%] top-[63.8%] h-[18.8%] w-[18.1%] bg-paper-cool"
          />
        </div>
      </div>

      {/* Chart badge — 83×82 @ left 71 / top 343 */}
      <div className="absolute left-[9.2%] top-[63.1%] z-10 aspect-square w-[10.8%] overflow-hidden rounded-tile bg-white shadow-modal sm:rounded-card">
        <CmsImage
          image={step.imageTertiary}
          fill
          sizes="(max-width: 1024px) 12vw, 6vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

function StepArrow({ active }: { active: boolean }) {
  const Icon = active ? ArrowCircleLeftIcon : ArrowCircleDownIcon;
  return <Icon width={24} height={24} className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />;
}

function StepPreview({ steps, open }: { steps: ContentItem[]; open: number }) {
  const step = steps[open];
  if (!step) return null;

  if (step.variant === "dropzone") {
    // Figma Frame 85 / Ingest Image (769×544 stage):
    // white card 618×406 @ 76,69 + dashed 584×372 @ 93,86 + art 436×333 @ 167,105
    return (
      <div className="absolute inset-0">
        {/* White plate */}
        <div
          aria-hidden
          className="absolute left-[9.9%] top-[12.7%] h-[74.6%] w-[80.4%] rounded-3xl bg-white"
        />
        {/* Dashed dropzone frame */}
        <div
          aria-hidden
          className="absolute left-[12.1%] top-[15.8%] h-[68.4%] w-[75.9%] rounded-xl border-[3px] border-dashed border-brand-accent bg-paper"
        />
        {/* Dropzone illustration */}
        <div className="absolute left-[21.7%] top-[19.3%] h-[61.2%] w-[56.7%]">
          <CmsImage
            image={step.image}
            alt={step.image?.alternativeText || step.title || ""}
            fill
            sizes="(max-width: 1024px) 92vw, 55vw"
            className="object-contain object-center"
            priority
          />
        </div>
      </div>
    );
  }

  if (step.variant === "govern") {
    return <GovernPreview step={step} />;
  }

  const panel = PANELS[step.variant ?? ""] ?? PANELS["panel-a"];
  return (
    <div
      key={open}
      className={`absolute overflow-hidden rounded-2xl bg-white sm:rounded-card ${panel.frame} ${panel.shadow}`}
    >
      <CmsImage
        image={step.image}
        alt={`${step.title ?? "Step"} preview`}
        fill
        sizes="(max-width: 1024px) 92vw, 55vw"
        className="object-cover object-top"
      />
    </div>
  );
}

/** Scroll distance dedicated to each step while the panel is pinned, in vh. */
const STEP_VH = 70;

export function HowItWorksSection({
  badgeLabel,
  heading,
  headingAccent,
  steps,
  integrationLogos,
  integrationsBody,
}: Omit<HowItWorksSectionData, "__component" | "id">) {
  const [open, setOpen] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const stepCount = steps.length;

  useEffect(() => {
    const onScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const scrollable = rect.height - viewportH;
      if (scrollable <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const idx = Math.min(
        stepCount - 1,
        Math.floor(progress * stepCount),
      );
      setOpen(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [stepCount]);

  if (stepCount === 0) return null;

  return (
    <section
      id="how-it-works"
      className={`scroll-mt-24 bg-surface ${layout.sectionX} ${layout.sectionY}`}
    >
      <div
        className={`${layout.inner} flex flex-col gap-10 sm:gap-12 lg:gap-14`}
      >
        <div className="flex max-w-4xl flex-col items-start gap-4 sm:gap-6">
          {badgeLabel ? <SectionBadge>{badgeLabel}</SectionBadge> : null}
          <h2 className="font-display text-h2 font-normal tracking-heading text-navy">
            {heading}{" "}
            {headingAccent ? (
              <em className="italic text-brand-accent">{headingAccent}</em>
            ) : null}
          </h2>
        </div>

        <div
          ref={trackRef}
          className="relative lg:h-[var(--how-track)]"
          style={{ "--how-track": `${stepCount * STEP_VH}vh` } as CSSProperties}
        >
          {/* Sticky two-column Steps layout: preview stage + accordion.
              Outer panel stretches at lg so both columns share height; the
              inner aspect-[769/544] keeps Figma frame % crops undistorted. */}
          <div className="grid gap-8 lg:sticky lg:top-24 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-8 xl:top-28 xl:gap-10">
            <div className="relative aspect-[769/544] w-full overflow-hidden rounded-3xl bg-founder-card lg:flex lg:aspect-auto lg:items-center">
              <div className="relative aspect-[769/544] w-full shrink-0 lg:h-auto">
                <StepPreview steps={steps} open={open} />
              </div>
            </div>

            <div className="flex w-full flex-col gap-6 sm:gap-7.5">
              {/* Figma: #E8F0FF, padding 20, radius 24; inner gap 20 */}
              <div className="rounded-card bg-brand-soft p-4 sm:rounded-3xl sm:p-5">
                <div className="flex flex-col gap-4 sm:gap-5">
                  {steps.map((step, i) => {
                    const active = open === i;
                    return (
                      <button
                        key={step.id ?? i}
                        type="button"
                        onClick={() => setOpen(i)}
                        aria-expanded={active}
                        className={`flex w-full flex-col items-start self-stretch rounded-2xl bg-surface text-left transition-all duration-300 hover:shadow-soft ${
                          active
                            ? "gap-4 p-4 sm:p-5"
                            : "gap-0 px-4 py-3.5 sm:px-5 sm:py-4"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="font-display text-xl leading-7 text-brand-accent sm:text-2xl sm:leading-8">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span
                              className={`font-display text-xl leading-7 sm:text-2xl sm:leading-8 ${
                                active ? "text-brand-accent" : "text-navy"
                              }`}
                            >
                              {step.title}
                            </span>
                          </div>
                          <StepArrow active={active} />
                        </div>
                        {active ? (
                          <p className="text-sm leading-6 text-ink sm:text-base">
                            {step.body}
                          </p>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:gap-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  {(integrationLogos ?? []).map((logo) => (
                    <span
                      key={logo.url}
                      className="grid h-10 w-10 place-items-center rounded-pill bg-white shadow-modal-sm sm:h-12 sm:w-12"
                    >
                      <CmsImage
                        image={logo}
                        width={28}
                        height={28}
                        className="h-6 w-6 object-contain sm:h-7 sm:w-7"
                      />
                    </span>
                  ))}
                </div>
                {integrationsBody ? (
                  <p className="text-sm font-medium leading-5 text-ink sm:text-body-sm sm:leading-5">
                    {integrationsBody}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
