import React from 'react'
import { colors, webFonts } from '../theme'

export interface LoggedDay {
  day: number
  emoji: string
  hasMultiple?: boolean
}

export interface CalendarGridProps {
  month: number       // 0-11 (JS Date convention)
  year: number
  today?: number
  selectedDay?: number
  loggedDays: LoggedDay[]
  onDayPress?: (day: number) => void
  compact?: boolean
}

/* ── Helpers ── */

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(month: number, year: number): number {
  return new Date(year, month, 1).getDay()
}

/* ── Day cell ── */

const DayCell: React.FC<{
  day: number
  isToday: boolean
  isSelected: boolean
  logged?: LoggedDay
  compact: boolean
  onPress?: () => void
}> = ({ day, isToday, isSelected, logged, compact, onPress }) => {
  const isLoggedDay = !!logged
  const fontSize = compact ? 11 : 12
  const emojiFontSize = compact ? 7 : 8
  const plusFontSize = compact ? 6 : 7

  let bgStyle: React.CSSProperties = {}
  if (isToday) {
    bgStyle = { background: 'linear-gradient(135deg, #C07858, #7C4A5A)' }
  } else if (isSelected) {
    bgStyle = {
      background: 'rgba(192,120,88,0.15)',
      border: `2px solid ${colors.terra}`,
    }
  }

  return (
    <div
      onClick={onPress}
      style={{
        aspectRatio: '1',
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        ...bgStyle,
      }}
    >
      <span style={{
        fontFamily: webFonts.dmSans,
        fontSize,
        lineHeight: 1,
        color: isToday ? colors.white : isLoggedDay ? colors.terra : colors.ink,
        fontWeight: isToday ? 700 : isLoggedDay ? 500 : 400,
      }}>
        {day}
      </span>
      {isLoggedDay && !isToday && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          lineHeight: 1,
          marginTop: 1,
        }}>
          <span style={{ fontSize: emojiFontSize }}>{logged!.emoji}</span>
          {logged!.hasMultiple && (
            <span style={{
              fontSize: plusFontSize,
              fontWeight: 600,
              color: colors.mauve,
              marginLeft: 1,
            }}>+</span>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Main component ── */

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  month,
  year,
  today,
  selectedDay,
  loggedDays,
  onDayPress,
  compact = false,
}) => {
  const daysInMonth = getDaysInMonth(month, year)
  const firstDow = getFirstDayOfWeek(month, year)

  const logMap = new Map<number, LoggedDay>()
  loggedDays.forEach((ld) => logMap.set(ld.day, ld))

  const headerFontSize = compact ? 8 : 9

  const cells: React.ReactNode[] = []
  for (let i = 0; i < firstDow; i++) {
    cells.push(
      <div key={`empty-${i}`} style={{ aspectRatio: '1', pointerEvents: 'none' }} />
    )
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const day = d
    cells.push(
      <DayCell
        key={day}
        day={day}
        isToday={day === today}
        isSelected={day === selectedDay}
        logged={logMap.get(day)}
        compact={compact}
        onPress={() => onDayPress?.(day)}
      />
    )
  }

  return (
    <div>
      {/* Day-of-week header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        marginBottom: compact ? 2 : 4,
      }}>
        {DAY_LABELS.map((label) => (
          <div key={label} style={{
            textAlign: 'center',
            fontFamily: webFonts.dmSans,
            fontSize: headerFontSize,
            fontWeight: 500,
            letterSpacing: compact ? 0.8 : 0.5,
            color: colors.stone,
            textTransform: 'uppercase',
            padding: '3px 0',
          }}>
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: compact ? 0 : 2,
      }}>
        {cells}
      </div>
    </div>
  )
}
