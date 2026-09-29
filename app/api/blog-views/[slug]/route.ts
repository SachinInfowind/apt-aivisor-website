import { NextRequest, NextResponse } from "next/server";
import { incrementBlogPostView } from "@/lib/cms/queries";

const VIEWED_COOKIE_MAX_AGE = 60 * 60 * 24; // 24h — one counted view per visitor per post per day

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const cookieName = `viewed_${slug}`;

  if (request.cookies.get(cookieName)) {
    return NextResponse.json({ counted: false });
  }

  await incrementBlogPostView(slug);

  const res = NextResponse.json({ counted: true });
  res.cookies.set(cookieName, "1", {
    maxAge: VIEWED_COOKIE_MAX_AGE,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  return res;
}
