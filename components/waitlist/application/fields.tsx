"use client";

import { Field, inputClass } from "@/components/design-partner/sections/questionnaire/shared";
import { OTHER, OTHER_MAX_LENGTH } from "./options";

/** Single-choice list shown as round radio buttons (Figma "Radio"). */
export function RadioGroupField({
  label,
  required,
  value,
  onChange,
  options,
  error,
  columns = "row",
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  error?: string;
  columns?: "row" | "stack";
}) {
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <span className="text-sm font-medium leading-5 text-ink">
        {label}
        {required ? " *" : ""}
      </span>
      <div role="radiogroup" aria-label={label} className={`flex w-full gap-x-6 gap-y-3 ${columns === "stack" ? "flex-col" : "flex-wrap"}`}>
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt)}
              className="flex min-h-11 items-center gap-2 text-left text-base leading-6 text-ink"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  selected ? "border-brand bg-[#E8F0FF]" : "border-[#D0D5DD] bg-white"
                }`}
              >
                {selected ? <span className="h-1.5 w-1.5 rounded-full bg-brand" /> : null}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-sm leading-5 text-red-600">{error}</p> : null}
    </div>
  );
}

/** Multi-choice list shown as square checkboxes in three columns (Figma "Checkbox"). */
export function CheckboxGroupField({
  label,
  required,
  value,
  onChange,
  options,
  error,
  columns = 3,
  heading = true,
}: {
  label: string;
  required?: boolean;
  value: string[];
  onChange: (value: string[]) => void;
  options: readonly string[];
  error?: string;
  /** 2 for the wider "challenge" lists, 3 elsewhere. */
  columns?: 2 | 3;
  /** false when a parent already shows the heading (e.g. a contract-type sub-group). */
  heading?: boolean;
}) {
  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  return (
    <div className="flex w-full flex-col items-start gap-3">
      {heading ? (
        <span className="text-sm font-medium leading-5 text-ink">
          {label}
          {required ? " *" : ""}
        </span>
      ) : null}
      <div
        className={`grid w-full grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}
      >
        {options.map((opt) => {
          const checked = value.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              role="checkbox"
              aria-checked={checked}
              onClick={() => toggle(opt)}
              className="flex min-h-11 items-start gap-2 py-2.5 text-left text-base leading-6 text-ink"
            >
              <CheckboxBox checked={checked} />
              {opt}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-sm leading-5 text-red-600">{error}</p> : null}
    </div>
  );
}

export function CheckboxBox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
        checked ? "border-brand bg-brand" : "border-[#D0D5DD] bg-white"
      }`}
    >
      {checked ? (
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );
}

/** Value of an "Other" choice inside a multi-select list: stored as "Other: <text>". */
export const OTHER_PREFIX = `${OTHER}: `;
export const hasOther = (v: string[]) => v.some((x) => x === OTHER || x.startsWith(OTHER_PREFIX));
export const otherText = (v: string[]) => v.find((x) => x.startsWith(OTHER_PREFIX))?.slice(OTHER_PREFIX.length) ?? "";
/** Replace the Other entry (or add it) so the list holds "Other: <text>". */
export const withOtherText = (v: string[], text: string) => [
  ...v.filter((x) => x !== OTHER && !x.startsWith(OTHER_PREFIX)),
  `${OTHER_PREFIX}${text}`,
];
/** Does this list have "Other" ticked but nothing written yet? */
export const otherIsEmpty = (v: string[]) => hasOther(v) && !otherText(v).trim();

/** Multi-select where "Other" reveals a text box (max 15 chars) — wraps CheckboxGroupField. */
export function CheckboxGroupWithOther({
  label,
  required,
  value,
  onChange,
  options,
  error,
  otherLabel,
  otherPlaceholder,
  columns = 3,
}: {
  label: string;
  required?: boolean;
  value: string[];
  onChange: (value: string[]) => void;
  options: readonly string[];
  error?: string;
  otherLabel?: string;
  otherPlaceholder: string;
  columns?: 2 | 3;
}) {
  // The list holds either the plain "Other" tick or "Other: <text>"; show it ticked in both cases.
  const shown = value.map((v) => (v.startsWith(OTHER_PREFIX) ? OTHER : v));
  return (
    <div className="flex w-full flex-col gap-3">
      <CheckboxGroupField
        label={label}
        required={required}
        value={shown}
        onChange={(next) => {
          const wantsOther = next.includes(OTHER);
          const text = otherText(value);
          const base = next.filter((x) => x !== OTHER);
          onChange(wantsOther ? [...base, text ? `${OTHER_PREFIX}${text}` : OTHER] : base);
        }}
        options={options}
        error={error}
        columns={columns}
      />
      {hasOther(value) ? (
        <input
          type="text"
          aria-label={otherLabel ?? "Other"}
          value={otherText(value)}
          maxLength={OTHER_MAX_LENGTH}
          onChange={(e) =>
            onChange(
              e.target.value
                ? [...value.filter((x) => x !== OTHER && !x.startsWith(OTHER_PREFIX)), `${OTHER_PREFIX}${e.target.value}`]
                : [...value.filter((x) => x !== OTHER && !x.startsWith(OTHER_PREFIX)), OTHER],
            )
          }
          placeholder={otherPlaceholder}
          className={`${inputClass} ${otherIsEmpty(value) && error ? "border-red-400" : ""}`}
        />
      ) : null}
    </div>
  );
}

/** Select with an extra text box that appears when "Other" is chosen (max 15 characters). */
export function SelectWithOther({
  label,
  required,
  value,
  otherValue,
  onChange,
  onOtherChange,
  options,
  placeholder = "Select",
  error,
  otherError,
}: {
  label: string;
  required?: boolean;
  value: string;
  otherValue: string;
  onChange: (value: string) => void;
  onOtherChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  otherError?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <Field label={label} required={required} error={error}>
        <div className="relative w-full">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} appearance-none pr-10 ${value ? "" : "text-subtle"} ${error ? "border-red-400" : ""}`}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
          >
            <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Field>
      {value === OTHER ? (
        <Field label="Please specify" required error={otherError}>
          <input
            type="text"
            value={otherValue}
            maxLength={OTHER_MAX_LENGTH}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="Enter other"
            className={`${inputClass} ${otherError ? "border-red-400" : ""}`}
          />
        </Field>
      ) : null}
    </div>
  );
}
