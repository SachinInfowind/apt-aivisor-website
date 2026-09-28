import { NotFoundContent } from "./NotFoundContent";

/**
 * 404 page — Figma “404 error” (1:19276).
 * Content only — no Header / Footer.
 */
export default function NotFoundPage() {
  return (
    <div
      id="top"
      className="relative min-h-screen w-full overflow-x-clip bg-white font-body antialiased"
    >
      <main className="w-full">
        <NotFoundContent />
      </main>
    </div>
  );
}
