export default function AdminLoading() {
  return (
    <div className="space-y-6">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 size-10 animate-pulse rounded-xl bg-gray-200" />
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 h-5 w-40 animate-pulse rounded bg-gray-200" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-brand-cream-dark" />
          ))}
        </div>
      </div>
    </div>
  );
}
