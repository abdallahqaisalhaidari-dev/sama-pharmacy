export default function StoreLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Header skeleton */}
      <div className="mb-8 flex items-center gap-3">
        <div className="size-12 animate-pulse rounded-2xl bg-gray-200" />
        <div className="space-y-2">
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            <div className="aspect-square animate-pulse bg-gray-200" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="h-9 w-full animate-pulse rounded-xl bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
