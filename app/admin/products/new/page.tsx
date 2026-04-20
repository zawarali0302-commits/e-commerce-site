import { getAllCategories } from "@/lib/services/category.service";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-light mb-1">
          Products
        </p>
        <h1 className="font-serif text-3xl font-light text-stone-900">
          New Product
        </h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}