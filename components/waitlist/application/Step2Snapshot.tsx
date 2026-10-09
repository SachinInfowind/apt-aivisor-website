"use client";

import { SelectField, StepSectionHeading } from "@/components/design-partner/sections/questionnaire/shared";
import { CheckboxGroupField, CheckboxGroupWithOther, otherIsEmpty } from "./fields";
import { ContractTypesField } from "./ContractTypesField";
import {
  BUYER_CHALLENGE_OPTIONS,
  DEAL_SIZE_OPTIONS,
  NONE_RIGHT_NOW,
  NO_MAJOR_CHALLENGE,
  SELLER_CHALLENGE_OPTIONS,
  TECH_SPEND_GROWTH_OPTIONS,
  TECH_SPEND_OPTIONS,
} from "./options";

/** Step 2 — Buyer Snapshot (Section C) and Seller Snapshot (Section D). Shown by the role chosen in step 1. */

const REQUIRED = "This field is required";
const PICK_ONE = "Select at least one";

/** An exclusive option ("No major challenge" / "None right now") clears the rest, and vice versa. */
const exclusive = (none: string) => (prev: string[], next: string[]) => {
  const added = next.find((o) => !prev.includes(o));
  if (added === none) return [none];
  return next.filter((o) => o !== none);
};

/* ---------- Buyer ---------- */

export type BuyerState = {
  techSpend: string;
  techSpendGrowth: string;
  contractTypes: string[];
  challenges: string[];
};
export const INITIAL_BUYER: BuyerState = { techSpend: "", techSpendGrowth: "", contractTypes: [], challenges: [] };

export const buyerErrors = (v: BuyerState) => ({
  techSpend: v.techSpend ? undefined : REQUIRED,
  techSpendGrowth: v.techSpendGrowth ? undefined : REQUIRED,
  contractTypes: !v.contractTypes.length ? PICK_ONE : otherIsEmpty(v.contractTypes) ? REQUIRED : undefined,
  challenges: !v.challenges.length ? PICK_ONE : otherIsEmpty(v.challenges) ? REQUIRED : undefined,
});
export const isBuyerValid = (v: BuyerState) => Object.values(buyerErrors(v)).every((e) => !e);

export function BuyerSnapshot({
  value,
  onChange,
  stepLabel,
  showErrors,
}: {
  value: BuyerState;
  onChange: (next: BuyerState) => void;
  stepLabel: string;
  showErrors?: boolean;
}) {
  const set = <K extends keyof BuyerState>(key: K, v: BuyerState[K]) => onChange({ ...value, [key]: v });
  const errors = buyerErrors(value);
  const err = (key: keyof BuyerState) => (showErrors ? errors[key] : undefined);
  return (
    <div className="flex w-full flex-col items-start gap-6">
      <StepSectionHeading title="Buyer Snapshot" stepLabel={stepLabel} />
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8">
        <SelectField
          label="Your company's annual technology spend (cloud + SaaS + services combined)"
          required
          value={value.techSpend}
          onChange={(v) => set("techSpend", v)}
          placeholder="Select"
          options={TECH_SPEND_OPTIONS}
          error={err("techSpend")}
        />
        <SelectField
          label="Expected annual tech spend growth over the next 3 years (a rough guess is fine)"
          required
          value={value.techSpendGrowth}
          onChange={(v) => set("techSpendGrowth", v)}
          placeholder="Select"
          options={TECH_SPEND_GROWTH_OPTIONS}
          error={err("techSpendGrowth")}
        />
      </div>
      <ContractTypesField
        label="Which are the most common contract types?"
        value={value.contractTypes}
        onChange={(v) => set("contractTypes", v)}
        error={err("contractTypes")}
      />
      <CheckboxGroupWithOther
        label="Biggest contract challenge as a buyer"
        required
        value={value.challenges}
        // "No major challenge" excludes everything else (including Other).
        onChange={(next) => set("challenges", exclusive(NO_MAJOR_CHALLENGE)(value.challenges, next))}
        options={BUYER_CHALLENGE_OPTIONS}
        error={err("challenges")}
        otherLabel="Other biggest contract challenge as a buyer"
        otherPlaceholder="Enter Other biggest contract challenge as a buyer"
        columns={2}
      />
    </div>
  );
}

/* ---------- Seller ---------- */

export type SellerState = { dealSize: string; contractTypes: string[]; challenges: string[] };
export const INITIAL_SELLER: SellerState = { dealSize: "", contractTypes: [], challenges: [] };

export const sellerErrors = (v: SellerState) => ({
  dealSize: v.dealSize ? undefined : REQUIRED,
  contractTypes: !v.contractTypes.length ? PICK_ONE : otherIsEmpty(v.contractTypes) ? REQUIRED : undefined,
  challenges: v.challenges.length ? undefined : PICK_ONE,
});
export const isSellerValid = (v: SellerState) => Object.values(sellerErrors(v)).every((e) => !e);

export function SellerSnapshot({
  value,
  onChange,
  stepLabel,
  showErrors,
}: {
  value: SellerState;
  onChange: (next: SellerState) => void;
  stepLabel?: string;
  showErrors?: boolean;
}) {
  const set = <K extends keyof SellerState>(key: K, v: SellerState[K]) => onChange({ ...value, [key]: v });
  const errors = sellerErrors(value);
  const err = (key: keyof SellerState) => (showErrors ? errors[key] : undefined);
  return (
    <div className="flex w-full flex-col items-start gap-6">
      <StepSectionHeading title="Seller Snapshot" stepLabel={stepLabel} />
      <div className="grid w-full grid-cols-1 gap-6">
        <SelectField
          label="Your typical deal size (Total Contract Value or TCV)"
          required
          value={value.dealSize}
          onChange={(v) => set("dealSize", v)}
          placeholder="Select"
          options={DEAL_SIZE_OPTIONS}
          error={err("dealSize")}
        />
      </div>
      <ContractTypesField
        label="Which are the most common contract types you sell?"
        value={value.contractTypes}
        onChange={(v) => set("contractTypes", v)}
        error={err("contractTypes")}
      />
      <CheckboxGroupField
        label="Biggest contract challenge as a seller"
        required
        value={value.challenges}
        onChange={(next) => set("challenges", exclusive(NONE_RIGHT_NOW)(value.challenges, next))}
        options={SELLER_CHALLENGE_OPTIONS}
        error={err("challenges")}
        columns={2}
      />
    </div>
  );
}
