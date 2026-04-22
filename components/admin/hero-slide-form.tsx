"use client";

import { useTransition } from "react";
import { SerializedHeroSlide } from "@/lib/services/hero.service";
import { createHeroSlideAction, updateHeroSlideAction } from "@/lib/actions/hero.actions";
import { cn } from "@/lib/utils";

interface HeroSlideFormProps {
  slide?: SerializedHeroSlide;
}

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
        {hint && (
          <span className="text-[10px] text-stone-300 font-light">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

export function HeroSlideForm({ slide }: HeroSlideFormProps) {
  const [isPending, startTransition] = useTransition();
  const isEdit = !!slide;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (isEdit) {
        await updateHeroSlideAction(slide.id, formData);
      } else {
        await createHeroSlideAction(formData);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-6">
      {/* Title */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Title" required hint="Main text">
          <input
            name="title"
            required
            defaultValue={slide?.title}
            placeholder="Where"
            className={inputCls}
          />
        </Field>
        <Field label="Title Italic" hint="Appended in italic">
          <input
            name="titleItalic"
            defaultValue={slide?.titleItalic ?? ""}
            placeholder="Silence Meets Style"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Label + Subtitle */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Label" hint="Small text above title">
          <input
            name="label"
            defaultValue={slide?.label ?? ""}
            placeholder="Spring / Summer 2026"
            className={inputCls}
          />
        </Field>
        <Field label="Subtitle" hint="Text below title">
          <input
            name="subtitle"
            defaultValue={slide?.subtitle ?? ""}
            placeholder="Now Live"
            className={inputCls}
          />
        </Field>
      </div>

      {/* CTA */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Button Text" required>
          <input
            name="ctaText"
            required
            defaultValue={slide?.ctaText ?? "Explore Collection"}
            placeholder="Explore Collection"
            className={inputCls}
          />
        </Field>
        <Field label="Button Link" required>
          <input
            name="ctaHref"
            required
            defaultValue={slide?.ctaHref ?? "/products"}
            placeholder="/products"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Image URL */}
      <Field label="Image URL" hint="Leave empty to show background color only">
        <input
          name="imageUrl"
          defaultValue={slide?.imageUrl ?? ""}
          placeholder="https://images.unsplash.com/..."
          className={inputCls}
        />
      </Field>

      {/* Background color + position */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Background Color" hint="Used when no image">
          <div className="flex gap-2 items-center">
            <input
              type="color"
              name="bgColor"
              defaultValue={slide?.bgColor ?? "#f0ebe3"}
              className="w-10 h-10 border border-stone-200 cursor-pointer bg-white p-0.5"
            />
            <input
              name="bgColorHex"
              defaultValue={slide?.bgColor ?? "#f0ebe3"}
              placeholder="#f0ebe3"
              className={cn(inputCls, "flex-1")}
              readOnly
            />
          </div>
        </Field>
        <Field label="Position" hint="Lower = appears first">
          <input
            name="position"
            type="number"
            min="0"
            defaultValue={slide?.position ?? 0}
            className={inputCls}
          />
        </Field>
      </div>

      {/* Active toggle */}
      <label className="flex items-center justify-between py-3 border border-stone-100 px-4 cursor-pointer hover:border-stone-200 transition-colors">
        <div>
          <p className="text-sm font-normal text-stone-900">Active</p>
          <p className="text-[11px] text-stone-400 font-light">Show this slide on the homepage</p>
        </div>
        <input
          type="checkbox"
          name="isActive"
          value="true"
          defaultChecked={slide?.isActive ?? true}
          className="w-4 h-4 accent-stone-900"
        />
      </label>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 bg-[#2a1f18] text-[#f0ebe3] text-[10px] tracking-[0.2em] uppercase font-normal hover:bg-[#3d2f25] transition-colors disabled:opacity-50"
        >
          {isPending
            ? isEdit ? "Saving..." : "Creating..."
            : isEdit ? "Save Changes" : "Create Slide"}
        </button>
        <a
          href="/admin/hero"
          className="px-8 py-3 border border-stone-200 text-[10px] tracking-[0.2em] uppercase text-stone-600 font-normal hover:border-stone-900 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}