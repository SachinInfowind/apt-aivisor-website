import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * Entry point for Strapi's Content Preview feature (see
 * aptaivisor-cms/config/admin.ts `preview.config.handler`). Strapi opens this
 * URL from the admin editor with `url` (the pathname to preview), `secret`,
 * and `status` ("draft" | "published").
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const url = searchParams.get("url");
  const status = searchParams.get("status");

  if (!secret || secret !== process.env.PREVIEW_SECRET || !url) {
    return new Response("Invalid preview token", { status: 401 });
  }

  // Only allow same-origin relative paths — never redirect to an
  // attacker-controlled absolute URL.
  if (!url.startsWith("/")) {
    return new Response("Invalid url", { status: 400 });
  }

  const draft = await draftMode();
  if (status === "published") {
    draft.disable();
  } else {
    draft.enable();
  }

  redirect(url);
}
