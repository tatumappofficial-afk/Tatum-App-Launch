import { useCallback, useMemo, useState } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { useRouter } from 'expo-router'
import { HomeScreen } from '@/lib/screens/HomeScreen'
import { WeekView } from '@/lib/screens/home/WeekView'
import { MonthView } from '@/lib/screens/home/MonthView'
import { YearView } from '@/lib/screens/home/YearView'
import { AllTimeView } from '@/lib/screens/home/AllTimeView'
import { PlaceholderView } from '@/lib/screens/home/PlaceholderView'
import { activityTags, desireEntries, encounters, partners } from '@/src/db'
import { useUserProfile } from '@/src/hooks/useUserProfile'
import {
  computeAllTimeStats,
  computeMonthStats,
  computeWeekStats,
  computeYearStats,
  findNearestEncounterDate,
  parseDateString,
  type CalendarStartDay,
  type Period,
} from '@/lib/stats'
import { PeriodPicker } from '@/lib/screens/home/shared/PeriodPicker'
import { usePeriodWindow } from '@/src/hooks/usePeriodWindow'

// TODO: read from UserSettings (`calendarStartDay`) once a settings UI lands.
const CALENDAR_START_DAY: CalendarStartDay = 'sunday'

export default function HomeRoute() {
  const router = useRouter()

  const { data: allEncounters = [], isReady: encReady } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters })),
  )
  const { data: allPartners = [], isReady: partReady } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners })),
  )
  const { data: allTags = [] } = useLiveQuery((q) =>
    q.from({ activityTags }).select(({ activityTags }) => ({ ...activityTags })),
  )
  const { data: allDesires = [] } = useLiveQuery((q) =>
    q.from({ desireEntries }).select(({ desireEntries }) => ({ ...desireEntries })),
  )
  const { displayName: userName } = useUserProfile()

  const ready = encReady && partReady
  const readyEncounters = ready ? allEncounters : []
  const readyPartners = ready ? allPartners : []

  const [period, setPeriod] = useState<Period>('month')
  const [anchor, setAnchor] = useState<Date>(() => new Date())
  const [pickerOpen, setPickerOpen] = useState(false)

  const handlePeriodChange = (next: Period) => {
    setPeriod(next)
    setAnchor(new Date())
    setPickerOpen(false)
  }

  const handleAnchorChange = useCallback((next: Date) => {
    setAnchor(next)
    setPickerOpen(false)
  }, [])

  const isEmpty = ready && readyEncounters.length === 0

  const { window, caption, emptyScenario, firstEncounterDate, minYear, maxYear, now } = usePeriodWindow(
    period,
    anchor,
    readyEncounters,
    CALENDAR_START_DAY,
  )

  const pickerContent = useMemo(() => {
    if (period === 'all') return null
    return (
      <PeriodPicker
        period={period}
        anchor={anchor}
        minYear={minYear}
        maxYear={maxYear}
        now={now}
        calendarStartDay={CALENDAR_START_DAY}
        encounters={readyEncounters}
        onAnchorChange={handleAnchorChange}
      />
    )
  }, [period, anchor, minYear, maxYear, now, readyEncounters, handleAnchorChange])

  const handleLookBack = useCallback(() => {
    setAnchor((prev) => {
      const next = new Date(prev)
      if (period === 'week') next.setDate(next.getDate() - 7)
      else if (period === 'month') next.setMonth(next.getMonth() - 1)
      else if (period === 'year') next.setFullYear(next.getFullYear() - 1)
      return next
    })
  }, [period])

  const handleJumpToNearest = useCallback(() => {
    const nearest = findNearestEncounterDate(readyEncounters, anchor)
    if (nearest) setAnchor(parseDateString(nearest))
  }, [readyEncounters, anchor])

  const handlePartnerPress = useCallback((id: string) => router.push(`/(pages)/partner-profile?id=${id}`), [router])
  const handleSessionPress = useCallback((id: string) => router.push(`/(pages)/session-detail?id=${id}`), [router])
  const handleSessionsHeaderPress = useCallback(() => {
    if (period === 'all') return
    const anchorIso = anchor.toISOString().split('T')[0]
    router.push(`/(pages)/sessions-list?period=${period}&anchor=${anchorIso}`)
  }, [router, period, anchor])

  const viewContent = useMemo(() => {
    if (!ready) return null
    if (!window) {
      // Should only happen when period === 'all' AND zero encounters, but the
      // parent's isEmpty branch catches that — render a placeholder defensively.
      return <PlaceholderView label="Nothing logged yet — and that's okay." />
    }
    const anchorIso = anchor.toISOString().split('T')[0]
    const goToPartnersPeriod = () => router.push(`/(pages)/partners-period?period=${period}&anchor=${anchorIso}`)
    if (period === 'week') {
      const stats = computeWeekStats(readyEncounters, readyPartners, allTags, window, CALENDAR_START_DAY)
      return (
        <WeekView
          stats={stats}
          partners={readyPartners}
          emptyScenario={emptyScenario}
          onLookBack={handleLookBack}
          onJumpToNearest={handleJumpToNearest}
          onPartnerPress={handlePartnerPress}
          onPartnersHeaderPress={goToPartnersPeriod}
          onSessionsHeaderPress={handleSessionsHeaderPress}
          onSessionPress={(e) => handleSessionPress(e.id)}
        />
      )
    }
    if (period === 'month') {
      const stats = computeMonthStats(readyEncounters, readyPartners, allTags, window, CALENDAR_START_DAY)
      return (
        <MonthView
          stats={stats}
          partners={readyPartners}
          calendarStartDay={CALENDAR_START_DAY}
          emptyScenario={emptyScenario}
          onLookBack={handleLookBack}
          onJumpToNearest={handleJumpToNearest}
          onPartnerPress={handlePartnerPress}
          onViewAllPartners={goToPartnersPeriod}
          onSessionsHeaderPress={handleSessionsHeaderPress}
          onSessionPress={(e) => handleSessionPress(e.id)}
        />
      )
    }
    if (period === 'year') {
      const stats = computeYearStats(readyEncounters, readyPartners, allTags, allDesires, window, CALENDAR_START_DAY)
      return (
        <YearView
          stats={stats}
          partners={readyPartners}
          calendarStartDay={CALENDAR_START_DAY}
          emptyScenario={emptyScenario}
          onLookBack={handleLookBack}
          onJumpToNearest={handleJumpToNearest}
          onPartnerPress={(p) => handlePartnerPress(p.id)}
          onViewAllPartners={goToPartnersPeriod}
          onSessionsHeaderPress={handleSessionsHeaderPress}
          onSessionPress={(e) => handleSessionPress(e.id)}
        />
      )
    }
    const stats = computeAllTimeStats(readyEncounters, readyPartners, allTags, window, CALENDAR_START_DAY)
    return (
      <AllTimeView
        stats={stats}
        calendarStartDay={CALENDAR_START_DAY}
        onPartnerPress={(p) => handlePartnerPress(p.id)}
        onViewAllPartners={() => router.push('/(pages)/partners')}
        onSessionPress={(e) => handleSessionPress(e.id)}
      />
    )
  }, [
    ready,
    period,
    anchor,
    window,
    readyEncounters,
    readyPartners,
    allTags,
    allDesires,
    emptyScenario,
    handleLookBack,
    handleJumpToNearest,
    handlePartnerPress,
    handleSessionPress,
    handleSessionsHeaderPress,
    router,
  ])

  const emptyPartnersForHero = useMemo(
    () =>
      readyPartners.map((p) => ({
        initials: p.avatarValue,
        gradient: p.avatarGradient,
      })),
    [readyPartners],
  )

  return (
    <HomeScreen
      period={period}
      onPeriodChange={handlePeriodChange}
      caption={caption}
      staticPillCaption={firstEncounterDate ? caption : undefined}
      onPickerPress={() => setPickerOpen((prev) => !prev)}
      pickerOpen={pickerOpen && period !== 'all'}
      pickerContent={pickerContent}
      isEmpty={isEmpty}
      userName={userName}
      emptyPartners={emptyPartnersForHero}
      onPartnerPress={(index) => {
        const partner = readyPartners[index]
        if (partner) handlePartnerPress(partner.id)
      }}
      onLogFirstSession={() => router.push('/(sheets)/log-session')}
      onAddPartner={() => router.push('/(sheets)/edit-partner')}
    >
      {viewContent}
    </HomeScreen>
  )
}
