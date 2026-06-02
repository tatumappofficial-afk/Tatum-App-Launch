import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import { Droppable } from 'react-native-reanimated-dnd'
import { colors, font, gradientPoints, gradients } from '../theme'

export interface LoggedDay {
  day: number
  emoji: string
  hasMultiple?: boolean
}

export interface CalendarGridProps {
  month: number // 0-11 (JS Date convention)
  year: number
  today?: number
  selectedDay?: number
  loggedDays: LoggedDay[]
  onDayPress?: (day: number) => void
  compact?: boolean
  /** 'day' (default): selected day highlighted as a circle.
   *  'week': the entire row containing `selectedDay` is highlighted, signalling
   *  that a tap selects the week the chosen day falls into. */
  mode?: 'day' | 'week'
  /** When true, non-logged day cells are dimmed and not pressable —
   *  used in browse contexts (e.g. the journal) where tapping a date
   *  with no entry would land nowhere. */
  loggedOnly?: boolean
  /** Whether the rendered month is the current calendar month. Combined with
   *  `today`, this gates which cells reject drag-and-drop drops (future days). */
  isCurrentMonth?: boolean
  /** Fired when an emoji is dropped onto a day cell via drag-and-drop. */
  onDayDrop?: (day: number, emoji: string) => void
  /** Visually dim future cells during an active drag. Caller flips this on/off
   *  using the Draggable's onDragStart/onDragEnd lifecycle. */
  isDragging?: boolean
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
  muted?: boolean
  onPress?: () => void
}> = ({ day, isToday, isSelected, logged, compact, muted = false, onPress }) => {
  const isLoggedDay = !!logged
  const fontSize = compact ? 11 : 12
  const emojiFontSize = compact ? 7 : 8
  const plusFontSize = compact ? 6 : 7

  return (
    <Pressable
      onPress={muted ? undefined : onPress}
      disabled={muted}
      accessibilityRole="button"
      accessibilityLabel={`Day ${day}${isToday ? ', today' : ''}${isSelected ? ', selected' : ''}`}
      accessibilityState={{ selected: isSelected, disabled: muted }}
      // `collapsable={false}` is the canonical Android Fabric escape hatch:
      // unconditionally keep this Pressable as a real native view, never
      // flatten it. The transparent backgroundColor below was the previous
      // fix and works for the single-emoji case, but once `hasMultiple` flips
      // true a second Text node appears in the inner row and Fabric's
      // flattening heuristics start dropping the day number Text from the
      // render pass. `collapsable={false}` blocks all such optimizations on
      // this view. No-op on iOS, where the prop is ignored.
      collapsable={false}
      style={{
        // Belt-and-suspenders with `collapsable={false}` above. Keeping this
        // for the same reason it was originally added — a visible-effect
        // style helps Fabric keep the view "real" on Android.
        backgroundColor: 'transparent',
        aspectRatio: 1,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: muted ? 0.3 : 1,
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
      <Text
        style={{
          fontFamily: font('dmSans', isToday ? '700' : isLoggedDay ? '500' : '400'),
          fontSize,
          lineHeight: fontSize * 1.2,
          color: isToday ? colors.white : isLoggedDay ? colors.terra : colors.ink,
        }}
      >
        {day}
      </Text>
      {isLoggedDay && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 1 }}>
          <Text style={{ fontSize: emojiFontSize }}>{logged!.emoji}</Text>
          {logged!.hasMultiple && (
            <Text
              style={{
                fontSize: plusFontSize,
                fontWeight: '600',
                color: isToday ? 'rgba(255,255,255,0.8)' : colors.mauve,
                marginLeft: 1,
              }}
            >
              +
            </Text>
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
  mode = 'day',
  loggedOnly = false,
  isCurrentMonth = false,
  onDayDrop,
  isDragging = false,
}) => {
  const daysInMonth = getDaysInMonth(month, year)
  const firstDow = getFirstDayOfWeek(month, year)

  const logMap = new Map<number, LoggedDay>()
  loggedDays.forEach((ld) => logMap.set(ld.day, ld))

  const headerFontSize = compact ? 8 : 9

  const cells: React.ReactNode[] = []
  for (let i = 0; i < firstDow; i++) {
    cells.push(<View key={`empty-${i}`} style={{ aspectRatio: 1 }} />)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const day = d
    const logged = logMap.get(day)
    const isFuture = isCurrentMonth && today != null && day > today
    const cell = (
      <DayCell
        key={day}
        day={day}
        isToday={day === today}
        // Per-cell circle highlight is suppressed in week mode — the row
        // background carries the selection signal instead.
        isSelected={mode === 'day' && day === selectedDay}
        logged={logged}
        compact={compact}
        muted={loggedOnly && !logged}
        onPress={() => onDayPress?.(day)}
      />
    )
    cells.push(
      onDayDrop ? (
        <Droppable<string>
          key={day}
          onDrop={(emoji) => onDayDrop(day, emoji)}
          dropDisabled={isFuture}
          onActiveChange={(active) => {
            if (active && !isFuture) Haptics.selectionAsync()
          }}
          activeStyle={isFuture ? undefined : { backgroundColor: 'rgba(192,120,88,0.22)', borderRadius: 9999 }}
          style={{ opacity: isDragging && isFuture ? 0.3 : 1 }}
        >
          {cell}
        </Droppable>
      ) : (
        cell
      ),
    )
  }

  const selectedRowIndex =
    mode === 'week' && selectedDay !== undefined ? Math.floor((firstDow + selectedDay - 1) / 7) : undefined

  // Render as rows of 7 (flex-based grid)
  const headerRow = (
    <View style={{ flexDirection: 'row', marginBottom: compact ? 2 : 4 }}>
      {DAY_LABELS.map((label) => (
        <View key={label} style={{ flex: 1, alignItems: 'center', paddingVertical: 3 }}>
          <Text
            style={{
              fontFamily: font('dmSans', '500'),
              fontSize: headerFontSize,
              letterSpacing: compact ? 0.8 : 0.5,
              color: colors.stone,
              textTransform: 'uppercase',
            }}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  )

  // Build rows of 7 from cells
  const rows: React.ReactNode[] = []
  for (let i = 0; i < cells.length; i += 7) {
    const rowIndex = i / 7
    const rowCells = cells.slice(i, i + 7)
    // Pad last row
    while (rowCells.length < 7) {
      rowCells.push(<View key={`pad-${rowCells.length}`} style={{ flex: 1 }} />)
    }
    const isSelectedRow = rowIndex === selectedRowIndex
    rows.push(
      <View
        key={`row-${i}`}
        style={{
          flexDirection: 'row',
          gap: compact ? 0 : 2,
          ...(isSelectedRow
            ? {
                backgroundColor: 'rgba(192,120,88,0.13)',
                borderRadius: 9999,
                borderWidth: 1,
                borderColor: colors.terra,
              }
            : null),
        }}
      >
        {rowCells.map((cell, j) => (
          <View key={j} style={{ flex: 1 }}>
            {cell}
          </View>
        ))}
      </View>,
    )
  }

  return (
    <View>
      {headerRow}
      <View style={{ gap: compact ? 0 : 2 }}>{rows}</View>
    </View>
  )
}
