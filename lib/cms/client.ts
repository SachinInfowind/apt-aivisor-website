import "server-only";
import { draftMode } from "next/headers";
import { toAbsoluteMediaUrl } from "./media";

export { toAbsoluteMediaUrl };

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiListResponse<T> {
  data: T[];
}

interface StrapiSingleResponse<T> {
  data: T | null;
}

interface CmsFetchOptions {
  tags?: string[];
  revalidate?: number | false;
}

/** draftMode needs a request; generateStaticParams / build has none. */
async function isDraftModeEnabled(): Promise<boolean> {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled;
  } catch {
    return false;
  }
}

async function cmsFetch<T>(path: string, options: CmsFetchOptions = {}): Promise<T | null> {
  const isDraft = await isDraftModeEnabled();
  const url = new URL(`${STRAPI_URL}${path}`);
  if (isDraft) {
    url.searchParams.set("status", "draft");
  }

  let res: Response;
  try {
    res = await fetch(url, {
      headers: STRAPI_API_TOKEN
        ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` }
        : undefined,
      next: {
        tags: ["cms", ...(options.tags ?? [])],
        // In local CMS work, avoid stale indefinite cache after seed/backfill.
        revalidate:
          options.revalidate ??
          (process.env.NODE_ENV === "development" ? 0 : false),
      },
    });
  } catch (err) {
    // Strapi not running (ECONNREFUSED) or network blip — don't 500 the site.
    console.warn(
      `[cms] unreachable ${STRAPI_URL}${path}:`,
      err instanceof Error ? err.message : err,
    );
    return null;
  }

  if (!res.ok) {
    console.warn(`[cms] ${res.status} ${path}`);
    return null;
  }

  return res.json() as Promise<T>;
}

export async function fetchList<T>(path: string, options?: CmsFetchOptions): Promise<T[]> {
  const json = await cmsFetch<StrapiListResponse<T>>(path, options);
  return json?.data ?? [];
}

export async function fetchSingle<T>(path: string, options?: CmsFetchOptions): Promise<T | null> {
  const json = await cmsFetch<StrapiSingleResponse<T>>(path, options);
  return json?.data ?? null;
}
