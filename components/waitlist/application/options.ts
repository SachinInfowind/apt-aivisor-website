/**
 * Option lists for the Waitlist application form — copied from the
 * "aptAIvisor Waitlist Questionnaire V2" document. Keep in sync with the CMS
 * (`aptaivisor-cms/src/api/waitlist-signup`) when answers are validated there.
 */
export const OTHER = "Other";
/** Free-text box shown next to an "Other" choice. */
export const OTHER_MAX_LENGTH = 15;

export const FUNCTION_OPTIONS = [
  "Finance",
  "Sales / Account Management",
  "Deal Desk / Revenue Operations / Pricing",
  "Product",
  "Procurement / Sourcing",
  "Legal / Contracts",
  "Executive Leadership / Founder",
  OTHER,
];

export const DEAL_ROLE_OPTIONS = ["Technology Buyer", "Technology Seller", "Both Buyer & Seller"] as const;
export type DealRole = (typeof DEAL_ROLE_OPTIONS)[number];

export const INDUSTRY_OPTIONS = [
  "Technology (Software / SaaS / Cyber Security)",
  "Technology (Hardware / Infrastructure)",
  "Financial Services",
  "Healthcare / Life Sciences",
  "Manufacturing",
  "Retail / E-commerce",
  "Media & Entertainment",
  "Professional Services",
  "Energy / Utilities",
  "Education",
  "Telecommunications",
  "Government / Public Sector",
  OTHER,
];

export const EMPLOYEE_OPTIONS = ["1–50", "51–200", "201–500", "501–1,000", "1,001–5,000", "5,001–25,000", "25,001+"];

export const REVENUE_OPTIONS = [
  "Under $1M",
  "$1M–$10M",
  "$10M–$50M",
  "$50M–$250M",
  "$250M–$1B",
  "Above $1B",
  "Prefer not to say",
];

export const OWNERSHIP_OPTIONS = ["Public", "Private (PE or VC backed)", "Private (founder or family owned)", OTHER];

export const GROWTH_OPTIONS = ["Declining", "0–10%", "10–25%", "25–50%", "50–100%", "Over 100%", "Not sure"];

export const APPROVER_OPTIONS = [
  "Dedicated function",
  "Part-time by other functions like Finance, Sales Ops, or RevOps",
  "Sales leaders approve deals directly",
  "Outsourced to an external partner",
  "No formal process",
  "Not sure",
];

export const DEAL_POLICY_OPTIONS = [
  "Yes - Robust official deal policy, guidelines and best practices",
  "Some - Informal process exists, not scalable or well managed",
  "None - We have not invested in this area",
];

export const NONE_RIGHT_NOW = "None right now";
export const HELP_OPTIONS = [
  "Defining deal policy, guidelines and best practices",
  "Pricing and discount rules",
  "Deal approval process design",
  "Contract terms and non-standard requests",
  "Deal modeling and margin analysis",
  "Organizational design of deal desk function",
  "Training and onboarding sales teams on deal best practices",
  NONE_RIGHT_NOW,
];

export const ALL_OF_THE_ABOVE = "All of the above";
export const MATTERS_OPTIONS = [
  "Executive oversight",
  "Prioritizing leadership KPIs (Backlog, long term commitment)",
  "Revenue growth",
  "Multi-vendor strategy",
  "Logo",
  "Margin",
  "Risk management (financial exposure)",
  "Compliance (legal, audit)",
  ALL_OF_THE_ABOVE,
];

/* ---- Step 2: Buyer / Seller snapshot ---- */

export const TECH_SPEND_OPTIONS = [
  "Under $500K",
  "$500K – $2M",
  "$2M – $10M",
  "$10M – $50M",
  "$50M – $250M",
  "Above $250M",
  "Not sure",
];

export const TECH_SPEND_GROWTH_OPTIONS = [
  "Declining",
  "0 – 10%",
  "10% – 25%",
  "25% – 50%",
  "50% – 100%",
  "Over 100%",
  "Not sure",
];

/** Contract types, grouped as in the design. The last group is a lone "Other" with a text box. */
export const CONTRACT_TYPE_GROUPS: { title: string; options: string[] }[] = [
  {
    title: "Pricing",
    options: [
      "Public / self-serve pricing",
      "Pay-as-you-go usage / subscription (incl. per-token)",
      "Negotiated discount off list price (rate card, % off MSRP)",
    ],
  },
  {
    title: "Commitments",
    options: [
      "Committed spend discount (e.g., AWS EDP, Azure MACC, GCP EDP, Other)",
      "Reserved capacity (e.g., CUD, provisioned throughput, storage)",
      "Program credits (Strategic Collaboration, Migration, Partnership, Partner Bounty, etc.)",
      "Revenue Share",
    ],
  },
  {
    title: "Subscriptions",
    options: ["Annual subscription", "Multi-year or company-wide license (ELA)", "Per-user fee plus usage credits"],
  },
  {
    title: "Hardware",
    options: ["Bundle (hardware + software + support)", "Volume purchase agreement", "Lease or lease-to-own"],
  },
  {
    title: "Channels and services",
    options: ["Cloud marketplace private offers", "Professional services (SOW)"],
  },
];

export const NO_MAJOR_CHALLENGE = "No major challenge";
export const BUYER_CHALLENGE_OPTIONS = [
  "Tracking commitments, obligations, and renewal dates",
  "Benchmarking pricing with market",
  "Negotiating better terms",
  "Sizing commitments correctly before signing",
  "Getting internal approval and compliance",
  "Post-deal contract governance",
  NO_MAJOR_CHALLENGE,
  OTHER,
];

export const DEAL_SIZE_OPTIONS = [
  "Under $50K",
  "$50K to under $250K",
  "$250K to under $1M",
  "$1M to under $5M",
  "$5M to under $25M",
  "$25M+",
  "Varies widely",
];

export const SELLER_CHALLENGE_OPTIONS = [
  "Defining deal policy, guidelines and best practices",
  "Pricing and discount rules",
  "Deal approval process design",
  "Contract terms and non-standard requests",
  "Deal modeling and margin analysis",
  "Deal related FP&A (Financial Planning & Analysis)",
  "Organizational design of deal desk function",
  "Training and onboarding sales teams on deal best practices",
  NONE_RIGHT_NOW,
];

/* ---- Step 3: Platform fit + consent ---- */

export const CAPABILITY_OPTIONS = [
  "Contract Chatbot (ask questions, get answers)",
  "Pricing Intelligence & Benchmarks",
  "Contract Builder & Redline",
  "Deal P&L Builder",
  "Approval & E-Signature Workflow",
  "Consulting Services",
  "Not sure yet",
];

export const TOOLS_OPTIONS = [
  "Spreadsheets",
  "Shared drive (Google Drive, SharePoint)",
  "CRM (Salesforce, HubSpot)",
  "SAP",
  "Quoting tool / CPQ (e.g. Salesforce CPQ, DealHub)",
  "Contract management software / CLM (Ironclad, DocuSign CLM)",
  "Procurement or finance system (e.g. Coupa, NetSuite)",
  "Email",
  OTHER,
];

export const CRM_OPTIONS = ["Salesforce", "HubSpot", "Pipedrive", "Microsoft Dynamics", "None", OTHER];

export const REFERRED = "Referred by someone";
export const HEARD_OPTIONS = ["LinkedIn", REFERRED, "aptAI team outreach", "Event or webinar", OTHER];
export const REFERRER_MAX_LENGTH = 50;

export const BENCHMARK_NOTICE =
  "aptAIvisor's benchmark intelligence is built from anonymized, aggregated deal data. Your specific data is never shared — only statistical patterns across a minimum of 5 contributors are ever surfaced. By joining the waitlist, you agree to the terms below.";
