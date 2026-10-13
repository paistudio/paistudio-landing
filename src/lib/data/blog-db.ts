import { sql } from "@vercel/postgres";
import type { ArticleBlock, ArticleTocEntry, BlogPost, BlogPostAuthor, BlogPostDetail } from "@/types/blog";

export { sql };

/** Shape of a row from the `blog_posts` table (see
 * scripts/setup-blog-db.mjs for the schema/seed). `toc`/`body` are stored
 * as JSONB — Postgres returns them already parsed as JS values via
 * @vercel/postgres, no manual JSON.parse needed. */
export type BlogPostRow = {
  slug: string;
  tag: string;
  tags: string[];
  published_at: string | Date;
  title: string;
  description: string;
  cover_image: string;
  hero_image: string;
  author_name: string;
  author_role: string;
  author_hue: number;
  read_time: string;
  is_featured: boolean;
  toc: ArticleTocEntry[];
  body: ArticleBlock[];
};

export { formatPublishedDate } from "@/lib/format-published-date";
import { formatPublishedDate } from "@/lib/format-published-date";

function rowToAuthor(row: BlogPostRow): BlogPostAuthor {
  return { name: row.author_name, role: row.author_role, hue: row.author_hue };
}

export function rowToBlogPost(row: BlogPostRow): BlogPost {
  return {
    slug: row.slug,
    tag: row.tag,
    date: formatPublishedDate(row.published_at),
    title: row.title,
    description: row.description,
    coverImage: row.cover_image,
    author: rowToAuthor(row),
    readTime: row.read_time,
  };
}

export function rowToBlogPostDetail(row: BlogPostRow): BlogPostDetail {
  return {
    ...rowToBlogPost(row),
    tags: row.tags,
    heroImage: row.hero_image,
    toc: row.toc,
    body: row.body,
  };
}
