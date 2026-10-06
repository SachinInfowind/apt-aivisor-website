import { Fragment, type ReactNode } from "react";
import { homeSerif } from "../../ui/fonts";
import { layout } from "../../ui/type";
import type { TrustNotesSection as TrustNotesSectionData } from "@/lib/cms/types";

/**
 * Trust editorial notes — Figma Frame 50 (26281:26854).
 * “Notes for Review Before Publishing” below the NDA CTA.
 */

const EMAIL_RE = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

function NoteBody({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(EMAIL_RE)) {
    const email = match[1];
    const start = match.index ?? 0;
    if (start > last) {
      nodes.push(<Fragment key={`t-${last}`}>{text.slice(last, start)}</Fragment>);
    }
    nodes.push(
      <a
        key={`e-${start}`}
        href={`mailto:${email}`}
        className="text-brand-accent underline underline-offset-2 transition-opacity hover:opacity-80"
      >
        {email}
      </a>,
    );
    last = start + email.length;
  }
  if (last < text.length) {
    nodes.push(<Fragment key={`t-${last}`}>{text.slice(last)}</Fragment>);
  }

  return (
    <p className="text-base leading-7 text-nav sm:text-xl sm:leading-[1.875rem]">
      {nodes}
    </p>
  );
}

export function TrustNotesSection({
  heading,
  headingAccent,
  notes,
}: TrustNotesSectionData) {
  return (
    <section
      className={`w-full bg-surface ${layout.sectionX} py-16 sm:py-20 md:py-[6.25rem]`}
    >
      <div
        className={`${layout.inner} flex w-full max-w-[80rem] flex-col items-start gap-8 md:gap-12`}
      >
        <h2
          className={`${homeSerif.className} text-[clamp(1.75rem,3vw,3rem)] leading-[1.2] tracking-[-0.02em]`}
        >
          <span className="text-navy">{heading} </span>
          {headingAccent ? (
            <span className="italic text-brand-accent">{headingAccent}</span>
          ) : null}
        </h2>

        {notes?.length ? (
          <div className="flex w-full flex-col items-start gap-5 sm:gap-6">
            {notes.map((note, i) => (
              <NoteBody
                key={`${note.id ?? i}-${note.body.slice(0, 24)}`}
                text={note.body}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
