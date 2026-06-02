import { useMemo } from 'react'
import type { Encounter } from '@/src/db/schema'
import type { LoggedDay } from '@/lib/components/CalendarGrid'

/**
 * Builds the `loggedDays` array consumed by `<CalendarGrid>` from a flat list
 * of encounters and a target month/year. Aggregates encounters per day and
 * picks the first emoji as the day's preview, with `hasMultiple` set when
 * the day has more than one encounter or any encounter has multiple activities.
 *
 * @param month 0-indexed month (Jan = 0)
 * @param year four-digit year
 * @param encounters all encounters; this hook filters to the target month
 */
export function useLoggedDaysForMonth(month: number, year: number, encounters: Encounter[]): LoggedDay[] {
  return useMemo(() => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
    const monthEncounters = encounters.filter((e) => e.date.startsWith(monthStr))
    const map = new Map<number, { emojis: string[]; count: number }>()
    for (const enc of monthEncounters) {
      const day = parseInt(enc.date.split('-')[2], 10)
      const existing = map.get(day)
      if (existing) {
        existing.emojis.push(...enc.activities)
        existing.count++
      } else {
        map.set(day, { emojis: [...enc.activities], count: 1 })
      }
    }
    return [...map.entries()].map(([day, data]) => ({
      day,
      emoji: data.emojis[0] || '✨',
      hasMultiple: data.count > 1 || data.emojis.length > 1,
    }))
  }, [month, year, encounters])
}
