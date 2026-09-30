import Image from "next/image";
import { toAbsoluteMediaUrl } from "@/lib/cms/media";
import type { StrapiImage } from "@/lib/cms/types";

type CmsImageProps = {
  /** Media object from the CMS. Renders nothing when it is missing. */
  image?: StrapiImage | null;
  /** Falls back to the CMS alternative text, then to an empty (decorative) alt. */
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Skip the Next optimizer (large SVG exports). SVGs are always served as-is. */
  unoptimized?: boolean;
} & (
  | { fill: true; width?: never; height?: never }
  | { fill?: false; width: number; height: number }
);

/** Absolute URL for a CMS media object, or null. */
export function cmsUrl(image?: StrapiImage | null): string | null {
  return image?.url ? toAbsoluteMediaUrl(image.url) : null;
}

/**
 * `next/image` for CMS media (S3 / CDN URLs). SVGs are served as-is — the optimizer
 * doesn't process them.
 */
export function CmsImage({ image, alt, className, sizes, priority, unoptimized, fill, width, height }: CmsImageProps) {
  const src = cmsUrl(image);
  if (!src) return null;
  const common = {
    src,
    alt: alt ?? image?.alternativeText ?? "",
    className,
    priority,
    unoptimized: unoptimized || /\.svg(\?|$)/i.test(src) || undefined,
  };
  return fill ? (
    <Image {...common} fill sizes={sizes} />
  ) : (
    <Image {...common} width={width} height={height} sizes={sizes} />
  );
}
