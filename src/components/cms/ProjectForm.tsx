"use client";

import { useActionState, useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { ImageIcon, LinkIcon, PlusIcon, TextBIcon, TextItalicIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { createWorkProject, updateWorkProject, type WorkPostState } from "@/lib/actions/cms-work-actions";
import { ImageUploadButton } from "./ImageUploadButton";
import { slugify } from "@/lib/cms/slugify";
import { PROJECT_CATEGORIES, type ProjectImageRef, type ProjectTestimonial } from "@/types/work";
import type { WorkProjectRow } from "@/lib/data/work-db";

const fieldClass =
  "w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-text transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

/** Single scrollable property list (label left, control right, one row per
 * field) instead of separate boxed cards — easier to scan down a long form
 * than stacked label-above-input groups, on request ("layout lebih gampang
 * untuk scanning"). `overflow-hidden` so the first/last row's content still
 * respects the panel's own rounded corners. */
function FormPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(3,105,161,0.06)]">
      {children}
    </div>
  );
}

/** A group header *row* inside the panel (e.g. "Media", "Testimonial") —
 * not a separate card, just a labeled break in the one continuous list. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-ink/10 bg-cream/40 px-6 py-3 text-[11px] font-medium tracking-[0.04em] text-muted uppercase">
      {children}
    </div>
  );
}

/** One property row: label in a fixed-width left column, control in the
 * right column. The building block every field in this form renders
 * through — directly, or via a component (`ImagePathField`, etc.) that
 * wraps itself in one. */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[220px_1fr] items-start gap-6 border-b border-ink/10 px-6 py-5 last:border-0 max-[640px]:grid-cols-1 max-[640px]:gap-2">
      <span className="pt-2 text-sm font-medium text-text">{label}</span>
      <div className="flex flex-col gap-2 text-sm text-text">{children}</div>
    </div>
  );
}

/** An action row (e.g. "Add showcase image") — same horizontal rhythm as a
 * `Field` row but with no left-column label, since it isn't a property. */
function ActionRow({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-ink/10 px-6 py-4 last:border-0">{children}</div>;
}

/** The actual preview + path input + upload button — no label of its own.
 * Used directly by `ImagePathField` (wrapped in one `Field` row) and by
 * `ImageRefFields` (embedded alongside an alt-text input inside one
 * shared `Field` row, so the pair reads as a single property). */
function ImagePathControl({
  name,
  value,
  onChange,
  uploadHint,
  required = true,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  uploadHint: string;
  required?: boolean;
}) {
  return (
    <>
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
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={fieldClass}
        />
      </div>
      <ImageUploadButton hint={uploadHint} onUploaded={onChange} folder="work" />
    </>
  );
}

function ImagePathField({
  label,
  name,
  value,
  onChange,
  uploadHint,
  required = true,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  uploadHint: string;
  required?: boolean;
}) {
  return (
    <Field label={label}>
      <ImagePathControl name={name} value={value} onChange={onChange} uploadHint={uploadHint} required={required} />
    </Field>
  );
}

/** Src + alt pair, with an upload button — used for the four single
 * ProjectImageRef fields (curved/testimonial/full-width/each split image).
 * Both the image control and the alt input live in one `Field` row's
 * right column, so the pair reads as a single property, not two. */
function ImageRefFields({
  label,
  srcName,
  altName,
  value,
  onChange,
  uploadHint,
}: {
  label: string;
  srcName: string;
  altName: string;
  value: ProjectImageRef;
  onChange: (next: ProjectImageRef) => void;
  uploadHint: string;
}) {
  return (
    <Field label={label}>
      <ImagePathControl
        name={srcName}
        value={value.src}
        onChange={(src) => onChange({ ...value, src })}
        uploadHint={uploadHint}
      />
      <input
        name={altName}
        placeholder="Alt text"
        value={value.alt}
        onChange={(e) => onChange({ ...value, alt: e.target.value })}
        className={fieldClass}
      />
    </Field>
  );
}

/** A repeatable list of plain image paths (work_projects.showcase_images —
 * unlike the detail-page image refs, these have no alt text of their own).
 * Each image is its own `Field` row ("Showcase image 1", "Showcase image
 * 2", ...) under the "Media" section header, same pattern the reference
 * layout uses for repeatable gallery slots. Submits as one hidden JSON
 * field, same pattern as BlockEditor's blocksJson. */
function ShowcaseImagesEditor({
  initial,
  uploadHintPrefix,
}: {
  initial: string[];
  uploadHintPrefix: string;
}) {
  const [images, setImages] = useState<string[]>(initial);

  function updateAt(index: number, value: string) {
    setImages((prev) => prev.map((img, i) => (i === index ? value : img)));
  }
  function removeAt(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <>
      <input type="hidden" name="showcaseImagesJson" value={JSON.stringify(images)} />
      {images.map((src, index) => (
        <Field key={index} label={`Showcase image ${index + 1}`}>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <ImagePathControl
                name={`showcaseImage${index}`}
                value={src}
                onChange={(value) => updateAt(index, value)}
                uploadHint={`${uploadHintPrefix}-showcase-${index}`}
                required={false}
              />
            </div>
            <button
              type="button"
              aria-label={`Remove showcase image ${index + 1}`}
              onClick={() => removeAt(index)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-cream hover:text-text"
            >
              <XIcon size={14} />
            </button>
          </div>
        </Field>
      ))}
      <ActionRow>
        <button
          type="button"
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-ink/10 px-3.5 py-1.5 text-sm font-medium text-text transition hover:bg-cream"
          onClick={() => setImages((prev) => [...prev, ""])}
        >
          <PlusIcon size={12} />
          Add showcase image
        </button>
      </ActionRow>
    </>
  );
}

function RichTextToolbarButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof TextBIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      // Losing contentEditable's selection before the command runs is what
      // execCommand needs the selection for — mousedown fires (and would
      // blur the field) before click, so prevent that default here.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition hover:bg-paper hover:text-text"
    >
      <Icon size={14} />
    </button>
  );
}

/** One paragraph's editable field — bold/italic/link only (this project's
 * own notion of "rich text" elsewhere, e.g. BlockEditor.tsx's block types,
 * is structural, not inline formatting, so there's no existing pattern to
 * match; a full WYSIWYG library wasn't wanted here, so this uses the
 * browser's native `execCommand` instead of a new dependency).
 *
 * Deliberately uncontrolled after mount: `initialHtml` seeds the DOM via
 * `innerHTML` once in an effect with an empty dependency array, and
 * `onInput` reads back `innerHTML` imperatively. Making this a normal
 * React-controlled element (feeding the live `html` state back in via
 * `dangerouslySetInnerHTML` on every keystroke) would reset the cursor to
 * the start of the field after every character — a well-known
 * contentEditable-in-React pitfall. */
function RichParagraphField({
  label,
  initialHtml,
  onChange,
}: {
  label: string;
  initialHtml: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = initialHtml;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed once on mount; the field owns its DOM content after that
  }, []);

  function exec(command: string, value?: string) {
    ref.current?.focus();
    document.execCommand(command, false, value);
    onChange(ref.current?.innerHTML ?? "");
  }

  function handleLink() {
    const url = window.prompt("Link URL");
    if (url) exec("createLink", url);
  }

  return (
    <div className="flex-1 overflow-hidden rounded-lg border border-ink/10 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
      <div className="flex items-center gap-1 border-b border-ink/10 bg-cream/50 px-2 py-1">
        <RichTextToolbarButton icon={TextBIcon} label="Bold" onClick={() => exec("bold")} />
        <RichTextToolbarButton icon={TextItalicIcon} label="Italic" onClick={() => exec("italic")} />
        <RichTextToolbarButton icon={LinkIcon} label="Link" onClick={handleLink} />
      </div>
      <div
        ref={ref}
        role="textbox"
        aria-multiline="true"
        aria-label={label}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML ?? "")}
        className="min-h-[88px] px-3 py-2 text-sm text-text outline-none [&_a]:text-brand [&_a]:underline"
      />
    </div>
  );
}

/** A repeatable list of paragraphs (work_projects.rich_text), each with
 * inline bold/italic/link formatting — stored as an HTML string per
 * paragraph, same shape (`string[]`) the column already has. Each
 * paragraph is its own `Field` row, same pattern as `ShowcaseImagesEditor`.
 * Submits as one hidden JSON field, same pattern as BlockEditor.tsx's
 * `blocksJson`. */
function RichTextEditor({ initial }: { initial: string[] }) {
  const [paragraphs, setParagraphs] = useState<{ id: string; html: string }[]>(() =>
    (initial.length > 0 ? initial : [""]).map((html) => ({ id: crypto.randomUUID(), html })),
  );

  function updateAt(id: string, html: string) {
    setParagraphs((prev) => prev.map((p) => (p.id === id ? { ...p, html } : p)));
  }
  function removeAt(id: string) {
    setParagraphs((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <>
      <input type="hidden" name="richTextJson" value={JSON.stringify(paragraphs.map((p) => p.html))} />
      {paragraphs.map((p, index) => (
        <Field key={p.id} label={`Paragraph ${index + 1}`}>
          <div className="flex items-start gap-2">
            <RichParagraphField
              label={`Paragraph ${index + 1}`}
              initialHtml={p.html}
              onChange={(html) => updateAt(p.id, html)}
            />
            <button
              type="button"
              aria-label={`Remove paragraph ${index + 1}`}
              onClick={() => removeAt(p.id)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-cream hover:text-text"
            >
              <XIcon size={14} />
            </button>
          </div>
        </Field>
      ))}
      <ActionRow>
        <button
          type="button"
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-ink/10 px-3.5 py-1.5 text-sm font-medium text-text transition hover:bg-cream"
          onClick={() => setParagraphs((prev) => [...prev, { id: crypto.randomUUID(), html: "" }])}
        >
          <PlusIcon size={12} />
          Add paragraph
        </button>
      </ActionRow>
    </>
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

const EMPTY_IMAGE_REF: ProjectImageRef = { src: "", alt: "" };

export function ProjectForm({
  initialProject,
  defaultSortOrder,
}: {
  initialProject?: WorkProjectRow;
  /** Suggested sort_order for a brand-new project (max existing + 1) —
   * ignored when editing, since the row already has a real value. */
  defaultSortOrder?: number;
}) {
  const action = initialProject ? updateWorkProject.bind(null, initialProject.slug) : createWorkProject;
  const [state, dispatch] = useActionState<WorkPostState, FormData>(action, { error: null });
  const [, startTransition] = useTransition();

  const [slug, setSlug] = useState(initialProject?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialProject));
  const [coverImage, setCoverImage] = useState(initialProject?.cover_image ?? "");
  const [indexThumbnail, setIndexThumbnail] = useState(initialProject?.index_thumbnail ?? "");
  const [curvedImage, setCurvedImage] = useState<ProjectImageRef>(initialProject?.curved_image ?? EMPTY_IMAGE_REF);
  const [testimonialImage, setTestimonialImage] = useState<ProjectImageRef>(
    initialProject?.testimonial_image ?? EMPTY_IMAGE_REF,
  );
  const [fullWidthImage, setFullWidthImage] = useState<ProjectImageRef>(
    initialProject?.full_width_image ?? EMPTY_IMAGE_REF,
  );
  const [splitImages, setSplitImages] = useState<[ProjectImageRef, ProjectImageRef]>(
    initialProject?.split_images ?? [EMPTY_IMAGE_REF, EMPTY_IMAGE_REF],
  );
  const [isVisible, setIsVisible] = useState(initialProject ? initialProject.is_visible : true);
  const [hasTestimonial, setHasTestimonial] = useState(Boolean(initialProject?.testimonial));
  const [testimonial, setTestimonial] = useState<ProjectTestimonial>(
    initialProject?.testimonial ?? { quote: "", author: "", role: "", rating: 5 },
  );

  const uploadHintPrefix = initialProject?.slug ?? "new-project";

  // Same rationale as the blog CMS's PostForm.tsx: onSubmit + manual
  // dispatch instead of <form action={fn}> avoids React's built-in
  // form-reset wiping every field on an inline error.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      dispatch(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {state.error && <p className="rounded-xl bg-cream px-4 py-3 text-sm text-text">{state.error}</p>}

      <FormPanel>
        <SectionLabel>Content</SectionLabel>
        <Field label="Title (list card)">
          <input
            name="title"
            required
            defaultValue={initialProject?.title}
            onChange={(e) => {
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={`${fieldClass} text-base font-medium`}
          />
        </Field>
        <Field label="Slug">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-sm text-muted">/work/</span>
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
          {initialProject && (
            <p className="text-xs text-muted">
              Changing this breaks the project&apos;s existing public URL for anyone who already has it.
            </p>
          )}
        </Field>
        <Field label="Description (list card)">
          <textarea
            name="description"
            required
            rows={2}
            defaultValue={initialProject?.description}
            className={fieldClass}
          />
        </Field>
        <Field label="Detail title (detail page)">
          <input name="detailTitle" required defaultValue={initialProject?.detail_title} className={fieldClass} />
        </Field>
        <Field label="Detail description (detail page)">
          <textarea
            name="detailDescription"
            required
            rows={3}
            defaultValue={initialProject?.detail_description}
            className={fieldClass}
          />
        </Field>

        <SectionLabel>Details</SectionLabel>
        <Field label="Tags (comma-separated)">
          <input name="tags" required defaultValue={initialProject?.tags.join(", ")} className={fieldClass} />
        </Field>
        <Field label="Badge (optional)">
          <input
            name="badge"
            placeholder='e.g. "Coming Soon"'
            defaultValue={initialProject?.badge ?? ""}
            className={fieldClass}
          />
        </Field>
        <Field label="Categories">
          <div className="flex flex-col gap-2">
            {PROJECT_CATEGORIES.map((category) => (
              <label key={category} className="flex items-center gap-2 text-sm text-text">
                <input
                  type="checkbox"
                  name="categories"
                  value={category}
                  defaultChecked={initialProject?.categories.includes(category)}
                  className="h-4 w-4 rounded border-ink/20 text-brand focus:ring-brand/40"
                />
                {category}
              </label>
            ))}
          </div>
        </Field>
        <Field label="Sort order">
          <input
            name="sortOrder"
            type="number"
            required
            defaultValue={initialProject?.sort_order ?? defaultSortOrder}
            className={fieldClass}
          />
        </Field>
        <Field label="Show on /work">
          <ToggleSwitch name="isVisible" checked={isVisible} onChange={setIsVisible} />
          {!isVisible && (
            <p className="text-xs text-muted">
              Hidden from the public /work listing. The detail page and this CMS entry stay reachable.
            </p>
          )}
        </Field>

        <SectionLabel>Media</SectionLabel>
        <ImagePathField
          label="Cover image (list card)"
          name="coverImage"
          value={coverImage}
          onChange={setCoverImage}
          uploadHint={`${uploadHintPrefix}-cover`}
        />
        <ImagePathField
          label="Index thumbnail (optional)"
          name="indexThumbnail"
          value={indexThumbnail}
          onChange={setIndexThumbnail}
          uploadHint={`${uploadHintPrefix}-index-thumbnail`}
          required={false}
        />
        <ShowcaseImagesEditor initial={initialProject?.showcase_images ?? []} uploadHintPrefix={uploadHintPrefix} />
        <ImageRefFields
          label="Curved image (detail page)"
          srcName="curvedImageSrc"
          altName="curvedImageAlt"
          value={curvedImage}
          onChange={setCurvedImage}
          uploadHint={`${uploadHintPrefix}-curved`}
        />
        <ImageRefFields
          label="Testimonial-column image (detail page)"
          srcName="testimonialImageSrc"
          altName="testimonialImageAlt"
          value={testimonialImage}
          onChange={setTestimonialImage}
          uploadHint={`${uploadHintPrefix}-testimonial`}
        />
        <ImageRefFields
          label="Full-width image (detail page)"
          srcName="fullWidthImageSrc"
          altName="fullWidthImageAlt"
          value={fullWidthImage}
          onChange={setFullWidthImage}
          uploadHint={`${uploadHintPrefix}-full`}
        />
        <ImageRefFields
          label="Split image 1 of 2"
          srcName="splitImage0Src"
          altName="splitImage0Alt"
          value={splitImages[0]}
          onChange={(next) => setSplitImages([next, splitImages[1]])}
          uploadHint={`${uploadHintPrefix}-split-0`}
        />
        <ImageRefFields
          label="Split image 2 of 2"
          srcName="splitImage1Src"
          altName="splitImage1Alt"
          value={splitImages[1]}
          onChange={(next) => setSplitImages([splitImages[0], next])}
          uploadHint={`${uploadHintPrefix}-split-1`}
        />

        <SectionLabel>Testimonial</SectionLabel>
        <Field label="Has a real client testimonial">
          <ToggleSwitch name="hasTestimonial" checked={hasTestimonial} onChange={setHasTestimonial} />
          {!hasTestimonial && (
            <p className="text-xs text-muted">
              Most projects don&apos;t have one on file — the detail page shows the description above instead.
            </p>
          )}
        </Field>
        {hasTestimonial && (
          <>
            <Field label="Quote">
              <textarea
                name="testimonialQuote"
                rows={2}
                value={testimonial.quote}
                onChange={(e) => setTestimonial({ ...testimonial, quote: e.target.value })}
                className={fieldClass}
              />
            </Field>
            <Field label="Author">
              <input
                name="testimonialAuthor"
                value={testimonial.author}
                onChange={(e) => setTestimonial({ ...testimonial, author: e.target.value })}
                className={fieldClass}
              />
            </Field>
            <Field label="Role">
              <input
                name="testimonialRole"
                value={testimonial.role}
                onChange={(e) => setTestimonial({ ...testimonial, role: e.target.value })}
                className={fieldClass}
              />
            </Field>
            <Field label="Rating (1-5)">
              <input
                name="testimonialRating"
                type="number"
                min={1}
                max={5}
                value={testimonial.rating}
                onChange={(e) => setTestimonial({ ...testimonial, rating: Number(e.target.value) })}
                className={fieldClass}
              />
            </Field>
          </>
        )}

        <SectionLabel>Rich text (detail page body paragraphs)</SectionLabel>
        <RichTextEditor initial={initialProject?.rich_text ?? []} />
      </FormPanel>

      <div className="sticky bottom-0 z-10 flex items-center justify-between rounded-2xl border border-ink/10 bg-paper p-5 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <a href="/cms/work" className="text-sm text-muted hover:text-text">
          ← Back to CMS
        </a>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-deep"
        >
          Save
        </button>
      </div>
    </form>
  );
}
