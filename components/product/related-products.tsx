import Link from "next/link";
import Image from "next/image";
import { SerializedProductWithCategory } from "@/lib/serialize";
import { formatPrice } from "@/lib/utils";

interface RelatedProductsProps {
  products: SerializedProductWithCategory[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <section className="px-6 md:px-10 py-14 md:py-20 bg-stone-50">
      <div className="flex items-end justify-between mb-10">
        <h2 className="font-serif text-3xl md:text-4xl font-light">
          You May Also Like
        </h2>
        <Link
          href="/products"
          className="text-[10px] tracking-[0.2em] uppercase text-stone-400 border-b border-stone-300 pb-0.5 hover:text-stone-900 hover:border-stone-900 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.slug}`} className="group block">
            <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden mb-3.5">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-stone-200" />
              )}
            </div>
            <p className="text-[10px] tracking-[0.12em] uppercase text-stone-400 mb-1">
              {product.category.name}
            </p>
            <p className="font-serif text-[17px] font-normal text-stone-900 mb-1.5 group-hover:text-stone-500 transition-colors leading-snug">
              {product.name}
            </p>
            <p className="text-sm text-stone-900 font-normal">
              {formatPrice(product.price)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}