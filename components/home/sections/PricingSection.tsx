import Link from "next/link";
import { SectionBadge } from "../../ui/SectionBadge";
import { layout } from "../../ui/type";
import type { FeatureTableSection } from "@/lib/cms/types";

type CellValue = true | false | "partial";

type Row = {
  feature: string;
  apt: CellValue;
  vendr: CellValue;
  ironclad: CellValue;
  generic: CellValue;
};

type Competitor = { key: "vendr" | "ironclad" | "generic"; name: string; price: string };

/** aptAIvisor wordmark with the brand sparkle over the "i" (Group 16.svg). */
function AptAIvisorWordmark() {
  return (
    <svg
      width="117"
      height="34"
      viewBox="0 0 117 34"
      fill="none"
      role="img"
      aria-label="aptAIvisor"
      className="h-[1.375rem] w-auto sm:h-[1.625rem]"
    >
      <path d="M109.44 28.8122V16.9046H112.276L112.583 19.1018C112.866 18.5821 113.221 18.141 113.646 17.7788C114.087 17.4165 114.583 17.133 115.134 16.9282C115.701 16.7235 116.324 16.6211 117.001 16.6211V19.9996H115.914C115.441 19.9996 115 20.0548 114.591 20.165C114.197 20.2753 113.851 20.4564 113.551 20.7084C113.252 20.9447 113.024 21.2754 112.866 21.7007C112.709 22.126 112.63 22.6615 112.63 23.3073V28.8122H109.44Z" fill="white"/>
      <path d="M100.643 29.0957C99.5086 29.0957 98.4848 28.8358 97.5712 28.316C96.6734 27.7805 95.9568 27.0481 95.4213 26.1188C94.9015 25.1738 94.6416 24.0948 94.6416 22.882C94.6416 21.6377 94.9015 20.5509 95.4213 19.6216C95.9568 18.6766 96.6813 17.9442 97.5949 17.4244C98.5084 16.8889 99.5322 16.6211 100.666 16.6211C101.816 16.6211 102.84 16.8889 103.738 17.4244C104.651 17.9442 105.368 18.6766 105.888 19.6216C106.423 20.5509 106.691 21.6298 106.691 22.8584C106.691 24.087 106.423 25.1738 105.888 26.1188C105.368 27.0481 104.651 27.7805 103.738 28.316C102.824 28.8358 101.792 29.0957 100.643 29.0957ZM100.643 26.3314C101.178 26.3314 101.651 26.2054 102.06 25.9534C102.485 25.7014 102.816 25.3155 103.052 24.7957C103.305 24.276 103.431 23.6302 103.431 22.8584C103.431 22.0866 103.305 21.4487 103.052 20.9447C102.816 20.4249 102.485 20.039 102.06 19.787C101.651 19.5192 101.186 19.3854 100.666 19.3854C100.162 19.3854 99.6976 19.5192 99.2723 19.787C98.847 20.039 98.5084 20.4249 98.2564 20.9447C98.0201 21.4487 97.902 22.0866 97.902 22.8584C97.902 23.6302 98.0201 24.276 98.2564 24.7957C98.5084 25.3155 98.8392 25.7014 99.2487 25.9534C99.674 26.2054 100.139 26.3314 100.643 26.3314Z" fill="white"/>
      <path d="M87.3125 29.0957C86.2257 29.0957 85.2807 28.9224 84.4774 28.5759C83.6741 28.2294 83.044 27.749 82.5873 27.1347C82.1305 26.5204 81.8706 25.8274 81.8076 25.0556H84.9735C85.0523 25.3549 85.1862 25.6305 85.3752 25.8825C85.5642 26.1188 85.8162 26.3078 86.1312 26.4496C86.4462 26.5913 86.8242 26.6622 87.2653 26.6622C87.6905 26.6622 88.037 26.6071 88.3048 26.4968C88.5726 26.3708 88.7695 26.2054 88.8955 26.0007C89.0372 25.7959 89.1081 25.5833 89.1081 25.3628C89.1081 25.032 89.0136 24.78 88.8246 24.6067C88.6356 24.4177 88.3599 24.2681 87.9977 24.1578C87.6354 24.0476 87.1944 23.9373 86.6746 23.8271C86.1076 23.7168 85.5484 23.5829 84.9971 23.4254C84.4616 23.2522 83.9812 23.0395 83.5559 22.7875C83.1307 22.5355 82.792 22.2126 82.54 21.8188C82.288 21.4251 82.162 20.9368 82.162 20.354C82.162 19.6452 82.351 19.0152 82.729 18.4639C83.1071 17.8969 83.6583 17.448 84.3829 17.1172C85.1074 16.7865 85.9816 16.6211 87.0054 16.6211C88.4387 16.6211 89.5727 16.944 90.4075 17.5898C91.2423 18.2355 91.7385 19.1255 91.896 20.2595H88.8955C88.801 19.8973 88.5883 19.6137 88.2576 19.409C87.9425 19.1885 87.5173 19.0782 86.9817 19.0782C86.4147 19.0782 85.9816 19.1806 85.6823 19.3854C85.383 19.5901 85.2334 19.8579 85.2334 20.1886C85.2334 20.4092 85.3279 20.606 85.5169 20.7793C85.7217 20.9526 86.0052 21.1022 86.3675 21.2282C86.7297 21.3384 87.1707 21.4487 87.6905 21.559C88.6041 21.748 89.4074 21.9685 90.1004 22.2205C90.7934 22.4567 91.3368 22.8033 91.7306 23.26C92.1244 23.7011 92.3212 24.3468 92.3212 25.1974C92.3212 25.9534 92.1165 26.6307 91.707 27.2292C91.2974 27.812 90.7147 28.2688 89.9586 28.5995C89.2183 28.9303 88.3363 29.0957 87.3125 29.0957Z" fill="white"/>
      <path d="M76.0331 28.8125V16.905H79.2226V28.8125H76.0331ZM77.6397 15.2748C77.0727 15.2748 76.6001 15.1094 76.2221 14.7786C75.8598 14.4321 75.6787 13.999 75.6787 13.4792C75.6787 12.9594 75.8598 12.5341 76.2221 12.2034C76.6001 11.8569 77.0727 11.6836 77.6397 11.6836C78.2225 11.6836 78.695 11.8569 79.0572 12.2034C79.4353 12.5341 79.6243 12.9594 79.6243 13.4792C79.6243 13.999 79.4353 14.4321 79.0572 14.7786C78.695 15.1094 78.2225 15.2748 77.6397 15.2748Z" fill="white"/>
      <path d="M65.7927 28.8119L61.4219 16.9043H64.7768L67.7301 25.8113L70.6833 16.9043H74.0146L69.6674 28.8119H65.7927Z" fill="white"/>
      <path d="M38.375 28.8117L44.4233 12.2734H48.0381L54.0627 28.8117H50.6842L46.2189 15.9119L41.7299 28.8117H38.375ZM41.0448 25.0552L41.8953 22.5744H50.3062L51.1331 25.0552H41.0448Z" fill="white"/>
      <path d="M34.5572 28.8123C33.7224 28.8123 32.99 28.6863 32.36 28.4343C31.7457 28.1665 31.2653 27.7334 30.9188 27.1349C30.5723 26.5206 30.399 25.6858 30.399 24.6305V19.5745H28.3672V16.9047H30.399L30.7534 13.668H33.5886V16.9047H36.7308V19.5745H33.5886V24.6777C33.5886 25.2133 33.7067 25.5834 33.943 25.7882C34.1792 25.9929 34.5809 26.0953 35.1479 26.0953H36.7072V28.8123H34.5572Z" fill="white"/>
      <path d="M14.1738 34.0099V16.9046H17.009L17.3634 18.5584C17.6154 18.2119 17.9146 17.8969 18.2611 17.6134C18.6077 17.3141 19.0172 17.0779 19.4897 16.9046C19.978 16.7156 20.545 16.6211 21.1908 16.6211C22.3091 16.6211 23.2935 16.8967 24.1441 17.448C24.9946 17.9993 25.664 18.7474 26.1523 19.6925C26.6563 20.6218 26.9083 21.685 26.9083 22.882C26.9083 24.0791 26.6563 25.1501 26.1523 26.0952C25.6483 27.0245 24.971 27.7569 24.1204 28.2924C23.2699 28.8279 22.3012 29.0957 21.2144 29.0957C20.3324 29.0957 19.5685 28.9382 18.9227 28.6232C18.2927 28.2924 17.7729 27.8435 17.3634 27.2765V34.0099H14.1738ZM20.4584 26.3078C21.0884 26.3078 21.6397 26.1661 22.1122 25.8825C22.6005 25.599 22.9785 25.1974 23.2463 24.6776C23.514 24.1578 23.6479 23.5593 23.6479 22.882C23.6479 22.2047 23.514 21.6062 23.2463 21.0864C22.9785 20.5509 22.6005 20.1414 22.1122 19.8579C21.6397 19.5586 21.0884 19.409 20.4584 19.409C19.8441 19.409 19.2928 19.5586 18.8046 19.8579C18.332 20.1414 17.954 20.543 17.6705 21.0628C17.4027 21.5826 17.2689 22.1811 17.2689 22.8584C17.2689 23.5357 17.4027 24.1421 17.6705 24.6776C17.954 25.1974 18.332 25.599 18.8046 25.8825C19.2928 26.1661 19.8441 26.3078 20.4584 26.3078Z" fill="white"/>
      <path d="M4.34721 29.0957C3.35491 29.0957 2.53587 28.9382 1.89009 28.6232C1.24431 28.2924 0.763912 27.8593 0.448896 27.3237C0.149632 26.7725 0 26.166 0 25.5045C0 24.78 0.181134 24.1421 0.543401 23.5908C0.921419 23.0395 1.48057 22.6064 2.22086 22.2914C2.97689 21.9763 3.92194 21.8188 5.05599 21.8188H8.00926C8.00926 21.2361 7.9305 20.7557 7.773 20.3776C7.61549 19.9839 7.37135 19.6925 7.04059 19.5035C6.70982 19.3145 6.2688 19.22 5.71752 19.22C5.11899 19.22 4.6071 19.3538 4.18183 19.6216C3.77231 19.8736 3.52029 20.2674 3.42579 20.8029H0.330766C0.40952 19.9524 0.685158 19.22 1.15768 18.6057C1.64595 17.9757 2.28386 17.4874 3.0714 17.1409C3.87469 16.7944 4.7646 16.6211 5.74115 16.6211C6.85945 16.6211 7.82812 16.8101 8.64716 17.1881C9.4662 17.5661 10.0962 18.1095 10.5373 18.8183C10.9783 19.5271 11.1988 20.4013 11.1988 21.4408V28.8122H8.50541L8.15101 26.993C7.97776 27.308 7.773 27.5915 7.53674 27.8435C7.30047 28.0955 7.02484 28.316 6.70982 28.505C6.39481 28.694 6.04041 28.8358 5.64665 28.9303C5.25288 29.0406 4.81973 29.0957 4.34721 29.0957ZM5.10324 26.6386C5.51276 26.6386 5.87503 26.5677 6.19005 26.4259C6.52081 26.2684 6.80433 26.0637 7.04059 25.8117C7.27685 25.5439 7.45798 25.2446 7.58399 24.9139C7.72574 24.5673 7.82025 24.1972 7.8675 23.8034V23.7798H5.43401C4.94574 23.7798 4.54409 23.8428 4.22908 23.9688C3.92981 24.0791 3.7093 24.2445 3.56755 24.465C3.42579 24.6855 3.35491 24.9375 3.35491 25.221C3.35491 25.536 3.42579 25.7959 3.56755 26.0007C3.7093 26.2054 3.91406 26.3629 4.18183 26.4732C4.44959 26.5834 4.75673 26.6386 5.10324 26.6386Z" fill="white"/>
      <path d="M56.2363 28.8117V12.2734H59.4259V28.8117H56.2363Z" fill="white"/>
      <path d="M57.8366 0L59.2374 3.78547L63.0228 5.18622L59.2374 6.58697L57.8366 10.3724L56.4359 6.58697L52.6504 5.18622L56.4359 3.78547L57.8366 0Z" fill="white"/>
    </svg>
  );
}

function CheckIcon({ onBlue }: { onBlue?: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke={onBlue ? "white" : "#079455"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinusIcon() {
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
        d="M4.16699 10H15.8337"
        className="stroke-faint"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cell({ value, onBlue }: { value: CellValue; onBlue?: boolean }) {
  if (value === "partial") {
    return (
      <span className="text-[0.875rem] leading-5 text-nav">Partial</span>
    );
  }
  if (value) {
    return (
      <span className="inline-flex" aria-label="Included">
        <CheckIcon onBlue={onBlue} />
      </span>
    );
  }
  return (
    <span className="inline-flex" aria-label="Not included">
      <MinusIcon />
    </span>
  );
}

function rowTone(i: number) {
  return i % 2 === 0;
}

export function PricingSection({
  badgeLabel,
  heading,
  headingAccent,
  ctaLabel,
  ctaHref,
  rows: rawRows,
  headerPrice,
  competitors: rawCompetitors,
}: FeatureTableSection) {
  const rows = (rawRows ?? []) as unknown as Row[];
  const competitors = (rawCompetitors ?? []) as unknown as Competitor[];

  return (
    <section
      className={`bg-white ${layout.sectionX} pt-12 sm:pt-16 md:pt-20 xl:pt-[6.25rem] pb-12 sm:pb-16`}
      id="pricing"
    >
      <div
        className={`${layout.inner} flex flex-col items-center gap-8 sm:gap-10`}
      >
        <div className="flex max-w-[45.125rem] flex-col items-center gap-6 text-center">
          {badgeLabel && <SectionBadge>{badgeLabel}</SectionBadge>}
          {heading && (
            <h2 className="font-display text-h2 font-normal tracking-[-0.02em] text-navy">
              {heading}{" "}
              {headingAccent && (
                <em className="italic text-brand-accent">
                  {headingAccent.includes(" ") ? (
                    <>
                      {headingAccent.slice(0, headingAccent.lastIndexOf(" "))}
                      {/* Figma: the closing word drops to its own centered line */}
                      <span className="block">
                        {headingAccent.slice(headingAccent.lastIndexOf(" ") + 1)}
                      </span>
                    </>
                  ) : (
                    headingAccent
                  )}
                </em>
              )}
            </h2>
          )}
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-pill border border-brand bg-brand px-4 py-2.5 text-[1rem] font-semibold leading-6 text-white shadow-sm transition-colors hover:bg-brand-hover active:scale-[0.98]"
            >
              {ctaLabel}
            </Link>
          )}
        </div>

        <div className="w-full min-w-0 max-w-[80rem] rounded-[1.25rem] bg-surface p-3 sm:rounded-[1.5rem] sm:p-6 md:p-8">
          <div className="-mx-1 overflow-x-auto sm:mx-0">
            <div className="grid min-w-[36rem] grid-cols-[minmax(8rem,1.2fr)_repeat(4,minmax(7rem,1fr))] items-start gap-0 sm:min-w-[52rem] md:gap-2 lg:gap-4">
              <div className="flex flex-col pt-[6.5rem]">
                {rows.map((row, i) => (
                  <div
                    key={row.feature}
                    className={`flex h-16 items-center px-4 sm:px-6 ${
                      rowTone(i)
                        ? "rounded-l-lg bg-surface-muted"
                        : "bg-transparent"
                    }`}
                  >
                    <span className="text-[0.875rem] font-medium leading-5 text-navy">
                      {row.feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col rounded-xl bg-brand-accent pb-5">
                <div className="flex h-[6.5rem] flex-col items-center justify-center gap-2 px-2">
                  <AptAIvisorWordmark />
                  {headerPrice ? (
                    <span className="inline-flex items-center rounded-pill border border-chip-success-edge bg-chip-success-bg px-2.5 py-0.5 text-[0.875rem] font-medium leading-5 text-chip-success-fg">
                      {headerPrice}
                    </span>
                  ) : null}
                </div>
                {rows.map((row, i) => (
                  <div
                    key={row.feature}
                    className={`flex h-16 items-center justify-center px-4 sm:px-6 ${
                      rowTone(i) ? "bg-brand-strong" : "bg-transparent"
                    }`}
                  >
                    <Cell value={row.apt} onBlue />
                  </div>
                ))}
              </div>

              {competitors.map((col) => (
                <div
                  key={col.key}
                  className="flex flex-col pb-5"
                >
                  <div className="flex h-[6.5rem] flex-col items-center justify-center gap-2 px-2">
                    <p className="text-center text-[1rem] font-semibold leading-7 text-navy sm:text-[1.125rem] sm:leading-7">
                      {col.name}
                    </p>
                    <span className="inline-flex items-center rounded-pill border border-[#FECDCA] bg-[#FEF3F2] px-2.5 py-0.5 text-[0.875rem] font-medium leading-5 text-danger-fg">
                      {col.price}
                    </span>
                  </div>
                  {rows.map((row, i) => (
                    <div
                      key={row.feature}
                      className={`flex h-16 items-center justify-center px-4 sm:px-6 ${
                        rowTone(i)
                          ? i === 0
                            ? "rounded-none bg-surface-muted"
                            : "bg-surface-muted"
                          : "bg-transparent"
                      } ${
                        col.key === "generic" && rowTone(i)
                          ? "rounded-r-lg"
                          : ""
                      }`}
                    >
                      <Cell value={row[col.key]} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
