import { NextRequest, NextResponse } from "next/server";
import {
  careerApplicationSchema,
  validateResumeFile,
} from "@/lib/validation/careerApplication";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
// Dedicated token — NOT STRAPI_API_TOKEN (the CMS client sends that on every read).
// It can only presign a resume upload and create a career application.
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

interface PresignedUpload {
  key: string;
  url: string;
  fields: Record<string, string>;
  fileName: string;
}

const SERVER_ERROR = "We couldn't send your application right now — please try again shortly.";
const UPLOAD_ERROR = "We couldn't upload your resume right now — please try again shortly.";

// Some browsers send an empty `type` for .doc/.docx — fall back to the extension.
const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function resumeContentType(file: File): string | null {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return CONTENT_TYPE_BY_EXTENSION[ext] ?? null;
}

/** A text field from the form, or "" when it is missing or is a file. */
function textField(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value : "";
}

/** A failed step: what to send back to the browser. */
class StepError extends Error {
  constructor(
    public readonly body: Record<string, unknown>,
    public readonly status: number,
  ) {
    super(String(body.message ?? "step failed"));
  }
}

const fail = (message: string, status: number, errors?: Record<string, string>) =>
  new StepError(errors ? { message, errors } : { message }, status);

function firstFieldErrors(fieldErrors: Record<string, string[]>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (messages?.[0]) errors[field] = messages[0];
  }
  return errors;
}

/** Step 1: presigned POST from the CMS (size / type are enforced by S3). */
async function presignResume(authHeaders: HeadersInit, file: File, contentType: string) {
  let res: Response;
  try {
    res = await fetch(`${STRAPI_URL}/api/career-applications/resume-upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({ fileName: file.name, contentType, size: file.size }),
      cache: "no-store",
    });
  } catch (err) {
    console.warn("[career-application] presign unreachable:", err instanceof Error ? err.message : err);
    throw fail(UPLOAD_ERROR, 502);
  }

  if (res.status === 400) {
    const payload = (await res.json().catch(() => ({}))) as StrapiErrorResponse;
    throw fail("Invalid submission", 400, { resume: payload.error?.message ?? "Invalid resume file" });
  }
  if (!res.ok) {
    console.warn(`[career-application] presign failed with ${res.status}`);
    throw fail(UPLOAD_ERROR, 502);
  }

  const presigned = ((await res.json()) as { data?: PresignedUpload }).data;
  if (!presigned?.url || !presigned?.key) {
    console.warn("[career-application] presign response incomplete");
    throw fail(UPLOAD_ERROR, 502);
  }
  return presigned;
}

/** Step 2: upload the file to private S3 with the presigned POST (fields first, file last). */
async function uploadToS3(presigned: PresignedUpload, file: File, contentType: string) {
  try {
    const s3Form = new FormData();
    for (const [name, value] of Object.entries(presigned.fields)) s3Form.append(name, value);
    s3Form.append("file", new Blob([await file.arrayBuffer()], { type: contentType }), file.name);

    const res = await fetch(presigned.url, { method: "POST", body: s3Form, cache: "no-store" });
    if (!res.ok) throw new Error(`S3 upload failed with ${res.status}`);
  } catch (err) {
    console.warn("[career-application] resume upload to S3 failed:", err instanceof Error ? err.message : err);
    throw fail(UPLOAD_ERROR, 502);
  }
}

/** Step 3: create the application, pointing at the uploaded object. */
async function createApplication(
  authHeaders: HeadersInit,
  values: Record<string, string>,
  presigned: PresignedUpload,
  file: File,
) {
  let res: Response;
  try {
    res = await fetch(`${STRAPI_URL}/api/career-applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({
        data: {
          ...values,
          resumeKey: presigned.key,
          resumeFileName: presigned.fileName ?? file.name,
          sourcePath: "/career",
        },
      }),
      cache: "no-store",
    });
  } catch (err) {
    console.warn("[career-application] Strapi unreachable:", err instanceof Error ? err.message : err);
    throw fail(SERVER_ERROR, 502);
  }
  if (res.ok) return;

  const payload = (await res.json().catch(() => ({}))) as StrapiErrorResponse;
  const fieldErrors = payload.error?.details?.errors;
  if (fieldErrors) throw fail("Invalid submission", 400, firstFieldErrors(fieldErrors));
  throw fail(SERVER_ERROR, 502);
}

/** Validates the text fields and the resume file; returns what the steps need. */
function parseSubmission(form: FormData) {
  const parsed = careerApplicationSchema.safeParse({
    fullName: textField(form, "fullName"),
    email: textField(form, "email"),
    website: textField(form, "website"),
    areaOfInterest: textField(form, "areaOfInterest"),
    linkedinOrPortfolio: textField(form, "linkedinOrPortfolio"),
    message: textField(form, "message"),
    companyName: textField(form, "companyName"),
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    throw fail("Invalid submission", 400, errors);
  }

  const { companyName, ...values } = parsed.data;
  // Honeypot tripped — the caller pretends success so bots can't tell it was dropped.
  if (companyName) return { honeypot: true as const };

  const resume = form.get("resume");
  const file = resume instanceof File ? resume : null;
  const resumeError = validateResumeFile(file);
  if (resumeError || !file) {
    throw fail("Invalid submission", 400, { resume: resumeError ?? "A resume file is required" });
  }
  const contentType = resumeContentType(file);
  if (!contentType) {
    throw fail("Invalid submission", 400, { resume: "Resume must be a PDF or Word document" });
  }
  return { honeypot: false as const, values: values as Record<string, string>, file, contentType };
}

/**
 * Career page "Express interest early" submission.
 *
 * The resume never touches Strapi's media library or a public URL. Flow (all
 * server-side, authenticated with STRAPI_CAREER_API_TOKEN — a token that can
 * only presign a resume upload and create a career application):
 *
 *   1. ask the CMS for a presigned S3 POST for this file (size/type enforced by S3),
 *   2. upload the file straight to private S3 with it,
 *   3. create the application in the CMS, passing the S3 key (`resumeKey`).
 */
export async function POST(request: NextRequest) {
  if (!STRAPI_CAREER_API_TOKEN) {
    console.error("[career-application] STRAPI_CAREER_API_TOKEN is not set — cannot submit applications.");
    return NextResponse.json({ message: SERVER_ERROR }, { status: 503 });
  }
  const authHeaders = { Authorization: `Bearer ${STRAPI_CAREER_API_TOKEN}` };

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


  try {
    const submission = parseSubmission(form);
    if (submission.honeypot) return NextResponse.json({ ok: true }, { status: 200 });

    const { values, file, contentType } = submission;
    const presigned = await presignResume(authHeaders, file, contentType);
    await uploadToS3(presigned, file, contentType);
    await createApplication(authHeaders, values, presigned, file);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    if (err instanceof StepError) return NextResponse.json(err.body, { status: err.status });
    throw err;
  }
}
