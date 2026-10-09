import { NextRequest, NextResponse } from "next/server";
import { waitlistSubmitSchema } from "@/lib/validation/waitlistApplication";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Lightweight per-IP rate limit: blunts naive bots without adding infra.
// In-memory, so it resets on redeploy/restart and isn't shared across
// instances — good enough for this form's volume, not a hard guarantee.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const submissionsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionsByIp.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  timestamps.push(now);
  submissionsByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

interface StrapiErrorResponse {
  error?: {
    message?: string;
    details?: { errors?: Record<string, string[]> };
  };
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many submissions — please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }


  const parsed = waitlistSubmitSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      // Answers sit under step1/step2/step3; report the field name.
      const key = issue.path[issue.path.length - 1];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    return NextResponse.json({ message: "Invalid submission", errors }, { status: 400 });
  }

  // Honeypot tripped — the CMS pretends success so bots can't tell it was dropped.
  let res: Response;
  try {
    res = await fetch(`${STRAPI_URL}/api/waitlist-signups/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
      },
      body: JSON.stringify({ ...parsed.data, sourcePath: "/waitlist" }),
      cache: "no-store",
    });
  } catch (err) {
    console.warn("[waitlist] Strapi unreachable:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { message: "We couldn't submit your application right now — please try again shortly." },
      { status: 502 },
    );
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
    return NextResponse.json(
      { message: "We couldn't submit your application right now — please try again shortly." },
      { status: 502 },
    );
  }

  const saved = (await res.json().catch(() => ({}))) as { data?: { firstName?: string; email?: string } };
  return NextResponse.json(
    { ok: true, firstName: saved.data?.firstName, email: saved.data?.email },
    { status: 200 },
  );
}
