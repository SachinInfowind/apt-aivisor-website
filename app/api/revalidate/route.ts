import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface StrapiWebhookPayload {
  model?: string;
  entry?: {
    slug?: string;
  };
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.STRAPI_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const payload = (await request.json()) as StrapiWebhookPayload;

  revalidateTag("cms", "max");

  if (payload.model === "page") {
    revalidateTag("pages", "max");
    if (payload.entry?.slug) {
      revalidateTag(`page:${payload.entry.slug}`, "max");
    }
  }

  if (payload.model === "global") {
    revalidateTag("global", "max");
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
