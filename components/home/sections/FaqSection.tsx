"use client";

import { useState } from "react";
import { SectionBadge } from "../../ui/SectionBadge";
import { layout } from "../../ui/type";
import type { FaqSection as FaqSectionData } from "@/lib/cms/types";

/**
 * FAQ — Figma Frame 206 (1:7984, 1440×1106).
 * Accordion: one open at a time; open row uses larger serif + answer panel.
 */

function MinusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M4.16669 10H15.8334"
        stroke="currentColor"
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
        d="M10 4.16675V15.8334M4.16669 10.0001H15.8334"
        stroke="currentColor"
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
      className="grid h-9 w-9 shrink-0 place-items-center rounded-pill bg-line-strong text-faint shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] sm:h-10 sm:w-10"
      aria-hidden
    >
      {open ? <MinusIcon /> : <PlusIcon />}
    </span>
  );
}

export function FaqSection({ badgeLabel, heading, headingAccent, items }: FaqSectionData) {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className={`bg-surface ${layout.sectionX} py-12 sm:py-16 md:py-[6.25rem]`}
    >
      <div
        className={`${layout.inner} flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12`}
      >
        {/* Left — badge + headline */}
        <div className="flex w-full shrink-0 flex-col items-start gap-6 sm:gap-8 lg:max-w-[22rem] xl:max-w-[26rem]">
          {badgeLabel && <SectionBadge>{badgeLabel}</SectionBadge>}
          {heading && (
            <h2 className="font-display text-h2 font-normal italic leading-[1.2] tracking-[-0.02em]">
              <span className="text-navy">{heading}</span>
              {headingAccent && (
                <>
                  <br />
                  <span className="text-brand-accent">{headingAccent}</span>
                </>
              )}
            </h2>
          )}
        </div>

        {/* Right — accordion */}
        <div className="flex w-full min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          {items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;

            return (
              <div key={item.question} className="flex w-full flex-col">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className={`flex w-full items-center justify-between gap-4 bg-surface-muted p-4 text-left transition-colors sm:gap-6 sm:p-6 ${
                    isOpen
                      ? "rounded-t-[20px] sm:rounded-t-[24px]"
                      : "rounded-[20px] sm:rounded-[24px]"
                  }`}
                >
                  <span
                    className={`min-w-0 flex-1 font-display font-normal text-navy ${
                      isOpen
                        ? "text-xl leading-7 sm:text-[1.875rem] sm:leading-[2.375rem]"
                        : "text-lg leading-7 sm:text-2xl sm:leading-8"
                    }`}
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
                    className="rounded-b-[20px] bg-white p-4 sm:rounded-b-[24px] sm:p-6"
                  >
                    <p className="max-w-[44.625rem] text-base leading-7 text-nav sm:text-lg sm:leading-7">
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
