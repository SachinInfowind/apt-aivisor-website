import { NextRequest, NextResponse } from "next/server";
import { RECAPTCHA_ACTIONS } from "@/lib/recaptcha-actions";
import { recaptchaTokenFrom, verifyRecaptcha } from "@/lib/recaptcha";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
// Dedicated token — scoped to request + status only (see
// apt-cms/scripts/create-email-verification-token.js).
const STRAPI_EMAIL_VERIFICATION_API_TOKEN = process.env.STRAPI_EMAIL_VERIFICATION_API_TOKEN;

// Lightweight per-IP rate limit: clicking "Verify Now" repeatedly shouldn't
// spam someone's inbox. Same in-memory approach as the other form routes.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const requestsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestsByIp.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestsByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  if (!STRAPI_EMAIL_VERIFICATION_API_TOKEN) {
    console.error("[verify-email] STRAPI_EMAIL_VERIFICATION_API_TOKEN is not set.");
    return NextResponse.json(
      { message: "Email verification is temporarily unavailable." },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many requests — please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const captcha = await verifyRecaptcha({
    token: recaptchaTokenFrom(body),
    action: RECAPTCHA_ACTIONS.emailVerification,
    request,
  });
  if (!captcha.ok) {
    return NextResponse.json({ message: captcha.message }, { status: captcha.status });
  }

  const email = typeof (body as { email?: unknown })?.email === "string" ? (body as { email: string }).email : "";
  if (!EMAIL_PATTERN.test(email.trim())) {
    return NextResponse.json({ message: "Enter a valid email address" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${STRAPI_URL}/api/email-verifications/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_EMAIL_VERIFICATION_API_TOKEN}`,
      },
      body: JSON.stringify({ email: email.trim(), sourcePath: "/design-partner" }),
      cache: "no-store",
    });
  } catch (err) {
    console.warn("[verify-email] Strapi unreachable:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { message: "We couldn't send the verification email right now — please try again shortly." },
      { status: 502 },
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { message: "We couldn't send the verification email right now — please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
