import Image from "next/image";
import type { ReactNode } from "react";
import { homeAssets } from "@/components/ui/assets";

type ModuleId = "chatbot" | "pricing" | "builder" | "pnl";

function Shell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <p className="text-body font-semibold text-navy">{title}</p>
          {subtitle ? (
            <p className="mt-0.5 text-body-xs text-subtle">{subtitle}</p>
          ) : null}
        </div>
        {action ? (
          <span className="inline-flex shrink-0 items-center rounded-pill border border-brand-edge px-3 py-1.5 text-body-xs font-semibold text-brand">
            {action}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">{children}</div>
    </div>
  );
}

function ChatbotPreview() {
  return (
    <Image
      src={homeAssets.modules.chatbotUi}
      alt="Contract chatbot preview"
      width={1654}
      height={1646}
      className="h-auto w-full"
      priority
    />
  );
}

function PricingPreview() {
  return (
    <Shell
      title="Pricing Intelligence"
      subtitle="Market benchmarks for your vendor stack"
      action="+ Add vendor"
    >
      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          { l: "Above market", v: "34%", c: "text-danger-fg bg-danger-bg" },
          { l: "Peer median", v: "$84k", c: "text-brand bg-brand-mist" },
          { l: "Savings opp.", v: "$18k", c: "text-success-fg bg-success-bg" },
        ].map((x) => (
          <div key={x.l} className={`rounded-xl px-3 py-3 ${x.c}`}>
            <p className="text-caption font-medium opacity-80">{x.l}</p>
            <p className="mt-1 font-display text-h5">{x.v}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[
          { name: "Salesforce", pay: "$142k", peer: "$96k", delta: "+48%" },
          { name: "AWS", pay: "$210k", peer: "$188k", delta: "+12%" },
          { name: "Slack", pay: "$28k", peer: "$22k", delta: "+27%" },
        ].map((r) => (
          <div
            key={r.name}
            className="flex items-center justify-between rounded-xl border border-line bg-brand-wash px-3 py-3"
          >
            <div>
              <p className="text-body-sm font-semibold text-navy">{r.name}</p>
              <p className="text-caption text-subtle">
                You {r.pay} · Peer {r.peer}
              </p>
            </div>
            <span className="rounded-pill bg-danger-bg px-2.5 py-1 text-caption font-semibold text-danger-fg">
              {r.delta}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-auto pt-4 text-center text-body-xs text-subtle">
        Renewal playbooks ready 90 days before auto-renewal
      </p>
    </Shell>
  );
}

function BuilderPreview() {
  return (
    <Shell
      title="Contract builder"
      subtitle="Draft, redline, and route for approval"
      action="New draft"
    >
      <div className="mb-4 flex gap-2">
        {["Template", "From PDF", "From email"].map((t, i) => (
          <span
            key={t}
            className={`rounded-lg px-3 py-1.5 text-caption font-semibold ${
              i === 0
                ? "bg-brand text-white"
                : "bg-brand-tab text-nav"
            }`}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex-1 rounded-xl border border-line bg-brand-wash p-4">
        <p className="text-caption font-semibold uppercase tracking-wide text-faint">
          Master Services Agreement
        </p>
        <div className="mt-3 space-y-2">
          <div className="h-2.5 w-[92%] rounded-sm bg-line" />
          <div className="h-2.5 w-[84%] rounded-sm bg-line" />
          <div className="h-2.5 w-[88%] rounded-sm bg-line" />
        </div>
        <div className="mt-4 rounded-lg border border-danger/30 bg-danger-bg px-3 py-2">
          <p className="text-caption font-semibold text-danger-fg">
            Risky clause · Auto-renewal (Section 8.2)
          </p>
          <p className="mt-0.5 text-caption text-ink">
            Suggest 30-day termination window before renewal.
          </p>
        </div>
        <div className="mt-3 rounded-lg border border-brand-edge bg-white px-3 py-2">
          <p className="text-caption font-semibold text-brand">
            Suggested redline applied
          </p>
        </div>
      </div>
    </Shell>
  );
}

function PnlPreview() {
  return (
    <Shell
      title="Deal P&L builder"
      subtitle="3-year cost model from contract terms"
      action="Export"
    >
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-caption text-subtle">Projected 3-year TCO</p>
          <p className="font-display text-stat-md text-brand-accent">$486k</p>
        </div>
        <p className="text-body-xs font-semibold text-success-fg">↓ 12% vs quote</p>
      </div>
      <div className="mb-4 flex h-28 items-end gap-2 rounded-xl bg-brand-mist px-4 py-3">
        {[
          "h-[45px]",
          "h-[62px]",
          "h-[54px]",
          "h-[78px]",
          "h-[69px]",
          "h-[95px]",
        ].map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className={`w-full rounded-t-md bg-brand ${h}`} />
            <span className="text-nano text-faint">Y{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[
          { l: "Base license", v: "$210k" },
          { l: "Implementation", v: "$90k" },
          { l: "Support & overages", v: "$186k" },
        ].map((r) => (
          <div
            key={r.l}
            className="flex items-center justify-between border-b border-line py-2 text-body-sm last:border-0"
          >
            <span className="text-ink">{r.l}</span>
            <span className="font-semibold text-navy">{r.v}</span>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function ModulePreview({ id }: { id: ModuleId }) {
  switch (id) {
    case "pricing":
      return <PricingPreview />;
    case "builder":
      return <BuilderPreview />;
    case "pnl":
      return <PnlPreview />;
    case "chatbot":
    default:
      return <ChatbotPreview />;
  }
}
