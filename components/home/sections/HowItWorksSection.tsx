"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SectionBadge } from "../../ui/SectionBadge";
import { homeAssets } from "../../ui/assets";
import { layout } from "../../ui/type";

/**
 * How it works — Figma "Steps" component set (24418:21073).
 * Artboard stage is 769×544; frame % below are relative to that box so the
 * composition scales fluidly. Accordion + integrations match the Steps column.
 */
const steps = [
  {
    n: "01",
    title: "Ingest",
    body: "Upload contracts, emails, or CRM records in any format.",
    /** Centered in stage (Figma flex center). */
    frame: "",
    shadow: "",
  },
  {
    n: "02",
    title: "Analyze",
    body: "AI risk-scores clauses, benchmarks pricing, flags anomalies",
    /** 523×382 @ left 123 / top 81 */
    frame: "left-[16%] top-[14.9%] h-[70.2%] w-[68%]",
    shadow:
      "shadow-modal",
  },
  {
    n: "03",
    title: "Negotiate",
    body: "Get a specific playbook — what to push, what leverage you have",
    /** 518×420 @ left 125 / top 62 */
    frame: "left-[16.3%] top-[11.4%] h-[77.2%] w-[67.4%]",
    shadow:
      "shadow-panel sm:shadow-panel-far",
  },
  {
    n: "04",
    title: "Close",
    body: "Auto-generate approvals, business cases, and summaries",
    /** 607×439 @ left 81 / top 53 */
    frame: "left-[10.5%] top-[9.7%] h-[80.7%] w-[78.9%]",
    shadow:
      "shadow-panel sm:shadow-panel-far",
  },
  {
    n: "05",
    title: "Govern",
    body: "Monitor obligations, track renewals, measure outcomes",
    frame: "",
    shadow: "",
  },
] as const;

/**
 * Figma Property 1=Step 5 stage (769×544). Positions are % of that box.
 */
function GovernPreview() {
  return (
    <div className="absolute inset-0">
      {/* Main obligations card — 507×376 @ left 131 / top 84 */}
      <div className="absolute left-[17%] top-[15.4%] h-[69.1%] w-[65.9%] overflow-hidden rounded-2xl bg-white shadow-modal sm:rounded-card">
        <Image
          src={homeAssets.how.step5.main}
          alt="Obligations tracking preview"
          fill
          sizes="(max-width: 1024px) 92vw, 55vw"
          className="object-cover object-top"
        />
      </div>

      {/* Renewals metric — 276×69 @ left 424 / top 60 */}
      <div className="absolute left-[55.1%] top-[11%] z-10 w-[35.9%] drop-shadow-hero">
        <div className="relative aspect-[4/1] w-full overflow-hidden rounded-lg sm:rounded-field">
          <Image
            src={homeAssets.how.step5.overlay}
            alt=""
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
        <Image
          src={homeAssets.how.step5.badge}
          alt=""
          fill
          sizes="(max-width: 1024px) 12vw, 6vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

function StepArrow({ active }: { active: boolean }) {
  return (
    <Image
      src={
        active
          ? "/assets/arrow-circle-left.svg"
          : "/assets/arrow-circle-down.svg"
      }
      alt=""
      width={24}
      height={24}
      className="h-5 w-5 shrink-0 sm:h-6 sm:w-6"
    />
  );
}

function StepPreview({ open }: { open: number }) {
  if (open === 0) {
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
          <Image
            src={homeAssets.how.stepImages[0]}
            alt="Drag and drop your files here"
            fill
            sizes="(max-width: 1024px) 92vw, 55vw"
            className="object-contain object-center"
            priority
          />
        </div>
      </div>
    );
  }

  if (open === 4) {
    return <GovernPreview />;
  }

  const step = steps[open];
  return (
    <div
      key={open}
      className={`absolute overflow-hidden rounded-2xl bg-white sm:rounded-card ${step.frame} ${step.shadow}`}
    >
      <Image
        src={homeAssets.how.stepImages[open]}
        alt={`${step.title} preview`}
        fill
        sizes="(max-width: 1024px) 92vw, 55vw"
        className="object-cover object-top"
      />
    </div>
  );
}

/** Scroll distance dedicated to each step while the panel is pinned, in vh.
 * Track height below must stay `steps.length * STEP_VH` — Tailwind can't read
 * this constant into its arbitrary-value class, so `lg:h-scroll` is hand-synced. */
const STEP_VH = 70;
const TRACK_VH_CLASS = "350vh";

export function HowItWorksSection() {
  const [open, setOpen] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  if (process.env.NODE_ENV !== "production") {
    const expected = `${steps.length * STEP_VH}vh`;
    if (expected !== TRACK_VH_CLASS) {
      throw new Error(
        `HowItWorksSection: lg:h-[${TRACK_VH_CLASS}] is out of sync with steps.length * STEP_VH (${expected}) — update the hardcoded class.`,
      );
    }
  }

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
        steps.length - 1,
        Math.floor(progress * steps.length),
      );
      setOpen(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="how-it-works"
      className={`scroll-mt-24 bg-surface ${layout.sectionX} ${layout.sectionY}`}
    >
      <div
        className={`${layout.inner} flex flex-col gap-10 sm:gap-12 lg:gap-14`}
      >
        <div className="flex max-w-4xl flex-col items-start gap-4 sm:gap-6">
          <SectionBadge>How it works</SectionBadge>
          <h2 className="font-display text-h2 font-normal tracking-heading text-navy">
            From first conversation to{" "}
            <em className="italic text-brand-accent">
              final signature and everything after
            </em>
          </h2>
        </div>

        <div ref={trackRef} className="relative lg:h-scroll">
          {/* Sticky two-column Steps layout: preview stage + accordion.
              Outer panel stretches at lg so both columns share height; the
              inner aspect-[769/544] keeps Figma frame % crops undistorted. */}
          <div className="grid gap-8 lg:sticky lg:top-24 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-8 xl:top-28 xl:gap-10">
            <div className="relative aspect-[769/544] w-full overflow-hidden rounded-3xl bg-founder-card lg:col-start-1 lg:row-start-1 lg:aspect-auto">
              <div className="relative aspect-[769/544] w-full lg:absolute lg:inset-0 lg:aspect-auto">
                <StepPreview open={open} />
              </div>
            </div>

            {/* lg:contents lifts accordion + logos into the grid so the preview
                row ends with the accordion and the logos sit below, separate. */}
            <div className="flex w-full flex-col gap-6 sm:gap-7.5 lg:contents">
              {/* Figma: #E8F0FF, padding 20, radius 24; inner gap 20 */}
              <div className="rounded-card bg-brand-soft p-4 sm:rounded-3xl sm:p-5 lg:col-start-2 lg:row-start-1">
                <div className="flex flex-col gap-4 sm:gap-5">
                  {steps.map((step, i) => {
                    const active = open === i;
                    return (
                      <button
                        key={step.n}
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
                              {step.n}
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

              <div className="flex flex-col gap-3 sm:gap-3.5 lg:col-start-2 lg:row-start-2">
                <div className="flex flex-wrap items-center gap-2">
                  {homeAssets.how.integrations.map((src) => (
                    <span
                      key={src}
                      className="grid h-10 w-10 place-items-center rounded-pill bg-white shadow-modal-sm sm:h-12 sm:w-12"
                    >
                      <Image
                        src={src}
                        alt=""
                        width={28}
                        height={28}
                        className="h-6 w-6 object-contain sm:h-7 sm:w-7"
                      />
                    </span>
                  ))}
                </div>
                <p className="text-sm font-medium leading-5 text-ink sm:text-body-sm sm:leading-5">
                  Connect the platforms you already rely on from Salesforce
                  and Microsoft to leading AI tools and work with your
                  procurement data without switching between systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
