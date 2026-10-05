"use client";

import { useState } from "react";
import { SectionBadge } from "../../ui/SectionBadge";
import { CmsImage } from "../../ui/CmsImage";
import { layout } from "../../ui/type";
import type { ContentItem, ModulesSectionData } from "@/lib/cms/types";

/**
 * Four Modules — hover states from Figma “Hover Components” (24392:17464).
 * Stage 630×568 @1440; fluid up to 1920.
 *
 * Copy and images come from the CMS (`sections.modules`). Each item's `variant`
 * picks the preview frame geometry from the Figma export:
 *   framed — 427×423 @ left 102 top 72 inside 630×568
 *   wide   — 572×474 @ left 58 top 94, radius 20 0 24 0
 *   bleed  — 581×446 @ left 49 top 122, radius 20 0
 */
const FRAMES: Record<string, string> = {
  framed:
    "left-[16.2%] top-[12.7%] w-[67.8%] aspect-[106/105] rounded-[1.25rem] shadow-[0_6.25rem_12.5rem_0_rgba(52,64,84,0.18)]",
  wide: "left-[9.2%] top-[16.5%] w-[90.8%] aspect-[251/208] rounded-tl-[1.25rem] rounded-br-[1.5rem] rounded-tr-none rounded-bl-none shadow-none",
  bleed:
    "left-[7.8%] top-[21.5%] w-[92.2%] aspect-[99/76] rounded-l-[1.25rem] rounded-r-none shadow-none",
};

type Module = ContentItem & { key: string };

function ModuleCard({
  m,
  selected,
  onSelect,
}: {
  m: Module;
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
      <CmsImage
        image={m.icon}
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
  activeModule: Module;
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
        key={activeModule.key}
        className={`absolute overflow-hidden bg-white transition-[opacity,transform] duration-300 ease-out ${FRAMES[activeModule.variant ?? ""] ?? FRAMES.wide}`}
      >
        <CmsImage
          image={activeModule.image}
          alt={`${activeModule.title ?? "Module"} preview`}
          fill
          sizes={sizes}
          className="object-cover object-top"
          priority={activeModule.key === "0"}
        />
      </div>
    </div>
  );
}

export function ModulesSection({
  badgeLabel,
  heading,
  headingAccent,
  subhead,
  ctaLabel,
  ctaHref,
  viewingLabel,
  items,
}: Omit<ModulesSectionData, "__component" | "id">) {
  const modules: Module[] = items.map((item, i) => ({ ...item, key: String(i) }));
  const [active, setActive] = useState("0");
  const left = modules.slice(0, 2);
  const right = modules.slice(2);
  const activeModule = modules.find((m) => m.key === active) ?? modules[0];

  if (!activeModule) return null;

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
            {badgeLabel ? <SectionBadge>{badgeLabel}</SectionBadge> : null}
            <h2 className="font-display text-h2 font-normal tracking-[-0.02em] text-navy">
              {heading}{" "}
              {headingAccent ? (
                <em className="italic text-brand-accent">{headingAccent}</em>
              ) : null}
            </h2>
          </div>
          {subhead ? (
            <p className="max-w-2xl text-[1rem] font-medium leading-7 text-ink sm:text-[1.125rem] sm:leading-8">
              {subhead}
            </p>
          ) : null}
          {ctaLabel && ctaHref ? (
            <a
              href={ctaHref}
              className="inline-flex h-11 items-center justify-center rounded-pill border border-brand bg-brand px-5 text-[0.875rem] font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover active:scale-[0.98] sm:h-12 sm:text-[1rem]"
            >
              {ctaLabel}
            </a>
          ) : null}
        </div>

        {/* Mobile/tablet */}
        <div className="flex flex-col gap-6 lg:hidden">
          <ModuleStage
            activeModule={activeModule}
            className="mx-auto w-full max-w-lg sm:rounded-[1.5rem]"
            sizes="(max-width: 1024px) 90vw, 500px"
          />
          <p className="text-center text-caption font-medium text-nav">
            {viewingLabel} {activeModule.title}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {modules.map((m) => (
              <ModuleCard
                key={m.key}
                m={m}
                selected={active === m.key}
                onSelect={() => setActive(m.key)}
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
                key={m.key}
                m={m}
                selected={active === m.key}
                onSelect={() => setActive(m.key)}
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
                key={m.key}
                m={m}
                selected={active === m.key}
                onSelect={() => setActive(m.key)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
