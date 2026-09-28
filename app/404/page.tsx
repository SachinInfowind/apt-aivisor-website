import type { Metadata } from "next";
import NotFoundPage from "@/components/not-found/NotFoundPage";
import { homeSans, homeSerif } from "@/components/ui/fonts";

export const metadata: Metadata = {
  title: "Page not found | aptAI Solutions",
  description: "Sorry, the page you are looking for doesn't exist.",
};

/** Explicit /404 route for preview; unknown paths still use app/not-found.tsx */
export default function Page() {
  return (
    <div
      className={`${homeSans.variable} ${homeSerif.variable} ${homeSans.className}`}
    >
      <NotFoundPage />
    </div>
  );
}
