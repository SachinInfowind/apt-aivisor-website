import { NextRequest, NextResponse } from "next/server";
import { NDA_UPLOAD_MAX_BYTES, ndaUploadTokenSchema } from "@/lib/validation/ndaRequestForm";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const STRAPI_NDA_API_TOKEN = process.env.STRAPI_NDA_API_TOKEN;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const uploadsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (uploadsByIp.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  uploadsByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

const GENERIC_ERROR = "We couldn't upload your signed NDA right now — please try again, or reply to the NDA email with it attached.";

/**
 * Signed NDA upload, from the personal link in the NDA email (/nda/upload?token=…).
 * Checks the basics here, then hands the file to the CMS, which verifies the link and
 * that the file really is a PDF before storing it privately.
 */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ message: "Too many uploads — please try again later." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const token = ndaUploadTokenSchema.safeParse(form.get("token"));
  if (!token.success) {
    return NextResponse.json({ message: "This upload link is not valid." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "Choose your signed NDA (PDF) to upload." }, { status: 400 });
  }
  if (file.size > NDA_UPLOAD_MAX_BYTES) {
    return NextResponse.json({ message: "The PDF must be 10MB or smaller." }, { status: 400 });
  }
  if (file.type && file.type !== "application/pdf") {
    return NextResponse.json({ message: "The signed NDA must be a PDF." }, { status: 400 });
  }

  if (!STRAPI_NDA_API_TOKEN) {
    console.error("[nda-request/signed] STRAPI_NDA_API_TOKEN is not set");
    return NextResponse.json({ message: GENERIC_ERROR }, { status: 503 });
  }

  const upstream = new FormData();
  upstream.set("token", token.data);
  upstream.set("file", file, file.name || "signed-nda.pdf");

  let res: Response;
  try {
    res = await fetch(`${STRAPI_URL}/api/nda-requests/signed-upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${STRAPI_NDA_API_TOKEN}` },
      body: upstream,
      cache: "no-store",
    });
  } catch (err) {
    console.warn("[nda-request/signed] Strapi unreachable:", err instanceof Error ? err.message : err);
    return NextResponse.json({ message: GENERIC_ERROR }, { status: 502 });
  }

  if (!res.ok) {
    const payload = (await res.json().catch(() => ({}))) as { error?: { status?: number; message?: string } };
    // 400s from the CMS are written for the user (expired link, not a PDF, …).
    if (res.status === 400 && payload.error?.message) {
      return NextResponse.json({ message: payload.error.message }, { status: 400 });
    }
    return NextResponse.json({ message: GENERIC_ERROR }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
