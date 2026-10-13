import Link from "next/link";
import { NewspaperIcon } from "@phosphor-icons/react/dist/ssr";
import { getAllBlogPostsForCms } from "@/lib/data/cms-blog-posts";
import { BlogPostsDataTable } from "@/components/cms/BlogPostsDataTable";

export const revalidate = 0;

export default async function CmsPage() {
  const posts = await getAllBlogPostsForCms();
  const draftCount = posts.filter((post) => post.status === "draft").length;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Blog CMS</h1>
        <p className="mt-1 text-sm text-muted">
          {posts.length === 0
            ? "No posts yet"
            : `${posts.length} ${posts.length === 1 ? "post" : "posts"}${
                draftCount > 0 ? ` · ${draftCount} draft${draftCount === 1 ? "" : "s"}` : ""
              }`}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 py-16 text-center">
          <NewspaperIcon size={32} weight="thin" className="text-muted" />
          <p className="text-sm text-muted">No posts yet — create the first one.</p>
          <Link
            href="/cms/new"
            className="mt-1 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/90"
          >
            New Post
          </Link>
        </div>
      ) : (
        <BlogPostsDataTable posts={posts} />
      )}
    </div>
  );
}
