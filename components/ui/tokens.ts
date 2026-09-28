/** Persona content only — nav lives in aboutMenu.ts; visual tokens in Tailwind / globals.css */

export type PersonaId = "buyer" | "both" | "seller";

export const personas: Record<
  PersonaId,
  {
    label: string;
    quote: string;
    bullets: string[];
    statValue: string;
    statLabel: string;
    statNote: string;
  }
> = {
  buyer: {
    label: "Technology Buyer",
    quote:
      "Your Salesforce renewal is in 47 days. You're paying 34% above market.",
    bullets: [
      "Benchmark 100+ vendors against what peers pay",
      "Get a specific negotiation playbook per vendor",
      "Flag risky clauses before you sign",
      "90-day renewal alerts so you never miss a window",
    ],
    statValue: "18K",
    statLabel: "Avg saved per renewal",
    statNote: "3x ROI on the Buyer plan from a single deal",
  },
  both: {
    label: "Buyer + Seller",
    quote:
      "You're buying cloud and selling SaaS. You need one intelligence layer for both sides of the table.",
    bullets: [
      "See buyer and seller leverage in the same deal room",
      "Align pricing, terms, and approval paths faster",
      "Reuse playbooks across inbound and outbound deals",
      "Keep renewals and pipeline in one operating rhythm",
    ],
    statValue: "2x",
    statLabel: "Faster deal cycles",
    statNote: "One workspace for both sides of every transaction",
  },
  seller: {
    label: "Technology Seller",
    quote:
      "Your champion wants a discount. Your Deal Desk needs margin. Close without guessing.",
    bullets: [
      "Price against real market comps, not tribal knowledge",
      "Generate seller-ready negotiation ranges in minutes",
      "Surface risky buyer redlines before legal review",
      "Protect margin while still winning the deal",
    ],
    statValue: "21%",
    statLabel: "Avg margin protected",
    statNote: "Seller intelligence that keeps deals moving",
  },
};
