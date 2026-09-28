"use client";

import { useState } from "react";
import { homeSerif } from "../../ui/fonts";
import { layout } from "../../ui/type";
import type { TrustFaqSection as TrustFaqSectionData } from "@/lib/cms/types";

/**
 * Trust FAQ — Figma Frame 206 (26281:26748).
 * “What design partners ask us” accordion (one open at a time).
 */

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

function ToggleButton({ open }: { open: boolean }) {
  return (
    <span
      className="grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-line-strong shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]"
      aria-hidden
    >
      {open ? <MinusIcon /> : <PlusIcon />}
    </span>
  );
}

export function TrustFaqSection({
  heading,
  headingAccent,
  items,
}: TrustFaqSectionData) {
  const [open, setOpen] = useState(0);

  return (
    <section
      className={`w-full bg-surface ${layout.sectionX} py-16 sm:py-20 md:py-[6.25rem]`}
    >
      <div
        className={`${layout.inner} flex w-full max-w-[80rem] flex-col items-start gap-10 lg:flex-row lg:gap-12`}
      >
        <div className="flex w-full shrink-0 flex-col gap-8 lg:max-w-[22rem] xl:max-w-[26rem]">
          <h2
            className={`${homeSerif.className} text-[clamp(1.75rem,3vw,3rem)] italic leading-[1.2] tracking-[-0.02em]`}
          >
            <span className="text-navy">{heading}</span>
            {headingAccent ? (
              <>
                <br />
                <span className="text-brand-accent">{headingAccent}</span>
              </>
            ) : null}
          </h2>
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-8">
          {items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `trust-faq-panel-${i}`;
            const buttonId = `trust-faq-button-${i}`;

            return (
              <div key={item.question} className="flex w-full flex-col">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className={`flex w-full items-center justify-between gap-5 bg-surface-muted p-6 text-left transition-colors ${
                    isOpen ? "rounded-t-3xl" : "rounded-3xl"
                  }`}
                >
                  <span
                    className={`${homeSerif.className} min-w-0 flex-1 text-[clamp(1.25rem,2vw,1.875rem)] font-normal leading-[1.27] text-navy sm:leading-[2.375rem]`}
                  >
                    {item.question}
                  </span>
                  <ToggleButton open={isOpen} />
                </button>

                {isOpen ? (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="rounded-b-3xl bg-white p-6"
                  >
                    <p className="text-base leading-7 text-nav sm:text-lg sm:leading-7">
                      {item.answer}
                    </p>
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
