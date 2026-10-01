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
    <footer className="bg-white" id="trust">
      <div className={`${layout.sectionX} pb-12 pt-12`}>
        <div className={layout.inner}>
          <div className="mb-10 flex justify-center">
            <a
              href="#top"
              className="inline-flex items-center gap-2 text-body-sm font-medium text-ink transition-colors hover:text-brand"
            >
              <span aria-hidden>↑</span> {global?.footerBackToTopLabel}
            </a>
          </div>

          {/* Figma: logo + Join CTA share the top row; tagline and link
              columns sit below, with the columns starting past the tagline. */}
          <div className="flex items-center justify-between gap-4">
            <Link href="/home" className="inline-flex items-center gap-2.5">
              <CmsImage
                image={global?.logoMark}
                alt={global?.siteName ?? ""}
                width={140}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            {global?.footerWaitlistLabel && global.footerWaitlistHref ? (
              <a
                href={global.footerWaitlistHref}
                className="inline-flex h-btn-md shrink-0 items-center rounded-pill bg-brand px-5 text-body-15 font-semibold text-white transition-colors hover:bg-brand-hover active:scale-[0.98]"
              >
                {global.footerWaitlistLabel}
              </a>
            ) : null}
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
