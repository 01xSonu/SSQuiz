interface GoalProgressBarProps {
  completed: number
  total: number
  percent: number
  goalHours: number
}

export default function GoalProgressBar({ completed, total, percent, goalHours }: GoalProgressBarProps) {
  const getBarColor = (p: number) =>
    p >= 100 ? 'from-emerald-400 to-emerald-500' :
    p >= 60  ? 'from-indigo-400 to-purple-500' :
    p >= 30  ? 'from-amber-400 to-orange-400' :
               'from-red-400 to-pink-400'

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Daily Goal Progress
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {completed} of {total} tasks completed · {goalHours}h target
          </p>
        </div>
        <span className={`text-2xl font-bold ${percent >= 100 ? 'text-emerald-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
          {percent}%
        </span>
      </div>
      <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getBarColor(percent)} transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      {percent >= 100 && (
        <p className="text-xs text-emerald-500 font-medium mt-1.5">🎉 Daily goal achieved! +50 XP</p>
      )}
    </div>
  )
}
