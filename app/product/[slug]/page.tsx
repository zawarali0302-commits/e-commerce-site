import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ImageGallery } from "@/components/product/image-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ReviewSection } from "@/components/product/review-section";
import { RelatedProducts } from "@/components/product/related-products";
import {
  getProductBySlug,
  getRelatedProducts,
  getProductRatingStats,
  getAllProductSlugs,
} from "@/lib/services/product.service";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: product.images[0] ? [{ url: product.images[0], width: 800, height: 1000, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 155),
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id),
  ]);

  const { totalReviews, avgRating, ratingBreakdown } = getProductRatingStats(
    product.reviews
  );

  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <div className="px-6 md:px-10 py-4 border-b border-stone-100">
        <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 font-light">
          <Link
            href="/products"
            className="hover:text-stone-700 transition-colors"
          >
            Shop
          </Link>
          <span className="mx-2 text-stone-200">›</span>
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-stone-700 transition-colors"
          >
            {product.category.name}
          </Link>
          <span className="mx-2 text-stone-200">›</span>
          <span className="text-stone-600">{product.name}</span>
        </p>
      </div>

      {/* Main product section */}
      <div className="px-6 md:px-10 py-10 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        <ImageGallery images={product.images} name={product.name} />
        <ProductInfo
          product={product}
          avgRating={avgRating}
          totalReviews={totalReviews}
        />
      </div>

      <div className="border-t border-stone-100" />

      <ReviewSection
        productId={product.id}
        reviews={product.reviews}
        avgRating={avgRating}
        totalReviews={totalReviews}
        ratingBreakdown={ratingBreakdown}
      />

      {related.length > 0 && (
        <>
          <div className="border-t border-stone-100" />
          <RelatedProducts products={related} />
        </>
      )}
    </main>
  );
}