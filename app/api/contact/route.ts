import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation/contactForm";
import { UploadError, uploadPrivateDocument } from "@/lib/server/privateUpload";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
// Only used when a document is attached: the token that may presign private uploads.
const STRAPI_CAREER_API_TOKEN = process.env.STRAPI_CAREER_API_TOKEN;

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

  // Plain JSON normally; multipart when a document is attached.
  let body: unknown;
  let documentFile: File | null = null;
  try {
    if ((request.headers.get("content-type") ?? "").includes("multipart/form-data")) {
      const form = await request.formData();
      const fields: Record<string, unknown> = {};
      for (const [name, value] of form.entries()) {
        if (typeof value === "string") fields[name] = value;
      }
      fields.agreedToPrivacyPolicy = fields.agreedToPrivacyPolicy === "true";
      const doc = form.get("document");
      documentFile = doc instanceof File && doc.size > 0 ? doc : null;
      body = fields;
    } else {
      body = await request.json();
    }
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }


  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    return NextResponse.json({ message: "Invalid submission", errors }, { status: 400 });
  }

  const { companyWebsite, ...clean } = parsed.data;

  // Honeypot tripped — pretend success so bots can't tell it was dropped.
  if (companyWebsite) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  let attachment: { key: string; fileName: string } | null = null;
  if (documentFile) {
    if (!STRAPI_CAREER_API_TOKEN) {
      console.error("[contact] STRAPI_CAREER_API_TOKEN is not set — cannot upload the attached document.");
      return NextResponse.json(
        { message: "We couldn't upload your document right now — please try again shortly." },
        { status: 503 },
      );
    }
    try {
      attachment = await uploadPrivateDocument(documentFile, STRAPI_CAREER_API_TOKEN);
    } catch (err) {
      if (err instanceof UploadError) {
        return NextResponse.json(
          err.errors ? { message: err.message, errors: err.errors } : { message: err.message },
          { status: err.status },
        );
      }
      throw err;
    }
  }

  let res: Response;
  try {
    res = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        data: {
          firstName: clean.firstName,
          lastName: clean.lastName,
          email: clean.email,
          phoneCountry: clean.phoneCountry,
          phone: clean.phone,
          message: clean.message,
          agreedToPrivacyPolicy: clean.agreedToPrivacyPolicy,
          sourcePath: "/contact",
          ...(attachment
            ? { attachmentKey: attachment.key, attachmentFileName: attachment.fileName }
            : {}),
        },
      }),
      cache: "no-store",
    });
  } catch (err) {
    console.warn("[contact] Strapi unreachable:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { message: "We couldn't send your message right now — please try again shortly." },
      { status: 502 },
    );
  }

  if (!res.ok) {
    const payload = (await res.json().catch(() => ({}))) as StrapiErrorResponse;
    const fieldErrors = payload.error?.details?.errors;
    if (fieldErrors) {
      const errors: Record<string, string> = {};
      for (const [field, messages] of Object.entries(fieldErrors)) {
        // The CMS names the file field "attachment"; the form calls it "document".
        if (messages?.[0]) errors[field === "attachment" ? "document" : field] = messages[0];
      }
      return NextResponse.json({ message: "Invalid submission", errors }, { status: 400 });
    }
    return NextResponse.json(
      { message: "We couldn't send your message right now — please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
