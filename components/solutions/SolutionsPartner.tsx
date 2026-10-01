"use client";

import { useState } from "react";
import { homeSerif } from "@/components/ui/fonts";
import type { PartnerSource, PartnerTone } from "@/lib/cms/types";

/**
 * Design partner program — Figma 26316:10479.
 * One source opens at a time. Copy and badges come from Strapi.
 */

const chip: Record<PartnerTone, string> = {
  success: "border-chip-success-edge bg-chip-success-bg text-chip-success-fg",
  orange: "border-chip-orange-edge bg-chip-orange-bg text-chip-orange-fg",
  pink: "border-chip-pink-edge bg-chip-pink-bg text-chip-pink-fg",
};

function MinusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M4.16797 10H15.8346"
        className="stroke-faint"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10.0013 4.16797V15.8346M4.16797 10.0013H15.8346"
        className="stroke-faint"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SolutionsPartner({
  badge,
  headline,
  headlineAccent,
  body,
  items,
}: {
  badge?: string;
  headline: string;
  headlineAccent?: string;
  body?: string;
  items?: PartnerSource[];
}) {
  const sources = (items ?? []).filter((item) => item.title);
  const [open, setOpen] = useState(0);

  return (
    <section className="w-full bg-surface px-4 py-16 sm:px-8 sm:py-20 md:px-10 xl:px-20 xl:py-[6.25rem]">
      <div className="mx-auto flex w-full max-w-[80rem] flex-col items-start gap-10 lg:flex-row lg:gap-12">
        <div className="flex w-full max-w-[20.1875rem] shrink-0 flex-col items-start gap-3">
          <div className="flex flex-col items-start gap-6">
            {badge ? (
              <span className="inline-flex items-center gap-1.5 rounded-pill border border-badge-edge bg-badge-bg py-1 pl-2.5 pr-3 text-body-sm font-medium text-badge-text">
                <span className="size-1.5 shrink-0 rounded-full bg-badge-dot" aria-hidden />
                {badge}
              </span>
            ) : null}
            <h2
              className={`${homeSerif.className} text-[clamp(2.25rem,4vw,3rem)] leading-[1.2] tracking-[-0.02em]`}
            >
              <span className="text-navy">
                {headline}
                {headlineAccent ? " " : ""}
              </span>
              {headlineAccent ? (
                <span className="italic text-brand-accent">{headlineAccent}</span>
              ) : null}
            </h2>
          </div>
          {body ? (
            <p className="text-base font-medium leading-7 text-ink sm:text-body-lg">
              {body}
            </p>
          ) : null}
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-8">
          {sources.map((source, index) => {
            const expanded = index === open;
            const tone = chip[source.tone ?? "success"] ?? chip.success;
            const panelId = `partner-source-${source.id ?? index}`;
            return (
              <div key={source.id ?? source.title} className="flex flex-col">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpen(expanded ? -1 : index)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-4 p-6 text-left transition-colors ${
                    expanded
                      ? source.body
                        ? "rounded-t-3xl bg-brand-strong"
                        : "rounded-3xl bg-brand-strong"
                      : "rounded-3xl bg-surface-muted hover:bg-line-strong/40"
                  }`}
                >
                  <div className="flex min-w-0 flex-wrap items-center gap-4">
                    <h3
                      className={`${homeSerif.className} text-2xl leading-8 sm:text-[1.875rem] sm:leading-[2.375rem] ${
                        expanded ? "text-white" : "text-navy"
                      }`}
                    >
                      {source.title}
                    </h3>
                    {source.badge ? (
                      <span
                        className={`inline-flex items-center rounded-pill border px-3 py-1 text-body-sm font-medium ${tone}`}
                      >
                        {source.badge}
                      </span>
                    ) : null}
                  </div>
                  <span
                    aria-hidden
                    className={`inline-flex size-10 shrink-0 items-center justify-center rounded-pill shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] ${
                      expanded ? "bg-white" : "bg-line-strong"
                    }`}
                  >
                    {expanded ? <MinusIcon /> : <PlusIcon />}
                  </span>
                  <span className="sr-only">
                    {expanded ? `Collapse ${source.title}` : `Expand ${source.title}`}
                  </span>
                </button>
                {expanded && source.body ? (
                  <div
                    id={panelId}
                    className="rounded-b-3xl bg-brand-soft p-6"
                  >
                    <p className="text-body text-navy">{source.body}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
