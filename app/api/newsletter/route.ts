import { NextRequest, NextResponse } from "next/server";
import { RECAPTCHA_ACTIONS } from "@/lib/recaptcha-actions";
import { recaptchaTokenFrom, verifyRecaptcha } from "@/lib/recaptcha";
import { newsletterFormSchema } from "@/lib/validation/newsletterForm";

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

  // reCAPTCHA v3 — reject bots before doing any other work.
  const captcha = await verifyRecaptcha({
    token: recaptchaTokenFrom(body),
    action: RECAPTCHA_ACTIONS.newsletter,
    request,
  });
  if (!captcha.ok) {
    return NextResponse.json({ message: captcha.message }, { status: captcha.status });
  }

  const parsed = newsletterFormSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    return NextResponse.json({ message: "Invalid submission", errors }, { status: 400 });
  }

  const { companyWebsite, email, sourcePath } = parsed.data;

  // Honeypot tripped — pretend success so bots can't tell it was dropped.
  if (companyWebsite) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  let res: Response;
  try {
    res = await fetch(`${STRAPI_URL}/api/newsletter-subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        data: { email, sourcePath: sourcePath ?? "/contact" },
      }),
      cache: "no-store",
    });
  } catch (err) {
    console.warn("[newsletter] Strapi unreachable:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { message: "We couldn't subscribe you right now — please try again shortly." },
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
      { message: "We couldn't subscribe you right now — please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
