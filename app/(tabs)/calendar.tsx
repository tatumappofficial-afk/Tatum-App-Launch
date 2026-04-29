import { useState } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { useRouter } from 'expo-router'
import { generateId as uuid } from '@/src/utils/uuid'
import { CalendarScreen } from '@/lib/screens/CalendarScreen'
import { activityTags, encounters, partners } from '@/src/db'
import { useActivityTagMap } from '@/src/hooks/useActivityTagMap'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function CalendarRoute() {
  const router = useRouter()
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [selectedDay, setSelectedDay] = useState<number>(now.getDate())

  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters }))
  )
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners }))
  )
  const { data: allTags = [] } = useLiveQuery((q) =>
    q.from({ activityTags }).select(({ activityTags }) => ({ ...activityTags }))
  )

  const tagMap = useActivityTagMap()

  const quickLogEmojis = allTags
    .filter(t => t.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(t => t.emoji)

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
    emoji: data.emojis[0] || '\u2728',
    hasMultiple: data.count > 1 || data.emojis.length > 1,
  }))

  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear()

  // Build sessions for selected day
  const selectedDateStr = `${year}-${String(month).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
  const selectedDateObj = new Date(selectedDateStr + 'T00:00:00')
  const dayOfWeek = DAY_NAMES[selectedDateObj.getDay()]
  const selectedDayLabel = `${dayOfWeek}, ${MONTH_NAMES[month - 1]} ${selectedDay}`

  const dayEncounters = allEncounters.filter(e => e.date === selectedDateStr)
  const daySessions = dayEncounters.map(enc => {
    const sessionPartners = enc.partnerIds
      .map(pid => allPartners.find(p => p.id === pid))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
    return {
      id: enc.id,
      partners: sessionPartners.map(p => ({
        initials: p.avatarValue,
        gradient: p.avatarGradient,
        name: p.displayName,
      })),
      rating: enc.stars || 0,
      tags: enc.activities.map(emoji => ({
        emoji,
        label: tagMap.get(emoji) || emoji,
      })),
      noteSnippet: enc.notes?.slice(0, 80),
    }
  })

  function handlePrevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelectedDay(1)
  }

  function handleNextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelectedDay(1)
  }

  function handleQuickLog(emoji: string) {
    if (allPartners.length === 0) return // can't log without a partner
    const nowStr = new Date().toISOString()
    const dateStr = nowStr.split('T')[0]
    // Quick-log defaults to the first partner; user can edit the session
    // afterwards to reassign or add others.
    encounters.insert({
      id: uuid(),
      date: dateStr,
      activities: [emoji],
      partnerIds: [allPartners[0].id],
      stars: null,
      notes: null,
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
      selectedDay={selectedDay}
      selectedDayLabel={selectedDayLabel}
      daySessions={daySessions}
      onPrevMonth={handlePrevMonth}
      onNextMonth={handleNextMonth}
      onDayPress={setSelectedDay}
      onQuickLog={handleQuickLog}
      onSessionPress={(id) => router.push(`/(pages)/session-detail?id=${id}`)}
      quickLogEmojis={quickLogEmojis}
    />
  )
}
