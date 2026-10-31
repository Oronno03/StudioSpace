// Skeleton loaders — branded shimmer blocks used during data fetches.

export function StudioCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[16/10] w-full" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-4 w-3/4 rounded-full" />
        <div className="skeleton h-3 w-1/2 rounded-full" />
        <div className="skeleton h-3 w-full rounded-full" />
        <div className="flex items-center justify-between pt-3">
          <div className="skeleton h-5 w-20 rounded-full" />
          <div className="skeleton h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function StudioGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <StudioCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="skeleton aspect-[21/9] w-full rounded-3xl" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="skeleton h-8 w-2/3 rounded-full" />
          <div className="skeleton h-4 w-1/3 rounded-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-3.5 w-full rounded-full" />
          ))}
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    </div>
  );
}

export function RowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card flex items-center gap-4 p-4">
          <div className="skeleton h-16 w-24 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-1/2 rounded-full" />
            <div className="skeleton h-3 w-1/3 rounded-full" />
          </div>
          <div className="skeleton hidden h-8 w-24 rounded-full sm:block" />
        </div>
      ))}
    </div>
  );
}
