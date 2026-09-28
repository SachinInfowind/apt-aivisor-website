"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { homeSerif } from "../ui/fonts";
import { layout } from "../ui/type";

/**
 * 404 content — Figma “404 error” (1:19276, 1722×1313).
 * Two-column: copy + actions | cloud/search illustration.
 */

function ArrowLeftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M15.8332 10.0001H4.1665M9.99984 4.16675L4.1665 10.0001L9.99984 15.8334"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="62"
      height="62"
      viewBox="0 0 62 62"
      fill="none"
      aria-hidden
      className="h-[clamp(2.5rem,8vw,3.875rem)] w-[clamp(2.5rem,8vw,3.875rem)]"
    >
      <path
        d="M53.4549 53.4547L44.5461 44.5456M50.9094 29.2728C50.9094 41.2223 41.2225 50.9092 29.2731 50.9092C17.3236 50.9092 7.63672 41.2223 7.63672 29.2728C7.63672 17.3234 17.3236 7.63647 29.2731 7.63647C41.2225 7.63647 50.9094 17.3234 50.9094 29.2728Z"
        stroke="white"
        strokeWidth="4.36364"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NotFoundIllustration() {
  return (
    <div
      className="relative mx-auto aspect-[480/349] w-full max-w-[min(100%,30rem)] shrink-0"
      aria-hidden
    >
      {/* Background circle — Figma left 65/480 ≈ 13.5%, size 350/480 */}
      <div className="absolute left-[13.5%] top-0 aspect-square w-[72.9%] rounded-full bg-line-muted" />

      {/* Decorative dots */}
      <div className="absolute left-[8.1%] top-[7.4%] aspect-square w-[7.3%] rounded-full bg-surface-muted" />
      <div className="absolute left-[87.3%] top-[75%] aspect-square w-[5.6%] rounded-full bg-surface-muted" />
      <div className="absolute left-[6.9%] top-[80%] aspect-square w-[9.2%] rounded-full bg-surface-muted" />
      <div className="absolute left-[90.8%] top-[22.6%] aspect-square w-[9.2%] rounded-full bg-surface-muted" />
      <div className="absolute left-[83.5%] top-[2.6%] aspect-square w-[6.5%] rounded-full bg-surface-muted" />

      {/* Cloud */}
      <div className="absolute left-[10.8%] top-[10%] w-[79.2%]">
        <Image
          src="/assets/404-cloud.svg"
          alt=""
          width={380}
          height={217}
          className="h-auto w-full drop-shadow-[0_2.5rem_3rem_-0.5rem_rgba(16,24,40,0.08)]"
          priority
        />
      </div>

      {/* Featured search icon — glass circle */}
      <div className="absolute left-[37.3%] top-[52.4%] flex aspect-square w-[25.4%] items-center justify-center rounded-full bg-[rgba(52,64,84,0.4)] p-[3.3%] backdrop-blur-[8px]">
        <SearchIcon />
      </div>
    </div>
  );
}

export function NotFoundContent() {
  const router = useRouter();

  return (
    <section
      className={`flex min-h-screen w-full flex-col justify-center bg-white ${layout.sectionX} py-[clamp(3rem,2rem+4vw,6rem)]`}
    >
      <div
        className={`${layout.inner} flex max-w-[80rem] flex-col-reverse items-center gap-[clamp(2rem,1.5rem+2vw,4rem)] lg:flex-row lg:items-center lg:justify-center lg:gap-8`}
      >
        {/* Copy + actions */}
        <div className="flex w-full max-w-[32rem] flex-1 flex-col items-start gap-[clamp(1.5rem,1rem+2vw,3rem)] lg:pr-8">
          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-3">
              <p className="text-body font-semibold leading-6 text-brand-deep">
                404 error
              </p>
              <h1
                className={`${homeSerif.className} text-hero-display text-[clamp(2.25rem,1.5rem+3vw,3.75rem)] leading-[1.2] tracking-[-0.02em]`}
              >
                Page not found
              </h1>
              <p className="max-w-[30rem] text-[clamp(1rem,0.9rem+0.4vw,1.25rem)] leading-[1.5] text-nav">
                Sorry, the page you are looking for doesn&apos;t exist.
                <br className="hidden sm:block" />
                Here are some helpful links:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-1.5 rounded-pill border border-line-strong bg-white px-[1.125rem] py-3 text-body font-semibold leading-6 text-ink shadow-sm transition-colors hover:bg-surface active:scale-[0.98]"
            >
              <ArrowLeftIcon />
              Go back
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 rounded-pill border border-brand bg-brand px-[1.125rem] py-3 text-body font-semibold leading-6 text-white shadow-sm transition-colors hover:bg-brand-hover active:scale-[0.98]"
            >
              Take me home
            </Link>
          </div>
        </div>

        <NotFoundIllustration />
      </div>
    </section>
  );
}
