"use client";

import { CheckboxBox, OTHER_PREFIX, hasOther, otherIsEmpty, otherText } from "./fields";
import { inputClass } from "@/components/design-partner/sections/questionnaire/shared";
import { CONTRACT_TYPE_GROUPS, OTHER, OTHER_MAX_LENGTH } from "./options";

/** "Which are the most common contract types?" — grouped checkboxes plus an "Other" box (Figma Buyer/Seller Snapshot). */
export function ContractTypesField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}) {
  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  const otherChecked = hasOther(value);
  const setOther = (text: string | null) => {
    const rest = value.filter((x) => x !== OTHER && !x.startsWith(OTHER_PREFIX));
    onChange(text === null ? rest : [...rest, text ? `${OTHER_PREFIX}${text}` : OTHER]);
  };

  const Option = ({ opt }: { opt: string }) => {
    const checked = value.includes(opt);
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => toggle(opt)}
        className="flex min-h-11 items-start gap-2 py-2 text-left text-sm leading-5 text-ink"
      >
        <CheckboxBox checked={checked} />
        {opt}
      </button>
    );
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <span className="text-sm font-medium leading-5 text-ink">{label} *</span>
      <div className="grid w-full grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {CONTRACT_TYPE_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-1">
            <span className="text-sm font-semibold leading-5 text-heading">Select {group.title}</span>
            {group.options.map((opt) => (
              <Option key={opt} opt={opt} />
            ))}
          </div>
        ))}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold leading-5 text-heading">Other</span>
          <button
            type="button"
            role="checkbox"
            aria-checked={otherChecked}
            onClick={() => setOther(otherChecked ? null : "")}
            className="flex min-h-11 items-start gap-2 py-2 text-left text-sm leading-5 text-ink"
          >
            <CheckboxBox checked={otherChecked} />
            Other
          </button>
          {otherChecked ? (
            <input
              type="text"
              aria-label="Other contract type"
              value={otherText(value)}
              maxLength={OTHER_MAX_LENGTH}
              onChange={(e) => setOther(e.target.value)}
              placeholder="Enter Other"
              className={`${inputClass} ${error && otherIsEmpty(value) ? "border-red-400" : ""}`}
            />
          ) : null}
        </div>
      </div>
      {error ? <p className="text-sm leading-5 text-red-600">{error}</p> : null}
    </div>
  );
}
