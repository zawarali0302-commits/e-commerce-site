"use client";

import { useTransition } from "react";
import { SerializedEditorial } from "@/lib/services/editorial.service";
import { createEditorialAction, updateEditorialAction } from "@/lib/actions/editorial.actions";

const inputCls =
  "w-full border border-stone-200 px-3 py-2.5 text-sm text-stone-900 font-light outline-none focus:border-stone-400 transition-colors bg-white";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <label className="text-[10px] tracking-[0.15em] uppercase text-stone-600 font-medium">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {hint && <span className="text-[10px] text-stone-300 font-light">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function EditorialForm({ editorial }: { editorial?: SerializedEditorial }) {
  const [isPending, startTransition] = useTransition();
  const isEdit = !!editorial;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (isEdit) {
        await updateEditorialAction(editorial.id, formData);
      } else {
        await createEditorialAction(formData);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-6">
      {/* Eyebrow */}
      <Field label="Eyebrow" hint="Small label above the title" required>
        <input
          name="eyebrow"
          required
          defaultValue={editorial?.eyebrow}
          placeholder="The Edit · Spring 2026"
          className={inputCls}
        />
      </Field>

      {/* Title */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Title" required>
          <input
            name="title"
            required
            defaultValue={editorial?.title}
            placeholder="Dressed in"
            className={inputCls}
          />
        </Field>
        <Field label="Title Italic" hint="Appended in italic">
          <input
            name="titleItalic"
            defaultValue={editorial?.titleItalic ?? ""}
            placeholder="Morning Light"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Body */}
      <Field label="Body Text" required>
        <textarea
          name="body"
          required
          defaultValue={editorial?.body}
          rows={5}
          placeholder="This season, we turn to the quieter hours..."
          className={`${inputCls} resize-none`}
        />
      </Field>

      {/* CTA */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Button Text" required>
          <input
            name="ctaText"
            required
            defaultValue={editorial?.ctaText ?? "Read the Story"}
            placeholder="Read the Story"
            className={inputCls}
          />
        </Field>
        <Field label="Button Link" required>
          <input
            name="ctaHref"
            required
            defaultValue={editorial?.ctaHref ?? "/products"}
            placeholder="/products"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Image URL */}
      <Field label="Image URL" hint="Left panel image — leave empty for dark background">
        <input
          name="imageUrl"
          defaultValue={editorial?.imageUrl ?? ""}
          placeholder="https://images.unsplash.com/..."
          className={inputCls}
        />
      </Field>

      {/* Active toggle */}
      <label className="flex items-center justify-between py-3 border border-stone-100 px-4 cursor-pointer hover:border-stone-200 transition-colors">
        <div>
          <p className="text-sm font-normal text-stone-900">Active</p>
          <p className="text-[11px] text-stone-400 font-light">Show this editorial on the homepage</p>
        </div>
        <input
          type="checkbox"
          name="isActive"
          value="true"
          defaultChecked={editorial?.isActive ?? true}
          className="w-4 h-4 accent-stone-900"
        />
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 bg-[#2a1f18] text-[#f0ebe3] text-[10px] tracking-[0.2em] uppercase font-normal hover:bg-[#3d2f25] transition-colors disabled:opacity-50"
        >
          {isPending
            ? isEdit ? "Saving..." : "Creating..."
            : isEdit ? "Save Changes" : "Create Editorial"}
        </button>
        <a
          href="/admin/editorial"
          className="px-8 py-3 border border-stone-200 text-[10px] tracking-[0.2em] uppercase text-stone-600 font-normal hover:border-stone-900 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}