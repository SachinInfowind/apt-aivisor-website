"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { getCountryCallingCode } from "react-phone-number-input";

type CountryCodeSelectProps = {
  value: string;
  onChange: (value: string) => void;
  countries: readonly string[];
};

const TYPEAHEAD_RESET_MS = 500;

/**
 * Compact country-code trigger for the phone field, styled like the rest of
 * the custom dropdowns in this codebase (see `components/ui/SelectDropdown.tsx`)
 * instead of a native `<select>` — a native select's open panel is drawn by
 * the OS/browser and can pop upward, span the full viewport height, and
 * ignore our styling entirely (as seen with ~250 countries in the list).
 * This version always opens below the trigger, is height-capped and
 * scrollable, and matches the design system's dropdown panel — while still
 * supporting the same type-to-jump search a native `<select>` gives for free
 * (type "in" to jump to India).
 */
export function CountryCodeSelect({
  value,
  onChange,
  countries,
}: CountryCodeSelectProps) {
  const id = useId();
  const listId = `${id}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const typeaheadBuffer = useRef("");
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setHighlight(-1);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const selectAt = (index: number) => {
    const country = countries[index];
    if (!country) return;
    onChange(country);
    close();
  };

  /** Type-to-jump: mirrors native `<select>` — typing "in" jumps to/selects India. */
  const handleTypeahead = (key: string) => {
    if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current);
    typeaheadBuffer.current += key.toLowerCase();
    typeaheadTimer.current = setTimeout(() => {
      typeaheadBuffer.current = "";
    }, TYPEAHEAD_RESET_MS);

    const buffer = typeaheadBuffer.current;
    const idx = countries.findIndex((c) => c.toLowerCase().startsWith(buffer));
    if (idx < 0) return;

    setHighlight(idx);
    onChange(countries[idx]);
    itemRefs.current[idx]?.scrollIntoView({ block: "nearest" });
  };

  const isTypeaheadKey = (key: string) => key.length === 1 && /[a-zA-Z]/.test(key);

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (isTypeaheadKey(e.key)) {
      e.preventDefault();
      handleTypeahead(e.key);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      const idx = Math.max(0, countries.indexOf(value));
      setHighlight(idx);
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (isTypeaheadKey(e.key)) {
      e.preventDefault();
      handleTypeahead(e.key);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(countries.length - 1, (h < 0 ? -1 : h) + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(0, (h < 0 ? countries.length : h) - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (highlight >= 0) selectAt(highlight);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      close();
    }
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label="Country code"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) {
            const idx = countries.indexOf(value);
            setHighlight(idx >= 0 ? idx : 0);
          }
        }}
        onKeyDown={onTriggerKeyDown}
        className="flex h-full items-center gap-1.5 border-r border-line-strong py-2.5 pl-3.5 pr-3 text-base leading-6 text-heading outline-none"
      >
        {value}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
          className={`shrink-0 text-subtle transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={id}
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-30 max-h-64 w-44 overflow-y-auto rounded-lg border border-line-muted bg-white py-1 shadow-[0_12px_16px_-4px_rgba(16,24,40,0.08),0_4px_6px_-2px_rgba(16,24,40,0.03)] focus:outline-none [scrollbar-color:var(--color-line-muted)_transparent] [scrollbar-width:thin]"
        >
          {countries.map((country, index) => {
            const isSelected = country === value;
            const isHighlight = index === highlight;
            return (
              <li key={country} role="option" aria-selected={isSelected} className="px-1.5 py-px">
                <button
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  type="button"
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => selectAt(index)}
                  className={`flex w-full items-center rounded-md px-2 py-1.5 text-left text-base font-medium leading-6 text-heading ${
                    isSelected || isHighlight ? "bg-surface" : "bg-transparent"
                  }`}
                >
                  {country}{" "}
                  <span className="text-subtle">+{getCountryCallingCode(country as never)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
