import { useMemo } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SessionsListScreen, type SessionsListEntry } from '@/lib/screens/SessionsListScreen'
import { encounters, partners } from '@/src/db'
import { filterByWindow, formatPeriodCaption, getWindow, parseDateString, type Period } from '@/lib/stats'

const CALENDAR_START_DAY = 'sunday' as const

const VALID_PERIODS = new Set<Period>(['week', 'month', 'year'])

function isValidPeriod(value: string | undefined): value is Period {
  return value !== undefined && VALID_PERIODS.has(value as Period)
}

function titleFor(period: Period, anchor: Date, now: Date): string {
  if (period === 'week') {
    const sameWeek = (() => {
      const w1 = anchor.getTime()
      const diff = Math.abs(now.getTime() - w1) / (1000 * 60 * 60 * 24)
      return diff < 7
    })()
    return sameWeek ? 'This week' : 'Sessions'
  }
  if (period === 'month') {
    const sameMonth = anchor.getFullYear() === now.getFullYear() && anchor.getMonth() === now.getMonth()
    return sameMonth ? 'This month' : 'Sessions'
  }
  // year
  const sameYear = anchor.getFullYear() === now.getFullYear()
  return sameYear ? 'This year' : 'Sessions'
}

export default function SessionsListRoute() {
  const router = useRouter()
  const params = useLocalSearchParams<{ period?: string; anchor?: string }>()

  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters })),
  )
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners })),
  )

  const period: Period = isValidPeriod(params.period) ? params.period : 'week'
  const anchor = useMemo(() => {
    if (params.anchor) {
      try {
        return parseDateString(params.anchor)
      } catch {
        /* fall through */
      }
    }
    return new Date()
  }, [params.anchor])

  const now = useMemo(() => new Date(), [])
  const window = useMemo(
    () =>
      getWindow(period, anchor, {
        calendarStartDay: CALENDAR_START_DAY,
        encounters: allEncounters,
        now,
      }),
    [period, anchor, allEncounters, now],
  )

  const filteredEncounters = useMemo(
    () => (window ? filterByWindow(allEncounters, window) : []),
    [allEncounters, window],
  )

  const entries: SessionsListEntry[] = useMemo(() => {
    const partnerById = new Map(allPartners.map((p) => [p.id, p]))
    return filteredEncounters
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((enc) => {
        const sessionPartners = enc.partnerIds
          .map((pid) => partnerById.get(pid))
          .filter((p): p is NonNullable<typeof p> => Boolean(p))
        return {
          id: enc.id,
          partners: sessionPartners.map((p) => ({
            initials: p.avatarValue,
            gradient: p.avatarGradient,
          })),
          date: new Date(enc.date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }),
          rating: enc.stars,
          tags: enc.activities,
          note: enc.notes ?? undefined,
        }
      })
  }, [filteredEncounters, allPartners])

  const title = titleFor(period, anchor, now)
  const caption = formatPeriodCaption(period, anchor, {
    calendarStartDay: CALENDAR_START_DAY,
    now,
  })
  const subtitle = `${caption} · ${entries.length} ${entries.length === 1 ? 'session' : 'sessions'}`

  return (
    <SessionsListScreen
      title={title}
      subtitle={subtitle}
      entries={entries}
      onBack={() => router.back()}
      onEntryPress={(id) => router.push(`/(pages)/session-detail?id=${id}`)}
    />
  )
}
