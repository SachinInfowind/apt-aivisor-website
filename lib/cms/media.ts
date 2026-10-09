/**
 * Client-safe media URL helper — do not import from `lib/cms/client`
 * (that module is server-only because of `next/headers`).
 */
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  process.env.STRAPI_URL ??
  "http://localhost:1337";

/**
 * Media is stored as a relative path (e.g. "/uploads/unsorted/x.png") in the CMS database —
 * never an absolute host — so it can move between S3 buckets/CDNs without a DB migration.
 * Prepend the CDN/S3 base when one is configured; otherwise fall back to the CMS itself
 * (local dev, where media is served by Strapi from public/uploads).
 */
const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || STRAPI_URL;

export function toAbsoluteMediaUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${MEDIA_BASE_URL}${url}`;
}
