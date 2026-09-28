import { homeSerif } from "../../ui/fonts";
import { layout } from "../../ui/type";
import type { TrustBenchmarkSection as TrustBenchmarkSectionData } from "@/lib/cms/types";

/**
 * Trust benchmark flow — Figma Frame 1261154183 (26281:26869).
 * “How a data point becomes a benchmark” + zigzag pipeline diagram.
 */

function StepDescription({ text }: { text: string }) {
  const lines = text
    .split(/\r?\n|\u2028/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length <= 1) {
    return <p className="text-sm leading-5 text-ink">{text}</p>;
  }
  return (
    <p className="text-sm leading-5 text-ink">
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className="block">
          {line}
        </span>
      ))}
    </p>
  );
}

function StepCard({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <article className="relative z-[1] flex w-full flex-col items-start gap-4 rounded-3xl border border-line-strong bg-white p-6 sm:gap-6 sm:p-8">
      <div className="flex w-full flex-col items-start gap-1.5 sm:gap-[0.9375rem]">
        <h3 className="text-xl font-semibold leading-[1.875rem] text-navy">
          {title}
        </h3>
        {description ? <StepDescription text={description} /> : null}
      </div>
    </article>
  );
}

/**
 * Dashed U between two adjacent cards.
 * Parent must be one pair cell (2 columns + the gap between them).
 * Figma: stems sit on each card’s horizontal center, so the U width is
 * one column + one gap — (pairWidth + gap) / 2.
 */
const connectorWidth =
  "w-[calc((100%+1.5rem)/2)] xl:w-[calc((100%+1.75rem)/2)]";

function ConnectorBelow({ label }: { label?: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        aria-hidden
        className={`h-[6.3125rem] ${connectorWidth} rounded-b-3xl border-b-[3px] border-l-[3px] border-r-[3px] border-dashed border-brand`}
      />
      {label ? (
        <p className="text-center text-base italic leading-6 text-navy">
          {label}
        </p>
      ) : null}
    </div>
  );
}

function ConnectorAbove({ label }: { label?: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      {label ? (
        <p className="text-center text-base italic leading-6 text-navy">
          {label}
        </p>
      ) : null}
      <div
        aria-hidden
        className={`h-[6.3125rem] ${connectorWidth} rounded-t-3xl border-l-[3px] border-r-[3px] border-t-[3px] border-dashed border-brand`}
      />
    </div>
  );
}

export function TrustBenchmarkSection({
  headline,
  headlineAccent,
  subhead,
  footnote,
  steps,
}: TrustBenchmarkSectionData) {
  return (
    <section
      className={`w-full bg-surface ${layout.sectionX} py-16 sm:py-20 md:py-[6.25rem]`}
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

        {steps?.length ? (
          <>
            {/* Mobile / tablet */}
            <div className="flex flex-col gap-4 rounded-3xl bg-[linear-gradient(252deg,var(--color-brand-soft)_-5.01%,var(--color-platform-to)_41.83%)] p-4 sm:p-6 lg:hidden">
              {steps.map((step, index) => (
                <div key={`${step.title}-${step.id}`}>
                  <StepCard title={step.title} description={step.description} />
                  {step.connectorLabel && index < steps.length - 1 ? (
                    <p className="py-3 text-center text-sm italic text-navy">
                      ↓ {step.connectorLabel}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Desktop: cards in flow; connectors sit above/below — never over text */}
            <div className="hidden w-full flex-col rounded-3xl bg-[linear-gradient(252deg,var(--color-brand-soft)_-5.01%,var(--color-platform-to)_41.83%)] px-8 py-14 lg:flex xl:px-12 xl:py-16">
              {/* Top U between cards 2 ↔ 3 */}
              <div className="grid grid-cols-4 gap-6 xl:gap-7">
                <div className="col-span-1" />
                <div className="col-span-2">
                  <ConnectorAbove label={steps[1]?.connectorLabel} />
                </div>
                <div className="col-span-1" />
              </div>

              <div className="relative z-[1] -mt-px grid grid-cols-4 gap-6 xl:gap-7">
                {steps.slice(0, 4).map((step) => (
                  <StepCard
                    key={`${step.title}-${step.id}`}
                    title={step.title}
                    description={step.description}
                  />
                ))}
              </div>

              {/* Bottom Us between 1↔2 and 3↔4 */}
              <div className="-mt-px grid grid-cols-2 gap-6 xl:gap-7">
                <ConnectorBelow label={steps[0]?.connectorLabel} />
                <ConnectorBelow label={steps[2]?.connectorLabel} />
              </div>
            </div>
          </>
        ) : null}

        {footnote ? (
          <p className="text-base italic leading-7 text-ink sm:text-xl sm:leading-[1.875rem]">
            {footnote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
