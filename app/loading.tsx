import { Skeleton } from "@/components/ui/skeleton";

// ─── Hero skeleton ────────────────────────────────────────────────────────────
function HeroSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[580px]">
      <Skeleton className="min-h-[420px]" />
      <div className="grid grid-rows-2">
        <Skeleton className="min-h-[180px] border-b border-white" />
        <Skeleton className="min-h-[180px]" />
      </div>
    </div>
  );
}

// ─── Product card skeleton ────────────────────────────────────────────────────
function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[3/4] w-full mb-4" />
      <Skeleton className="h-3 w-16 mb-2" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

// ─── Featured products skeleton ───────────────────────────────────────────────
function FeaturedSkeleton() {
  return (
    <section className="px-6 md:px-10 py-16">
      <div className="flex items-end justify-between mb-10">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

// ─── Editorial skeleton ───────────────────────────────────────────────────────
function EditorialSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">
      <Skeleton className="min-h-[300px]" />
      <div className="bg-[#f0ebe3] px-10 md:px-16 py-16 flex flex-col justify-center gap-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-10 w-36 mt-4" />
      </div>
    </div>
  );
}

// ─── Homepage loading ─────────────────────────────────────────────────────────
export default function HomeLoading() {
  return (
    <div>
      <HeroSkeleton />

      {/* Ticker */}
      <Skeleton className="h-10 w-full" />

      {/* Category grid */}
      <div className="px-6 md:px-10 py-12">
        <Skeleton className="h-7 w-40 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="aspect-[3/5]" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4]" />
          ))}
        </div>
      </div>

      <FeaturedSkeleton />
      <EditorialSkeleton />
    </div>
  );
}