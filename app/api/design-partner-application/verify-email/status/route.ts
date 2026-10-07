import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const STRAPI_EMAIL_VERIFICATION_API_TOKEN = process.env.STRAPI_EMAIL_VERIFICATION_API_TOKEN;

/**
 * Called once when the page loads with `?emailVerifyToken=<token>` (the user
 * just clicked the link in their inbox and was redirected back here by the
 * CMS). Re-checks the token server-side rather than trusting the URL blindly.
 */
export async function GET(request: NextRequest) {
  if (!STRAPI_EMAIL_VERIFICATION_API_TOKEN) {
    return NextResponse.json({ status: "unavailable" }, { status: 503 });
  }

  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ message: "token is required" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(
      `${STRAPI_URL}/api/email-verifications/status?token=${encodeURIComponent(token)}`,
      {
        headers: { Authorization: `Bearer ${STRAPI_EMAIL_VERIFICATION_API_TOKEN}` },
        cache: "no-store",
      },
    );
  } catch (err) {
    console.warn("[verify-email] status check unreachable:", err instanceof Error ? err.message : err);
    return NextResponse.json({ status: "unavailable" }, { status: 502 });
  }

  if (!res.ok) {
    return NextResponse.json({ status: "unavailable" }, { status: 502 });
  }

  const payload = (await res.json()) as { data?: { status?: string; email?: string } };
  return NextResponse.json({
    status: payload.data?.status ?? "not_found",
    email: payload.data?.email ?? null,
  });
}
