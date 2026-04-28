import React from 'react'
import { Pressable, Text, View } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import { colors, font } from '../theme'
import { CalendarGrid, type LoggedDay } from './CalendarGrid'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export interface DatePickerDropdownProps {
  month: number        // 0-11
  year: number
  today?: number
  selectedDay?: number
  loggedDays?: LoggedDay[]
  onDaySelect?: (day: number) => void
  onMonthChange?: (delta: number) => void
}

export const DatePickerDropdown: React.FC<DatePickerDropdownProps> = ({
  month,
  year,
  today,
  selectedDay,
  loggedDays = [],
  onDaySelect,
  onMonthChange,
}) => (
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
    {/* Month/year nav */}
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
      <Pressable
        onPress={() => onMonthChange?.(-1)}
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: colors.surface2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <Polyline points="15 18 9 12 15 6" />
        </Svg>
      </Pressable>
      <Text style={{
        fontFamily: font('playfair', '600'),
        fontSize: 16,
        color: colors.ink,
      }}>
        {MONTH_NAMES[month]} {year}
      </Text>
      <Pressable
        onPress={() => onMonthChange?.(1)}
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: colors.surface2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <Polyline points="9 18 15 12 9 6" />
        </Svg>
      </Pressable>
    </View>

    {/* Calendar grid */}
    <View style={{ paddingHorizontal: 12, paddingTop: 6, paddingBottom: 10 }}>
      <CalendarGrid
        month={month}
        year={year}
        today={today}
        selectedDay={selectedDay}
        loggedDays={loggedDays}
        onDayPress={onDaySelect}
        compact
      />
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
        fontSize: 9,
        fontWeight: '300',
        color: colors.muted,
        fontStyle: 'italic',
      }}>
        Tap any date to log for that day
      </Text>
    </View>
  </View>
)
