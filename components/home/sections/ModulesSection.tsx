"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionBadge } from "../../ui/SectionBadge";
import { homeAssets } from "../../ui/assets";
import { layout } from "../../ui/type";

type ModuleId = "chatbot" | "pricing" | "builder" | "pnl";

/**
 * Four Modules — hover states from Figma “Hover Components” (24392:17464).
 * Stage 630×568 @1440; fluid up to 1920.
 */
const modules = [
  {
    id: "chatbot" as const,
    title: "Contract chatbot",
    body: "Ask anything about contracts, clauses, or pricing. Get answers from Claude, GPT-4, and Gemini side-by-side with citations grounded in your own contract data.",
    icon: homeAssets.modules.icons.chatbot,
    preview: homeAssets.modules.previews.chatbot,
    /** Figma: 427×423 @ left 102 top 72 inside 630×568 */
    frame:
      "left-[16.2%] top-[12.7%] w-[67.8%] aspect-[106/105] rounded-[1.25rem] shadow-[0_6.25rem_12.5rem_0_rgba(52,64,84,0.18)]",
  },
  {
    id: "pricing" as const,
    title: "Pricing Intelligence",
    body: "Benchmark your vendor contracts against real market data. Get overpayment alerts, negotiation playbooks, and renewal warnings 90 days before auto-renewal.",
    icon: homeAssets.modules.icons.pricing,
    preview: homeAssets.modules.previews.pricing,
    /** Figma: 572×474 @ left 58 top 94 — radius 20 0 24 0 */
    frame:
      "left-[9.2%] top-[16.5%] w-[90.8%] aspect-[251/208] rounded-tl-[1.25rem] rounded-br-[1.5rem] rounded-tr-none rounded-bl-none shadow-none",
  },
  {
    id: "builder" as const,
    title: "Contract builder",
    body: "Upload a PDF, paste an email, or start from a template. AI drafts the contract, flags risky clauses, suggests redlines, and routes for approval.",
    icon: homeAssets.modules.icons.builder,
    preview: homeAssets.modules.previews.builder,
    /** Figma: 572×474 @ left 58 top 94 — radius 20 0 24 0 */
    frame:
      "left-[9.2%] top-[16.5%] w-[90.8%] aspect-[251/208] rounded-tl-[1.25rem] rounded-br-[1.5rem] rounded-tr-none rounded-bl-none shadow-none",
  },
  {
    id: "pnl" as const,
    title: "Deal P&L builder",
    body: "Model the true economics of any deal. AI extracts pricing tiers, escalations, and overages directly from contracts and builds a 3-year cost model automatically.",
    icon: homeAssets.modules.icons.pnl,
    preview: homeAssets.modules.previews.pnl,
    /** Figma: 581×446 @ left 49 top 122 — radius 20 0 */
    frame:
      "left-[7.8%] top-[21.5%] w-[92.2%] aspect-[99/76] rounded-l-[1.25rem] rounded-r-none shadow-none",
  },
] as const;

function ModuleCard({
  m,
  selected,
  onSelect,
}: {
  m: (typeof modules)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full flex-col gap-5 rounded-[1.25rem] p-5 text-left transition-colors duration-300 ${
        selected ? "bg-brand-soft" : "bg-white hover:bg-brand-wash"
      }`}
    >
      <Image
        src={m.icon}
        alt=""
        width={48}
        height={48}
        className="h-10 w-10 shrink-0 sm:h-12 sm:w-12"
      />
      <span className="flex flex-col gap-2">
        <span className="font-display text-[1.25rem] leading-7 text-navy sm:text-[1.5rem] sm:leading-8">
          {m.title}
        </span>
        <span className="text-[0.875rem] leading-5 text-ink sm:text-[1rem] sm:leading-6">
          {m.body}
        </span>
      </span>
    </button>
  );
}

function ModuleStage({
  activeModule,
  className,
  sizes,
  matchHeight,
}: {
  activeModule: (typeof modules)[number];
  className?: string;
  sizes: string;
  /** When true, stage fills the height of its flex row instead of forcing its own aspect ratio — keeps it aligned with sibling card columns whose height is driven by text content. */
  matchHeight?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.5rem] bg-founder-card ${matchHeight ? "" : "aspect-[630/568]"} ${className ?? ""}`}
    >
      <div
        key={activeModule.id}
        className={`absolute overflow-hidden bg-white transition-[opacity,transform] duration-300 ease-out ${activeModule.frame}`}
      >
        <Image
          src={activeModule.preview}
          alt={`${activeModule.title} preview`}
          fill
          sizes={sizes}
          className="object-cover object-top"
          priority={activeModule.id === "chatbot"}
        />
      </div>
    </div>
  );
}

export function ModulesSection() {
  const [active, setActive] = useState<ModuleId>("chatbot");
  const left = modules.slice(0, 2);
  const right = modules.slice(2);
  const activeModule = modules.find((m) => m.id === active) ?? modules[0];

  return (
    <section
      className={`bg-white ${layout.sectionX} ${layout.sectionY}`}
      id="product"
    >
      <div
        className={`${layout.inner} flex flex-col gap-10 sm:gap-12 lg:gap-14`}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center sm:gap-8 lg:gap-10">
          <div className="flex w-full flex-col items-center gap-4 sm:gap-6">
            <SectionBadge>The aptAIvisor platform</SectionBadge>
            <h2 className="font-display text-h2 font-normal tracking-[-0.02em] text-navy">
              Four Modules.{" "}
              <em className="italic text-brand-accent">One Platform.</em>
            </h2>
          </div>
          <p className="max-w-2xl text-[1rem] font-medium leading-7 text-ink sm:text-[1.125rem] sm:leading-8">
            Each module works standalone. Together they form a complete deal
            intelligence layer for both sides of every technology transaction.
          </p>
          <a
            href="/waitlist"
            className="inline-flex h-11 items-center justify-center rounded-pill border border-brand bg-brand px-5 text-[0.875rem] font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover active:scale-[0.98] sm:h-12 sm:text-[1rem]"
          >
            Join the waitlist
          </a>
        </div>

        {/* Mobile/tablet */}
        <div className="flex flex-col gap-6 lg:hidden">
          <ModuleStage
            activeModule={activeModule}
            className="mx-auto w-full max-w-lg sm:rounded-[1.5rem]"
            sizes="(max-width: 1024px) 90vw, 500px"
          />
          <p className="text-center text-caption font-medium text-nav">
            Viewing: {activeModule.title}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {modules.map((m) => (
              <ModuleCard
                key={m.id}
                m={m}
                selected={active === m.id}
                onSelect={() => setActive(m.id)}
              />
            ))}
          </div>
        </div>

        {/* Desktop: left | stage | right — hover swaps center preview.
            items-stretch (default) makes all three columns share the row's
            tallest natural height (the two-card columns), and the stage fills
            that height via matchHeight so its edges stay aligned with the
            cards' top/bottom at every viewport width. */}
        <div className="hidden justify-center gap-6 lg:flex xl:gap-8 2xl:gap-9">
          <div className="flex w-[min(100%,18.75rem)] shrink-0 flex-col justify-between gap-6 xl:w-[20rem] 2xl:w-[23.75rem] 2xl:gap-8">
            {left.map((m) => (
              <ModuleCard
                key={m.id}
                m={m}
                selected={active === m.id}
                onSelect={() => setActive(m.id)}
              />
            ))}
          </div>

          <ModuleStage
            activeModule={activeModule}
            matchHeight
            className="w-full min-w-0 max-w-[min(100%,39.375rem)] shrink 2xl:max-w-[48.75rem]"
            sizes="(max-width: 1536px) 40vw, 560px"
          />

          <div className="flex w-[min(100%,18.75rem)] shrink-0 flex-col justify-between gap-6 xl:w-[20rem] 2xl:w-[23.75rem] 2xl:gap-8">
            {right.map((m) => (
              <ModuleCard
                key={m.id}
                m={m}
                selected={active === m.id}
                onSelect={() => setActive(m.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
