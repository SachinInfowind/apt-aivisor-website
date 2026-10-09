import { validateResumeFile } from "@/lib/validation/careerApplication";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";

export class UploadError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors?: Record<string, string>,
  ) {
    super(message);
  }
}

const UPLOAD_ERROR = "We couldn't upload your document right now — please try again shortly.";

// Some browsers send an empty `type` for .doc/.docx — fall back to the extension.
const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function contentTypeOf(file: File): string | null {
  if (file.type) return file.type;
  return CONTENT_TYPE_BY_EXTENSION[file.name.split(".").pop()?.toLowerCase() ?? ""] ?? null;
}

/**
 * Stores a PDF/Word document in the CMS's private storage and returns its key.
 * Server-side only: asks the CMS for a presigned S3 POST (size/type enforced by S3, using the
 * token that may presign uploads), then uploads the file with it. The CMS later checks the key.
 */
export async function uploadPrivateDocument(
  file: File,
  token: string,
  field = "document",
): Promise<{ key: string; fileName: string }> {
  const invalid = (message: string) => new UploadError("Invalid submission", 400, { [field]: message });
  const fileError = validateResumeFile(file);
  if (fileError) throw invalid(fileError.replace("Resume", "Document").replace("A resume file", "A document"));
  const contentType = contentTypeOf(file);
  if (!contentType) throw invalid("Document must be a PDF or Word document");

  let res: Response;
  try {
    res = await fetch(`${STRAPI_URL}/api/career-applications/resume-upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ fileName: file.name, contentType, size: file.size }),
      cache: "no-store",
    });
  } catch (err) {
    console.warn("[upload] presign unreachable:", err instanceof Error ? err.message : err);
    throw new UploadError(UPLOAD_ERROR, 502);
  }
  if (res.status === 400) throw invalid("Invalid document file");
  if (!res.ok) {
    console.warn(`[upload] presign failed with ${res.status}`);
    throw new UploadError(UPLOAD_ERROR, 502);
  }
  const presigned = ((await res.json()) as {
    data?: { key: string; url: string; fields: Record<string, string>; fileName?: string };
  }).data;
  if (!presigned?.url || !presigned?.key) throw new UploadError(UPLOAD_ERROR, 502);

  try {
    const s3Form = new FormData();
    for (const [name, value] of Object.entries(presigned.fields)) s3Form.append(name, value);
    s3Form.append("file", new Blob([await file.arrayBuffer()], { type: contentType }), file.name);
    const up = await fetch(presigned.url, { method: "POST", body: s3Form, cache: "no-store" });
    if (!up.ok) throw new Error(`S3 upload failed with ${up.status}`);
  } catch (err) {
    console.warn("[upload] upload to storage failed:", err instanceof Error ? err.message : err);
    throw new UploadError(UPLOAD_ERROR, 502);
  }
  return { key: presigned.key, fileName: presigned.fileName ?? file.name };
}
