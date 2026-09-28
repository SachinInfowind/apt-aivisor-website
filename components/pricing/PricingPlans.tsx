"use client";

/**
 * Founding plans — Figma "Image" frame (1:7647, 1280×1189).
 * Three plan cards (Buyer / Both / Seller); Both is the highlighted Most Value tier.
 * Fluid grid: 1 col → 2 col (md) → 3 col (lg).
 */

export type PlanId = "buyer" | "both" | "seller";
export type BillingPeriod = "monthly" | "yearly";

type Feature = { label: string; included?: boolean };

type FeatureGroup = {
  title: string;
  items: Feature[];
};

type Plan = {
  id: PlanId;
  name: string;
  /** Monthly list price in USD */
  priceMonthly: number;
  description: string;
  featured?: boolean;
  badge?: string;
  groups: FeatureGroup[];
};

const DEFAULT_YEARLY_DISCOUNT = 17;

const PLANS: Plan[] = [
  {
    id: "buyer",
    name: "Buyer Plan",
    priceMonthly: 499,
    description:
      "For CFOs, finance leads & RevOps teams buying SaaS, cloud & technology services",
    groups: [
      {
        title: "Contract intelligence",
        items: [
          { label: "Multi-LLM chatbot — Claude, GPT-4, Gemini side-by-side" },
          { label: "50 contracts stored with clause extraction" },
          { label: "AI risk flagging and redline suggestions" },
          { label: "Contract drafting from any input format" },
          { label: "Export to PDF and Word" },
        ],
      },
      {
        title: "Pricing benchmarks",
        items: [
          { label: "100+ vendor pricing benchmarks" },
          { label: "Overpayment detection report" },
          { label: "Negotiation playbook per vendor" },
          { label: "90-day renewal alerts" },
          { label: "Deal P&L builder" },
        ],
      },
      {
        title: "Access",
        items: [
          { label: "3 user seats" },
          { label: "Contract repository" },
          { label: "Salesforce integration", included: false },
          { label: "Competitive pricing library", included: false },
          { label: "Deal velocity analytics", included: false },
        ],
      },
    ],
  },
  {
    id: "both",
    name: "Both Plan",
    priceMonthly: 999,
    featured: true,
    badge: "Most Value",
    description:
      "For technology companies that buy tools to operate and sell technology products or services",
    groups: [
      {
        title: "BUYING SIDE (FULL BUYER PLAN)",
        items: [
          { label: "Multi-LLM chatbot — Claude, GPT-4, Gemini" },
          { label: "100+ vendor benchmarks + negotiation playbooks" },
          { label: "Overpayment detection + renewal alerts" },
          { label: "Contract risk scoring + redlines" },
          { label: "Deal P&L builder (buyer view)" },
        ],
      },
      {
        title: "SELLING SIDE (FULL SELLER PLAN)",
        items: [
          { label: "Contract generation from CRM + email + quote" },
          { label: "Inbound redline AI counter-draft" },
          { label: "Deal desk P&L + discount approval builder" },
          { label: "Competitive pricing benchmarks" },
          { label: "Optimal price point by deal size + segment" },
        ],
      },
      {
        title: "BOTH-ONLY FEATURES",
        items: [
          { label: "Salesforce integration (buy + sell side)" },
          { label: "Two-sided deal analytics dashboard" },
          { label: "10 user seats with RBAC" },
          { label: "Obligation + revenue recognition tracker" },
          { label: "Quarterly benchmark refresh" },
        ],
      },
    ],
  },
  {
    id: "seller",
    name: "Seller Plan",
    priceMonthly: 799,
    description:
      "For sales leaders, deal desk teams & RevOps at SaaS companies and technology service firms",
    groups: [
      {
        title: "DEAL WORKFLOW",
        items: [
          { label: "Contract generation from CRM, email, or quote" },
          { label: "Unlimited contracts generated per month" },
          { label: "Inbound redline AI review + counter-draft" },
          { label: "Deal desk P&L + discount approval builder" },
          { label: "Export to PDF and Word" },
        ],
      },
      {
        title: "PRICING INTELLIGENCE",
        items: [
          { label: "Competitive pricing benchmarks for your category" },
          { label: "Optimal price point by deal size and segment" },
          { label: "Margin at each discount level" },
          { label: "Win rate analysis by price tier" },
          { label: "Which terms to hold vs. concede playbook" },
        ],
      },
      {
        title: "BOTH-ONLY FEATURES",
        items: [
          { label: "5 user seats" },
          { label: "Salesforce integration" },
          { label: "Deal velocity analytics" },
          { label: "Buyer-side benchmarks", included: false },
          { label: "Obligation tracker", included: false },
        ],
      },
    ],
  },
];

function formatPrice(amount: number) {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}
function CheckIcon({ onBlue }: { onBlue?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={`mt-0.5 shrink-0 ${onBlue ? "text-white" : "text-nav"}`}
    >
      <path
        d="M16.6667 5L7.50004 14.1667L3.33337 10"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlanCard({
  plan,
  billing,
  yearlyDiscountPercent,
}: {
  plan: Plan;
  billing: BillingPeriod;
  yearlyDiscountPercent: number;
}) {
  const onBlue = Boolean(plan.featured);
  const yearlyFactor = (100 - yearlyDiscountPercent) / 100;
  const amount =
    billing === "yearly"
      ? plan.priceMonthly * yearlyFactor
      : plan.priceMonthly;
  const billedLabel = billing === "yearly" ? "Billed yearly" : "Billed monthly";

  return (
    <article
      className={`flex h-full min-w-0 w-full flex-col gap-6 rounded-[20px] p-4 sm:gap-8 sm:p-5 sm:pb-8 ${
        onBlue
          ? "bg-brand-strong text-white md:col-span-2 lg:col-span-1"
          : "border border-line-strong bg-white text-navy"
      }`}
    >
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <h3
            className={`font-display text-[1.375rem] font-normal leading-[1.27] sm:text-[1.875rem] sm:leading-[2.375rem] ${
              onBlue ? "text-white" : "text-navy"
            }`}
          >
            {plan.name}
          </h3>
          {plan.badge ? (
            <span className="inline-flex shrink-0 items-center rounded-[32px] bg-[#FEC84B] px-2 py-0.5 text-[13px] font-medium leading-[1.5] tracking-[-0.03em] text-[#001E55]">
              {plan.badge}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-end gap-1">
            <span
              className={`font-body text-[2.25rem] font-semibold leading-[1.2] tracking-[-0.02em] sm:text-[3.75rem] ${
                onBlue ? "text-white" : "text-navy"
              }`}
            >
              {formatPrice(amount)}
            </span>
            <span
              className={`pb-1 text-sm font-semibold leading-5 sm:pb-3 ${
                onBlue ? "text-white" : "text-ink"
              }`}
            >
              /mo
            </span>
          </div>
          <p
            className={`text-[13px] leading-[1.5] ${
              onBlue ? "text-success-bg" : "text-[#079455]"
            }`}
          >
            {billedLabel}
          </p>
        </div>

        <p
          className={`text-xs leading-[1.5] sm:text-xs ${
            onBlue ? "text-white/90" : "text-ink"
          }`}
        >
          {plan.description}
        </p>

        <a
          href="/waitlist"
          className={`inline-flex w-full items-center justify-center rounded-pill border border-line-strong px-4 py-3 text-sm font-semibold leading-6 text-ink shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors sm:px-[1.125rem] sm:text-base ${
            onBlue
              ? "bg-white hover:bg-surface"
              : "bg-surface hover:bg-white"
          }`}
        >
          Start 14 Free Trial
        </a>
      </div>

      <div className="flex flex-col gap-6 sm:gap-8">
        {plan.groups.map((group) => (
          <div key={group.title} className="flex flex-col gap-3 sm:gap-4">
            <p
              className={`text-xs font-semibold leading-[1.5] ${
                onBlue ? "text-white" : "text-navy"
              }`}
            >
              {group.title}
            </p>
            <ul className="flex flex-col gap-3">
              {group.items.map((item) => {
                const included = item.included !== false;
                return (
                  <li
                    key={item.label}
                    className={`flex items-start gap-1.5 ${
                      included ? "" : "opacity-40"
                    }`}
                  >
                    <CheckIcon onBlue={onBlue} />
                    <span
                      className={`min-w-0 text-xs font-medium leading-[1.5] ${
                        onBlue ? "text-white" : "text-nav"
                      }`}
                    >
                      {item.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}

export function PricingPlans({
  className = "",
  billing = "monthly",
  plans: cmsPlans,
  yearlyDiscountPercent = DEFAULT_YEARLY_DISCOUNT,
}: {
  className?: string;
  billing?: BillingPeriod;
  plans?: { planId: PlanId; name?: string; priceMonthly: number }[];
  yearlyDiscountPercent?: number;
}) {
  const plans = PLANS.map((plan) => {
    const cms = cmsPlans?.find((item) => item.planId === plan.id);
    if (!cms) return plan;
    return {
      ...plan,
      name: cms.name || plan.name,
      priceMonthly: cms.priceMonthly,
    };
  });

  return (
    <div
      className={`flex w-full min-w-0 flex-col gap-6 overflow-hidden rounded-[24px] bg-white p-4 sm:gap-[2.125rem] sm:p-6 md:gap-[2.125rem] md:p-8 ${className}`}
    >
      <div className="flex flex-col items-center gap-3 px-1 text-center">
        <h2 className="font-display text-[1.5rem] font-normal italic leading-[1.15] tracking-[-0.02em] sm:text-[2.5rem] sm:leading-[2.75rem] lg:text-[3rem]">
          <span className="text-[#001C2E]">Limited Founding</span>{" "}
          <span className="text-brand-accent">Plan</span>
        </h2>
        <p className="max-w-[40rem] text-sm leading-6 text-[#446278] sm:text-base">
          Every plan up to 50% off the regular yearly price, billed yearly and
          locked in for life. Only 200 seats available.
        </p>
      </div>

      <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billing={billing}
            yearlyDiscountPercent={yearlyDiscountPercent}
          />
        ))}
      </div>
    </div>
  );
}
