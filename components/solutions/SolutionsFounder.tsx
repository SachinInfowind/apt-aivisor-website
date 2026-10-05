"use client";

import { useState } from "react";
import Link from "next/link";
import { homeSerif } from "@/components/ui/fonts";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { SolutionsFounderSection } from "@/lib/cms/types";

function ShoppingCartIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1H1.65308C1.77609 1 1.8376 1 1.88709 1.02262C1.93071 1.04255 1.96767 1.07461 1.99357 1.11497C2.02297 1.16077 2.03167 1.22166 2.04906 1.34343L2.28571 3M2.28571 3L2.81166 6.8657C2.8784 7.35626 2.91177 7.60154 3.02905 7.78617C3.13239 7.94886 3.28054 8.07822 3.45568 8.15869C3.65443 8.25 3.90197 8.25 4.39705 8.25H8.676C9.14727 8.25 9.38291 8.25 9.57548 8.16521C9.74527 8.09044 9.89092 7.96992 9.99614 7.81711C10.1155 7.64381 10.1596 7.41233 10.2477 6.94938L10.9096 3.47484C10.9406 3.3119 10.9561 3.23043 10.9336 3.16675C10.9139 3.11088 10.875 3.06384 10.8238 3.03401C10.7654 3 10.6825 3 10.5166 3H2.28571ZM5 10.5C5 10.7761 4.77614 11 4.5 11C4.22386 11 4 10.7761 4 10.5C4 10.2239 4.22386 10 4.5 10C4.77614 10 5 10.2239 5 10.5ZM9 10.5C9 10.7761 8.77614 11 8.5 11C8.22386 11 8 10.7761 8 10.5C8 10.2239 8.22386 10 8.5 10C8.77614 10 9 10.2239 9 10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 10.5V7.8C7.5 7.51997 7.5 7.37996 7.4455 7.273C7.39757 7.17892 7.32108 7.10243 7.227 7.0545C7.12004 7 6.98003 7 6.7 7H5.3C5.01997 7 4.87996 7 4.773 7.0545C4.67892 7.10243 4.60243 7.17892 4.5545 7.273C4.5 7.37996 4.5 7.51997 4.5 7.8V10.5M1.5 3.5C1.5 4.32843 2.17157 5 3 5C3.82843 5 4.5 4.32843 4.5 3.5C4.5 4.32843 5.17157 5 6 5C6.82843 5 7.5 4.32843 7.5 3.5C7.5 4.32843 8.17157 5 9 5C9.82843 5 10.5 4.32843 10.5 3.5M3.1 10.5H8.9C9.46005 10.5 9.74008 10.5 9.95399 10.391C10.1422 10.2951 10.2951 10.1422 10.391 9.95399C10.5 9.74008 10.5 9.46005 10.5 8.9V3.1C10.5 2.53995 10.5 2.25992 10.391 2.04601C10.2951 1.85785 10.1422 1.70487 9.95399 1.60899C9.74008 1.5 9.46005 1.5 8.9 1.5H3.1C2.53995 1.5 2.25992 1.5 2.04601 1.60899C1.85785 1.70487 1.70487 1.85785 1.60899 2.04601C1.5 2.25992 1.5 2.53995 1.5 3.1V8.9C1.5 9.46005 1.5 9.74008 1.60899 9.95399C1.70487 10.1422 1.85785 10.2951 2.04601 10.391C2.25992 10.5 2.53995 10.5 3.1 10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg className="text-[#079455] shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" fill="currentColor"/>
      <path d="M6.25 10L8.75 12.5L13.75 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 15L15 5M15 11.6667V5H8.33333" stroke="currentColor" strokeWidth="1.6667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function SolutionsFounder({
  badge,
  headline,
  headlineAccent,
  subhead,
  tabs,
}: SolutionsFounderSection) {
  const [activeTab, setActiveTab] = useState(0);

  if (!tabs || tabs.length === 0) return null;

  const currentTab = tabs[activeTab];
  const imageUrl = currentTab.image?.url ? toAbsoluteMediaUrl(currentTab.image.url) : "";
  // Always route to the Design Partner page's application form with the
  // matching Buyer/Seller tab pre-selected, regardless of whatever URL is
  // configured in the CMS `ctaHref` field for this tab.
  const currentTabParticipant = currentTab.title.toLowerCase().includes("buyer")
    ? "buyer"
    : "seller";
  const applyHref = `/design-partner?type=${currentTabParticipant}#apply`;

  return (
    <section className="relative flex w-full flex-col bg-[#F9FAFB] px-5 py-12 md:px-[80px] md:py-[100px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-10">
        
        {/* Top Text area */}
        <div className="flex flex-col items-start gap-3">
          <div className="flex flex-col items-start gap-6">
            {badge ? (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#B2DDFF] bg-[#EFF8FF] px-2.5 py-1">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="4" cy="4" r="3" fill="#2E90FA" />
                </svg>
                <div className="text-center font-body text-sm font-medium leading-[20px] text-[#175CD3]">
                  {badge}
                </div>
              </div>
            ) : null}
            <h2 className={`${homeSerif.className} text-[48px] leading-[1.2] tracking-[-0.96px] text-[#182230]`}>
              {headline} {headlineAccent ? <span className="italic text-[#4F8DFF]">{headlineAccent}</span> : null}
            </h2>
          </div>
          {subhead ? (
            <p className="max-w-[800px] text-[20px] font-medium leading-[30px] text-[#344054]">
              {subhead}
            </p>
          ) : null}
        </div>

        {/* Toggle Box Area */}
        <div className="flex w-full flex-col rounded-[24px] bg-[linear-gradient(180deg,#B5CFFF_0%,#1C6BFF_100%)] p-6 md:p-9 pt-9">
          
          {/* Tabs Container */}
          <div className="flex flex-col items-start w-full">
            <div className="flex flex-wrap items-center gap-2 rounded-t-[24px] bg-white p-3">
              {tabs.map((tab, idx) => {
                const isActive = activeTab === idx;
                const isBuyer = tab.title.toLowerCase().includes("buyer");

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(idx)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 md:py-1 text-[13px] md:text-[14px] font-medium leading-[20px] transition-colors ${
                      isActive
                        ? "border border-[#1C6BFF] bg-[#1C6BFF] text-white"
                        : "border border-[#EAECF0] bg-[#F9FAFB] text-[#344054] hover:bg-gray-50"
                    }`}
                  >
                    {isBuyer ? <ShoppingCartIcon /> : <BuildingIcon />}
                    {tab.title}
                  </button>
                );
              })}
            </div>

          {/* Tab Content Box */}
          <div className="flex w-full flex-col md:flex-row items-center gap-10 lg:gap-[82px] rounded-[24px] rounded-tl-none bg-white p-6 md:p-[50px]">
            <div className="w-full md:w-1/2">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={currentTab.title}
                  className="w-full h-auto rounded-[24px] object-cover"
                />
              ) : (
                <div className="w-full aspect-[237/161] bg-gray-100 rounded-[24px]" />
              )}
            </div>
            
            <div className="flex w-full md:w-1/2 flex-col items-start gap-6">
              {currentTab.description ? (
                <p className="text-[16px] leading-[24px] text-[#344054]">
                  {currentTab.description}
                </p>
              ) : null}

              <div className="flex flex-col gap-5">
                {currentTab.features?.map((f) => (
                  <div key={f.id} className="flex items-start gap-2">
                    <CheckCircleIcon />
                    <span className="text-[14px] font-semibold leading-[20px] text-[#344054]">
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>

              {currentTab.ctaLabel ? (
                <Link
                  href={applyHref}
                  className="mt-2 flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full border border-[#0042BB] bg-[#0042BB] px-4 py-2 md:px-4 md:py-2.5 text-[14px] md:text-[16px] font-semibold leading-[24px] text-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-[#003699]"
                >
                  {currentTab.ctaLabel}
                  <ArrowUpRightIcon />
                </Link>
              ) : null}
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
