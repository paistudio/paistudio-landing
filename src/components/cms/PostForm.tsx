"use client";

import { useState, useTransition, useActionState, type FormEvent } from "react";
import { ImageIcon } from "@phosphor-icons/react/dist/ssr";
import { createBlogPost, updateBlogPost, type CreatePostState } from "@/lib/actions/cms-blog-actions";
import { BlockEditor } from "./BlockEditor";
import { BlogAuthorRow } from "@/components/blog/BlogAuthorRow";
import { ImageUploadButton } from "./ImageUploadButton";
import { slugify } from "@/lib/cms/slugify";
import type { ArticleBlock } from "@/types/blog";
import type { CmsBlogPostRow } from "@/lib/data/cms-blog-posts";

type Author = { name: string; role: string; hue: number };

/** `published_at` comes back from the driver as a `Date` parsed at local
 * midnight (a plain `DATE` column has no timezone of its own). Reading it
 * with UTC-based methods (`toISOString`) shifts it a day on any host
 * whose local timezone is behind UTC — read the local calendar fields
 * instead, which round-trips exactly regardless of host timezone. */
function toDateInputValue(value: string | Date): string {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const fieldClass =
  "w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-text transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

/** Single scrollable property list (label left, control right, one row per
 * field) instead of separate boxed cards — easier to scan down a long form
 * than stacked label-above-input groups, on request ("layout lebih gampang
 * untuk scanning"), same pattern as the Work CMS's ProjectForm.tsx. */
function FormPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(3,105,161,0.06)]">
      {children}
    </div>
  );
}

/** A group header *row* inside the panel (e.g. "Media", "Author") — not a
 * separate card, just a labeled break in the one continuous list. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-ink/10 bg-cream/40 px-6 py-3 text-[11px] font-medium tracking-[0.04em] text-muted uppercase">
      {children}
    </div>
  );
}

/** One property row: label in a fixed-width left column, control in the
 * right column. */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[220px_1fr] items-start gap-6 border-b border-ink/10 px-6 py-5 last:border-0 max-[640px]:grid-cols-1 max-[640px]:gap-2">
      <span className="pt-2 text-sm font-medium text-text">{label}</span>
      <div className="flex flex-col gap-2 text-sm text-text">{children}</div>
    </div>
  );
}

function ImagePathField({
  label,
  name,
  value,
  onChange,
  uploadHint,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  uploadHint: string;
}) {
  return (
    <Field label={label}>
      <div className="flex gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cream">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-typed path, informational preview only
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
              onLoad={(e) => {
                e.currentTarget.style.visibility = "visible";
              }}
            />
          ) : (
            <ImageIcon size={16} className="text-muted" />
          )}
        </div>
        <input
          name={name}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={fieldClass}
        />
      </div>
      <ImageUploadButton hint={uploadHint} onUploaded={onChange} />
    </Field>
  );
}

function ToggleSwitch({ checked, onChange, name }: { checked: boolean; onChange: (checked: boolean) => void; name: string }) {
  return (
    <label className="flex w-fit cursor-pointer items-center gap-2.5">
      <span className="relative inline-flex h-5 w-9 shrink-0 items-center">
        <input
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-cream transition-colors peer-checked:bg-brand" />
        <span className="absolute left-0.5 h-4 w-4 rounded-full bg-paper shadow transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  );
}

export function PostForm({
  authors,
  initialPost,
}: {
  authors: Author[];
  initialPost?: CmsBlogPostRow;
}) {
  const action = initialPost ? updateBlogPost.bind(null, initialPost.slug) : createBlogPost;
  const [state, dispatch] = useActionState<CreatePostState, FormData>(action, { error: null });
  const [, startTransition] = useTransition();

  const [coverImage, setCoverImage] = useState(initialPost?.cover_image ?? "");
  const [heroImage, setHeroImage] = useState(initialPost?.hero_image ?? "");
  const [authorName, setAuthorName] = useState(initialPost?.author_name ?? "");
  const [authorRole, setAuthorRole] = useState(initialPost?.author_role ?? "");
  const [authorHue, setAuthorHue] = useState(initialPost?.author_hue ?? 0);
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  // On create, the slug auto-follows the title until the user edits the
  // slug field directly — same UX WordPress uses. On edit, a real slug
  // already exists, so it never auto-follows title edits.
  const [slugTouched, setSlugTouched] = useState(Boolean(initialPost));
  const [isFeatured, setIsFeatured] = useState(Boolean(initialPost?.is_featured));

  const initialDate = initialPost ? toDateInputValue(initialPost.published_at) : "";

  // Submitting through a plain onSubmit + manual dispatch (instead of the
  // <form action={fn}> prop) avoids React's built-in form-reset: React
  // resets every uncontrolled field the instant an action-bound form is
  // submitted (react-dom-client's startHostTransition calls
  // requestFormReset unconditionally, before the action even runs), which
  // silently wiped every field except the block list on any inline error
  // (e.g. a slug collision) — violates the spec's "entered values
  // preserved" requirement. This path never triggers that reset.
  //
  // Two submit buttons ("Save as Draft" / "Publish") share this one form,
  // each carrying its own `name="status" value="draft"|"published"` —
  // passing the native event's `submitter` into the `FormData` constructor
  // is what makes only the *clicked* button's status value end up in the
  // submitted data (the standard way multiple submit buttons on one form
  // disambiguate which one fired, per the HTML form-submission spec).
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const formData = new FormData(event.currentTarget, submitter ?? undefined);
    startTransition(() => {
      dispatch(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {state.error && (
        <p className="rounded-xl bg-cream px-4 py-3 text-sm text-text">{state.error}</p>
      )}

      <FormPanel>
        <SectionLabel>Content</SectionLabel>
        <Field label="Title">
          <input
            name="title"
            required
            defaultValue={initialPost?.title}
            onChange={(e) => {
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={`${fieldClass} text-base font-medium`}
          />
        </Field>
        <Field label="Slug">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-sm text-muted">/blog/</span>
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className={`${fieldClass} font-mono text-sm`}
            />
          </div>
          {initialPost && (
            <p className="text-xs text-muted">
              Changing this breaks the post&apos;s existing public URL for anyone who already has it.
            </p>
          )}
        </Field>
        <Field label="Description">
          <textarea
            name="description"
            required
            rows={2}
            defaultValue={initialPost?.description}
            className={fieldClass}
          />
        </Field>

        <SectionLabel>Details</SectionLabel>
        <Field label="Tag (primary category)">
          <input name="tag" required defaultValue={initialPost?.tag} className={fieldClass} />
        </Field>
        <Field label="Tags (comma-separated)">
          <input name="tags" defaultValue={initialPost?.tags.join(", ")} className={fieldClass} />
        </Field>
        <Field label="Published date">
          <input name="publishedAt" type="date" required defaultValue={initialDate} className={fieldClass} />
        </Field>
        <Field label="Read time">
          <input
            name="readTime"
            required
            placeholder='e.g. "6 min read"'
            defaultValue={initialPost?.read_time}
            className={fieldClass}
          />
        </Field>

        <SectionLabel>Media</SectionLabel>
        <ImagePathField
          label="Cover image path"
          name="coverImage"
          value={coverImage}
          onChange={setCoverImage}
          uploadHint={`${initialPost?.slug ?? "new-post"}-cover`}
        />
        <ImagePathField
          label="Hero image path"
          name="heroImage"
          value={heroImage}
          onChange={setHeroImage}
          uploadHint={`${initialPost?.slug ?? "new-post"}-hero`}
        />

        <SectionLabel>Author</SectionLabel>
        <Field label="Preview">
          <div className="rounded-xl bg-cream/50 p-3">
            <BlogAuthorRow
              author={{ name: authorName || "Author name", role: authorRole, hue: Number(authorHue) || 0 }}
              meta={authorRole || "Role"}
            />
          </div>
        </Field>
        <Field label="Name">
          <input
            name="authorName"
            list="known-authors"
            required
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className={fieldClass}
          />
          <datalist id="known-authors">
            {Array.from(new Set(authors.map((author) => author.name))).map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </Field>
        <Field label="Role">
          <input
            name="authorRole"
            required
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field label="Avatar hue">
          <input
            name="authorHue"
            type="number"
            min={0}
            max={2}
            value={authorHue}
            onChange={(e) => setAuthorHue(Number(e.target.value))}
            className={fieldClass}
          />
        </Field>

        <SectionLabel>Publishing</SectionLabel>
        <Field label="Featured post">
          <ToggleSwitch name="isFeatured" checked={isFeatured} onChange={setIsFeatured} />
        </Field>
        {initialPost && (
          <Field label="Status">
            {/* Informational only — status itself is set by which button
                below is clicked ("Save as Draft" / "Publish"), not by a
                separate control here. */}
            {initialPost.status === "published" ? (
              <span className="inline-flex w-fit items-center rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
                Currently published
              </span>
            ) : (
              <span className="inline-flex w-fit items-center rounded-full bg-cream px-3 py-1 text-xs font-medium text-muted">
                Currently a draft
              </span>
            )}
          </Field>
        )}

        <SectionLabel>Body</SectionLabel>
        <div className="px-6 py-5">
          <BlockEditor initialBlocks={(initialPost?.body as ArticleBlock[]) ?? []} />
        </div>
      </FormPanel>

      <div className="sticky bottom-0 z-10 flex items-center justify-between rounded-2xl border border-ink/10 bg-paper p-5 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <a href="/cms" className="text-sm text-muted hover:text-text">
          ← Back to CMS
        </a>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            name="status"
            value="draft"
            className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-6 py-2.5 text-sm font-semibold text-text transition-colors hover:bg-cream"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            name="status"
            value="published"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-deep"
          >
            Publish
          </button>
        </div>
      </div>
    </form>
  );
}
