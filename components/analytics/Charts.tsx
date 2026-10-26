'use client'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar, CartesianGrid, Legend } from 'recharts'

interface AccuracyChartProps {
  data: { date: string; accuracy: number }[]
}

export function AccuracyChart({ data }: AccuracyChartProps) {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
          <Tooltip formatter={(v) => [`${v}%`, 'Accuracy']} />
          <Line type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface SubjectRadarProps {
  data: { subject: string; accuracy: number }[]
}

export function SubjectRadar({ data }: SubjectRadarProps) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
          <Radar name="Accuracy" dataKey="accuracy" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
          <Tooltip formatter={(v) => [`${v}%`, 'Accuracy']} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
