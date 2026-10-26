interface StatsCardProps {
  label: string
  value: string | number
  icon: string
  color: 'indigo' | 'blue' | 'orange' | 'purple' | 'emerald'
}

const colorMap = {
  indigo:  'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
  blue:    'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  orange:  'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  purple:  'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
}

export default function StatsCard({ label, value, icon, color }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex flex-col gap-2">
      <span className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
        {icon}
      </span>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  )
}
