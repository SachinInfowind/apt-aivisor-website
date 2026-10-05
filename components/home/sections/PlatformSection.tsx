"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { layout } from "../../ui/type";
import type { PlatformTabsSection } from "@/lib/cms/types";

/** Auto-advance interval — restores prior marketing rotate behavior */
const ROTATE_MS = 5000;

/** Tab glyphs, keyed by the tab's `variant` in the CMS (buyer / seller / both). */
const icons: Record<string, ReactNode> = {
  buyer: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M1.5 1.5h1.5l.9 5.4a1.1 1.1 0 0 0 1.1 1h4.2a1.1 1.1 0 0 0 1.1-.9L11 3.5H4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="5.2" cy="10" r="0.8" fill="currentColor" />
      <circle cx="9" cy="10" r="0.8" fill="currentColor" />
    </svg>
  ),
  seller: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <rect
        x="2"
        y="1.5"
        width="8"
        height="9"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M4 4h4M4 6h4M4 8h2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  both: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M4.5 3 2 6l2.5 3M7.5 3 10 6l-2.5 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="mt-0.5 shrink-0"
      aria-hidden
    >
      <path
        d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z"
        fill="#079455"
      />
      <path
        d="M6.25 10L8.75 12.5L13.75 7.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Platform / Section 2 — Figma Frame 112 (26193:18333, 1440×762).
 * Tabs auto-rotate every 5s; pause on hover / focus / manual click.
 * All copy comes from the CMS (`sections.platform-tabs`).
 */
export function PlatformSection({
  heading,
  headingAccent,
  headingAfter,
  tabsLabel,
  tabs,
}: Omit<PlatformTabsSection, "__component" | "id">) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const data = tabs[active] ?? tabs[0];
  const stat = data?.stats?.[0];
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const measure = () => setPanelHeight(el.scrollHeight);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active]);

  useEffect(() => {
    if (paused || tabs.length < 2) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % tabs.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused, tabs.length]);

  if (!data) return null;

  const select = (index: number) => {
    setActive(index);
    setPaused(true);
  };

  return (
    <section
      id="solutions"
      className={`${layout.sectionX} pb-0 pt-12 sm:pt-16 md:pt-20 xl:pt-24`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        className={`${layout.inner} flex flex-col items-center gap-8 rounded-[20px] bg-surface py-5 sm:gap-10 sm:rounded-[24px] sm:py-8 md:gap-10 md:py-10 lg:gap-10 lg:py-12 xl:py-14`}
      >
        <div className="flex w-full flex-col items-center gap-8 px-5 sm:gap-10 sm:px-8 md:gap-10 md:px-10 lg:gap-10 lg:px-12 xl:px-14">
          <h2 className="max-w-[min(100%,66.5625rem)] text-center font-display text-h2 font-normal tracking-[-0.02em] text-navy">
            {heading}{" "}
            {headingAccent ? (
              <em className="italic text-brand-accent">{headingAccent}</em>
            ) : null}{" "}
            {headingAfter}
          </h2>

          <div
            className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-pill border border-surface-muted bg-white p-1"
            role="tablist"
            aria-label={tabsLabel || undefined}
          >
            {tabs.map((tab, index) => {
              const selected = active === index;
              return (
                <button
                  key={tab.id ?? index}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => select(index)}
                  className={`inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 text-sm font-medium transition-colors sm:gap-1.5 sm:px-3 sm:py-1 ${
                    selected
                      ? "border-brand-strong bg-brand text-white"
                      : "border-line bg-surface text-ink hover:bg-white"
                  }`}
                >
                  <span className="opacity-90">{icons[tab.variant ?? ""] ?? icons.both}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="w-full overflow-hidden rounded-[20px] bg-platform-card transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:rounded-[24px]"
          style={panelHeight != null ? { height: panelHeight } : undefined}
        >
          <div
            ref={panelRef}
            key={active}
            className="platform-panel-fade grid items-center gap-8 p-5 sm:gap-10 sm:p-8 md:p-10 lg:grid-cols-[1.4fr_0.7fr] lg:gap-[clamp(2rem,5vw,69px)] lg:p-12 xl:px-[60px] xl:py-16"
          >
            <div className="flex min-w-0 flex-col gap-6 sm:gap-8">
              <p className="font-display text-quote leading-[1.25] text-navy md:text-[clamp(1.5rem,2.5vw,2.25rem)]">
                “{data.body}”
              </p>
              <ul className="flex flex-col gap-4 sm:gap-5">
                {(data.bullets ?? []).map((item) => (
                  <li
                    key={item.text}
                    className="flex items-start gap-2 text-base leading-7 text-ink sm:gap-2.5 sm:text-lg sm:leading-8"
                  >
                    <CheckIcon />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {stat ? (
              <aside className="flex w-full flex-col gap-2 rounded-[20px] bg-white p-6 sm:rounded-[24px] sm:p-8 lg:max-w-[278px] lg:justify-self-end 2xl:max-w-[360px] 2xl:p-10">
                <p className="font-display text-stat-lg leading-none text-brand-accent">
                  {stat.value}
                </p>
                <p className="text-[1rem] font-semibold leading-7 text-ink sm:text-[1.125rem]">
                  {stat.label}
                </p>
                <p className="text-[0.875rem] leading-5 text-ink sm:text-[1rem] sm:leading-6">
                  {stat.note}
                </p>
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
