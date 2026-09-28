"use client";

import { useState } from "react";

/**
 * Founder intro — Figma expand/collapse ("Read More." ↔ "Less More.").
 * Collapsed shows `intro`; expanded appends optional `introMore`.
 */
export function FounderIntro({
  intro,
  introMore,
}: {
  intro: string;
  introMore?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const more = introMore?.trim();
  const canToggle = Boolean(more);

  return (
    <div id="about-more" className="max-w-4xl">
      <p className="text-lg font-medium leading-7 text-[#344054] sm:text-xl sm:leading-[30px]">
        {intro}
        {expanded && more ? (
          <span className="whitespace-pre-line">
            {" "}
            {more}
          </span>
        ) : null}{" "}
        {canToggle ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline font-medium text-[#4F8DFF] transition-colors hover:underline cursor-pointer"
            aria-expanded={expanded}
          >
            {expanded ? "Less More." : "Read More."}
          </button>
        ) : null}
      </p>
    </div>
  );
}

