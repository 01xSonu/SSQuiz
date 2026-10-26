export default function TestsLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Top Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-44 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="h-4 w-72 bg-gray-100 dark:bg-gray-800/60 rounded-lg" />
      </div>

      {/* Subject Filter Pills Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Test Subject Section Skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-36 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900/60 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-800/60 rounded" />
                </div>
                <div className="h-5 w-14 bg-gray-200 dark:bg-gray-800 rounded-full" />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800/60 rounded" />
                <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800/60 rounded" />
              </div>

              <div className="h-10 w-full bg-indigo-100/60 dark:bg-indigo-950/40 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
