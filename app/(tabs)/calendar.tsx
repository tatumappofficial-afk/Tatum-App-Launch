import { useEffect, useRef, useState } from 'react'
import * as Haptics from 'expo-haptics'
import { useLiveQuery } from '@tanstack/react-db'
import { useRouter } from 'expo-router'
import { generateId as uuid } from '@/src/utils/uuid'
import { CalendarScreen } from '@/lib/screens/CalendarScreen'
import type { SuccessOverlayDetails } from '@/lib/components/SuccessOverlay'
import { activityTags, encounters, partners, PERIOD_TAG_ID } from '@/src/db'
import { useActivityTagMap } from '@/src/hooks/useActivityTagMap'
import { useLoggedDaysForMonth } from '@/src/hooks/useLoggedDaysForMonth'
import { formatDateString } from '@/lib/stats/windows'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = [
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

export default function CalendarRoute() {
  const router = useRouter()
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [selectedDay, setSelectedDay] = useState<number>(now.getDate())

  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters })),
  )
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners })),
  )
  const { data: allTags = [] } = useLiveQuery((q) =>
    q.from({ activityTags }).select(({ activityTags }) => ({ ...activityTags })),
  )

  const tagMap = useActivityTagMap()

  const quickLogEmojis = allTags
    .filter((t) => t.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((t) => t.emoji)

  // useLoggedDaysForMonth uses 0-indexed month; this screen tracks 1-indexed.
  const loggedDays = useLoggedDaysForMonth(month - 1, year, allEncounters)

  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear()

  // Build sessions for selected day
  const selectedDateStr = `${year}-${String(month).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
  const selectedDateObj = new Date(selectedDateStr + 'T00:00:00')
  const dayOfWeek = DAY_NAMES[selectedDateObj.getDay()]
  const selectedDayLabel = `${dayOfWeek}, ${MONTH_NAMES[month - 1]} ${selectedDay}`

  const dayEncounters = allEncounters.filter((e) => e.date === selectedDateStr)
  const daySessions = dayEncounters.map((enc) => {
    const sessionPartners = enc.partnerIds
      .map((pid) => allPartners.find((p) => p.id === pid))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
    return {
      id: enc.id,
      partners: sessionPartners.map((p) => ({
        initials: p.avatarValue,
        gradient: p.avatarGradient,
        name: p.displayName,
      })),
      rating: enc.stars || 0,
      tags: enc.activities.map((emoji) => ({
        emoji,
        label: tagMap.get(emoji) || emoji,
      })),
      noteSnippet: enc.notes?.slice(0, 80),
    }
  })

  function handlePrevMonth() {
    if (month === 1) {
      setMonth(12)
      setYear((y) => y - 1)
    } else setMonth((m) => m - 1)
    setSelectedDay(1)
  }

  function handleNextMonth() {
    if (month === 12) {
      setMonth(1)
      setYear((y) => y + 1)
    } else setMonth((m) => m + 1)
    setSelectedDay(1)
  }

  const [loggedOverlay, setLoggedOverlay] = useState<SuccessOverlayDetails | null>(null)
  const overlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (overlayTimer.current) clearTimeout(overlayTimer.current)
    },
    [],
  )

  function insertQuickEncounter(emoji: string, dateStr: string) {
    const nowStr = new Date().toISOString()
    // Period is the only tag that can be quick-logged without a partner —
    // it's a personal wellness marker, not a shared activity. Find by id
    // (stable across renames) and compare emoji as the lookup key.
    const periodTag = allTags.find((t) => t.id === PERIOD_TAG_ID)
    const isPeriodLog = periodTag != null && emoji === periodTag.emoji

    if (!isPeriodLog && allPartners.length === 0) return // every other tag needs a partner

    // Quick-log uses the main partner if set, else falls back to the first.
    // Period skips this entirely so it can log even on a fresh, partner-less account.
    const target = isPeriodLog ? null : (allPartners.find((p) => p.isMain && p.isActive) ?? allPartners[0])

    encounters.insert({
      id: uuid(),
      date: dateStr,
      activities: [emoji],
      partnerIds: target ? [target.id] : [],
      stars: null,
      notes: null,
      createdAt: nowStr,
      updatedAt: nowStr,
    })
    const d = new Date(dateStr + 'T00:00:00')
    const dateLabel = `${DAY_NAMES[d.getDay()].slice(0, 3)}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`
    setLoggedOverlay({
      partnerInitials: target?.avatarValue,
      partnerGradient: target?.avatarGradient,
      partnerName: target?.displayName,
      emoji,
      dateLabel,
    })
    if (overlayTimer.current) clearTimeout(overlayTimer.current)
    overlayTimer.current = setTimeout(() => setLoggedOverlay(null), 1400)
  }

  function handleQuickLog(emoji: string) {
    // Encounter.date is local-calendar 'YYYY-MM-DD' (see lib/stats/windows.ts).
    // Using new Date().toISOString().split('T')[0] would give the UTC date —
    // wrong after ~4pm PST.
    insertQuickEncounter(emoji, formatDateString(new Date()))
  }

  function handleDayDrop(day: number, emoji: string) {
    const dateStr = formatDateString(new Date(year, month - 1, day))
    insertQuickEncounter(emoji, dateStr)
    setSelectedDay(day)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  return (
    <CalendarScreen
      month={month}
      year={year}
      today={isCurrentMonth ? now.getDate() : undefined}
      isCurrentMonth={isCurrentMonth}
      loggedDays={loggedDays}
      selectedDay={selectedDay}
      selectedDayLabel={selectedDayLabel}
      daySessions={daySessions}
      onPrevMonth={handlePrevMonth}
      onNextMonth={handleNextMonth}
      onDayPress={setSelectedDay}
      onQuickLog={handleQuickLog}
      onDayDrop={handleDayDrop}
      onSessionPress={(id) => router.push(`/(pages)/session-detail?id=${id}`)}
      quickLogEmojis={quickLogEmojis}
      loggedOverlay={loggedOverlay}
    />
  )
}
