import { notFound } from "next/navigation";
import { getAdminProductBySlug } from "@/lib/services/admin.service";
import { getAllCategories } from "@/lib/services/category.service";
import { ProductForm } from "@/components/admin/product-form";
interface EditProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { slug } = await params;

  const [product, categories] = await Promise.all([
    getAdminProductBySlug(slug),
    getAllCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-light mb-1">
          Products
        </p>
        <h1 className="font-serif text-3xl font-light text-stone-900">
          Edit Product
        </h1>
        <p className="text-sm text-stone-400 font-light mt-1">{product.name}</p>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}