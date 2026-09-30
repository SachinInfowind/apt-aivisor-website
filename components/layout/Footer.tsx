import Link from "next/link";
import { CmsImage } from "../ui/CmsImage";
import { SocialIcon } from "../ui/icons";
import { layout } from "../ui/type";
import { getGlobal } from "@/lib/cms/queries";

export async function Footer() {
  const global = await getGlobal();

  // Everything in the footer — logo, tagline, columns, buttons, social links — comes from the CMS.
  const tagline = global?.footerTagline;
  const copyright = global?.copyrightText;
  const columns = (global?.footerColumns ?? []).filter((col) => col.links?.length);
  const socialLinks = global?.socialLinks ?? [];

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
            <span aria-hidden>↑</span> {global?.footerBackToTopLabel}
          </a>
        </div>

        <div className="grid gap-9 lg:grid-cols-[1.3fr_2.2fr_auto]">
          <div>
            <Link href="/home" className="inline-flex items-center gap-2.5">
              <CmsImage
                image={global?.logoMark}
                alt={global?.siteName ?? ""}
                width={140}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            {tagline ? <p className="mt-3.5 max-w-70 text-body-sm text-ink">{tagline}</p> : null}
          </div>

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

          {global?.footerWaitlistLabel && global.footerWaitlistHref ? (
            <a
              href={global.footerWaitlistHref}
              className="inline-flex h-btn-md items-center self-start rounded-pill bg-brand px-5 text-body-15 font-semibold text-white transition-colors hover:bg-brand-hover active:scale-[0.98]"
            >
              {global.footerWaitlistLabel}
            </a>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          {copyright ? <p className="text-body-xs text-muted">{copyright}</p> : <span />}
          <div className="flex items-center gap-3.5">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="opacity-70 transition-opacity hover:opacity-100"
                aria-label={link.label}
              >
                <SocialIcon label={link.label} width={24} height={24} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
