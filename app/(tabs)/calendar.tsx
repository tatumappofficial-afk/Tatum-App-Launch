import { useState } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { useRouter } from 'expo-router'
import { generateId as uuid } from '@/src/utils/uuid'
import { CalendarScreen } from '@/lib/screens/CalendarScreen'
import { encounters } from '@/src/db'

export default function CalendarRoute() {
  const router = useRouter()
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters }))
  )

  // Compute logged days for current month
  const monthStr = `${year}-${String(month).padStart(2, '0')}`
  const monthEncounters = allEncounters.filter(e => e.date.startsWith(monthStr))

  const loggedDaysMap = new Map<number, { emojis: string[]; count: number }>()
  for (const enc of monthEncounters) {
    const day = parseInt(enc.date.split('-')[2], 10)
    const existing = loggedDaysMap.get(day)
    if (existing) {
      existing.emojis.push(...enc.activities)
      existing.count++
    } else {
      loggedDaysMap.set(day, { emojis: [...enc.activities], count: 1 })
    }
  }

  const loggedDays = [...loggedDaysMap.entries()].map(([day, data]) => ({
    day,
    emoji: data.emojis[0] || '✨',
    hasMultiple: data.count > 1 || data.emojis.length > 1,
  }))

  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear()

  function handlePrevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function handleNextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  function handleQuickLog(emoji: string) {
    const nowStr = new Date().toISOString()
    const dateStr = nowStr.split('T')[0]
    encounters.insert({
      id: uuid(),
      date: dateStr,
      activities: [emoji],
      partnerId: null,
      rating: null,
      stars: null,
      vibes: [],
      noteId: null,
      createdAt: nowStr,
      updatedAt: nowStr,
    })
  }

  return (
    <CalendarScreen
      month={month}
      year={year}
      today={isCurrentMonth ? now.getDate() : undefined}
      loggedDays={loggedDays}
      onPrevMonth={handlePrevMonth}
      onNextMonth={handleNextMonth}
      onDayPress={(day) => router.push(`/(modals)/calendar-day?month=${month}&year=${year}&day=${day}`)}
      onQuickLog={handleQuickLog}
    />
  )
}
