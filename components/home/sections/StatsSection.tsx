"use client";

import { useEffect, useRef, useState } from "react";
import { layout } from "../../ui/type";
import type { StatsSection as StatsSectionData } from "@/lib/cms/types";

/**
 * Parse CMS stat strings like "20%", "$36k+", "$0", "21%" into parts for
 * count-up while preserving prefix / suffix / casing of the unit letter.
 */
function parseStatValue(raw: string): {
  prefix: string;
  target: number;
  suffix: string;
  decimals: number;
} {
  const match = raw.trim().match(/^([^0-9.-]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) {
    return { prefix: "", target: 0, suffix: raw, decimals: 0 };
  }
  const [, prefix, num, suffix] = match;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return {
    prefix,
    target: Number(num),
    suffix,
    decimals,
  };
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function AnimatedStatValue({ value }: { value: string }) {
  const { prefix, target, suffix, decimals } = parseStatValue(value);
  // "$0" has no visible count-up (0→0). Count down from a start value instead.
  const from = target === 0 ? 50 : 0;
  const [display, setDisplay] = useState(from);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplay(target);
      return;
    }

    const duration = 1200;
    let frame = 0;
    const t0 = performance.now();
    const delta = target - from;

    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      setDisplay(from + delta * easeOutCubic(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, target, from]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <p
      ref={ref}
      className="font-display text-stat-xl leading-none text-brand-accent tabular-nums"
    >
      {prefix}
      {formatted}
      {suffix}
    </p>
  );
}

// CMS currently sends the whole heading in `heading`; the Figma styles the
// closing "Love Us" as the italic accent, so split it off when no accent is set.
const DEFAULT_ACCENT = "Love Us";

export function StatsSection({
  heading: rawHeading,
  headingAccent: rawAccent,
  items,
}: StatsSectionData) {
  let heading = rawHeading;
  let headingAccent = rawAccent;
  if (heading && !headingAccent && heading.trim().endsWith(DEFAULT_ACCENT)) {
    heading = heading.trim().slice(0, -DEFAULT_ACCENT.length).trim();
    headingAccent = DEFAULT_ACCENT;
  }
  return (
    <section className={`bg-white ${layout.sectionX} pb-section-x pt-5`}>
      <div className={layout.inner}>
        {heading && (
          <h2 className="text-center font-display text-h2 font-normal text-navy">
            {heading}{" "}
            {headingAccent && (
              <em className="italic text-brand-accent">{headingAccent}</em>
            )}
          </h2>
        )}

        <div className="mt-8 grid grid-cols-1 gap-8 sm:mt-12 sm:grid-cols-2 sm:gap-0 lg:mt-14 lg:grid-cols-4">
          {items.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center px-4 text-center sm:px-6 ${
                i > 0 ? "lg:border-l lg:border-line" : ""
              } ${i === 1 ? "sm:border-l sm:border-line" : ""} ${
                i === 3 ? "sm:border-l sm:border-line" : ""
              }`}
            >
              <AnimatedStatValue value={s.value} />
              <p className="mt-3 max-w-50 text-sm leading-5 text-ink sm:mt-3.5 sm:text-body-15">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
