import React, { useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Polyline } from 'react-native-svg'
import { colors, font, gradientPoints, gradients } from '../theme'

const PICK_FEEDBACK_MS = 220

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export interface MonthYearDropdownProps {
  /** Currently-selected year shown in the header. */
  year: number
  /** 0–11 — selected month within the displayed year (or undefined when year ≠ selected year). */
  selectedMonth?: number
  /** Inclusive minimum year the user can navigate to (first-encounter year). */
  minYear: number
  /** Inclusive maximum year the user can navigate to (current year). */
  maxYear: number
  /** Current month (0–11) of the maxYear — months past this are disabled when year === maxYear. */
  currentMonthInMaxYear?: number
  onYearChange: (delta: number) => void
  onSelect: (month: number, year: number) => void
}

export const MonthYearDropdown: React.FC<MonthYearDropdownProps> = ({
  year,
  selectedMonth,
  minYear,
  maxYear,
  currentMonthInMaxYear,
  onYearChange,
  onSelect,
}) => {
  const canPrev = year > minYear
  const canNext = year < maxYear

  const [pendingMonth, setPendingMonth] = useState<number | null>(null)
  const pickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleMonthPress(m: number) {
    if (pickTimer.current) clearTimeout(pickTimer.current)
    setPendingMonth(m)
    pickTimer.current = setTimeout(() => {
      pickTimer.current = null
      setPendingMonth(null)
      onSelect(m, year)
    }, PICK_FEEDBACK_MS)
  }

  return (
    <View style={{
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: 'rgba(160,100,80,0.18)',
      borderRadius: 22,
      overflow: 'hidden',
      shadowColor: '#3D2B25',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.18,
      shadowRadius: 48,
      elevation: 14,
    }}>
      {/* Year nav */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 14,
        paddingHorizontal: 16,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(160,100,80,0.1)',
      }}>
        <NavButton direction="prev" disabled={!canPrev} onPress={() => canPrev && onYearChange(-1)} />
        <Text style={{
          fontFamily: font('playfair', '600'),
          fontSize: 16,
          color: colors.ink,
        }}>{year}</Text>
        <NavButton direction="next" disabled={!canNext} onPress={() => canNext && onYearChange(1)} />
      </View>

      {/* Month chip grid */}
      <View style={{
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
        {MONTH_SHORT.map((label, m) => {
          const disabled = year === maxYear && currentMonthInMaxYear !== undefined && m > currentMonthInMaxYear
          const isSelected = selectedMonth === m
          const isPending = pendingMonth === m
          const showHighlight = isSelected || isPending
          return (
            <View key={m} style={{ width: '25%', padding: 4 }}>
              <Pressable
                onPress={() => !disabled && handleMonthPress(m)}
                disabled={disabled || pendingMonth !== null}
                accessibilityRole="button"
                accessibilityLabel={`${label} ${year}`}
                accessibilityState={{ selected: showHighlight, disabled }}
                style={{
                  height: 36,
                  borderRadius: 9999,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  backgroundColor: showHighlight ? undefined : colors.surface2,
                  opacity: disabled ? 0.35 : 1,
                }}
              >
                {showHighlight && (
                  <LinearGradient
                    colors={gradients.primaryCta}
                    start={gradientPoints.diagonal.start}
                    end={gradientPoints.diagonal.end}
                    style={[StyleSheet.absoluteFill, { borderRadius: 9999 }]}
                  />
                )}
                <Text style={{
                  fontFamily: font('dmSans', '500'),
                  fontSize: 14,
                  color: showHighlight ? colors.white : colors.ink,
                  letterSpacing: 0.4,
                }}>
                  {label}
                </Text>
              </Pressable>
            </View>
          )
        })}
      </View>

      {/* Hint */}
      <View style={{
        alignItems: 'center',
        paddingBottom: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(160,100,80,0.1)',
        paddingTop: 8,
      }}>
        <Text style={{
          fontSize: 12,
          fontWeight: '300',
          color: colors.muted,
          fontStyle: 'italic',
        }}>
          Tap a month to view that period
        </Text>
      </View>
    </View>
  )
}

const NavButton: React.FC<{ direction: 'prev' | 'next'; disabled: boolean; onPress: () => void }> = ({ direction, disabled, onPress }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={direction === 'prev' ? 'Previous year' : 'Next year'}
    style={{
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.surface2,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.35 : 1,
    }}
  >
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points={direction === 'prev' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </Svg>
  </Pressable>
)
