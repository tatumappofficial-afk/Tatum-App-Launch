import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, font, gradientPoints, gradients } from '../theme'

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

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Day ${day}${isToday ? ', today' : ''}${isSelected ? ', selected' : ''}`}
      accessibilityState={{ selected: isSelected }}
      style={{
        aspectRatio: 1,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...(isSelected && !isToday
          ? { backgroundColor: 'rgba(192,120,88,0.15)', borderWidth: 2, borderColor: colors.terra }
          : null),
      }}
    >
      {isToday && (
        <LinearGradient
          colors={gradients.primaryCta}
          start={gradientPoints.diagonal.start}
          end={gradientPoints.diagonal.end}
          style={[StyleSheet.absoluteFill, { borderRadius: 9999 }]}
        />
      )}
      <Text style={{
        fontFamily: font('dmSans', isToday ? '700' : isLoggedDay ? '500' : '400'),
        fontSize,
        lineHeight: fontSize * 1.2,
        color: isToday ? colors.white : isLoggedDay ? colors.terra : colors.ink,
      }}>
        {day}
      </Text>
      {isLoggedDay && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 1 }}>
          <Text style={{ fontSize: emojiFontSize }}>{logged!.emoji}</Text>
          {logged!.hasMultiple && (
            <Text style={{
              fontSize: plusFontSize,
              fontWeight: '600',
              color: isToday ? 'rgba(255,255,255,0.8)' : colors.mauve,
              marginLeft: 1,
            }}>+</Text>
          )}
        </View>
      )}
    </Pressable>
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
      <View key={`empty-${i}`} style={{ aspectRatio: 1 }} />
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

  // Render as rows of 7 (flex-based grid)
  const headerRow = (
    <View style={{ flexDirection: 'row', marginBottom: compact ? 2 : 4 }}>
      {DAY_LABELS.map((label) => (
        <View key={label} style={{ flex: 1, alignItems: 'center', paddingVertical: 3 }}>
          <Text style={{
            fontFamily: font('dmSans', '500'),
            fontSize: headerFontSize,
            letterSpacing: compact ? 0.8 : 0.5,
            color: colors.stone,
            textTransform: 'uppercase',
          }}>
            {label}
          </Text>
        </View>
      ))}
    </View>
  )

  // Build rows of 7 from cells
  const rows: React.ReactNode[] = []
  for (let i = 0; i < cells.length; i += 7) {
    const rowCells = cells.slice(i, i + 7)
    // Pad last row
    while (rowCells.length < 7) {
      rowCells.push(<View key={`pad-${rowCells.length}`} style={{ flex: 1 }} />)
    }
    rows.push(
      <View key={`row-${i}`} style={{ flexDirection: 'row', gap: compact ? 0 : 2 }}>
        {rowCells.map((cell, j) => (
          <View key={j} style={{ flex: 1 }}>{cell}</View>
        ))}
      </View>
    )
  }

  return (
    <View>
      {headerRow}
      <View style={{ gap: compact ? 0 : 2 }}>
        {rows}
      </View>
    </View>
  )
}
