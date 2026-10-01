"use client";

import { useState, type ReactElement } from "react";
import Image from "next/image";
import { homeSerif } from "@/components/ui/fonts";
import { layout } from "@/components/ui/type";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { DesignPartnerAudienceSection } from "@/lib/cms/types";

const TAB_ICONS: Record<number, ReactElement> = {
  0: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M1 1h.65c.13 0 .19 0 .24.02.05.02.08.05.11.09.03.04.05.1.06.22L2.29 3m0 0 .52 3.87c.07.5.1.75.22.94.1.16.27.29.44.37.2.1.44.1.93.1h4.28c.47 0 .71 0 .9-.08.17-.08.32-.2.42-.35.11-.17.16-.4.24-.87l.66-3.47c.03-.16.05-.24.02-.3a.28.28 0 0 0-.12-.13c-.06-.04-.14-.04-.31-.04H2.29"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4.5" cy="10.5" r=".6" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8.5" cy="10.5" r=".6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  1: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M7.5 10.5V7.8c0-.28 0-.42-.055-.53a.5.5 0 0 0-.218-.22C7.12 7 6.98 7 6.7 7H5.3c-.28 0-.42 0-.527.055a.5.5 0 0 0-.218.218C4.5 7.38 4.5 7.52 4.5 7.8v2.7M1.5 3.5a1.5 1.5 0 0 0 3 0 1.5 1.5 0 0 0 3 0 1.5 1.5 0 0 0 3 0 1.5 1.5 0 0 0 3 0M3.1 10.5h5.8c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C10.5 9.74 10.5 9.46 10.5 8.9V3.1c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437C9.74 1.5 9.46 1.5 8.9 1.5H3.1c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C1.5 2.26 1.5 2.54 1.5 3.1v5.8c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437c.214.109.494.109 1.054.109Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

/**
 * "What is a design partner?" intro + Buyer/Seller audience toggle —
 * Figma "The program" / "Founder Section" frame.
 */
export function AudienceSection({
  badgeLabel,
  heading,
  headingAccent,
  body,
  tabs,
}: DesignPartnerAudienceSection) {
  const [active, setActive] = useState(0);
  const tab = tabs?.[active];
  const imageUrl = tab?.image?.url ? toAbsoluteMediaUrl(tab.image.url) : null;

  return (
    <section className={`w-full bg-white py-16 sm:py-20 md:py-24 ${layout.sectionX}`}>
      <div className={`${layout.inner} flex w-full max-w-container flex-col gap-10 md:gap-12`}>
        <div className="flex w-full max-w-[46rem] flex-col gap-3">
          {badgeLabel ? (
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-info-edge bg-info-bg px-2.5 py-1">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                <circle className="fill-info" cx="4" cy="4" r="3" />
              </svg>
              <span className="text-sm font-medium leading-5 text-info-fg">
                {badgeLabel}
              </span>
            </div>
          ) : null}
          <h2
            className={`${homeSerif.className} text-[clamp(1.75rem,3.5vw,2.5rem)] leading-heading tracking-heading text-navy`}
          >
            {heading}{" "}
            {headingAccent ? <span className="italic text-brand-accent">{headingAccent}</span> : null}
          </h2>
          {body ? (
            <p className="text-body-lg font-medium leading-[30px] text-ink">{body}</p>
          ) : null}
        </div>

        {tabs?.length ? (
          <div className="w-full rounded-3xl bg-linear-to-b from-brand-veil to-brand-strong p-4 sm:p-6 md:p-9">
            <div className="flex w-full flex-col items-start">
              <div className="relative flex w-full items-center gap-2 rounded-t-3xl bg-white p-3 sm:inline-flex sm:w-fit sm:after:absolute sm:after:bottom-0 sm:after:-right-6 sm:after:h-6 sm:after:w-6 sm:after:bg-[radial-gradient(circle_at_100%_0,transparent_1.5rem,white_1.55rem)] sm:after:content-['']">
                {tabs.map((t, i) => {
                  const selected = i === active;
                  return (
                    <button
                      key={t.tabLabel}
                      type="button"
                      onClick={() => setActive(i)}
                      className={`inline-flex flex-1 flex-col items-center justify-center gap-1 min-w-0 whitespace-nowrap rounded-2xl border px-1.5 py-2 text-xs font-medium leading-4 min-[380px]:text-[13px] transition-colors sm:flex-none sm:flex-row sm:gap-1 sm:px-2.5 sm:py-1 sm:text-sm sm:leading-5 ${
                        selected
                          ? "border-brand-strong bg-brand-strong text-white"
                          : "border-line-muted bg-surface text-ink"
                      }`}
                    >
                      {TAB_ICONS[i]}
                      {t.tabLabel}
                    </button>
                  );
                })}
              </div>

              {tab ? (
                <div className="flex w-full flex-col gap-2.5 rounded-b-3xl bg-white p-6 sm:rounded-tr-3xl sm:p-8 md:p-10 xl:p-12.5">
                  <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-10 xl:gap-20.5">
                    {imageUrl ? (
                      <div className="relative aspect-[118/71] w-full max-w-[482px] overflow-hidden rounded-2xl lg:w-[45%] lg:shrink-0">
                        <Image
                          src={imageUrl}
                          alt={tab.image?.alternativeText ?? tab.heading}
                          fill
                          sizes="(min-width: 1024px) 482px, 100vw"
                          className="object-contain lg:object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
                      <h3
                        className={`${homeSerif.className} text-[clamp(1.375rem,2.5vw,2.25rem)] leading-[1.22] tracking-heading text-navy`}
                      >
                        {tab.heading}
                      </h3>
                      {tab.body ? (
                        <p className="max-w-[34.5rem] text-base leading-6 text-ink">{tab.body}</p>
                      ) : null}
                      {tab.points?.length ? (
                        <ul className="flex w-full max-w-copy flex-col gap-5">
                          {tab.points.map((p, i) => (
                            <li
                              key={`${p.text}-${i}`}
                              className="flex items-center gap-2 text-sm leading-5 text-ink"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                aria-hidden
                                className="shrink-0"
                              >
                                <circle className="fill-success-strong" cx="10" cy="10" r="10" />
                                <path
                                  d="M6.25 10l2.5 2.5 5-5"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              {p.text}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
