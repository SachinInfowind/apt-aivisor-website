import { notFound } from "next/navigation";
import Home from "@/components/home/HomePage";
import { homeSans, homeSerif } from "@/components/ui/fonts";
import { getPageBySlug } from "@/lib/cms/queries";

export default async function Page() {
  const page = await getPageBySlug("home");

  if (!page) {
    notFound();
  }

  return (
    <div className={`${homeSans.variable} ${homeSerif.variable} ${homeSans.className}`}>
      <Home sections={page.sections} />
    </div>
  );
}
