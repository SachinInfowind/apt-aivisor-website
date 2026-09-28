/**
 * Client-safe media URL helper — do not import from `lib/cms/client`
 * (that module is server-only because of `next/headers`).
 */
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  process.env.STRAPI_URL ??
  "http://localhost:1337";

export function toAbsoluteMediaUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${STRAPI_URL}${url}`;
}
