"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectDropdownProps = {
  id?: string;
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
};

/**
 * Input dropdown menu — Figma “Approximate annual technology spend / ARR”
 * (26281:29930). Open menu: white panel, #EAECF0 border, soft shadow;
 * selected row #F9FAFB + brand check.
 */
export function SelectDropdown({
  id: idProp,
  name,
  label,
  placeholder = "Select",
  options,
  value,
  onChange,
  required,
  className = "",
}: SelectDropdownProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const listId = `${id}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const selected = options.find((o) => o.value === value);
  const display = selected?.label ?? placeholder;

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
    const opt = options[index];
    if (!opt) return;
    onChange(opt.value);
    close();
  };

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      const idx = Math.max(
        0,
        options.findIndex((o) => o.value === value),
      );
      setHighlight(idx);
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(options.length - 1, (h < 0 ? -1 : h) + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(0, (h < 0 ? options.length : h) - 1));
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
    <div ref={rootRef} className={`relative flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium leading-5 text-ink">
        {label}
        {required ? (
          <span className="text-danger" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>

      {/* Hidden native input for form posts / required validation */}
      <input
        type="text"
        name={name}
        value={value}
        required={required}
        readOnly
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          setOpen((o) => !o);
          if (!open) {
            const idx = options.findIndex((o) => o.value === value);
            setHighlight(idx >= 0 ? idx : 0);
          }
        }}
        onKeyDown={onTriggerKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-left text-base font-medium leading-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] outline-none transition-shadow focus:border-brand focus:shadow-[0_0_0_4px_rgba(0,66,187,0.12)]"
      >
        <span className={selected ? "text-heading" : "text-subtle"}>
          {display}
        </span>
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
          className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-30 max-h-[26.375rem] overflow-y-auto rounded-lg border border-line-muted bg-white py-1 shadow-[0_12px_16px_-4px_rgba(16,24,40,0.08),0_4px_6px_-2px_rgba(16,24,40,0.03)] focus:outline-none [scrollbar-color:var(--color-line-muted)_transparent] [scrollbar-width:thin]"
        >
          {options.map((opt, index) => {
            const isSelected = opt.value === value;
            const isHighlight = index === highlight;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                className="px-1.5 py-px"
              >
                <button
                  type="button"
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => selectAt(index)}
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-left text-base font-medium leading-6 text-heading ${
                    isSelected || isHighlight ? "bg-surface" : "bg-transparent"
                  }`}
                >
                  <span className="min-w-0 flex-1">{opt.label}</span>
                  {isSelected ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden
                      className="shrink-0"
                    >
                      <path
                        d="M16.6693 5L7.5026 14.1667L3.33594 10"
                        className="stroke-brand"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span className="h-5 w-5 shrink-0" aria-hidden />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
