import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CookiesPage from "@/components/cookies/CookiesPage";
import { homeSans, homeSerif } from "@/components/ui/fonts";
import { getPageBySlug } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How aptAIvisor uses cookies and similar technologies on the website and application.",
};

export default async function Page() {
  const page = await getPageBySlug("cookies");

  if (!page) {
    notFound();
  }

  return (
    <div
      className={`${homeSans.variable} ${homeSerif.variable} ${homeSans.className}`}
    >
      <CookiesPage sections={page.sections} />
    </div>
  );
}
