import "server-only";
import { RECAPTCHA_FIELD, type RecaptchaAction } from "./recaptcha-actions";

/**
 * Shared server side of Google reCAPTCHA v3, used by every form route.
 *
 *   const captcha = await verifyRecaptcha({ token: recaptchaTokenFrom(body), action: "contact", request });
 *   if (!captcha.ok) return NextResponse.json({ message: captcha.message }, { status: captcha.status });
 *
 * Checks, in order: the token exists, Google accepts it, it was issued for this exact
 * action, and its score is at least RECAPTCHA_MIN_SCORE (default 0.5). Optionally restricts
 * the hostname via RECAPTCHA_ALLOWED_HOSTNAMES (comma-separated).
 *
 * Without RECAPTCHA_SECRET_KEY: production fails closed (503); development skips the check
 * with a warning so forms still work locally.
 */
const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const HUMAN_ERROR = "We couldn't verify that you're human — please try again.";
const UNAVAILABLE_ERROR = "Verification is temporarily unavailable — please try again shortly.";

type VerifyResult =
  | { ok: true; score: number | null; skipped: boolean }
  | { ok: false; status: 403 | 503; message: string };

interface SiteVerifyResponse {
  success?: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
}

/** Pulls the token out of a JSON body or multipart `FormData`. */
export function recaptchaTokenFrom(source: unknown): string | undefined {
  if (source instanceof FormData) {
    const value = source.get(RECAPTCHA_FIELD);
    return typeof value === "string" ? value : undefined;
  }
  if (source && typeof source === "object" && RECAPTCHA_FIELD in source) {
    const value = (source as Record<string, unknown>)[RECAPTCHA_FIELD];
    return typeof value === "string" ? value : undefined;
  }
  return undefined;
}

const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? undefined;

let warnedMissingSecret = false;

export async function verifyRecaptcha({
  token,
  action,
  request,
}: {
  token: string | null | undefined;
  action: RecaptchaAction;
  request: Request;
}): Promise<VerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[recaptcha] RECAPTCHA_SECRET_KEY is not set — rejecting submission");
      return { ok: false, status: 503, message: UNAVAILABLE_ERROR };
    }
    if (!warnedMissingSecret) {
      warnedMissingSecret = true;
      console.warn("[recaptcha] RECAPTCHA_SECRET_KEY is not set — skipping verification (development only)");
    }
    return { ok: true, score: null, skipped: true };
  }

  if (!token) {
    console.warn(`[recaptcha] rejected action=${action}: no token`);
    return { ok: false, status: 403, message: HUMAN_ERROR };
  }

  let data: SiteVerifyResponse;
  try {
    const body = new URLSearchParams({ secret, response: token });
    const ip = clientIp(request);
    if (ip) body.set("remoteip", ip);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`siteverify ${res.status}`);
    data = (await res.json()) as SiteVerifyResponse;
  } catch (err) {
    console.error("[recaptcha] verification request failed:", err instanceof Error ? err.message : err);
    return { ok: false, status: 503, message: UNAVAILABLE_ERROR };
  }

  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? 0.5);
  const allowedHosts = (process.env.RECAPTCHA_ALLOWED_HOSTNAMES ?? "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);

  const reason = !data.success
    ? `google rejected token (${(data["error-codes"] ?? []).join(", ") || "unknown"})`
    : data.action !== action
      ? `action mismatch (got ${data.action})`
      : typeof data.score !== "number" || data.score < minScore
        ? `score ${data.score} below ${minScore}`
        : allowedHosts.length && !allowedHosts.includes(data.hostname ?? "")
          ? `hostname ${data.hostname} not allowed`
          : null;

  if (reason) {
    console.warn(`[recaptcha] rejected action=${action}: ${reason}`);
    return { ok: false, status: 403, message: HUMAN_ERROR };
  }

  return { ok: true, score: data.score ?? null, skipped: false };
}
