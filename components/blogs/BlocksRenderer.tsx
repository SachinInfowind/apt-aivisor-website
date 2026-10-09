import Image from "next/image";
import type { ReactNode } from "react";
import { homeSerif } from "@/components/ui/fonts";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { BlockNode } from "@/lib/cms/types";

function renderInline(node: BlockNode, key: number): ReactNode {
  if (node.type === "link") {
    return (
      <a
        key={key}
        href={node.url}
        className="text-brand underline underline-offset-2"
      >
        {node.children?.map((child, i) => renderInline(child, i))}
      </a>
    );
  }

  let text: ReactNode = node.text ?? "";
  if (node.bold) text = <strong key={key}>{text}</strong>;
  if (node.italic) text = <em key={key}>{text}</em>;
  return <span key={key}>{text}</span>;
}

/**
 * Renderer for Strapi's native "blocks" rich-text field — styled to match
 * the Blog Detail design (Instrument Serif headings/quotes, Inter body).
 */
export function BlocksRenderer({ content }: { content: BlockNode[] }) {
  return (
    <div className="flex flex-col gap-6 text-body-lg leading-relaxed text-nav">
      {content.map((node, i) => {
        const children = node.children?.map((child, ci) => renderInline(child, ci));

        switch (node.type) {
          case "heading": {
            const level = node.level ?? 2;
            const sizeClass =
              level <= 2 ? "text-h2" : level === 3 ? "text-h3" : "text-h4";
            return (
              <h2
                key={i}
                className={`${homeSerif.className} ${sizeClass} mt-4 text-navy`}
              >
                {children}
              </h2>
            );
          }
          case "list": {
            const Tag = node.format === "ordered" ? "ol" : "ul";
            return (
              <Tag
                key={i}
                className={`ml-5 flex flex-col gap-2 ${
                  node.format === "ordered" ? "list-decimal" : "list-disc"
                }`}
              >
                {node.children?.map((item, ii) => (
                  <li key={ii}>
                    {item.children?.map((child, ci) => renderInline(child, ci))}
                  </li>
                ))}
              </Tag>
            );
          }
          case "quote":
            return (
              <blockquote
                key={i}
                className="flex flex-col gap-2 border-l-2 border-brand py-2 pl-5"
              >
                <p className={`${homeSerif.className} text-h4 italic text-navy`}>
                  {children}
                </p>
              </blockquote>
            );
          case "code":
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-lg bg-surface-muted p-4 text-body-sm"
              >
                <code>{node.children?.map((c) => c.text).join("")}</code>
              </pre>
            );
          case "image": {
            if (!node.image?.url) return null;
            // Natural aspect ratio so a tall (portrait) image isn't cropped
            // the same way a wide (landscape) one is — content authors can
            // drop in any mix of images, anywhere in the article.
            const { width, height } = node.image;
            const aspectRatio = width && height ? width / height : 16 / 9;
            return (
              <figure key={i} className="flex flex-col gap-4">
                <span
                  className="relative block max-h-screen w-full overflow-hidden rounded-xl"
                  style={{ aspectRatio }}
                >
                  <Image
                    src={toAbsoluteMediaUrl(node.image.url)}
                    alt={node.image.alternativeText || ""}
                    fill
                    sizes="(min-width: 1024px) 720px, 100vw"
                    className="object-cover"
                  />
                </span>
                {node.image.alternativeText ? (
                  <figcaption className="text-body-sm text-nav">
                    {node.image.alternativeText}
                  </figcaption>
                ) : null}
              </figure>
            );
          }
          case "paragraph":
          default:
            return <p key={i}>{children}</p>;
        }
      })}
    </div>
  );
}
