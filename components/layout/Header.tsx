"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
  aboutMegaMenu as defaultAboutMegaMenu,
  navLinks as defaultNavLinks,
} from "./aboutMenu";
import { AboutMenuIcon } from "./AboutMenuIcons";
import { isVideoUrl, VideoModal } from "./VideoModal";
import { homeAssets } from "../ui/assets";
import { layout } from "../ui/type";
import type { MegaMenu } from "@/lib/cms/types";

function Logo() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
      aria-label="aptAI Solutions home"
    >
      <Image
        src={homeAssets.brand.mark}
        alt=""
        width={127}
        height={54}
        className="h-7 w-auto object-contain object-left sm:h-8 xl:h-9"
        priority
      />
      <span className="sr-only">aptAI Solutions</span>
    </Link>
  );
}

function MenuLinkItem({
  href,
  label,
  description,
  icon,
  badge,
}: {
  href: string;
  label: string;
  description: string;
  icon: "flag" | "people" | "book" | "play";
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-brand-mist"
    >
      <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-white text-brand shadow-soft">
        <AboutMenuIcon name={icon} />
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-body font-semibold text-navy">{label}</span>
          {badge ? (
            <span className="rounded-pill bg-success-bg px-2 py-0.5 text-caption font-semibold text-success-fg">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="mt-0.5 block text-body-sm text-subtle">
          {description}
        </span>
      </span>
    </Link>
  );
}

function AboutMegaMenu({
  menu,
  onNavigate,
  onWatchVideo,
}: {
  menu: MegaMenu;
  onNavigate: () => void;
  onWatchVideo: (url: string) => void;
}) {
  const { company, resources, featured } = menu;
  const watchHref = featured.watchHref ?? "#tutorials";
  const featuredIsVideo = isVideoUrl(watchHref);

  return (
    <div
      role="menu"
      aria-label="About"
      className="absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-3xl border border-line bg-white shadow-card-lg"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) onNavigate();
      }}
    >
      <div className="grid lg:grid-cols-[1fr_1fr_1.15fr]">
        <div className="p-6 lg:pr-3">
          <p className="px-3 text-caption font-semibold text-brand">
            {company.title}
          </p>
          <div className="mt-2 space-y-0.5">
            {company.items.map((item) => (
              <MenuLinkItem
                key={item.label}
                href={item.href}
                label={item.label}
                description={item.description ?? ""}
                icon={item.icon ?? "flag"}
                badge={item.badge ?? undefined}
              />
            ))}
          </div>
        </div>

        <div className="p-6 lg:px-3">
          <p className="px-3 text-caption font-semibold text-brand">
            {resources.title}
          </p>
          <div className="mt-2 space-y-0.5">
            {resources.items.map((item) => (
              <MenuLinkItem
                key={item.label}
                href={item.href}
                label={item.label}
                description={item.description ?? ""}
                icon={item.icon ?? "flag"}
              />
            ))}
          </div>
        </div>

        <div className="bg-surface p-6 lg:pl-8">
          <p className="text-caption font-semibold text-brand">
            {featured.title}
          </p>
          <div className="mt-3 flex gap-3.5">
            {featuredIsVideo ? (
              <button
                type="button"
                onClick={() => onWatchVideo(watchHref)}
                className="relative flex h-[100px] w-[128px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-brand p-3 text-left text-white"
              >
                <span className="absolute inset-0 bg-card-art opacity-80" />
                <span className="relative text-nano font-semibold opacity-90">
                  {featured.thumbLine1}
                </span>
                <span className="relative mx-auto grid h-8 w-8 place-items-center rounded-pill bg-white/20">
                  <AboutMenuIcon name="play" className="text-white" />
                </span>
                <span className="relative text-caption font-semibold leading-tight">
                  {featured.thumbLine2}
                </span>
              </button>
            ) : (
              <a
                href={watchHref}
                className="relative flex h-[100px] w-[128px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-brand p-3 text-left text-white"
              >
                <span className="absolute inset-0 bg-card-art opacity-80" />
                <span className="relative text-nano font-semibold opacity-90">
                  {featured.thumbLine1}
                </span>
                <span className="relative mx-auto grid h-8 w-8 place-items-center rounded-pill bg-white/20">
                  <AboutMenuIcon name="play" className="text-white" />
                </span>
                <span className="relative text-caption font-semibold leading-tight">
                  {featured.thumbLine2}
                </span>
              </a>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-body font-semibold text-navy">
                {featured.heading}
              </p>
              <p className="mt-1 text-body-sm text-subtle">{featured.body}</p>
              {featuredIsVideo ? (
                <button
                  type="button"
                  onClick={() => onWatchVideo(watchHref)}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand"
                >
                  <AboutMenuIcon name="play" />
                  {featured.watchLabel}
                </button>
              ) : (
                <a
                  href={watchHref}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand"
                >
                  <AboutMenuIcon name="play" />
                  {featured.watchLabel}
                </a>
              )}
            </div>
          </div>
          <a
            href={featured.allHref ?? "#tutorials"}
            className="mt-4 inline-flex items-center gap-1 text-body-sm font-semibold text-brand"
          >
            {featured.allLabel}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export interface HeaderNavLink {
  label: string;
  href: string;
  mega?: boolean | null;
}

export function HeaderView({
  navLinks = defaultNavLinks,
  aboutMegaMenu = defaultAboutMegaMenu as unknown as MegaMenu,
}: {
  navLinks?: readonly HeaderNavLink[];
  aboutMegaMenu?: MegaMenu;
}) {
  const pathname = usePathname();
  // "About" is a menu, not a page: highlight it on any of its destinations.
  const aboutActive = aboutMegaMenu.company.items.some((item) => item.href === pathname);
  const [openAbout, setOpenAbout] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const aboutRef = useRef<HTMLLIElement>(null);
  const menuId = useId();
  const mobileMenuId = useId();

  const openVideo = (url: string) => {
    setVideoUrl(url);
    setOpenAbout(false);
  };

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!aboutRef.current?.contains(e.target as Node)) setOpenAbout(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenAbout(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`pointer-events-none absolute inset-x-0 top-0 z-50 flex justify-center pt-4 sm:pt-6 md:pt-8 xl:pt-nav-top ${layout.sectionX}`}
      >
        <nav
          className="pointer-events-auto relative flex h-14 w-full max-w-content items-center justify-between rounded-pill bg-white px-4 shadow-nav sm:h-16 sm:px-5 md:px-6 xl:h-nav-h xl:max-w-page"
          aria-label="Primary"
        >
          <Logo />

          <ul className="hidden items-center gap-5 xl:flex">
            {navLinks.map((link) => {
              if (link.mega) {
                return (
                  <li key={link.label} ref={aboutRef}>
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1.5 text-body font-semibold leading-6 transition-colors ${
                        openAbout || aboutActive ? "text-brand" : "text-nav hover:text-brand"
                      }`}
                      aria-expanded={openAbout}
                      aria-haspopup="menu"
                      aria-controls={menuId}
                      onClick={() => setOpenAbout((v) => !v)}
                    >
                      {link.label}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        aria-hidden
                        className={`transition-transform duration-200 ${openAbout ? "rotate-180" : ""}`}
                      >
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    {openAbout ? (
                      <div id={menuId}>
                        <AboutMegaMenu
                          menu={aboutMegaMenu}
                          onNavigate={() => setOpenAbout(false)}
                          onWatchVideo={openVideo}
                        />
                      </div>
                    ) : null}
                  </li>
                );
              }

              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`text-body font-semibold leading-6 transition-colors hover:text-brand ${
                      pathname === link.href ? "text-brand" : "text-nav"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#demo"
              className="hidden h-btn items-center rounded-pill border border-line-strong bg-white px-4.5 text-body font-semibold leading-6 text-ink transition-all hover:border-brand hover:text-brand active:scale-[0.98] sm:inline-flex"
            >
              Demo
            </a>
            <a
              href="/waitlist"
              className="hidden h-btn items-center rounded-pill bg-brand px-4.5 text-body font-semibold leading-6 text-white transition-colors hover:bg-brand-hover active:scale-[0.98] xl:inline-flex"
            >
              Join the waitlist
            </a>

            <button
              type="button"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-pill border border-line-strong bg-white text-ink transition-colors hover:border-brand hover:text-brand xl:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls={mobileMenuId}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
              >
                {mobileOpen ? (
                  <path
                    d="M5 5L15 15M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M2.5 5.5H17.5M2.5 10H17.5M2.5 14.5H17.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>

          {mobileOpen ? (
            <div
              id={mobileMenuId}
              className="absolute inset-x-0 top-[calc(100%+16px)] z-40 max-h-[70svh] overflow-y-auto rounded-4xl border border-line bg-white p-4 shadow-card-lg xl:hidden"
            >
              <ul className="flex flex-col">
                {navLinks.map((link) => {
                  if (link.mega) {
                    return (
                      <li
                        key={link.label}
                        className="border-b border-line last:border-b-0"
                      >
                        <button
                          type="button"
                          className="flex w-full items-center justify-between py-3 text-body font-semibold text-nav"
                          aria-expanded={mobileAboutOpen}
                          onClick={() => setMobileAboutOpen((v) => !v)}
                        >
                          {link.label}
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            aria-hidden
                            className={`transition-transform duration-200 ${mobileAboutOpen ? "rotate-180" : ""}`}
                          >
                            <path
                              d="M3 4.5L6 7.5L9 4.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                        {mobileAboutOpen ? (
                          <ul className="flex flex-col gap-0.5 pb-3">
                            {[
                              ...aboutMegaMenu.company.items,
                              ...aboutMegaMenu.resources.items,
                            ].map((item) => (
                              <li key={item.label}>
                                <Link
                                  href={item.href}
                                  className="block rounded-xl px-3 py-2 text-body-sm font-semibold text-navy transition-colors hover:bg-brand-mist"
                                  onClick={() => setMobileOpen(false)}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    );
                  }

                  return (
                    <li
                      key={link.label}
                      className="border-b border-line last:border-b-0"
                    >
                      <a
                        href={link.href}
                        className={`block py-3 text-body font-semibold transition-colors hover:text-brand ${
                          pathname === link.href ? "text-brand" : "text-nav"
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 flex flex-col gap-3">
                <a
                  href="#demo"
                  className="inline-flex h-btn items-center justify-center rounded-pill border border-line-strong bg-white px-4.5 text-body font-semibold leading-6 text-ink transition-all hover:border-brand hover:text-brand active:scale-[0.98]"
                  onClick={() => setMobileOpen(false)}
                >
                  Demo
                </a>
                <a
                  href="/waitlist"
                  className="inline-flex h-btn items-center justify-center rounded-pill bg-brand px-4.5 text-body font-semibold leading-6 text-white transition-colors hover:bg-brand-hover active:scale-[0.98]"
                  onClick={() => setMobileOpen(false)}
                >
                  Join the waitlist
                </a>
              </div>
            </div>
          ) : null}
        </nav>
      </header>
      {videoUrl && (
        <VideoModal videoUrl={videoUrl} onClose={() => setVideoUrl(null)} />
      )}
    </>
  );
}
