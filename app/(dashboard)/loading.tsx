export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800/60 rounded-lg" />
        </div>
        <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      </div>

      {/* Hero / Banner Skeleton */}
      <div className="h-28 rounded-2xl bg-gray-200 dark:bg-gray-800/80" />

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-800/80" />
        ))}
      </div>

      {/* Content Section Skeleton */}
      <div className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-800/80" />
    </div>
  )
}
