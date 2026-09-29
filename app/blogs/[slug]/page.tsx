import { notFound } from "next/navigation";
import BlogPostPage from "@/components/blogs/BlogPostPage";
import { homeSans, homeSerif } from "@/components/ui/fonts";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/cms/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.seo?.metaTitle || `${post.title} | aptAI Solutions`,
    description: post.seo?.metaDescription || post.excerpt,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(slug, 3);

  return (
    <div
      className={`${homeSans.variable} ${homeSerif.variable} ${homeSans.className}`}
    >
      <BlogPostPage post={post} relatedPosts={relatedPosts} />
    </div>
  );
}
