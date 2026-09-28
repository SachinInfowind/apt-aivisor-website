"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { homeSerif } from "@/components/ui/fonts";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { WorkflowIcon, WorkflowItem } from "@/lib/cms/types";

/**
 * Real problems. Real workflows — Figma 26316:10637.
 * Selecting a step swaps the copy and image. The loop advances every 5 seconds.
 */

const icons: Record<WorkflowIcon, string[]> = {
  user: [
    "M12.0018 15C8.83173 15 6.0126 16.5306 4.2178 18.906C3.83151 19.4172 3.63836 19.6728 3.64468 20.0183C3.64956 20.2852 3.81716 20.6219 4.02717 20.7867C4.29899 21 4.67567 21 5.42904 21H18.5746C19.3279 21 19.7046 21 19.9764 20.7867C20.1864 20.6219 20.354 20.2852 20.3589 20.0183C20.3652 19.6728 20.1721 19.4172 19.7858 18.906C17.991 16.5306 15.1719 15 12.0018 15Z",
    "M12.0018 12C14.4871 12 16.5018 9.98528 16.5018 7.5C16.5018 5.01472 14.4871 3 12.0018 3C9.51652 3 7.5018 5.01472 7.5018 7.5C7.5018 9.98528 9.51652 12 12.0018 12Z",
  ],
  cloud: [
    "M6.5 19C4.01472 19 2 16.9853 2 14.5C2 12.1564 3.79151 10.2313 6.07974 10.0194C6.54781 7.17213 9.02024 5 12 5C14.9798 5 17.4522 7.17213 17.9203 10.0194C20.2085 10.2313 22 12.1564 22 14.5C22 16.9853 19.9853 19 17.5 19C13.1102 19 10.3433 19 6.5 19Z",
  ],
  file: [
    "M20 11.9412V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H14M14 11H8M10 15H8M16 7H8M15 17H21",
  ],
  cart: [
    "M2 2H3.30616C3.55218 2 3.67519 2 3.77418 2.04524C3.86142 2.08511 3.93535 2.14922 3.98715 2.22995C4.04593 2.32154 4.06333 2.44332 4.09812 2.68686L4.57143 6M4.57143 6L5.62332 13.7314C5.75681 14.7125 5.82355 15.2031 6.0581 15.5723C6.26478 15.8977 6.56108 16.1564 6.91135 16.3174C7.30886 16.5 7.80394 16.5 8.79411 16.5H17.352C18.2945 16.5 18.7658 16.5 19.151 16.3304C19.4905 16.1809 19.7818 15.9398 19.9923 15.6342C20.2309 15.2876 20.3191 14.8247 20.4955 13.8988L21.8191 6.94969C21.8812 6.62381 21.9122 6.46087 21.8672 6.3335C21.8278 6.22177 21.7499 6.12768 21.6475 6.06802C21.5308 6 21.365 6 21.0332 6H4.57143ZM10 21C10 21.5523 9.55228 22 9 22C8.44772 22 8 21.5523 8 21C8 20.4477 8.44772 20 9 20C9.55228 20 10 20.4477 10 21ZM18 21C18 21.5523 17.5523 22 17 22C16.4477 22 16 21.5523 16 21C16 20.4477 16.4477 20 17 20C17.5523 20 18 20.4477 18 21Z",
  ],
  copy: [
    "M10.5 2.0028C9.82495 2.01194 9.4197 2.05103 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8.05103 3.4197 8.01194 3.82495 8.0028 4.5M19.5 2.0028C20.1751 2.01194 20.5803 2.05103 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C21.949 3.4197 21.9881 3.82494 21.9972 4.49999M21.9972 13.5C21.9881 14.175 21.949 14.5803 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.5803 15.949 20.1751 15.9881 19.5 15.9972M22 7.99999V9.99999M14.0001 2H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z",
  ],
  chat: [
    "M6.09436 11.2288C6.03221 10.8282 5.99996 10.4179 5.99996 10C5.99996 5.58172 9.60525 2 14.0526 2C18.4999 2 22.1052 5.58172 22.1052 10C22.1052 10.9981 21.9213 11.9535 21.5852 12.8345C21.5154 13.0175 21.4804 13.109 21.4646 13.1804C21.4489 13.2512 21.4428 13.301 21.4411 13.3735C21.4394 13.4466 21.4493 13.5272 21.4692 13.6883L21.8717 16.9585C21.9153 17.3125 21.9371 17.4895 21.8782 17.6182C21.8266 17.731 21.735 17.8205 21.6211 17.8695C21.4911 17.9254 21.3146 17.8995 20.9617 17.8478L17.7765 17.3809C17.6101 17.3565 17.527 17.3443 17.4512 17.3448C17.3763 17.3452 17.3245 17.3507 17.2511 17.3661C17.177 17.3817 17.0823 17.4172 16.893 17.4881C16.0097 17.819 15.0524 18 14.0526 18C13.6344 18 13.2237 17.9683 12.8227 17.9073M7.63158 22C10.5965 22 13 19.5376 13 16.5C13 13.4624 10.5965 11 7.63158 11C4.66668 11 2.26316 13.4624 2.26316 16.5C2.26316 17.1106 2.36028 17.6979 2.53955 18.2467C2.61533 18.4787 2.65322 18.5947 2.66566 18.6739C2.67864 18.7567 2.68091 18.8031 2.67608 18.8867C2.67145 18.9668 2.65141 19.0573 2.61134 19.2383L2 22L4.9948 21.591C5.15827 21.5687 5.24 21.5575 5.31137 21.558C5.38652 21.5585 5.42641 21.5626 5.50011 21.5773C5.5701 21.5912 5.67416 21.6279 5.88227 21.7014C6.43059 21.8949 7.01911 22 7.63158 22Z",
  ],
};

function WorkflowIconMark({ name }: { name: WorkflowIcon }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      {(icons[name] ?? icons.user).map((d) => (
        <path
          key={d.slice(0, 24)}
          d={d}
          className="stroke-brand-accent"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

export function SolutionsWorkflows({ items }: { items?: WorkflowItem[] }) {
  const workflows = (items ?? []).filter((item) => item.title);
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const selected = workflows.length ? index % workflows.length : 0;
  const current = workflows[selected];

  useEffect(() => {
    if (workflows.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % workflows.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [workflows.length, cycle]);

  if (!current) return null;

  const imageUrl = current.image?.url
    ? toAbsoluteMediaUrl(current.image.url)
    : null;

  return (
    <section className="w-full bg-[linear-gradient(206deg,var(--color-brand-veil)_3.52%,var(--color-brand-strong)_83.83%)] px-4 py-16 sm:px-8 sm:py-20 md:px-10 xl:px-20">
      <div className="mx-auto flex w-full max-w-[82.5rem] flex-col gap-6">
        <div className="grid grid-cols-1 items-center gap-8 rounded-card border-2 border-brand-veil bg-white p-6 sm:p-8 lg:grid-cols-2 lg:gap-16 lg:p-12">
          <div className="flex min-h-[16rem] items-center justify-center overflow-hidden rounded-3xl bg-brand-strong sm:min-h-[20rem] lg:min-h-[26rem]">
            {imageUrl ? (
              <Image
                key={current.id ?? current.title}
                src={imageUrl}
                alt={current.imageAlt || current.image?.alternativeText || ""}
                width={current.image?.width || 578}
                height={current.image?.height || 379}
                className="solutions-workflow-in h-auto w-full max-w-[36.125rem] object-contain"
              />
            ) : null}
          </div>

          <div
            key={`copy-${current.id ?? current.title}`}
            className="solutions-workflow-in flex flex-col items-start gap-3.5 py-2"
          >
            <h2
              className={`${homeSerif.className} text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.22] tracking-[-0.02em] text-navy`}
            >
              {current.title}
            </h2>
            {current.body ? (
              <p className="text-body font-medium text-ink sm:text-body-lg">
                {current.body}
              </p>
            ) : null}
            {current.metric ? (
              <p className="text-body text-metric sm:text-body-lg">
                {current.metric}
              </p>
            ) : null}
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Workflows"
          className="flex gap-3 overflow-x-auto rounded-3xl bg-brand-soft p-5 sm:gap-5"
        >
          {workflows.map((item, itemIndex) => {
            const active = itemIndex === selected;
            return (
              <button
                key={item.id ?? item.title}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setIndex(itemIndex);
                  setCycle((value) => value + 1);
                }}
                className={`flex min-w-[9.5rem] flex-1 flex-col items-center justify-center gap-4 rounded-2xl px-3 py-5 text-center transition-colors duration-300 sm:min-w-0 sm:px-5 ${
                  active ? "bg-brand-active text-white" : "bg-surface text-ink-deep"
                }`}
              >
                <span className="inline-flex size-[2.875rem] items-center justify-center rounded-pill border border-brand-accent bg-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
                  <WorkflowIconMark name={item.icon ?? "user"} />
                </span>
                <span
                  className={`${homeSerif.className} text-lg leading-7 sm:text-2xl sm:leading-8`}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
