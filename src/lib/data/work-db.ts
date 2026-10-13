import { sql } from "@vercel/postgres";
import type { Project, ProjectCategory, ProjectDetail, ProjectImageRef, ProjectTestimonial } from "@/types/work";

export { sql };

/** Shape of a row from the `work_projects` table (see
 * scripts/setup-work-db.mjs for the original list-card columns and
 * scripts/merge-work-tables.mjs for the detail-page columns merged in
 * later). `curved_image`/`testimonial_image`/`testimonial`/
 * `full_width_image`/`split_images` are JSONB — Postgres returns them
 * already parsed via @vercel/postgres, no manual JSON.parse needed. */
export type WorkProjectRow = {
  slug: string;
  title: string;
  description: string;
  cover_image: string;
  index_thumbnail: string | null;
  showcase_images: string[];
  tags: string[];
  badge: string | null;
  categories: string[];
  is_visible: boolean;
  sort_order: number;
  detail_title: string;
  detail_description: string;
  curved_image: ProjectImageRef;
  testimonial_image: ProjectImageRef;
  testimonial: ProjectTestimonial | null;
  rich_text: string[];
  full_width_image: ProjectImageRef;
  split_images: [ProjectImageRef, ProjectImageRef];
};

export function rowToProject(row: WorkProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    coverImage: row.cover_image,
    indexThumbnail: row.index_thumbnail ?? undefined,
    showcaseImages: row.showcase_images,
    tags: row.tags,
    badge: row.badge ?? undefined,
    // Written only by the CMS form's fixed checkbox options (see
    // PROJECT_CATEGORIES), so this cast is safe.
    categories: row.categories as ProjectCategory[],
  };
}

export function rowToProjectDetail(row: WorkProjectRow): ProjectDetail {
  return {
    ...rowToProject(row),
    detailTitle: row.detail_title,
    detailDescription: row.detail_description,
    curvedImage: row.curved_image,
    testimonialImage: row.testimonial_image,
    testimonial: row.testimonial ?? undefined,
    richText: row.rich_text,
    fullWidthImage: row.full_width_image,
    splitImages: row.split_images,
  };
}
