import BlogsPage from "@/components/blogs/BlogsPage";
import { homeSans, homeSerif } from "@/components/ui/fonts";
import { getBlogPosts } from "@/lib/cms/queries";

export const metadata = {
  title: "Resource Library | aptAI Solutions",
  description:
    "Subscribe to learn about new product features, the latest in technology, solutions, and updates.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { posts, pageCount } = await getBlogPosts(page);

  return (
    <div
      className={`${homeSans.variable} ${homeSerif.variable} ${homeSans.className}`}
    >
      <BlogsPage posts={posts} page={page} pageCount={pageCount} />
    </div>
  );
}
