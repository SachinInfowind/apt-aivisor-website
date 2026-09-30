/**
 * Enterprise / Custom plan — Figma Frame 174 (1:7858, 1280×452).
 * White card: badge + copy left, Contact Us right (desktop), feature pill strip.
 */

import type { EnterprisePlanSection } from "@/lib/cms/types";

function FeaturePill({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-pill border border-line-muted bg-surface px-3 py-1 text-sm font-medium leading-5 text-[#3D3B33]">
      {label}
    </span>
  );
}

export function EnterprisePlan({
  badge,
  badgeNote,
  heading,
  headingAccent,
  quote,
  body,
  ctaLabel,
  ctaHref,
  features: featureItems,
  className = "",
}: Partial<Omit<EnterprisePlanSection, "__component" | "id">> & { className?: string }) {
  const FEATURES = (featureItems ?? []).map((f) => f.text);
  // Duplicate for seamless CSS marquee on wider viewports.
  const marquee = [...FEATURES, ...FEATURES];

  return (
    <div
      className={`flex w-full flex-col gap-8 overflow-hidden rounded-[24px] bg-white p-5 sm:gap-[3.875rem] sm:p-8 ${className}`}
    >
      {/* Figma: space-between + align-end — copy left, CTA right */}
      <div className="flex w-full flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-6 sm:gap-8">
          <div className="inline-flex w-fit max-w-full flex-wrap items-center gap-2 rounded-pill border border-line-muted bg-surface-muted py-1 pl-1 pr-2.5 sm:gap-3">
            <span className="inline-flex items-center rounded-pill border border-badge-edge bg-badge-bg px-2.5 py-0.5 text-sm font-medium leading-5 text-badge-text">
              {badge}
            </span>
            <span className="text-sm font-medium leading-5 text-ink">
              {badgeNote}
            </span>
          </div>

          <div className="flex max-w-[48rem] flex-col gap-4 sm:gap-6">
            <h2 className="font-display text-[1.75rem] font-normal italic leading-[1.25] tracking-[-0.02em] sm:text-[2.5rem] sm:leading-[3.75rem] lg:text-[3rem]">
              <span className="text-navy">{heading} </span>
              <span className="text-brand-strong">{headingAccent}</span>
            </h2>

            <div className="flex flex-col gap-4">
              {quote ? (
                <p className="text-base font-medium leading-7 text-ink sm:text-xl sm:leading-7">
                  {quote}
                </p>
              ) : null}
              {body ? (
                <p className="text-base leading-7 text-ink sm:text-xl sm:leading-7">
                  {body}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {ctaLabel && ctaHref ? (
          <a
            href={ctaHref}
            className="inline-flex w-full shrink-0 items-center justify-center rounded-pill border border-brand bg-brand px-[1.125rem] py-3 text-base font-semibold leading-6 text-white shadow-sm transition-colors hover:bg-brand-hover sm:w-auto sm:min-w-[10.8125rem] lg:mb-1"
          >
            {ctaLabel}
          </a>
        ) : null}
      </div>

      {/* Feature pills — wrap on small screens; marquee on md+ */}
      <div className="w-full">
        <div className="flex flex-wrap gap-2 md:hidden">
          {FEATURES.map((label) => (
            <FeaturePill key={label} label={label} />
          ))}
        </div>

        <div className="relative hidden overflow-hidden md:block">
          <div className="enterprise-marquee flex w-max items-center gap-2">
            {marquee.map((label, i) => (
              <FeaturePill key={`${label}-${i}`} label={label} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
