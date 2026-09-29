import { NextRequest, NextResponse } from "next/server";
import {
  careerApplicationSchema,
  validateResumeFile,
} from "@/lib/validation/careerApplication";

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

const authHeaders = STRAPI_API_TOKEN
  ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` }
  : undefined;

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

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const fields = {
    fullName: form.get("fullName")?.toString() ?? "",
    email: form.get("email")?.toString() ?? "",
    website: form.get("website")?.toString() ?? "",
    areaOfInterest: form.get("areaOfInterest")?.toString() ?? "",
    linkedinOrPortfolio: form.get("linkedinOrPortfolio")?.toString() ?? "",
    message: form.get("message")?.toString() ?? "",
    companyName: form.get("companyName")?.toString() ?? "",
  };

  const parsed = careerApplicationSchema.safeParse(fields);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    return NextResponse.json({ message: "Invalid submission", errors }, { status: 400 });
  }

  const { companyName, ...clean } = parsed.data;

  // Honeypot tripped — pretend success so bots can't tell it was dropped.
  if (companyName) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const resumeFile = form.get("resume");
  const resumeError = validateResumeFile(resumeFile instanceof File ? resumeFile : null);
  if (resumeError) {
    return NextResponse.json(
      { message: "Invalid submission", errors: { resume: resumeError } },
      { status: 400 },
    );
  }

  // Step 1: upload the resume via Strapi's public upload endpoint.
  let resumeId: number;
  try {
    const uploadForm = new FormData();
    uploadForm.append("files", resumeFile as File);

    const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: authHeaders,
      body: uploadForm,
      cache: "no-store",
    });

    if (!uploadRes.ok) {
      throw new Error(`upload failed with ${uploadRes.status}`);
    }

    const uploaded = (await uploadRes.json()) as Array<{ id: number }>;
    resumeId = uploaded[0]?.id;
    if (!resumeId) throw new Error("upload response missing file id");
  } catch (err) {
    console.warn(
      "[career-application] resume upload failed:",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { message: "We couldn't upload your resume right now — please try again shortly." },
      { status: 502 },
    );
  }

  // Step 2: create the application entry, pointing at the uploaded file.
  let res: Response;
  try {
    res = await fetch(`${STRAPI_URL}/api/career-applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({
        data: {
          fullName: clean.fullName,
          email: clean.email,
          website: clean.website,
          areaOfInterest: clean.areaOfInterest,
          linkedinOrPortfolio: clean.linkedinOrPortfolio,
          message: clean.message,
          resume: resumeId,
          sourcePath: "/career",
        },
      }),
      cache: "no-store",
    });
  } catch (err) {
    console.warn(
      "[career-application] Strapi unreachable:",
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { message: "We couldn't send your application right now — please try again shortly." },
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
      { message: "We couldn't send your application right now — please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
