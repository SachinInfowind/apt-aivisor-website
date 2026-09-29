import "server-only";
import qs from "qs";
import { fetchList, fetchSingle, fetchPaginatedList, cmsPost } from "./client";
import type { CmsGlobal, CmsPage, BlogPost } from "./types";

const SECTIONS_POPULATE = {
  on: {
    "sections.hero": { populate: ["image"] },
    "sections.stats": { populate: ["items"] },
    "sections.faq": { populate: ["items"] },
    "sections.feature-table": true,
    "sections.card-grid": { populate: { items: { populate: ["icon"] } } },
    "sections.team": { populate: { members: { populate: ["photo"] } } },
    "sections.cta": true,
    "sections.rich-text": true,
    "sections.founder-highlight": true,
    "sections.contact-hero": { populate: ["contactMethods"] },
    "sections.confirmation": { populate: ["steps"] },
    "sections.home-hero": true,
    "sections.founder-spotlight": { populate: ["highlights", "founderPhoto"] },
    "sections.waitlist": true,
    "sections.waitlist-hero": true,
    "sections.waitlist-perks": {
      populate: { items: { populate: ["icon"] } },
    },
    "sections.waitlist-form": true,
    "sections.problem-grid": { populate: { items: { populate: ["icon"] } } },
    "sections.pricing-catalog": { populate: ["plans", "addons"] },
    "sections.career-roles": { populate: ["image"] },
    "sections.career-open-call": { populate: ["image"] },
    "sections.who-it-is-for": { populate: { personas: { populate: ["avatars"] } } },
    "sections.trust-hero": { populate: { features: { populate: ["icon"] } } },
    "sections.trust-benchmark": { populate: ["steps"] },
    "sections.trust-controls": { populate: ["rows"] },
    "sections.trust-faq": { populate: ["items"] },
    "sections.trust-cta": true,
    "sections.trust-notes": { populate: ["notes"] },
    "sections.team-hero": true,
    "sections.solutions-hero": { populate: ["audiences"] },
    "sections.solutions-features": { populate: ["points", "image"] },
    "sections.solutions-workflows": { populate: { items: { populate: ["image"] } } },
    "sections.solutions-partner": { populate: ["items"] },
    "sections.solutions-security": { populate: { items: { populate: ["icon"] } } },
    "sections.solutions-founder": { populate: { tabs: { populate: ["features", "image"] } } },
    "sections.solutions-cta": { populate: ["image"] },
    "sections.legal-hero": true,
    "sections.legal-body": { populate: ["blocks"] },
    "sections.team-roster": {
      populate: { members: { populate: ["photo", "brands"] } },
    },
  },
};

export async function getPageBySlug(slug: string): Promise<CmsPage | null> {
  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: {
        seo: { populate: ["ogImage"] },
        sections: SECTIONS_POPULATE,
      },
    },
    { encodeValuesOnly: true },
  );

  const pages = await fetchList<CmsPage>(`/api/pages?${query}`, {
    tags: [`page:${slug}`],
  });

  const page = pages[0] ?? null;

  return page;
}

export async function getAllPageSlugs(): Promise<string[]> {
  const query = qs.stringify({ fields: ["slug"] }, { encodeValuesOnly: true });
  const pages = await fetchList<{ slug: string }>(`/api/pages?${query}`, {
    tags: ["pages"],
  });
  return pages.map((page) => page.slug);
}

export async function getGlobal(): Promise<CmsGlobal | null> {
  const query = qs.stringify(
    {
      populate: {
        navLinks: true,
        aboutMegaMenu: {
          populate: {
            company: { populate: ["items"] },
            resources: { populate: ["items"] },
            featured: true,
          },
        },
        footerColumns: { populate: ["links"] },
        socialLinks: true,
        seo: { populate: ["ogImage"] },
      },
    },
    { encodeValuesOnly: true },
  );

  return fetchSingle<CmsGlobal>(`/api/global?${query}`, { tags: ["global"] });
}

const BLOG_POSTS_PAGE_SIZE = 10;

export async function getBlogPosts(page = 1): Promise<{
  posts: BlogPost[];
  page: number;
  pageCount: number;
}> {
  const query = qs.stringify(
    {
      populate: {
        coverImage: true,
        category: true,
        author: { populate: ["avatar"] },
      },
      sort: ["publishedAt:desc"],
      pagination: { page, pageSize: BLOG_POSTS_PAGE_SIZE },
    },
    { encodeValuesOnly: true },
  );

  const { data, pagination } = await fetchPaginatedList<BlogPost>(
    `/api/blog-posts?${query}`,
    { tags: ["blog-posts"] },
  );

  return { posts: data, page: pagination.page, pageCount: pagination.pageCount };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: {
        coverImage: true,
        category: true,
        author: { populate: ["avatar"] },
        seo: { populate: ["ogImage"] },
      },
    },
    { encodeValuesOnly: true },
  );

  const posts = await fetchList<BlogPost>(`/api/blog-posts?${query}`, {
    tags: [`blog-post:${slug}`],
  });

  return posts[0] ?? null;
}

export async function getRelatedBlogPosts(
  excludeSlug: string,
  limit = 3,
): Promise<BlogPost[]> {
  const query = qs.stringify(
    {
      filters: { slug: { $ne: excludeSlug } },
      populate: {
        coverImage: true,
        category: true,
        author: { populate: ["avatar"] },
      },
      sort: ["publishedAt:desc"],
      pagination: { page: 1, pageSize: limit },
    },
    { encodeValuesOnly: true },
  );

  return fetchList<BlogPost>(`/api/blog-posts?${query}`, {
    tags: ["blog-posts"],
  });
}

/** Fire-and-forget — increments the post's view count server-side. */
export async function incrementBlogPostView(slug: string): Promise<void> {
  await cmsPost(`/api/blog-posts/${encodeURIComponent(slug)}/view`);
}
