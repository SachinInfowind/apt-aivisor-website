import Image from "next/image";
import Link from "next/link";
import { homeAssets } from "../ui/assets";
import { layout } from "../ui/type";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "#about" },
      { label: "Our team", href: "/team" },
      { label: "Careers", href: "/career" },
      { label: "Blog", href: "#blog" },
      { label: "Design Partners", href: "#design-partner" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Solutions", href: "/solutions", badge: "New" },
      { label: "Demo", href: "#demo" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "Facebook", href: "#" },
      { label: "X", href: "#" },
      { label: "Youtube", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Trust & Security", href: "/trust" },
      { label: "Cookies", href: "/cookies" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer
      className={`bg-brand-wash ${layout.sectionX} pb-7 pt-12`}
      id="trust"
    >
      <div className={layout.inner}>
        <div className="mb-10 flex justify-center">
          <a
            href="#top"
            className="inline-flex items-center gap-2 text-body-sm font-medium text-ink transition-colors hover:text-brand"
          >
            <span aria-hidden>↑</span> Back at top
          </a>
        </div>

        <div className="grid gap-9 lg:grid-cols-[1.3fr_2.2fr_auto]">
          <div>
            <Link href="/home" className="inline-flex items-center gap-2.5">
              <Image
                src={homeAssets.brand.mark}
                alt="aptAI Solutions"
                width={140}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="mt-3.5 max-w-70 text-body-sm text-ink">
              AI-powered contract intelligence for technology buyers and
              sellers. Built by ex-AWS deal pricing executives.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-caption font-medium uppercase tracking-[0.06em] text-faint">
                  {col.title}
                </p>
                <ul className="mt-3.5 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="inline-flex items-center gap-2 text-body-sm font-semibold text-navy transition-colors hover:text-brand"
                      >
                        {link.label}
                        {"badge" in link && link.badge ? (
                          <span className="rounded-pill bg-success-bg px-2 py-0.5 text-micro font-semibold text-success-fg">
                            {link.badge}
                          </span>
                        ) : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <a
            href="/waitlist"
            className="inline-flex h-btn-md items-center self-start rounded-pill bg-brand px-5 text-body-15 font-semibold text-white transition-colors hover:bg-brand-hover active:scale-[0.98]"
          >
            Join the waitlist
          </a>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-xs text-muted">
            © 2026 aptAI Solutions Group LLC · Austin, Texas, USA. All rights
            reserved
          </p>
          <div className="flex gap-3.5 text-body-xs font-medium text-subtle">
            {["in", "f", "𝕏", "▶"].map((icon) => (
              <a
                key={icon}
                href="#"
                className="transition-colors hover:text-brand"
                aria-label="Social"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
