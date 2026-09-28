import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SolutionsPage from "@/components/solutions/SolutionsPage";
import { homeSans, homeSerif } from "@/components/ui/fonts";
import { getPageBySlug } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Solutions",
};

export default async function Page() {
  const page = await getPageBySlug("solutions");

  if (!page) {
    notFound();
  }

  return (
    <div
      className={`${homeSans.variable} ${homeSerif.variable} ${homeSans.className}`}
    >
      <SolutionsPage sections={page.sections} />
    </div>
  );
}
