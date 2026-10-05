import { SectionBadge } from "../../ui/SectionBadge";
import { CmsImage } from "../../ui/CmsImage";
import { layout } from "../../ui/type";
import type { ProblemGridSection } from "@/lib/cms/types";

export function ProblemSection({
  badgeLabel,
  heading,
  headingAccent,
  subheading,
  items,
}: ProblemGridSection) {
  return (
    <section
      className={`bg-problem-section ${layout.sectionX} ${layout.sectionY}`}
    >
      <div className={layout.inner}>
        <div className="flex max-w-heading flex-col items-start text-left">
          {badgeLabel && <SectionBadge>{badgeLabel}</SectionBadge>}
          {heading && (
            <h2 className="mt-5 max-w-[640px] font-display text-h2 font-normal tracking-tight text-navy">
              {heading}{" "}
              {headingAccent && (
                <em className="italic text-brand-accent">{headingAccent}</em>
              )}
            </h2>
          )}
          {subheading && (
            <p className="mt-4 max-w-prose text-base leading-7 text-ink sm:mt-4.5 sm:text-body-md">
              {subheading}
            </p>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
          {items.map((p) => (
            <article
              key={p.title}
              className="flex flex-col overflow-hidden rounded-card bg-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card-lg"
            >
              {/* Blue gradient matches Figma card tops; PNG also has it baked in */}
              <div className="relative aspect-[300/289] w-full overflow-hidden bg-card-art">
                <CmsImage
                  image={p.icon}
                  fill
                  sizes="(max-width: 1280px) 50vw, 300px"
                  className="object-cover object-center"
                  priority
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-h5 text-navy">{p.title}</h3>
                {p.description && (
                  <p className="mt-2.5 text-body-sm text-ink">{p.description}</p>
                )}
                {p.meta && (
                  <p className="mt-auto pt-3.5 text-body-sm font-medium text-brand">
                    {p.meta}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
