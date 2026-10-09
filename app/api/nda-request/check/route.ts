import { NextRequest, NextResponse } from "next/server";
import { ndaCheckFormSchema } from "@/lib/validation/ndaRequestForm";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const STRAPI_NDA_API_TOKEN = process.env.STRAPI_NDA_API_TOKEN;

// "Already signed NDA" lookups answer true/false for any email, so keep guessing slow: per-IP limit.
// In-memory — resets on restart and isn't shared across instances.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const checksByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (checksByIp.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  checksByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

const GENERIC_ERROR = "We couldn't check right now — please try again shortly.";

/** "Already signed NDA?" — is a signed NDA on file for this email? Answers `{ signed: boolean }`. */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ message: "Too many attempts — please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const parsed = ndaCheckFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid submission", errors: { email: parsed.error.issues[0]?.message ?? "Enter a valid email address" } },
      { status: 400 },
    );
  }

  if (!STRAPI_NDA_API_TOKEN) {
    console.error("[nda-request/check] STRAPI_NDA_API_TOKEN is not set");
    return NextResponse.json({ message: GENERIC_ERROR }, { status: 503 });
  }

  let res: Response;
  try {
    res = await fetch(`${STRAPI_URL}/api/nda-requests/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${STRAPI_NDA_API_TOKEN}` },
      body: JSON.stringify({ email: parsed.data.email }),
      cache: "no-store",
    });
  } catch (err) {
    console.warn("[nda-request/check] Strapi unreachable:", err instanceof Error ? err.message : err);
    return NextResponse.json({ message: GENERIC_ERROR }, { status: 502 });
  }

  if (!res.ok) {
    console.warn(`[nda-request/check] CMS answered ${res.status}`);
    return NextResponse.json({ message: GENERIC_ERROR }, { status: 502 });
  }

  const payload = (await res.json().catch(() => ({}))) as { data?: { signed?: boolean } };
  return NextResponse.json({ signed: payload.data?.signed === true }, { status: 200 });
}
