import type { SelectOption } from "@/components/ui/SelectDropdown";

/**
 * Waitlist form dropdown options.
 * Spend menu: Figma 26281:29930 · Title/Role menu: Figma 26281:29918
 */

export const SPEND_PLACEHOLDER = "Select range";

/** Approximate annual technology spend / ARR */
export const SPEND_OPTIONS: SelectOption[] = [
  { value: "under-1m", label: "Under $1M" },
  { value: "1m-5m", label: "$1M – $5M" },
];

export const ROLE_PLACEHOLDER = "Select role";

/** Title / Role */
export const ROLE_OPTIONS: SelectOption[] = [
  { value: "ceo-founder", label: "CEO / Founder" },
  { value: "cfo-vp-finance", label: "CFO / VP Finance" },
  { value: "cto-vp-eng", label: "CTO / VP Engineering" },
  { value: "vp-sales", label: "VP Sales / Revenue" },
  { value: "deal-desk", label: "Deal Desk / Sales Ops" },
  { value: "procurement-legal", label: "Procurement / Legal" },
  { value: "revops-finops", label: "RevOps / FinOps" },
  { value: "other", label: "Other" },
];
