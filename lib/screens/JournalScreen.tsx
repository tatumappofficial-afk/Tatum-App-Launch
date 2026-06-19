import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { FlashList, type FlashListRef, type ViewToken } from '@shopify/flash-list'
import { Image } from 'expo-image'
import Svg, { Line, Polyline } from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, font, fontFamily, gradientPoints, gradients, shadows, typography } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { StatusBarSpacer } from './shared/StatusBarSpacer'
import { AvatarStack } from '../components/AvatarStack'
import { GradientButton } from '../components/GradientButton'
import { DatePickerDropdown } from '../components/DatePickerDropdown'
import type { LoggedDay } from '../components/CalendarGrid'

/* ── Types ── */

export interface JournalPartner {
  initials: string
  gradient: string // CSS linear-gradient value
}

export interface JournalEntry {
  id: string
  partners: JournalPartner[]
  /** Display label, e.g. "Sat, Mar 14" */
  date: string
  /** Raw ISO date YYYY-MM-DD — used for calendar navigation and visible-month tracking */
  isoDate: string
  /** `null` (or 0) means the session is unrated; the widget renders "Not rated" instead of "0/10". */
  score: number | null
  maxScore?: number
  tags: string[] // emoji strings
  mood?: { emoji: string; label: string }
  note?: string
  monthSeparator?: string // rendered before this entry
}

export interface JournalScreenProps {
  entries: JournalEntry[]
  /** Storybook-only override; in the app the screen tracks the visible month from scroll. */
  initialVisibleIsoDate?: string
  onEntryPress?: (id: string) => void
  onLogFirstSession?: () => void
}

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

function isoToParts(iso: string): { year: number; month: number; day: number } {
  const [y, m, d] = iso.split('-').map((s) => parseInt(s, 10))
  return { year: y, month: m - 1, day: d }
}

function monthLabelFromIso(iso: string): string {
  const { year, month } = isoToParts(iso)
  return `${MONTH_NAMES[month]} ${year}`
}

/* ── Sub-components ── */

const ChevronDown: React.FC<{ color?: string; size?: number }> = ({ color = 'rgba(255,255,255,0.75)', size = 14 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Polyline points="6 9 12 15 18 9" />
  </Svg>
)

const ChevronUp: React.FC<{ color?: string; size?: number }> = ({ color = 'rgba(255,255,255,0.75)', size = 14 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Polyline points="6 15 12 9 18 15" />
  </Svg>
)

const PlusIcon: React.FC<{ color?: string; size?: number }> = ({ color = 'white', size = 16 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.5}
    strokeLinecap="round"
  >
    <Line x1={12} y1={5} x2={12} y2={19} />
    <Line x1={5} y1={12} x2={19} y2={12} />
  </Svg>
)

/* ── Month Separator ── */

const MonthSeparator: React.FC<{ label: string }> = ({ label }) => (
  <View style={styles.monthSeparator}>
    <Text style={styles.monthSeparatorLabel}>{label}</Text>
    <View style={styles.monthSeparatorRule} />
  </View>
)

/* ── Entry Card ── */

const EntryCard: React.FC<{ entry: JournalEntry; onPress?: () => void }> = ({ entry, onPress }) => {
  const isCompact = !entry.note

  return (
    <View style={styles.entryWrapper}>
      {/* Shadow stack behind (depth) */}
      <View style={styles.entryShadow} />

      {/* Main paper — entire card is the press target */}
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Session on ${entry.date}`}
        android_ripple={{ color: 'rgba(192,120,88,0.12)' }}
        style={({ pressed }) => [styles.entryPaper, pressed && onPress ? { opacity: 0.85 } : null]}
      >
        {/* Margin line */}
        <View style={styles.entryMarginLine} />

        {/* Header band */}
        <View style={styles.entryHeader}>
          {/* Left side */}
          <View style={styles.entryHeaderLeft}>
            {/* Discretion-first: identify the session by the initials avatar
                only — never the partner's full name. */}
            <AvatarStack partners={entry.partners} size={32} borderWidth={2} />
            <View>
              <Text style={styles.entryDate}>{entry.date}</Text>
            </View>
          </View>

          {/* Right side — score */}
          <View style={styles.entryHeaderRight}>
            {entry.score && entry.score > 0 ? (
              <View style={styles.entryScoreRow}>
                <Text style={styles.entryScore}>{entry.score}</Text>
                <Text style={styles.entryScoreSlash}>/</Text>
                <Text style={styles.entryMaxScore}>{entry.maxScore ?? 10}</Text>
              </View>
            ) : (
              <Text style={styles.entryUnrated}>Not rated</Text>
            )}
          </View>
        </View>

        {/* Tags row */}
        <View style={styles.entryTagsRow}>
          {entry.tags.map((tag, i) => (
            <Text key={i} style={styles.entryTag}>
              {tag}
            </Text>
          ))}
          {entry.mood && (
            <Text style={styles.entryMood}>
              {entry.mood.emoji} {entry.mood.label}
            </Text>
          )}
        </View>

        {/* Note body */}
        {!isCompact && (
          <View style={styles.entryNoteBody}>
            <Text style={styles.entryNote}>{entry.note}</Text>
          </View>
        )}

        {/* Compact cards: smaller bottom padding area */}
        {isCompact && <View style={styles.entryCompactBottom} />}
      </Pressable>
    </View>
  )
}

/* ── Empty State ── */

const EmptyState: React.FC<{ onLogSession?: () => void }> = ({ onLogSession }) => (
  <View style={styles.emptyState}>
    {/* Stacked blank journal cards */}
    <View style={styles.emptyStackArea}>
      {/* Card 3 - furthest back */}
      <View style={styles.emptyCard3} />
      {/* Card 2 */}
      <View style={styles.emptyCard2} />
      {/* Card 1 - front */}
      <View style={styles.emptyCard1}>
        {/* Margin line */}
        <View style={styles.emptyCard1MarginLine} />
        {/* Center icon */}
        <View style={styles.emptyCard1IconWrapper}>
          <Image source={require('@/assets/tatum-logo.png')} style={styles.emptyCard1Image} />
        </View>
      </View>
    </View>

    <Text style={styles.emptyHeading}>Your story starts here.</Text>

    <Text style={styles.emptyBody}>
      As you log sessions, they'll appear here as private journal entries — yours to read, remember, and return to.
    </Text>

    <Text style={styles.emptyQuote}>"Feel seen, validated, and completely empowered."</Text>

    <GradientButton
      label="Log your first session"
      fullWidth={false}
      letterSpacing={1.5}
      icon={<PlusIcon />}
      onPress={onLogSession}
    />
  </View>
)

/* ── Main Screen ── */

export const JournalScreen: React.FC<JournalScreenProps> = ({
  entries,
  initialVisibleIsoDate,
  onEntryPress,
  onLogFirstSession,
}) => {
  const isEmpty = entries.length === 0

  // Visible-month tracking — initialised to the topmost (newest) entry, then
  // updated as the user scrolls.
  const initialIso = initialVisibleIsoDate ?? entries[0]?.isoDate ?? new Date().toISOString().split('T')[0]
  const [visibleIso, setVisibleIso] = useState(initialIso)
  const visibleParts = isoToParts(visibleIso)
  const visibleMonthLabel = monthLabelFromIso(visibleIso)

  // Calendar dropdown state — independent so user can navigate months freely.
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calMonth, setCalMonth] = useState(visibleParts.month)
  const [calYear, setCalYear] = useState(visibleParts.year)

  // Today (for highlighting the current day in the calendar).
  const todayObj = new Date()
  const todayIsCurrentMonth = todayObj.getMonth() === calMonth && todayObj.getFullYear() === calYear

  // Logged days for the calendar's currently displayed month.
  const loggedDays = useMemo<LoggedDay[]>(() => {
    const prefix = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-`
    const byDay = new Map<number, { emoji: string; count: number }>()
    for (const e of entries) {
      if (!e.isoDate.startsWith(prefix)) continue
      const day = parseInt(e.isoDate.slice(8, 10), 10)
      const existing = byDay.get(day)
      const emoji = e.tags[0] ?? '✨'
      if (existing) existing.count++
      else byDay.set(day, { emoji, count: 1 })
    }
    return [...byDay.entries()].map(([day, v]) => ({ day, emoji: v.emoji, hasMultiple: v.count > 1 }))
  }, [entries, calMonth, calYear])

  // Entry count for the visible-month pill badge.
  const visibleMonthCount = useMemo(() => {
    const prefix = `${visibleParts.year}-${String(visibleParts.month + 1).padStart(2, '0')}-`
    return entries.filter((e) => e.isoDate.startsWith(prefix)).length
  }, [entries, visibleParts.year, visibleParts.month])

  const listRef = useRef<FlashListRef<JournalEntry>>(null)

  function openCalendar() {
    setCalMonth(visibleParts.month)
    setCalYear(visibleParts.year)
    setCalendarOpen(true)
  }

  function changeCalMonth(delta: number) {
    let m = calMonth + delta
    let y = calYear
    if (m < 0) {
      m = 11
      y--
    } else if (m > 11) {
      m = 0
      y++
    }
    setCalMonth(m)
    setCalYear(y)
  }

  function handleDayPick(day: number) {
    const picked = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setCalendarOpen(false)
    // We render with loggedOnly so non-logged days are non-pressable; an
    // exact-match find is enough.
    const idx = entries.findIndex((e) => e.isoDate === picked)
    if (idx >= 0) {
      listRef.current?.scrollToIndex({ index: idx, animated: true })
    }
  }

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken<JournalEntry>[] }) => {
    const top = viewableItems[0]?.item
    if (top?.isoDate) setVisibleIso(top.isoDate)
  }, [])

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current

  return (
    <View style={styles.screenContainer}>
      <DecorativeGlow position="top-right" size={200} opacity={0.08} />
      <StatusBarSpacer />

      {/* Screen header */}
      <View style={styles.screenHeader}>
        <Text style={typography.screenTitle}>Sessions Journal</Text>
      </View>

      {/* Sticky month bar */}
      <View style={styles.monthBar}>
        {isEmpty ? (
          /* Ghost pill for empty state */
          <View style={styles.ghostPill}>
            <Text style={styles.ghostPillText}>No entries yet</Text>
            <ChevronDown color="#C4B0A0" size={13} />
          </View>
        ) : (
          <Pressable
            onPress={() => (calendarOpen ? setCalendarOpen(false) : openCalendar())}
            accessibilityRole="button"
            accessibilityLabel={`Toggle calendar, ${visibleMonthLabel}`}
            accessibilityState={{ expanded: calendarOpen }}
            style={styles.monthPill}
          >
            <LinearGradient
              colors={gradients.primaryCta}
              start={gradientPoints.diagonal.start}
              end={gradientPoints.diagonal.end}
              style={[StyleSheet.absoluteFill, { borderRadius: 9999 }]}
            />
            <Text style={styles.monthPillLabel}>{visibleMonthLabel}</Text>
            <Text style={styles.monthPillBadge}>{visibleMonthCount}</Text>
            {calendarOpen ? <ChevronUp /> : <ChevronDown />}
          </Pressable>
        )}

        {/* Calendar dropdown */}
        {calendarOpen && (
          <View style={styles.calendarDropdown}>
            <DatePickerDropdown
              month={calMonth}
              year={calYear}
              today={todayIsCurrentMonth ? todayObj.getDate() : undefined}
              loggedDays={loggedDays}
              onMonthChange={changeCalMonth}
              onDaySelect={handleDayPick}
              loggedOnly
              hint="Tap a logged date to jump to that entry"
            />
          </View>
        )}
      </View>

      {/* Dim overlay */}
      {calendarOpen && <Pressable onPress={() => setCalendarOpen(false)} style={styles.dimOverlay} />}

      {/* Content */}
      {isEmpty ? (
        <EmptyState onLogSession={onLogFirstSession} />
      ) : (
        <FlashList
          ref={listRef}
          data={entries}
          keyExtractor={(entry) => entry.id}
          contentContainerStyle={styles.listContent}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item }) => (
            <>
              {item.monthSeparator && <MonthSeparator label={item.monthSeparator} />}
              <EntryCard entry={item} onPress={() => onEntryPress?.(item.id)} />
            </>
          )}
        />
      )}
    </View>
  )
}

/* ── Styles ── */

const styles = StyleSheet.create({
  monthSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 10,
  },
  monthSeparatorLabel: {
    fontSize: 8,
    fontFamily: font('dmSans', '500'),
    letterSpacing: 3.5,
    textTransform: 'uppercase',
    color: colors.terra,
  },
  monthSeparatorRule: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(160,100,80,0.18)',
  },
  entryWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  entryShadow: {
    position: 'absolute',
    bottom: -4,
    left: 6,
    right: -6,
    top: 4,
    backgroundColor: colors.surface2,
    borderRadius: 16,
    zIndex: 0,
  },
  entryPaper: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(160,100,80,0.14)',
    overflow: 'hidden',
    ...shadows.cardSubtle,
  },
  entryMarginLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 50,
    width: 1,
    backgroundColor: 'rgba(192,120,88,0.12)',
    zIndex: 0,
  },
  entryHeader: {
    position: 'relative',
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 11,
    paddingBottom: 10,
    paddingLeft: 14,
    paddingRight: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160,100,80,0.1)',
    backgroundColor: 'rgba(245,239,232,0.6)',
  },
  entryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  entryDate: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.stone,
    marginTop: 2,
  },
  entryHeaderRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  entryScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  entryScore: {
    fontFamily: font('playfair', '700'),
    fontSize: 22,
    color: colors.terra,
    lineHeight: 22,
  },
  entryScoreSlash: {
    fontSize: 13,
    fontWeight: '300',
    color: '#C4B0A0',
    marginHorizontal: 1,
  },
  entryMaxScore: {
    fontSize: 12,
    fontWeight: '300',
    color: '#C4B0A0',
  },
  entryUnrated: {
    fontSize: 13,
    fontFamily: font('dmSans', '400'),
    fontStyle: 'italic',
    color: '#C4B0A0',
  },
  entryTagsRow: {
    position: 'relative',
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
    paddingTop: 7,
    paddingHorizontal: 14,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160,100,80,0.07)',
  },
  entryTag: {
    fontSize: 18,
    backgroundColor: 'rgba(237,227,216,0.85)',
    borderRadius: 7,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  entryMood: {
    fontSize: 10,
    backgroundColor: 'rgba(192,120,88,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(192,120,88,0.2)',
    borderRadius: 9999,
    paddingVertical: 2,
    paddingHorizontal: 8,
    color: colors.terra,
  },
  entryNoteBody: {
    position: 'relative',
    zIndex: 2,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 14,
    minHeight: 56,
  },
  entryNote: {
    fontFamily: fontFamily.playfair,
    fontSize: 16,
    fontWeight: '400',
    fontStyle: 'italic',
    color: '#5A3E36',
    lineHeight: 28,
    letterSpacing: 0.1,
  },
  entryCompactBottom: {
    position: 'relative',
    zIndex: 2,
    minHeight: 0,
    paddingTop: 7,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  emptyState: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  emptyStackArea: {
    position: 'relative',
    width: 240,
    height: 130,
    marginBottom: 28,
  },
  emptyCard3: {
    position: 'absolute',
    width: 200,
    height: 110,
    top: 20,
    left: 20,
    opacity: 0.4,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(160,100,80,0.12)',
  },
  emptyCard2: {
    position: 'absolute',
    width: 220,
    height: 118,
    top: 10,
    left: 10,
    opacity: 0.65,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(160,100,80,0.12)',
  },
  emptyCard1: {
    position: 'absolute',
    width: 240,
    height: 130,
    top: 0,
    left: 0,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(160,100,80,0.12)',
  },
  emptyCard1MarginLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 40,
    width: 1,
    backgroundColor: 'rgba(192,120,88,0.12)',
  },
  emptyCard1IconWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard1Image: {
    width: 80,
    height: 80,
    opacity: 0.3,
  },
  emptyHeading: {
    fontFamily: font('playfair', '700'),
    fontSize: 22,
    color: colors.ink,
    marginBottom: 10,
    lineHeight: 29,
    textAlign: 'center',
  },
  emptyBody: {
    fontFamily: font('dmSans', '300'),
    fontSize: 13,
    color: colors.stone,
    lineHeight: 22,
    marginBottom: 26,
    textAlign: 'center',
  },
  emptyQuote: {
    fontFamily: fontFamily.playfair,
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.mauve,
    marginBottom: 28,
    lineHeight: 22,
    textAlign: 'center',
  },
  screenContainer: {
    width: '100%',
    flex: 1,
    overflow: 'hidden',
  },
  screenHeader: {
    paddingTop: 4,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
  },
  monthBar: {
    flexShrink: 0,
    paddingTop: 10,
    paddingHorizontal: 24,
    position: 'relative',
    zIndex: 50,
  },
  ghostPill: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.surface2,
    borderRadius: 9999,
    paddingVertical: 7,
    paddingLeft: 16,
    paddingRight: 12,
  },
  ghostPillText: {
    fontFamily: font('playfair', '600'),
    fontSize: 14,
    color: '#C4B0A0',
    letterSpacing: 0.3,
  },
  monthPill: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 7,
    borderRadius: 9999,
    paddingVertical: 7,
    paddingLeft: 16,
    paddingRight: 12,
    overflow: 'hidden',
    ...shadows.pillSoft,
  },
  monthPillLabel: {
    fontFamily: font('playfair', '600'),
    fontSize: 15,
    color: 'white',
    letterSpacing: 0.3,
  },
  monthPillBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 9999,
    paddingVertical: 1,
    paddingHorizontal: 7,
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.5,
    overflow: 'hidden',
  },
  calendarDropdown: {
    position: 'absolute',
    top: 48,
    left: 24,
    right: 24,
    zIndex: 200,
  },
  dimOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30,18,12,0.22)',
    zIndex: 40,
  },
  listContent: {
    paddingTop: 12,
    paddingHorizontal: 20,
  },
})
