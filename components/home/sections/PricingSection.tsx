import Link from "next/link";
import { SectionBadge } from "../../ui/SectionBadge";
import { layout } from "../../ui/type";
import type { FeatureTableSection } from "@/lib/cms/types";

type CellValue = true | false | "partial";

type Row = {
  feature: string;
  apt: CellValue;
  vendr: CellValue;
  ironclad: CellValue;
  generic: CellValue;
};

const competitors = [
  {
    key: "vendr" as const,
    name: "Vendr / Tropic",
    price: "$20k-36k/yr",
  },
  {
    key: "ironclad" as const,
    name: "Ironclad / Sirion",
    price: "$25k-50k/yr",
  },
  {
    key: "generic" as const,
    name: "Generic CLM tools",
    price: "$3k-15k/yr",
  },
];

function CheckIcon({ onBlue }: { onBlue?: boolean }) {
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
        d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke={onBlue ? "white" : "#079455"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M4.16699 10H15.8337"
        className="stroke-faint"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cell({ value, onBlue }: { value: CellValue; onBlue?: boolean }) {
  if (value === "partial") {
    return (
      <span className="text-[0.875rem] leading-5 text-nav">Partial</span>
    );
  }
  if (value) {
    return (
      <span className="inline-flex" aria-label="Included">
        <CheckIcon onBlue={onBlue} />
      </span>
    );
  }
  return (
    <span className="inline-flex" aria-label="Not included">
      <MinusIcon />
    </span>
  );
}

function rowTone(i: number) {
  return i % 2 === 0;
}

export function PricingSection({
  badgeLabel,
  heading,
  headingAccent,
  ctaLabel,
  ctaHref,
  rows: rawRows,
}: FeatureTableSection) {
  const rows = rawRows as unknown as Row[];

  return (
    <section
      className={`bg-white ${layout.sectionX} pt-12 sm:pt-16 md:pt-20 xl:pt-[6.25rem] pb-12 sm:pb-16`}
      id="pricing"
    >
      <div
        className={`${layout.inner} flex flex-col items-center gap-8 sm:gap-10`}
      >
        <div className="flex max-w-[45.125rem] flex-col items-center gap-6 text-center">
          {badgeLabel && <SectionBadge>{badgeLabel}</SectionBadge>}
          {heading && (
            <h2 className="font-display text-h2 font-normal tracking-[-0.02em] text-navy">
              {heading}{" "}
              {headingAccent && (
                <em className="italic text-brand-accent">
                  {headingAccent.includes(" ") ? (
                    <>
                      {headingAccent.slice(0, headingAccent.lastIndexOf(" "))}
                      {/* Figma: the closing word drops to its own centered line */}
                      <span className="block">
                        {headingAccent.slice(headingAccent.lastIndexOf(" ") + 1)}
                      </span>
                    </>
                  ) : (
                    headingAccent
                  )}
                </em>
              )}
            </h2>
          )}
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-pill border border-brand bg-brand px-4 py-2.5 text-[1rem] font-semibold leading-6 text-white shadow-sm transition-colors hover:bg-brand-hover active:scale-[0.98]"
            >
              {ctaLabel}
            </Link>
          )}
        </div>

        <div className="w-full min-w-0 max-w-[80rem] rounded-[1.25rem] bg-surface p-3 sm:rounded-[1.5rem] sm:p-6 md:p-8">
          <div className="-mx-1 overflow-x-auto sm:mx-0">
            <div className="grid min-w-[36rem] grid-cols-[minmax(8rem,1.2fr)_repeat(4,minmax(7rem,1fr))] items-start gap-0 sm:min-w-[52rem] md:gap-2 lg:gap-4">
              <div className="flex flex-col pt-[6.5rem]">
                {rows.map((row, i) => (
                  <div
                    key={row.feature}
                    className={`flex h-16 items-center px-4 sm:px-6 ${
                      rowTone(i)
                        ? "rounded-l-lg bg-surface-muted"
                        : "bg-transparent"
                    }`}
                  >
                    <span className="text-[0.875rem] font-medium leading-5 text-navy">
                      {row.feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col rounded-xl bg-brand-accent pb-5">
                <div className="flex h-[6.5rem] flex-col items-center justify-center gap-2 px-4 sm:px-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/pricing-apt-header.svg"
                    alt="aptAIvisor — From $499/mo"
                    width={126}
                    height={74}
                    className="h-auto w-full max-w-[7rem]"
                  />
                </div>
                {rows.map((row, i) => (
                  <div
                    key={row.feature}
                    className={`flex h-16 items-center justify-center px-4 sm:px-6 ${
                      rowTone(i) ? "bg-brand-strong" : "bg-transparent"
                    }`}
                  >
                    <Cell value={row.apt} onBlue />
                  </div>
                ))}
              </div>

              {competitors.map((col) => (
                <div
                  key={col.key}
                  className="flex flex-col pb-5"
                >
                  <div className="flex h-[6.5rem] flex-col items-center justify-center gap-2 px-2">
                    <p className="text-center text-[1rem] font-semibold leading-7 text-navy sm:text-[1.125rem] sm:leading-7">
                      {col.name}
                    </p>
                    <span className="inline-flex items-center rounded-pill border border-[#FECDCA] bg-[#FEF3F2] px-2.5 py-0.5 text-[0.875rem] font-medium leading-5 text-danger-fg">
                      {col.price}
                    </span>
                  </div>
                  {rows.map((row, i) => (
                    <div
                      key={row.feature}
                      className={`flex h-16 items-center justify-center px-4 sm:px-6 ${
                        rowTone(i)
                          ? i === 0
                            ? "rounded-none bg-surface-muted"
                            : "bg-surface-muted"
                          : "bg-transparent"
                      } ${
                        col.key === "generic" && rowTone(i)
                          ? "rounded-r-lg"
                          : ""
                      }`}
                    >
                      <Cell value={row[col.key]} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
