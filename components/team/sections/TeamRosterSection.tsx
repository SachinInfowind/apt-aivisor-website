"use client";

import Image from "next/image";
import { useState } from "react";
import { homeSerif } from "../../ui/fonts";
import { layout } from "../../ui/type";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type {
  TeamProfile,
  TeamRosterSection as TeamRosterSectionData,
} from "@/lib/cms/types";

/**
 * Team roster — Figma Team component set (26281:27852) + page Frame 1261154210.
 * Name + LinkedIn inline, brands top-right, blue quote card, Read More/Less.
 */

/** Splits `**bold**` markup out of plain CMS text into text/<strong> nodes. */
function renderRichBio(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-ink">{part}</strong> : part,
  );
}

function LinkedInIcon() {
  return (
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" aria-hidden>
      <path
        d="M3.333 4.667H0.667V13.333H3.333V4.667ZM2 3.467C2.88 3.467 3.6 2.747 3.6 1.867C3.6 0.987 2.88 0.267 2 0.267C1.12 0.267 0.4 0.987 0.4 1.867C0.4 2.747 1.12 3.467 2 3.467ZM14.333 13.333H11.68V9.067C11.68 8.04 11.66 6.72 10.253 6.72C8.827 6.72 8.613 7.84 8.613 8.987V13.333H5.96V4.667H8.507V5.853H8.54C8.9 5.187 9.76 4.48 11.047 4.48C13.72 4.48 14.333 6.24 14.333 8.613V13.333Z"
        fill="white"
      />
    </svg>
  );
}

function MemberCard({
  member,
  open,
  onToggle,
}: {
  member: TeamProfile;
  open: boolean;
  onToggle: () => void;
}) {
  const photoUrl = member.photo?.url
    ? toAbsoluteMediaUrl(member.photo.url)
    : null;
  const brandsUrl = member.brands?.url
    ? toAbsoluteMediaUrl(member.brands.url)
    : null;
  const fullBio = member.bio?.trim() ?? "";
  const previewFromCms = member.bioPreview?.trim() ?? "";
  const preview =
    previewFromCms ||
    (fullBio.includes("\n\n") ? fullBio.split("\n\n")[0]!.trim() : "");
  const canExpand = Boolean(fullBio && preview && fullBio.length > preview.length);
  const shownBio = open || !canExpand ? fullBio || preview : preview;
  const quote = member.quote?.replace(/^["“]|["”]$/g, "").trim() ?? "";
  const quoteAccent = member.quoteAccent?.trim() ?? "";
  const quoteAccentIndex = quoteAccent ? quote.indexOf(quoteAccent) : -1;
  const quoteBefore =
    quoteAccentIndex >= 0 ? quote.slice(0, quoteAccentIndex) : quote;
  const quoteAfter =
    quoteAccentIndex >= 0
      ? quote.slice(quoteAccentIndex + quoteAccent.length)
      : "";

  return (
    <article className="flex w-full flex-col items-start gap-8 lg:flex-row lg:items-start lg:gap-12">
      <div className="relative mx-auto w-full max-w-[25rem] shrink-0 sm:max-w-[20rem] lg:mx-0 lg:w-[18rem] xl:w-[25rem]">
        <div
          className="relative aspect-square w-full overflow-hidden rounded-[1.25rem]"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, white 0%, var(--color-platform-to) 100%)",
          }}
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={member.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 90vw, 400px"
            />
          ) : null}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-4 sm:gap-5">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <h3
                className={`${homeSerif.className} text-[clamp(1.5rem,2.5vw,2.25rem)] leading-[1.22] tracking-[-0.02em] text-navy`}
              >
                {member.name}
              </h3>
              {member.linkedinUrl ? (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on LinkedIn`}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1275B1] transition-opacity hover:opacity-90"
                >
                  <LinkedInIcon />
                </a>
              ) : null}
            </div>
            {brandsUrl ? (
              <Image
                src={brandsUrl}
                alt=""
                width={230}
                height={25}
                className="h-5 w-auto object-contain object-right sm:h-6"
              />
            ) : null}
          </div>

          {member.role ? (
            <p className="text-base font-semibold leading-7 text-ink sm:text-lg sm:leading-7">
              {member.role}
            </p>
          ) : null}
        </div>

        {shownBio ? (
          <p className="whitespace-pre-line text-base leading-6 text-nav sm:text-lg sm:leading-7">
            {renderRichBio(shownBio)}
            {canExpand ? (
              <>
                {" "}
                <button
                  type="button"
                  onClick={onToggle}
                  aria-expanded={open}
                  className="text-brand-accent underline transition-colors hover:text-brand"
                >
                  {open ? "Read Less" : "Read More"}
                </button>
                .
              </>
            ) : null}
          </p>
        ) : null}

        {quote ? (
          <blockquote className="w-full rounded-3xl bg-surface px-6 py-8 sm:px-10 sm:py-10 md:px-[6.9375rem] md:py-[3.125rem]">
            <p
              className={`${homeSerif.className} text-[clamp(1.125rem,2vw,1.5rem)] italic leading-[1.4] text-navy`}
            >
              “{quoteBefore}
              {quoteAccentIndex >= 0 ? (
                <span className="text-brand-deep">{quoteAccent}</span>
              ) : null}
              {quoteAfter}”
            </p>
          </blockquote>
        ) : null}
      </div>
    </article>
  );
}

export function TeamRosterSection({
  heading,
  headingAccent,
  members,
}: TeamRosterSectionData) {
  const [openMap, setOpenMap] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    members.forEach((m, i) => {
      if (m.expandedByDefault) initial[i] = true;
    });
    return initial;
  });

  return (
    <section
      className={`w-full bg-white ${layout.sectionX} py-16 sm:py-20 md:py-[6.25rem]`}
    >
      <div
        className={`${layout.inner} flex w-full max-w-[80rem] flex-col items-start gap-10 md:gap-12`}
      >
        <h2
          className={`${homeSerif.className} w-full text-left text-[clamp(1.75rem,4vw,3rem)] leading-[1.2] tracking-[-0.02em]`}
        >
          <span className="text-navy">{heading} </span>
          {headingAccent ? (
            <span className="italic text-brand-accent">{headingAccent}</span>
          ) : null}
        </h2>

        <div className="flex w-full flex-col items-stretch gap-16 md:gap-20">
          {members.map((member, i) => (
            <MemberCard
              key={`${member.name}-${member.id ?? i}`}
              member={member}
              open={Boolean(openMap[i])}
              onToggle={() =>
                setOpenMap((prev) => ({ ...prev, [i]: !prev[i] }))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
