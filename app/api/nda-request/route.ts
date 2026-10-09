import { NextRequest, NextResponse } from "next/server";
import { ndaRequestFormSchema } from "@/lib/validation/ndaRequestForm";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
// Dedicated token — scoped to the NDA actions only (see
// apt-cms/scripts/create-nda-api-token.js).
const STRAPI_NDA_API_TOKEN = process.env.STRAPI_NDA_API_TOKEN;

// Lightweight per-IP rate limit: each request emails a document, so keep it tight.
// In-memory, so it resets on redeploy/restart and isn't shared across instances.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const submissionsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionsByIp.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  submissionsByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

interface StrapiErrorResponse {
  error?: { message?: string; details?: { errors?: Record<string, string[]> } };
}

const GENERIC_ERROR = "We couldn't send the NDA right now — please try again shortly.";

/** "Request NDA draft" — the CMS fills in the NDA and emails it to the requester. */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ message: "Too many requests — please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const parsed = ndaRequestFormSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    return NextResponse.json({ message: "Invalid submission", errors }, { status: 400 });
  }

  // Honeypot tripped — pretend success so bots can't tell it was dropped.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!STRAPI_NDA_API_TOKEN) {
    console.error("[nda-request] STRAPI_NDA_API_TOKEN is not set");
    return NextResponse.json({ message: GENERIC_ERROR }, { status: 503 });
  }

  const { signerName, signerTitle, signerEmail, companyName, sourcePath } = parsed.data;
  let res: Response;
  try {
    res = await fetch(`${STRAPI_URL}/api/nda-requests/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${STRAPI_NDA_API_TOKEN}` },
      body: JSON.stringify({ signerName, signerTitle, signerEmail, companyName, sourcePath: sourcePath ?? "/" }),
      cache: "no-store",
    });
  } catch (err) {
    console.warn("[nda-request] Strapi unreachable:", err instanceof Error ? err.message : err);
    return NextResponse.json({ message: GENERIC_ERROR }, { status: 502 });
  }

  if (!res.ok) {
    const payload = (await res.json().catch(() => ({}))) as StrapiErrorResponse;
    const fieldErrors = payload.error?.details?.errors;
    if (fieldErrors) {
      const errors: Record<string, string> = {};
      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (messages?.[0]) errors[field] = messages[0];
      }
      return NextResponse.json({ message: "Invalid submission", errors }, { status: 400 });
    }
    return NextResponse.json({ message: GENERIC_ERROR }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
