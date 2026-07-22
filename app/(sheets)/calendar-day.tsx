import { useLiveQuery } from '@tanstack/react-db'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { CalendarDayModal } from '@/lib/screens/CalendarDayModal'
import { encounters, partners } from '@/src/db'
import { formatPartnerLabel } from '@/src/utils/partnerLabel'

const MONTH_NAMES = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function CalendarDayRoute() {
  const router = useRouter()
  const { month, year, day } = useLocalSearchParams<{ month: string; year: string; day: string }>()

  const monthNum = parseInt(month, 10)
  const yearNum = parseInt(year, 10)
  const dayNum = parseInt(day, 10)

  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters })),
  )
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners })),
  )
  // Build date string for this day
  const dateStr = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
  const dateObj = new Date(dateStr + 'T00:00:00')
  const dayOfWeek = DAY_NAMES[dateObj.getDay()]
  const dayLabel = `${dayOfWeek}, ${MONTH_NAMES[monthNum]} ${dayNum}`

  // Filter encounters for this specific day, newest logged first
  const dayEncounters = allEncounters
    .filter((e) => e.date === dateStr)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  // Build sessions list
  const sessions = dayEncounters.map((enc) => {
    const sessionPartners = enc.partnerIds
      .map((pid) => allPartners.find((p) => p.id === pid))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
    return {
      id: enc.id,
      partnerName: formatPartnerLabel(sessionPartners.map((p) => p.displayName)),
      partners: sessionPartners.map((p) => ({
        initials: p.avatarValue,
        gradient: p.avatarGradient,
      })),
      tags: enc.activities,
      rating: enc.stars || 0,
      noteSnippet: enc.notes?.slice(0, 80),
    }
  })

  // Build logged days for the month (for the calendar grid in the modal)
  const monthStr = `${yearNum}-${String(monthNum).padStart(2, '0')}`
  const monthEncounters = allEncounters.filter((e) => e.date.startsWith(monthStr))
  const loggedDaysMap = new Map<number, { emojis: string[]; count: number }>()
  for (const enc of monthEncounters) {
    const d = parseInt(enc.date.split('-')[2], 10)
    const existing = loggedDaysMap.get(d)
    if (existing) {
      existing.emojis.push(...enc.activities)
      existing.count++
    } else {
      loggedDaysMap.set(d, { emojis: [...enc.activities], count: 1 })
    }
  }
  const loggedDays = [...loggedDaysMap.entries()].map(([d, data]) => ({
    day: d,
    emoji: data.emojis[0] || '\u2728',
    hasMultiple: data.count > 1 || data.emojis.length > 1,
  }))

  const now = new Date()
  const isCurrentMonth = monthNum === now.getMonth() + 1 && yearNum === now.getFullYear()

  return (
    <CalendarDayModal
      month={monthNum}
      year={yearNum}
      today={isCurrentMonth ? now.getDate() : undefined}
      loggedDays={loggedDays}
      selectedDay={dayNum}
      dayLabel={dayLabel}
      sessions={sessions}
      onLogSession={() => router.push('/(sheets)/log-session')}
      onSessionPress={(id) => router.push(`/(sheets)/session-detail?id=${id}`)}
      onDismiss={() => router.back()}
      onClose={() => router.dismiss()}
    />
  )
}
