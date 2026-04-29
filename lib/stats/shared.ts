import type { ActivityTag, Encounter, Partner } from '@/src/db/schema'
import type { CalendarStartDay, DateWindow } from './windows'
import { parseDateString } from './windows'

// ── Filtering ──

export function filterByWindow<T extends { date: string }>(items: T[], window: DateWindow): T[] {
  return items.filter(e => e.date >= window.startStr && e.date < window.endStr)
}

// ── Activity counts / inventory ──

export interface ActivityCount {
  emoji: string
  label: string
  count: number
}

export function topActivities(
  encounters: Encounter[],
  tags: ActivityTag[],
  limit: number,
): ActivityCount[] {
  const counts = new Map<string, number>()
  for (const enc of encounters) {
    for (const emoji of enc.activities) {
      counts.set(emoji, (counts.get(emoji) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([emoji, count]) => ({ emoji, label: lookupTagLabel(emoji, tags), count }))
}

/** Every distinct emoji used in the given encounters, sorted by descending frequency. */
export function emojiInventory(encounters: Encounter[], tags: ActivityTag[]): ActivityCount[] {
  const counts = new Map<string, number>()
  for (const enc of encounters) {
    for (const emoji of enc.activities) {
      counts.set(emoji, (counts.get(emoji) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([emoji, count]) => ({ emoji, label: lookupTagLabel(emoji, tags), count }))
}

// ── Partner counts ──

export interface PartnerCount {
  partner: Partner
  count: number
}

/**
 * Counts encounters per partner. A multi-partner encounter contributes to
 * each partner in its `partnerIds`. Partners not present in `partners` (e.g.
 * a hard-deleted row) are silently skipped.
 */
export function topPartners(
  encounters: Encounter[],
  partners: Partner[],
  limit?: number,
): PartnerCount[] {
  const counts = new Map<string, number>()
  for (const enc of encounters) {
    for (const id of enc.partnerIds) {
      counts.set(id, (counts.get(id) ?? 0) + 1)
    }
  }
  const partnerById = new Map(partners.map(p => [p.id, p]))
  const ranked = [...counts.entries()]
    .map(([id, count]) => {
      const partner = partnerById.get(id)
      return partner ? { partner, count } : null
    })
    .filter((x): x is PartnerCount => x !== null)
    .sort((a, b) => b.count - a.count)
  return limit ? ranked.slice(0, limit) : ranked
}

// ── Histograms ──

/**
 * 7-element array of encounter counts indexed by day of week, ordered by the
 * user's calendar start day (so index 0 is Sunday or Monday).
 */
export function dayOfWeekHistogram(
  encounters: Encounter[],
  calendarStartDay: CalendarStartDay,
): number[] {
  const buckets = [0, 0, 0, 0, 0, 0, 0]
  for (const enc of encounters) {
    const dow = parseDateString(enc.date).getDay() // 0=Sun..6=Sat
    const idx = calendarStartDay === 'sunday' ? dow : (dow === 0 ? 6 : dow - 1)
    buckets[idx]++
  }
  return buckets
}

/** 12-element array, index 0 = January, index 11 = December. */
export function monthOfYearHistogram(encounters: Encounter[]): number[] {
  const buckets = new Array(12).fill(0) as number[]
  for (const enc of encounters) {
    buckets[parseDateString(enc.date).getMonth()]++
  }
  return buckets
}

// ── Quality stats ──

export interface MostEnjoyedActivity {
  emoji: string
  label: string
  averageStars: number
  sampleSize: number
}

/**
 * Activity with the highest average stars among activities meeting `minSample`
 * rated encounters. Returns null when no activity qualifies.
 */
export function mostEnjoyedActivity(
  encounters: Encounter[],
  tags: ActivityTag[],
  minSample = 3,
): MostEnjoyedActivity | null {
  const totals = new Map<string, { sum: number; n: number }>()
  for (const enc of encounters) {
    if (enc.stars === null) continue
    for (const emoji of enc.activities) {
      const cur = totals.get(emoji) ?? { sum: 0, n: 0 }
      cur.sum += enc.stars
      cur.n += 1
      totals.set(emoji, cur)
    }
  }
  let best: MostEnjoyedActivity | null = null
  for (const [emoji, { sum, n }] of totals) {
    if (n < minSample) continue
    const avg = sum / n
    if (!best || avg > best.averageStars) {
      best = { emoji, label: lookupTagLabel(emoji, tags), averageStars: avg, sampleSize: n }
    }
  }
  return best
}

/**
 * Top `count` activities by average stars among those meeting `minSample` rated
 * encounters. Sorted highest avg first; ties broken by larger sample size.
 */
export function topEnjoyedActivities(
  encounters: Encounter[],
  tags: ActivityTag[],
  count: number,
  minSample = 3,
): MostEnjoyedActivity[] {
  const totals = new Map<string, { sum: number; n: number }>()
  for (const enc of encounters) {
    if (enc.stars === null) continue
    for (const emoji of enc.activities) {
      const cur = totals.get(emoji) ?? { sum: 0, n: 0 }
      cur.sum += enc.stars
      cur.n += 1
      totals.set(emoji, cur)
    }
  }
  const ranked: MostEnjoyedActivity[] = []
  for (const [emoji, { sum, n }] of totals) {
    if (n < minSample) continue
    ranked.push({ emoji, label: lookupTagLabel(emoji, tags), averageStars: sum / n, sampleSize: n })
  }
  ranked.sort((a, b) => b.averageStars - a.averageStars || b.sampleSize - a.sampleSize)
  return ranked.slice(0, count)
}

/** Sessions with stars ≥ threshold, newest first. */
export function standoutSessions(encounters: Encounter[], threshold = 8): Encounter[] {
  return encounters
    .filter(e => e.stars !== null && e.stars >= threshold)
    .sort((a, b) => b.date.localeCompare(a.date))
}

/** Mean of star-rated encounters in the set. Returns null when none are rated. */
export function averageRating(encounters: Encounter[]): number | null {
  const rated = encounters.filter(e => e.stars !== null)
  if (rated.length === 0) return null
  const sum = rated.reduce((s, e) => s + (e.stars ?? 0), 0)
  return sum / rated.length
}

// ── Notes ──

export function recentNotes(encounters: Encounter[], limit = 3): Encounter[] {
  return encounters
    .filter(e => e.notes !== null && e.notes.trim().length > 0)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
}

// ── Recent sessions ──

/** Encounters sorted newest first, sliced to `limit`. */
export function recentEncounters(encounters: Encounter[], limit = 5): Encounter[] {
  return [...encounters]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
}

// ── Lifetime partner stats ──

export interface PartnerLifetimeStats {
  partner: Partner
  sessionCount: number
  averageStars: number | null
  topActivityEmoji: string | null
}

/**
 * Lifetime stats per active partner across all encounters (not period-filtered).
 * Inactive partners are excluded. Each partner's row is rendered even if
 * `sessionCount === 0` so brand-new partners are visible.
 */
export function partnerLifetimeStats(
  allEncounters: Encounter[],
  partners: Partner[],
): PartnerLifetimeStats[] {
  return partners
    .filter(p => p.isActive)
    .map(p => {
      const pEnc = allEncounters.filter(e => e.partnerIds.includes(p.id))
      const rated = pEnc.filter(e => e.stars !== null)
      const averageStars = rated.length === 0
        ? null
        : rated.reduce((s, e) => s + (e.stars ?? 0), 0) / rated.length
      const counts = new Map<string, number>()
      for (const enc of pEnc) {
        for (const emoji of enc.activities) {
          counts.set(emoji, (counts.get(emoji) ?? 0) + 1)
        }
      }
      let topEmoji: string | null = null
      let topCount = 0
      for (const [emoji, count] of counts) {
        if (count > topCount) { topEmoji = emoji; topCount = count }
      }
      return { partner: p, sessionCount: pEnc.length, averageStars, topActivityEmoji: topEmoji }
    })
}

// ── Lookup helpers ──

/**
 * Resolves an activity emoji to a label by checking the tag table (active or
 * inactive). Falls back to the emoji itself when no tag matches.
 */
export function lookupTagLabel(emoji: string, tags: ActivityTag[]): string {
  for (const t of tags) {
    if (t.emoji === emoji) return t.label
  }
  return emoji
}

/** Distinct partners present in the encounter set, including inactive ones. */
export function partnersInWindow(encounters: Encounter[], partners: Partner[]): Partner[] {
  const ids = new Set<string>()
  for (const enc of encounters) {
    for (const id of enc.partnerIds) ids.add(id)
  }
  return partners.filter(p => ids.has(p.id))
}

// ── Nearest activity (for "jump to nearest activity" CTA) ──

/**
 * Returns the encounter date string nearest to `anchor` in absolute days.
 * Used to power the "jump to nearest activity" CTA in empty-period scenarios.
 */
export function findNearestEncounterDate(encounters: Encounter[], anchor: Date): string | null {
  if (encounters.length === 0) return null
  const anchorMs = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate()).getTime()
  let best: { date: string; diff: number } | null = null
  for (const enc of encounters) {
    const [y, m, d] = enc.date.split('-').map(Number)
    const ms = new Date(y, m - 1, d).getTime()
    const diff = Math.abs(ms - anchorMs)
    if (!best || diff < best.diff) {
      best = { date: enc.date, diff }
    }
  }
  return best?.date ?? null
}

// ── Days-of-week (Week view list form) ──

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Distinct weekday names where encounters occurred, ordered by user week start. */
export function distinctWeekdays(
  encounters: Encounter[],
  calendarStartDay: CalendarStartDay,
): string[] {
  const seen = new Set<number>()
  for (const enc of encounters) {
    seen.add(parseDateString(enc.date).getDay())
  }
  const order = calendarStartDay === 'sunday'
    ? [0, 1, 2, 3, 4, 5, 6]
    : [1, 2, 3, 4, 5, 6, 0]
  return order.filter(d => seen.has(d)).map(d => WEEKDAY_SHORT[d])
}
