import { notFound } from "next/navigation";
import WaitlistPage from "@/components/waitlist/WaitlistPage";
import { homeSans, homeSerif } from "@/components/ui/fonts";
import { getPageBySlug } from "@/lib/cms/queries";

export default async function Page() {
  const page = await getPageBySlug("waitlist");

  if (!page) {
    notFound();
  }

  return (
    <div
      className={`${homeSans.variable} ${homeSerif.variable} ${homeSans.className}`}
    >
      <WaitlistPage sections={page.sections} />
    </div>
  );
}
