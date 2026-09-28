import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

async function exitPreview() {
  "use server";
  const draft = await draftMode();
  draft.disable();
  redirect("/");
}

export async function PreviewBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <div className="sticky top-0 z-[100] flex items-center justify-center gap-3 bg-brand px-4 py-2 text-sm font-medium text-white">
      <span>Preview mode — showing draft content from Strapi.</span>
      <form action={exitPreview}>
        <button
          type="submit"
          className="rounded-full border border-white/60 px-3 py-0.5 text-xs font-semibold transition-colors hover:bg-white/10"
        >
          Exit preview
        </button>
      </form>
    </div>
  );
}
