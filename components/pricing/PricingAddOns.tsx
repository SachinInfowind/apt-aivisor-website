import Image from "next/image";
import { layout } from "@/components/ui/type";

/**
 * Pricing add-ons — Figma Frame 205 (1:7872, 1440×733).
 * Full-bleed white section (pad 100×80, gap 48) over the page gradient.
 */

type Addon = {
  id: string;
  title: string;
  description: string;
  price: string;
  iconBg: string;
  iconColor: string;
  iconSrc: string;
  footer?: "avatars" | "hubspot" | "pratt" | "clouds";
};

const ADDONS: Addon[] = [
  {
    id: "cloud-ai",
    title: "Cloud & AI Pricing Boost",
    description:
      "AWS EDP, Azure MACC, GCP CUD tiers plus AI API pricing benchmarks (OpenAI, Anthropic, Google) & essential for cloud-heavy companies.",
    price: "+$150/mo",
    iconBg: "bg-brand-soft",
    iconColor: "text-brand",
    iconSrc: "/assets/addons/cloud-blank-01.svg",
    footer: "clouds",
  },
  {
    id: "seats",
    title: "Additional User Seats",
    description:
      "Add users beyond your plan's base allocation. Volume pricing available on 10+ additional seats. All plans.",
    price: "+$49/seat/mo",
    iconBg: "bg-success-bg",
    iconColor: "text-[#067647]",
    iconSrc: "/assets/addons/user-plus-01.svg",
    footer: "avatars",
  },
  {
    id: "hubspot",
    title: "HubSpot Integration",
    description:
      "Native HubSpot CRM integration - automates linked to deals, aggregated from deal data, approval status synced. Seller and Both plans.",
    price: "+$99/mo",
    iconBg: "bg-[#EAECF5]",
    iconColor: "text-[#4E5BA6]",
    iconSrc: "/assets/addons/folder-code.svg",
    footer: "hubspot",
  },
  {
    id: "strategy",
    title: "Expert Deal Strategy Session",
    description:
      "45-minute 1:1 with Pratt Dey — ex-AWS Complex Deal Pricing. Written brief with specific tactics for your deal. Any plan, any side.",
    price: "+$499/session",
    iconBg: "bg-[#FEF0C7]",
    iconColor: "text-[#DC6803]",
    iconSrc: "/assets/addons/phone-call-01.svg",
    footer: "pratt",
  },
];

const SEAT_AVATARS = [
  "/assets/addons/avatar-1.png",
  "/assets/addons/avatar-2.png",
  "/assets/addons/avatar-3.png",
  "/assets/addons/avatar-4.png",
  "/assets/addons/avatar-5.png",
] as const;

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 3.33337V12.6667M3.33337 8H12.6667"
        className="stroke-faint"
        strokeWidth="1.333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AddonFooter({ type }: { type: NonNullable<Addon["footer"]> }) {
  if (type === "avatars") {
    return (
      <div className="flex items-center gap-2 pt-1">
        <div className="flex items-center">
          {SEAT_AVATARS.map((src, i) => (
            <span
              key={src}
              className={`relative h-6 w-6 overflow-hidden rounded-pill border-[1.5px] border-white ${
                i === 0 ? "" : "-ml-1"
              }`}
            >
              <Image src={src} alt="" fill sizes="24px" className="object-cover" />
            </span>
          ))}
          <span className="relative -ml-1 grid h-6 w-6 place-items-center rounded-pill border-2 border-white bg-surface-muted text-[10px] font-medium text-ink">
            +5
          </span>
        </div>
        <span className="grid h-6 w-6 place-items-center rounded-pill border border-dashed border-line-strong bg-white">
          <PlusIcon />
        </span>
      </div>
    );
  }

  if (type === "hubspot") {
    return (
      <div className="pt-1">
        <Image
          src="/assets/addons/hubspot-logo.svg"
          alt="HubSpot"
          width={77}
          height={22}
          className="h-5 w-auto"
        />
      </div>
    );
  }

  if (type === "pratt") {
    return (
      <div className="inline-flex items-center gap-1 rounded-pill border border-line-strong bg-surface py-px pl-px pr-3">
        <Image
          src="/assets/addons/pratt.png"
          alt=""
          width={24}
          height={25}
          className="h-6 w-6 rounded-pill object-cover"
        />
        <Image
          src="/assets/addons/aptai-mark.png"
          alt="aptAI"
          width={31}
          height={18}
          className="h-[18px] w-auto"
        />
      </div>
    );
  }

  // clouds — Azure + GCP + AI symbols
  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <Image
        src="/assets/addons/azure-logo.svg"
        alt="Azure"
        width={23}
        height={23}
        className="h-5 w-5 object-contain"
      />
      <Image
        src="/assets/addons/img-b.png"
        alt="Google Cloud"
        width={31}
        height={19}
        className="h-[19px] w-auto object-contain"
      />
      <Image
        src="/assets/addons/ai-symbol-0.svg"
        alt=""
        width={19}
        height={19}
        className="h-5 w-5 object-contain"
      />
      <Image
        src="/assets/addons/ai-symbol-1.svg"
        alt=""
        width={27}
        height={19}
        className="h-5 w-auto object-contain"
      />
    </div>
  );
}

function AddonCard({ addon }: { addon: Addon }) {
  return (
    <article className="flex h-full min-w-0 flex-col gap-5 rounded-[20px] border border-line-strong bg-white p-5 sm:gap-6 sm:rounded-[24px] sm:p-8">
      <div
        className={`grid h-12 w-12 place-items-center rounded-[10px] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] ${addon.iconBg} ${addon.iconColor}`}
      >
        <Image
          src={addon.iconSrc}
          alt=""
          width={24}
          height={24}
          className="h-6 w-6"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 sm:gap-4">
        <h3 className="font-body text-lg font-semibold leading-7 text-navy sm:text-xl sm:leading-[1.5]">
          {addon.title}
        </h3>
        <p className="text-sm leading-5 text-ink">{addon.description}</p>
        <p className="mt-auto text-lg font-bold leading-[1.5] text-brand-accent sm:text-xl">
          {addon.price}
        </p>
        {addon.footer ? <AddonFooter type={addon.footer} /> : null}
      </div>
    </article>
  );
}

export function PricingAddOns({
  className = "",
  addons: cmsAddons,
}: {
  className?: string;
  addons?: { addonId: Addon["id"]; price: string }[];
}) {
  const addons = ADDONS.map((addon) => {
    const cms = cmsAddons?.find((item) => item.addonId === addon.id);
    return cms?.price ? { ...addon, price: cms.price } : addon;
  });

  return (
    <section
      className={`mt-8 w-full bg-white sm:mt-10 md:mt-[6.25rem] ${layout.sectionX} py-12 sm:py-16 md:py-[6.25rem] ${className}`}
    >
      <div
        className={`${layout.inner} flex flex-col items-center gap-8 sm:gap-10 md:gap-12`}
      >
        <div className="flex flex-col items-center gap-4 text-center sm:gap-5">
          <span className="inline-flex items-center justify-center rounded-pill bg-brand-veil px-3.5 py-2 text-sm font-semibold leading-5 text-navy sm:px-4 sm:py-3.5">
            ADD-ONS
          </span>
          <h2 className="font-display text-[1.5rem] font-normal italic leading-[1.25] tracking-[-0.02em] sm:text-[2.5rem] sm:leading-[3.75rem] lg:text-[3rem]">
            <span className="text-navy">Extend any </span>
            <span className="text-brand-accent">plan</span>
          </h2>
        </div>

        <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          {addons.map((addon) => (
            <AddonCard key={addon.id} addon={addon} />
          ))}
        </div>
      </div>
    </section>
  );
}
