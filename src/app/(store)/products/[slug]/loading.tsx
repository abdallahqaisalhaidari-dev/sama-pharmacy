export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image skeleton */}
        <div className="aspect-square animate-pulse rounded-3xl bg-gray-200" />

        {/* Details skeleton */}
        <div className="space-y-6">
          <div className="h-5 w-24 animate-pulse rounded-full bg-gray-200" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex gap-4">
            <div className="h-12 w-32 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-12 flex-1 animate-pulse rounded-xl bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
