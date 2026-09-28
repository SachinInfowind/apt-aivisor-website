import { homeSerif } from "../../ui/fonts";
import { layout } from "../../ui/type";
import type { TrustControlsSection as TrustControlsSectionData } from "@/lib/cms/types";

/**
 * Trust controls table — Figma Frame 1261154180 (26281:26775).
 * “Eight controls, not an after thought” + Reference / Control / What it does table.
 */

function ReferenceBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 whitespace-nowrap rounded-md border border-line-strong bg-white px-1.5 py-0.5 text-xs font-medium leading-[1.125rem] text-ink shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
      <span
        className="h-2 w-2 shrink-0 rounded-full bg-metric"
        aria-hidden
      />
      {label}
    </span>
  );
}

export function TrustControlsSection({
  headline,
  headlineAccent,
  subhead,
  rows,
}: TrustControlsSectionData) {
  return (
    <section
      className={`w-full bg-white ${layout.sectionX} py-16 sm:py-20 md:py-[6.25rem]`}
    >
      <div
        className={`${layout.inner} flex w-full max-w-[80rem] flex-col gap-10 md:gap-12`}
      >
        <div className="flex w-full flex-col gap-3">
          <h2
            className={`${homeSerif.className} text-[clamp(1.75rem,3vw,3rem)] italic leading-[1.2] tracking-[-0.02em]`}
          >
            <span className="text-navy">{headline} </span>
            {headlineAccent ? (
              <span className="text-brand-accent">{headlineAccent}</span>
            ) : null}
          </h2>
          {subhead ? (
            <p className="max-w-[79.875rem] text-base font-medium leading-7 text-ink sm:text-xl sm:leading-[1.875rem]">
              {subhead}
            </p>
          ) : null}
        </div>

        {rows?.length ? (
          <div className="w-full overflow-hidden rounded-xl border border-line-muted bg-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[48rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line-muted bg-white">
                    <th className="w-[9.625rem] whitespace-nowrap px-6 py-3 text-xs font-medium leading-[1.125rem] text-nav">
                      Reference
                    </th>
                    <th className="w-[14rem] whitespace-nowrap px-6 py-3 text-xs font-medium leading-[1.125rem] text-nav sm:w-[16rem]">
                      Control
                    </th>
                    <th className="whitespace-nowrap px-6 py-3 text-xs font-medium leading-[1.125rem] text-nav">
                      What it does
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={`${row.control}-${row.id ?? index}`}
                      className={`border-b border-line-muted last:border-b-0 ${
                        index % 2 === 1 ? "bg-surface" : "bg-white"
                      }`}
                    >
                      <td className="px-6 py-4 align-middle">
                        {row.reference ? (
                          <ReferenceBadge label={row.reference} />
                        ) : (
                          <span className="sr-only">No reference</span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-middle text-sm font-semibold leading-5 text-navy sm:text-base sm:leading-6">
                        {row.control}
                      </td>
                      <td className="px-6 py-4 align-middle text-sm leading-5 text-ink sm:text-base sm:leading-6">
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
