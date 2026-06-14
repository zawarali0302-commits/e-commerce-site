import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <main className="min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
        {/* Image gallery */}
        <div className="flex gap-3 p-6 md:p-10">
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-16 aspect-[3/4]" />
            ))}
          </div>
          {/* Main image */}
          <Skeleton className="flex-1 aspect-[3/4]" />
        </div>

        {/* Product info */}
        <div className="px-6 md:px-12 py-10 flex flex-col gap-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-20" />

          <div className="flex gap-2 mt-4">
            <Skeleton className="w-8 h-8" />
            <Skeleton className="w-10 h-8" />
            <Skeleton className="w-8 h-8" />
          </div>

          <Skeleton className="h-12 w-full mt-2" />
          <Skeleton className="h-12 w-full" />

          <div className="mt-6 space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>

      {/* Reviews skeleton */}
      <div className="px-6 md:px-10 py-12 border-t border-stone-100">
        <Skeleton className="h-7 w-32 mb-8" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}