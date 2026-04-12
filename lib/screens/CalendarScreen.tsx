import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import { colors, font, fontFamily, gradientStyle } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { CalendarGrid } from '../components/CalendarGrid'
import { EmojiChip } from '../components/EmojiChip'

/* ── Types ── */

export interface LoggedDay {
  day: number
  emoji: string
  hasMultiple?: boolean
}

export interface CalendarScreenProps {
  month: number       // 1-12
  year: number
  today?: number
  loggedDays?: LoggedDay[]
  selectedDay?: number | null
  onPrevMonth?: () => void
  onNextMonth?: () => void
  onDayPress?: (day: number) => void
  onQuickLog?: (emoji: string) => void
}

/* ── Helpers ── */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const QUICK_LOG_EMOJIS = ['🍆', '✋', '👉', '💋', '🌬️', '😘', '🍑', '✨', '🌙', '🩷', '🩸']

/* ── Sub-components ── */

const NavHeader: React.FC = () => (
  <View style={{
    paddingHorizontal: 24,
    paddingTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
  }}>
    <Text style={{
      fontFamily: font('playfair', '700'),
      fontSize: 20,
      letterSpacing: 5,
      color: colors.terra,
    }}>TATUM</Text>
  </View>
)

const ChevronIcon: React.FC<{ direction: 'back' | 'forward' }> = ({ direction }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    {direction === 'back'
      ? <Polyline points="15 18 9 12 15 6" />
      : <Polyline points="9 6 15 12 9 18" />
    }
  </Svg>
)

const CalendarHeader: React.FC<{
  month: number
  year: number
  onPrev?: () => void
  onNext?: () => void
}> = ({ month, year, onPrev, onNext }) => (
  <View style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 8,
  }}>
    <Text style={{
      fontFamily: font('playfair', '600'),
      fontSize: 22,
      color: colors.ink,
    }}>
      {MONTH_NAMES[month - 1]} {year}
    </Text>
    <View style={{ flexDirection: 'row', gap: 6 }}>
      <Pressable
        onPress={onPrev}
        accessibilityLabel="Previous month"
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: 'rgba(160,100,80,0.18)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ChevronIcon direction="back" />
      </Pressable>
      <Pressable
        onPress={onNext}
        accessibilityLabel="Next month"
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: 'rgba(160,100,80,0.18)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ChevronIcon direction="forward" />
      </Pressable>
    </View>
  </View>
)

const Legend: React.FC = () => (
  <View style={{ flexDirection: 'row', gap: 14, paddingHorizontal: 22, paddingTop: 7 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        ...gradientStyle('linear-gradient(135deg, #C07858, #7C4A5A)'),
      }} />
      <Text style={{ fontFamily: fontFamily.dmSans, fontSize: 8.5, color: colors.stone }}>Today</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <Text style={{ fontSize: 10 }}>🍆</Text>
      <Text style={{ fontFamily: fontFamily.dmSans, fontSize: 8.5, color: colors.stone }}>Logged</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <Text style={{ fontSize: 10, color: colors.terra, fontWeight: '600' }}>🍆+</Text>
      <Text style={{ fontFamily: fontFamily.dmSans, fontSize: 8.5, color: colors.stone }}>Multiple</Text>
    </View>
  </View>
)

const QuickLogWidget: React.FC<{ onQuickLog?: (emoji: string) => void }> = ({ onQuickLog }) => (
  <View style={{
    flexShrink: 0,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(160,100,80,0.16)',
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  }}>
    <View style={{ marginBottom: 10 }}>
      <Text style={{
        fontFamily: font('dmSans', '500'),
        fontSize: 8,
        letterSpacing: 2.5,
        textTransform: 'uppercase',
        color: colors.terra,
        marginBottom: 2,
      }}>Quick Log</Text>
      <Text style={{
        fontFamily: font('dmSans', '300'),
        fontSize: 9,
        color: colors.muted,
        fontStyle: 'italic',
      }}>Drag to a date · Tap to log today</Text>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', gap: 7, paddingBottom: 2 }}>
        {QUICK_LOG_EMOJIS.map((emoji, i) => (
          <EmojiChip key={i} emoji={emoji} size={46} borderRadius={12} onPress={() => onQuickLog?.(emoji)} />
        ))}
      </View>
    </ScrollView>
  </View>
)

/* ── Main Screen ── */

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  month,
  year,
  today,
  loggedDays = [],
  selectedDay,
  onPrevMonth,
  onNextMonth,
  onDayPress,
  onQuickLog,
}) => (
  <View style={{
    width: '100%',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.warmSand,
  }}>
    <DecorativeGlow position="top-right" size={220} opacity={0.09} />
    <View style={{ height: 54 }} />
    <NavHeader />

    <View style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
      <CalendarHeader month={month} year={year} onPrev={onPrevMonth} onNext={onNextMonth} />
      <View style={{ paddingHorizontal: 18 }}>
        <CalendarGrid
          month={month - 1}
          year={year}
          today={today}
          selectedDay={selectedDay ?? undefined}
          loggedDays={loggedDays}
          onDayPress={onDayPress}
        />
      </View>
      <Legend />
    </View>

    <View style={{ height: 1, backgroundColor: 'rgba(160,100,80,0.12)', marginHorizontal: 22, marginTop: 10, flexShrink: 0 }} />

    <QuickLogWidget onQuickLog={onQuickLog} />

  </View>
)
