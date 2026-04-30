import React from 'react'
import { DatePickerDropdown } from '../../../components/DatePickerDropdown'
import { MonthYearDropdown } from '../../../components/MonthYearDropdown'
import { YearDropdown } from '../../../components/YearDropdown'
import type { Encounter } from '@/src/db/schema'
import { useLoggedDaysForMonth } from '@/src/hooks/useLoggedDaysForMonth'
import type { CalendarStartDay, Period } from '../../../stats'

export interface PeriodPickerProps {
  period: Period
  /** Anchor date driving what's currently shown as selected. */
  anchor: Date
  /** Year of the user's first encounter (or current year if none). */
  minYear: number
  /** Inclusive maximum year (current year). */
  maxYear: number
  /** "Today" (any Date) used to determine the forward boundary in pickers. */
  now: Date
  calendarStartDay: CalendarStartDay
  /** All encounters — used by the week picker to render emoji previews on days. */
  encounters?: Encounter[]
  onAnchorChange: (next: Date) => void
}

export const PeriodPicker: React.FC<PeriodPickerProps> = (props) => {
  switch (props.period) {
    case 'week':
      return <WeekPicker {...props} />
    case 'month':
      return <MonthPicker {...props} />
    case 'year':
      return <YearPicker {...props} />
    case 'all':
    default:
      return null
  }
}

// ── Per-period pickers ──

const WeekPicker: React.FC<PeriodPickerProps> = ({
  anchor,
  minYear,
  maxYear,
  now,
  encounters,
  onAnchorChange,
}) => {
  const [view, setView] = React.useState({
    month: anchor.getMonth(),
    year: anchor.getFullYear(),
  })

  // Keep visible month in sync if anchor changes from outside.
  React.useEffect(() => {
    setView({ month: anchor.getMonth(), year: anchor.getFullYear() })
  }, [anchor])

  const stepMonth = React.useCallback(
    (delta: number) => {
      setView(prev => {
        let m = prev.month + delta
        let y = prev.year
        while (m < 0) { m += 12; y -= 1 }
        while (m > 11) { m -= 12; y += 1 }
        if (y < minYear) return prev
        if (y > maxYear) return prev
        if (y === maxYear && m > now.getMonth()) return prev
        return { month: m, year: y }
      })
    },
    [minYear, maxYear, now],
  )

  const loggedDays = useLoggedDaysForMonth(view.month, view.year, encounters ?? [])

  const isCurrentMonth = view.month === now.getMonth() && view.year === now.getFullYear()
  const showSelected = anchor.getMonth() === view.month && anchor.getFullYear() === view.year

  return (
    <DatePickerDropdown
      month={view.month}
      year={view.year}
      today={isCurrentMonth ? now.getDate() : undefined}
      selectedDay={showSelected ? anchor.getDate() : undefined}
      loggedDays={loggedDays}
      onDaySelect={(day) => onAnchorChange(new Date(view.year, view.month, day))}
      onMonthChange={stepMonth}
      mode="week"
    />
  )
}

const MonthPicker: React.FC<PeriodPickerProps> = ({
  anchor,
  minYear,
  maxYear,
  now,
  onAnchorChange,
}) => (
  <MonthYearDropdown
    year={anchor.getFullYear()}
    selectedMonth={anchor.getMonth()}
    minYear={minYear}
    maxYear={maxYear}
    currentMonthInMaxYear={now.getMonth()}
    onYearChange={(delta) => {
      const nextYear = anchor.getFullYear() + delta
      if (nextYear < minYear || nextYear > maxYear) return
      const cappedMonth =
        nextYear === maxYear && anchor.getMonth() > now.getMonth()
          ? now.getMonth()
          : anchor.getMonth()
      onAnchorChange(new Date(nextYear, cappedMonth, 1))
    }}
    onSelect={(month, year) => onAnchorChange(new Date(year, month, 1))}
  />
)

const YearPicker: React.FC<PeriodPickerProps> = ({
  anchor,
  minYear,
  maxYear,
  onAnchorChange,
}) => (
  <YearDropdown
    selectedYear={anchor.getFullYear()}
    minYear={minYear}
    maxYear={maxYear}
    onSelect={(year) => onAnchorChange(new Date(year, 0, 1))}
  />
)
