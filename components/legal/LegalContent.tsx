import { homeSerif } from "@/components/ui/fonts";
import type { LegalBlock, LegalBodySection } from "@/lib/cms/types";

/**
 * Shared body for Privacy, Terms, and Cookies.
 * Copy comes from Strapi (`sections.legal-body`).
 * Intro and closing paragraphs are separated by a blank line.
 * Bullets are one item per line.
 */

const body = "text-body-md text-nav";

function paragraphs(text?: string) {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function bullets(text?: string) {
  return (text ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function SectionHeading({
  children,
  size,
}: {
  children: string;
  size: "lg" | "md";
}) {
  const scale =
    size === "lg"
      ? "mt-10 mb-5 text-[1.875rem] leading-[2.375rem]"
      : "mt-8 mb-4 text-2xl leading-8";
  return (
    <h2 className={`${homeSerif.className} text-heading ${scale}`}>
      {children}
    </h2>
  );
}

function Block({ block }: { block: LegalBlock }) {
  const intro = paragraphs(block.intro);
  const items = bullets(block.bullets);
  const closing = paragraphs(block.closing);
  const hasBody = intro.length > 0 || items.length > 0 || closing.length > 0;

  return (
    <>
      {block.heading ? (
        <SectionHeading size={block.headingSize === "md" ? "md" : "lg"}>
          {block.heading}
        </SectionHeading>
      ) : null}
      {hasBody ? (
        <div className={`flex flex-col gap-7 ${body}`}>
          {intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {items.length ? (
            <ul className="list-disc space-y-0 pl-6">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {closing.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : null}
    </>
  );
}

export function LegalContent({ blocks }: LegalBodySection) {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto flex w-full max-w-[45rem] flex-col items-start">
        {(blocks ?? []).map((block) => (
          <Block key={block.id ?? block.heading} block={block} />
        ))}
      </div>
    </section>
  );
}
