"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * Platform ROI — Figma component set (1:8031).
 * Three Property 1 variants switch via pill tabs; layout stays fluid.
 */

export type PlatformRoiId = "buyer" | "seller" | "both";

type RoiStat = { value: string; label: string };

type RoiVariant = {
  id: PlatformRoiId;
  tab: string;
  /** Navy serif line */
  title: string;
  /** Brand-blue italic serif line */
  titleAccent: string;
  body: string;
  stats: [RoiStat, RoiStat];
};

const VARIANTS: RoiVariant[] = [
  {
    id: "buyer",
    tab: "Technology Buyer ROI",
    title: "One renewal.",
    titleAccent: "Pays for a year.",
    body: "Negotiate one Salesforce renewal down 15% on a $120K contract and save $18K — a 3× annual ROI on the Buyer plan.",
    stats: [
      { value: "$18K", label: "saved on one renewal" },
      { value: "3X", label: "ROI year 1" },
    ],
  },
  {
    id: "seller",
    tab: "Technology Seller ROI",
    title: "8 days faster.",
    titleAccent: "Every deal.",
    body: "Cut deal cycle time by 8 days on 5 deals a month and add $280K+ in accelerated ARR — a 29× ROI on the Seller plan.",
    stats: [
      { value: "8 Days", label: "Faster per deal close" },
      { value: "29X", label: "ROI from velocity" },
    ],
  },
  {
    id: "both",
    tab: "Buyer + Seller ROI",
    title: "Both sides.",
    titleAccent: "One platform.",
    body: "The Both plan costs 25% less than buying Buyer + Seller separately. And the benchmark data compounds — buy-side insights inform sell-side pricing and vice versa.",
    stats: [
      { value: "25%", label: "Vs buying both plans separately" },
      {
        value: "2X",
        label: "Data flywheel — both sides inform each other",
      },
    ],
  },
];

function CartIcon() {
  const id = useId();
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <g clipPath={`url(#${id})`}>
        <path
          d="M1 1H1.65308C1.77609 1 1.8376 1 1.88709 1.02262C1.93071 1.04255 1.96767 1.07461 1.99357 1.11497C2.02297 1.16077 2.03167 1.22166 2.04906 1.34343L2.28571 3M2.28571 3L2.81166 6.8657C2.8784 7.35626 2.91177 7.60154 3.02905 7.78617C3.13239 7.94886 3.28054 8.07822 3.45568 8.15869C3.65443 8.25 3.90197 8.25 4.39705 8.25H8.676C9.14727 8.25 9.38291 8.25 9.57548 8.16521C9.74527 8.09044 9.89092 7.96992 9.99614 7.81711C10.1155 7.64381 10.1596 7.41233 10.2477 6.94938L10.9096 3.47484C10.9406 3.3119 10.9561 3.23043 10.9336 3.16675C10.9139 3.11088 10.875 3.06384 10.8238 3.03401C10.7654 3 10.6825 3 10.5166 3H2.28571ZM5 10.5C5 10.7761 4.77614 11 4.5 11C4.22386 11 4 10.7761 4 10.5C4 10.2239 4.22386 10 4.5 10C4.77614 10 5 10.2239 5 10.5ZM9 10.5C9 10.7761 8.77614 11 8.5 11C8.22386 11 8 10.7761 8 10.5C8 10.2239 8.22386 10 8.5 10C8.77614 10 9 10.2239 9 10.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id={id}>
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function BuildingIcon() {
  const id = useId();
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <g clipPath={`url(#${id})`}>
        <path
          d="M7.5 10.5V7.8C7.5 7.51997 7.5 7.37996 7.4455 7.273C7.39757 7.17892 7.32108 7.10243 7.227 7.0545C7.12004 7 6.98003 7 6.7 7H5.3C5.01997 7 4.87996 7 4.773 7.0545C4.67892 7.10243 4.60243 7.17892 4.5545 7.273C4.5 7.37996 4.5 7.51997 4.5 7.8V10.5M1.5 3.5C1.5 4.32843 2.17157 5 3 5C3.82843 5 4.5 4.32843 4.5 3.5C4.5 4.32843 5.17157 5 6 5C6.82843 5 7.5 4.32843 7.5 3.5C7.5 4.32843 8.17157 5 9 5C9.82843 5 10.5 4.32843 10.5 3.5M3.1 10.5H8.9C9.46005 10.5 9.74008 10.5 9.95399 10.391C10.1422 10.2951 10.2951 10.1422 10.391 9.95399C10.5 9.74008 10.5 9.46005 10.5 8.9V3.1C10.5 2.53995 10.5 2.25992 10.391 2.04601C10.2951 1.85785 10.1422 1.70487 9.95399 1.60899C9.74008 1.5 9.46005 1.5 8.9 1.5H3.1C2.53995 1.5 2.25992 1.5 2.04601 1.60899C1.85785 1.70487 1.70487 1.85785 1.60899 2.04601C1.5 2.25992 1.5 2.53995 1.5 3.1V8.9C1.5 9.46005 1.5 9.74008 1.60899 9.95399C1.70487 10.1422 1.85785 10.2951 2.04601 10.391C2.25992 10.5 2.53995 10.5 3.1 10.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id={id}>
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function BothIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M4.5 3.5L2 6L4.5 8.5M7.5 3.5L10 6L7.5 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TAB_ICONS: Record<PlatformRoiId, () => ReactNode> = {
  buyer: CartIcon,
  seller: BuildingIcon,
  both: BothIcon,
};

function Stat({ value, label }: RoiStat) {
  return (
    <div className="flex min-w-0 items-center gap-3 sm:gap-6">
      <span
        aria-hidden
        className="h-14 w-px shrink-0 bg-brand-strong sm:h-20"
      />
      <div className="flex min-w-0 flex-col gap-2 sm:gap-4">
        <p className="font-body text-[1.75rem] font-semibold leading-[1.2] tracking-[-0.02em] text-navy sm:text-[2.75rem] lg:text-[3.75rem]">
          {value}
        </p>
        <p className="text-sm leading-5 text-ink">{label}</p>
      </div>
    </div>
  );
}

export function PlatformRoi({
  defaultId = "buyer",
  className = "",
}: {
  defaultId?: PlatformRoiId;
  className?: string;
}) {
  const [active, setActive] = useState<PlatformRoiId>(defaultId);
  const variant = VARIANTS.find((v) => v.id === active) ?? VARIANTS[0];

  return (
    <div
      className={`flex w-full min-w-0 flex-col overflow-hidden rounded-[20px] bg-white sm:rounded-[24px] ${className}`}
    >
      {/* Tab bar — Figma: padding 12, gap 8, radius 24 24 0 0 */}
      <div
        role="tablist"
        aria-label="Platform ROI personas"
        className="flex flex-wrap items-center gap-2 rounded-t-[20px] bg-white p-2 sm:rounded-t-[24px] sm:p-3"
      >
        {VARIANTS.map((v) => {
          const selected = v.id === active;
          const Icon = TAB_ICONS[v.id];
          return (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={selected}
              id={`platform-roi-tab-${v.id}`}
              aria-controls="platform-roi-panel"
              onClick={() => setActive(v.id)}
              className={`inline-flex max-w-full items-center gap-1 rounded-2xl border px-2.5 py-1 text-xs font-medium leading-5 transition-colors sm:px-3 sm:text-sm ${
                selected
                  ? "border-brand-strong bg-brand-strong text-white"
                  : "border-line-muted bg-surface text-ink hover:border-line-strong"
              }`}
            >
              <span
                className={`inline-flex shrink-0 ${selected ? "text-surface-muted" : "text-subtle"}`}
              >
                <Icon />
              </span>
              <span className="truncate">{v.tab}</span>
            </button>
          );
        })}
      </div>

      {/* Content — Figma: padding ~78×97, radius 0 24 24 24 */}
      <div
        role="tabpanel"
        id="platform-roi-panel"
        aria-labelledby={`platform-roi-tab-${variant.id}`}
        className="flex min-w-0 flex-col gap-8 rounded-b-[20px] bg-white px-4 py-8 sm:gap-10 sm:rounded-b-[24px] sm:px-8 sm:py-12 md:px-12 lg:px-[6.0625rem] lg:py-[4.875rem]"
      >
        <div className="flex min-w-0 flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <h3 className="max-w-[19.5rem] shrink-0 font-display text-[1.5rem] font-normal italic leading-[1.2] tracking-[-0.02em] sm:text-[2.25rem] lg:text-[3rem]">
            <span className="text-navy">{variant.title}</span>
            <br />
            <span className="text-brand-strong">{variant.titleAccent}</span>
          </h3>

          <div className="flex w-full min-w-0 max-w-[40.375rem] flex-col gap-8 sm:gap-12 lg:gap-16">
            <p className="text-sm leading-6 text-ink sm:text-base">
              {variant.body}
            </p>

            <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:gap-10 lg:gap-[3.1875rem]">
              <Stat {...variant.stats[0]} />
              <Stat {...variant.stats[1]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
