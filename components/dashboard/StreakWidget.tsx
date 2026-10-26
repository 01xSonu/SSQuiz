interface StreakWidgetProps {
  streak: number
}

export default function StreakWidget({ streak }: StreakWidgetProps) {
  const getStreakColor = (s: number) =>
    s >= 7 ? 'text-orange-500' : s >= 3 ? 'text-amber-500' : 'text-gray-400'

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30">
      <span className={`text-2xl ${getStreakColor(streak)}`}>🔥</span>
      <div>
        <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">{streak}</p>
        <p className="text-xs text-gray-400">{streak === 1 ? 'day streak' : 'day streak'}</p>
      </div>
    </div>
  )
}
