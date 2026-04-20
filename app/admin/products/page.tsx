import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getAdminProducts } from "@/lib/services/admin.service";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "@/components/admin/product-actions";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-light text-stone-900">Products</h1>
          <p className="text-sm text-stone-400 font-light mt-1">
            {products.length} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2a1f18] text-[#f0ebe3] text-[10px] tracking-[0.18em] uppercase font-normal hover:bg-[#3d2f25] transition-colors"
        >
          <Plus size={13} />
          Add Product
        </Link>
      </div>

      <div className="border border-stone-100">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3 border-b border-stone-100 bg-stone-50">
          {["Product", "Category", "Price", "Stock", ""].map((h) => (
            <p
              key={h}
              className="text-[9px] tracking-[0.18em] uppercase text-stone-400 font-medium"
            >
              {h}
            </p>
          ))}
        </div>

        {/* Rows */}
        {products.length === 0 ? (
          <p className="text-sm text-stone-300 font-light text-center py-16">
            No products yet
          </p>
        ) : (
          <div className="divide-y divide-stone-100">
            {products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3.5 items-center hover:bg-stone-50 transition-colors"
              >
                {/* Product */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 aspect-[3/4] bg-stone-100 shrink-0 overflow-hidden">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="40px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-stone-200" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-normal text-stone-900 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {product.isFeatured && (
                        <span className="text-[8px] tracking-[0.1em] uppercase text-amber-600 bg-amber-50 px-1.5 py-0.5">
                          Featured
                        </span>
                      )}
                      {product.isArchived && (
                        <span className="text-[8px] tracking-[0.1em] uppercase text-stone-400 bg-stone-100 px-1.5 py-0.5">
                          Archived
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <p className="text-sm text-stone-500 font-light">
                  {product.category.name}
                </p>

                {/* Price */}
                <p className="text-sm text-stone-900 font-normal">
                  {formatPrice(product.price)}
                </p>

                {/* Stock */}
                <p
                  className={`text-sm font-normal ${
                    product.stock === 0
                      ? "text-red-500"
                      : product.stock <= 5
                      ? "text-amber-600"
                      : "text-stone-900"
                  }`}
                >
                  {product.stock}
                </p>

                {/* Actions */}
                <ProductActions product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}