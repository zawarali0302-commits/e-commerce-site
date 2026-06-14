import { Skeleton } from "@/components/ui/skeleton";

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

export default function ProductsLoading() {
  return (
    <main className="min-h-screen">
      <div className="border-b border-stone-100 px-6 md:px-10 py-10">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-stone-100 p-6 space-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-24" />
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-32" />
              ))}
            </div>
          ))}
        </aside>

        {/* Grid */}
        <div className="flex-1 px-6 md:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}