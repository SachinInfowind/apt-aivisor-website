"use client";

import { KeyboardEvent, useState } from "react";

type TagInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
  /** Shown inside the box while it is empty. */
  placeholder?: string;
  /** Helper text under the box (Figma "Hint text"). */
  hint?: string;
  className?: string;
};

/**
 * Chip/tag input — "Add Tag" boxes under each selected tech category in the
 * Design Partner application (Figma "Which AI application vendor(s)?" etc.):
 * type a value, press Enter or "," to commit it as a chip, Backspace on an
 * empty input removes the last chip.
 */
export function TagInput({
  value,
  onChange,
  placeholder = "Add Tag",
  hint,
  className = "",
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (!value.includes(trimmed)) onChange([...value, trimmed]);
    setDraft("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={`flex w-full flex-col gap-1.5 ${className}`}>
      <div className="flex min-h-cell w-full flex-col items-start gap-2 rounded-lg border border-line-strong bg-white p-3 shadow-field focus-within:border-brand-accent focus-within:shadow-field-focus">
        {value.length > 0 ? (
          <div className="flex w-full flex-wrap items-center gap-1.5">
            {value.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="inline-flex items-center gap-[3px] rounded-md border border-line-strong bg-white py-0.5 pl-2.25 pr-1 text-sm font-medium leading-5 text-ink"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label={`Remove ${tag}`}
                  className="flex h-4 w-4 items-center justify-center rounded text-faint transition-colors hover:text-ink"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                    <path
                      d="M8 2L2 8M2 2l6 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        ) : null}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commit}
          placeholder={placeholder}
          className="w-full min-w-menu border-0 bg-transparent p-0 text-base leading-6 text-heading outline-none placeholder:text-subtle"
        />
      </div>
      {hint ? <p className="text-sm leading-5 text-nav">{hint}</p> : null}
    </div>
  );
}
