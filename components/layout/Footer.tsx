import Link from "next/link";
import { CmsImage } from "../ui/CmsImage";
import { SocialIcon } from "../ui/icons";
import { layout } from "../ui/type";
import { getGlobal } from "@/lib/cms/queries";

const DEFAULT_FOOTER_COLUMNS = [
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
      { label: "Terms of Service", href: "/terms" },
      { label: "Trust & Security", href: "/trust" },
      { label: "Cookies", href: "/cookies" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export async function Footer() {
  const global = await getGlobal().catch(() => null);

  const tagline =
    global?.footerTagline ||
    "AI-powered contract intelligence for technology buyers and sellers. Built by ex-AWS deal pricing executives.";
  const copyright =
    global?.copyrightText ||
    "© 2026 aptAI Solutions Group LLC · Austin, Texas, USA. All rights reserved";
  const cmsCols = (global?.footerColumns ?? []).filter((col) => col.links?.length);
  const columns = cmsCols.length > 0 ? cmsCols : DEFAULT_FOOTER_COLUMNS;
  const backToTopLabel = global?.footerBackToTopLabel || "Back at top";
  const waitlistLabel = global?.footerWaitlistLabel || "Join the waitlist";
  const waitlistHref = global?.footerWaitlistHref || "/waitlist";

  return (
    <footer className="w-full bg-white" id="trust">
      <div className={`${layout.sectionX} pb-16 pt-16`}>
        <div className={layout.inner}>
          {/* Back at top button */}
          <div className="mb-16 flex justify-center">
            <a
              href="#top"
              className="inline-flex items-center gap-2.5 text-base font-semibold text-[#344054] transition-colors hover:text-brand"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="text-[#344054]"
              >
                <path
                  d="M12 20V4M18 10L12 4L6 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{backToTopLabel}</span>
            </a>
          </div>

          {/* Logo + Join the waitlist CTA bar */}
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              {global?.logoMark ? (
                <CmsImage
                  image={global.logoMark}
                  alt={global.siteName ?? "aptAI Solutions"}
                  width={127}
                  height={54}
                  className="h-9 w-auto object-contain"
                />
              ) : (
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/d3b17dd007cf4f46c32969d15e3942919410e962?width=254"
                  alt="aptAI Solutions"
                  className="h-9 w-auto object-contain select-none"
                />
              )}
            </Link>
            <Link
              href={waitlistHref}
              className="inline-flex h-11 items-center justify-center rounded-full border border-brand bg-brand px-4.5 text-base font-semibold text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-brand-hover active:scale-[0.98]"
            >
              {waitlistLabel}
            </Link>
          </div>

          {/* Tagline + Links Grid */}
          <div className="mt-8 grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-16 lg:mt-10">
            <p className="text-base leading-6 text-[#475467]">{tagline}</p>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-8">
              {columns.map((col) => (
                <div key={col.heading} className="flex flex-col gap-4">
                  <p className="text-sm font-semibold leading-5 text-[#667085]">
                    {col.heading}
                  </p>
                  <ul className="space-y-3">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="inline-flex items-center gap-2 text-base font-semibold leading-6 text-[#475467] transition-colors hover:text-brand"
                        >
                          <span>{link.label}</span>
                          {link.badge ? (
                            <span className="rounded-full border border-[#ABEFC6] bg-[#ECFDF3] px-2 py-0.5 text-xs font-medium leading-[18px] text-[#067647]">
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

      {/* Bottom Copyright & Social Icons Row */}
      <div className={`bg-[#F9FAFB] ${layout.sectionX} py-12`}>
        <div
          className={`${layout.inner} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
        >
          <p className="text-base leading-6 text-[#667085]">{copyright}</p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-[#98A2B3] transition-colors hover:text-[#475467]"
              aria-label="LinkedIn"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M22.2234 0H1.77187C0.792187 0 0 0.773438 0 1.72969V22.2656C0 23.2219 0.792187 24 1.77187 24H22.2234C23.2031 24 24 23.2219 24 22.2703V1.72969C24 0.773438 23.2031 0 22.2234 0ZM7.12031 20.4516H3.55781V8.99531H7.12031V20.4516ZM5.33906 7.43438C4.19531 7.43438 3.27188 6.51094 3.27188 5.37187C3.27188 4.23281 4.19531 3.30937 5.33906 3.30937C6.47813 3.30937 7.40156 4.23281 7.40156 5.37187C7.40156 6.50625 6.47813 7.43438 5.33906 7.43438ZM20.4516 20.4516H16.8937V14.8828C16.8937 13.5563 16.8703 11.8453 15.0422 11.8453C13.1906 11.8453 12.9094 13.2938 12.9094 14.7891V20.4516H9.35625V8.99531H12.7687V10.5609H12.8156C13.2891 9.66094 14.4516 8.70938 16.1813 8.70938C19.7859 8.70938 20.4516 11.0813 20.4516 14.1656V20.4516Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="#"
              className="text-[#98A2B3] transition-colors hover:text-[#475467]"
              aria-label="Facebook"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="#"
              className="text-[#98A2B3] transition-colors hover:text-[#475467]"
              aria-label="X"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.9455 23L10.396 15.0901L3.44886 23H0.509766L9.09209 13.2311L0.509766 1H8.05571L13.286 8.45502L19.8393 1H22.7784L14.5943 10.3165L23.4914 23H15.9455ZM19.2185 20.77H17.2398L4.71811 3.23H6.6971L11.7121 10.2532L12.5793 11.4719L19.2185 20.77Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="#"
              className="text-[#98A2B3] transition-colors hover:text-[#475467]"
              aria-label="YouTube"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M23.7609 7.20005C23.7609 7.20005 23.5266 5.54536 22.8047 4.8188C21.8906 3.86255 20.8688 3.85786 20.4 3.80161C17.0438 3.55786 12.0047 3.55786 12.0047 3.55786H11.9953C11.9953 3.55786 6.95625 3.55786 3.6 3.80161C3.13125 3.85786 2.10938 3.86255 1.19531 4.8188C0.473438 5.54536 0.24375 7.20005 0.24375 7.20005C0.24375 7.20005 0 9.14536 0 11.086V12.9047C0 14.8454 0.239062 16.7907 0.239062 16.7907C0.239062 16.7907 0.473437 18.4454 1.19062 19.1719C2.10469 20.1282 3.30469 20.0954 3.83906 20.1985C5.76094 20.3813 12 20.4375 12 20.4375C12 20.4375 17.0438 20.4282 20.4 20.1891C20.8688 20.1329 21.8906 20.1282 22.8047 19.1719C23.5266 18.4454 23.7609 16.7907 23.7609 16.7907C23.7609 16.7907 24 14.85 24 12.9047V11.086C24 9.14536 23.7609 7.20005 23.7609 7.20005ZM9.52031 15.1125V8.36724L16.0031 11.7516L9.52031 15.1125Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
