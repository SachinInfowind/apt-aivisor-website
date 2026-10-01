import Image from "next/image";
import Link from "next/link";
import { homeAssets } from "../ui/assets";
import { layout } from "../ui/type";
import { getGlobal } from "@/lib/cms/queries";
import type { FooterColumn, Link as CmsLink } from "@/lib/cms/types";

const defaultTagline =
  "AI-powered contract intelligence for technology buyers and sellers. Built by ex-AWS deal pricing executives.";

const defaultCopyright =
  "© 2026 aptAI Solutions Group LLC · Austin, Texas, USA. All rights reserved";

const defaultColumns: FooterColumn[] = [
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/career" },
      { label: "Blog", href: "/blogs" },
      { label: "Design Partners", href: "/design-partner" },
    ],
  },
  {
    heading: "Product",
    links: [
      { label: "Solutions", href: "/solutions", badge: "New" },
      { label: "Demo", href: "#demo" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Social",
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "Facebook", href: "#" },
      { label: "X", href: "#" },
      { label: "Youtube", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Trust & Security", href: "/trust" },
      { label: "Cookies", href: "/cookies" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const defaultSocialLinks: CmsLink[] = [
  { label: "LinkedIn", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "X", href: "#" },
  { label: "Youtube", href: "#" },
];

const socialIconByLabel: Record<string, string> = {
  linkedin: homeAssets.footer.social.linkedin,
  facebook: homeAssets.footer.social.facebook,
  x: homeAssets.footer.social.x,
  twitter: homeAssets.footer.social.x,
  youtube: homeAssets.footer.social.youtube,
};

function socialIconFor(label: string) {
  return socialIconByLabel[label.toLowerCase()] ?? null;
}

export async function Footer() {
  const global = await getGlobal();

  const tagline = global?.footerTagline || defaultTagline;
  const copyright = global?.copyrightText || defaultCopyright;
  const columns =
    global?.footerColumns?.length && global.footerColumns.every((col) => col.links?.length)
      ? global.footerColumns
      : defaultColumns;
  const socialLinks = global?.socialLinks?.length ? global.socialLinks : defaultSocialLinks;

  return (
    <footer className="bg-white" id="trust">
      <div className={`${layout.sectionX} pb-12 pt-12`}>
        <div className={layout.inner}>
          <div className="mb-10 flex justify-center">
            <a
              href="#top"
              className="inline-flex items-center gap-2 text-body-sm font-medium text-ink transition-colors hover:text-brand"
            >
              <span aria-hidden>↑</span> Back at top
            </a>
          </div>

          {/* Figma: logo + Join CTA share the top row; tagline and link
              columns sit below, with the columns starting past the tagline. */}
          <div className="flex items-center justify-between gap-4">
            <Link href="/home" className="inline-flex items-center gap-2.5">
              <Image
                src={homeAssets.brand.mark}
                alt="aptAI Solutions"
                width={140}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <a
              href="/waitlist"
              className="inline-flex h-btn-md shrink-0 items-center rounded-pill bg-brand px-5 text-body-15 font-semibold text-white transition-colors hover:bg-brand-hover active:scale-[0.98]"
            >
              Join the waitlist
            </a>
          </div>

          <div className="mt-8 grid gap-9 lg:grid-cols-[3fr_7fr] lg:mt-10">
            <p className="max-w-70 text-body-sm text-ink">{tagline}</p>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {columns.map((col) => (
                <div key={col.heading}>
                  <p className="text-caption font-medium uppercase tracking-[0.06em] text-faint">
                    {col.heading}
                  </p>
                  <ul className="mt-3.5 space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="inline-flex items-center gap-2 text-body-sm font-semibold text-navy transition-colors hover:text-brand"
                        >
                          {link.label}
                          {link.badge ? (
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
          </div>
        </div>
      </div>

      <div className={`bg-surface ${layout.sectionX} py-6`}>
        <div
          className={`${layout.inner} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}
        >
          <p className="text-body-xs text-muted">{copyright}</p>
          <div className="flex items-center gap-3.5">
            {socialLinks.map((link) => {
              const icon = socialIconFor(link.label);
              if (!icon) return null;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="opacity-70 transition-opacity hover:opacity-100"
                  aria-label={link.label}
                >
                  <Image src={icon} alt="" width={24} height={24} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
