"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { SerializedProductWithCategory } from "@/lib/serialize";
import { SerializedCategory } from "@/lib/serialize";
import { createProductAction, updateProductAction } from "@/lib/actions/admin.actions";
import { cn } from "@/lib/utils";

interface ProductFormProps {
  product?: SerializedProductWithCategory;
  categories: SerializedCategory[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const isEdit = !!product;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (isEdit) {
        await updateProductAction(product.id, formData);
      } else {
        await createProductAction(formData);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-6">
      {/* Name */}
      <Field label="Product Name" required>
        <input
          name="name"
          defaultValue={product?.name}
          required
          placeholder="e.g. Ivory Lawn Shirt"
          className={inputCls}
        />
      </Field>

      {/* Description */}
      <Field label="Description" required>
        <textarea
          name="description"
          defaultValue={product?.description}
          required
          rows={4}
          placeholder="Describe the product..."
          className={cn(inputCls, "resize-none")}
        />
      </Field>

      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (PKR)" required>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.price}
            required
            placeholder="0.00"
            className={inputCls}
          />
        </Field>
        <Field label="Stock" required>
          <input
            name="stock"
            type="number"
            min="0"
            defaultValue={product?.stock ?? 0}
            required
            placeholder="0"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Category */}
      <Field label="Category" required>
        <select
          name="categoryId"
          defaultValue={product?.categoryId}
          required
          className={inputCls}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </Field>

      {/* Images */}
      <Field label="Image URLs" hint="One URL per line">
        <textarea
          name="images"
          defaultValue={product?.images.join("\n")}
          rows={4}
          placeholder={"https://images.unsplash.com/...\nhttps://images.unsplash.com/..."}
          className={cn(inputCls, "resize-none font-mono text-xs")}
        />
      </Field>

      {/* Toggles */}
      <div className="flex flex-col gap-3">
        <Toggle
          name="isFeatured"
          label="Featured product"
          hint="Shown on the homepage"
          defaultChecked={product?.isFeatured ?? false}
        />
        {isEdit && (
          <Toggle
            name="isArchived"
            label="Archived"
            hint="Hidden from the store"
            defaultChecked={product?.isArchived ?? false}
          />
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 bg-[#2a1f18] text-[#f0ebe3] text-[10px] tracking-[0.2em] uppercase font-normal hover:bg-[#3d2f25] transition-colors disabled:opacity-50"
        >
          {isPending
            ? isEdit ? "Saving..." : "Creating..."
            : isEdit ? "Save Changes" : "Create Product"}
        </button>
        <a
          href="/admin/products"
          className="px-8 py-3 border border-stone-200 text-[10px] tracking-[0.2em] uppercase text-stone-600 font-normal hover:border-stone-900 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function Toggle({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center justify-between py-3 border border-stone-100 px-4 cursor-pointer hover:border-stone-200 transition-colors">
      <div>
        <p className="text-sm font-normal text-stone-900">{label}</p>
        <p className="text-[11px] text-stone-400 font-light">{hint}</p>
      </div>
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={defaultChecked}
        className="w-4 h-4 accent-stone-900"
      />
    </label>
  );
}