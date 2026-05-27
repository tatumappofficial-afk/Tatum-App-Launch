import React, { useCallback, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import Svg, { Polyline } from 'react-native-svg'
import { Draggable, DraggableState } from 'react-native-reanimated-dnd'
import { colors, font, fontFamily, gradientPoints, gradients, typography } from '../theme'
import { SuccessOverlay, type SuccessOverlayDetails } from '../components/SuccessOverlay'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { StatusBarSpacer } from './shared/StatusBarSpacer'
import { SectionLabel } from './shared/SectionLabel'
import { CalendarGrid } from '../components/CalendarGrid'
import { EmojiChip } from '../components/EmojiChip'
import { AvatarCircle } from '../components/AvatarCircle'
import { AvatarStack } from '../components/AvatarStack'
import { formatPartnerLabel } from '@/src/utils/partnerLabel'
import { StarRating } from '../components/StarRating'
import { TagPill } from '../components/TagPill'

/* ── Types ── */

export interface LoggedDay {
  day: number
  emoji: string
  hasMultiple?: boolean
}

export interface DaySessionPartner {
  initials: string
  gradient: string
  name: string
}

export interface DaySession {
  id: string
  partners: DaySessionPartner[]
  rating: number
  tags: { emoji: string; label: string }[]
  noteSnippet?: string
}

export interface CalendarScreenProps {
  month: number       // 1-12
  year: number
  today?: number
  /** True when the rendered month is the current real-world month. Combined
   *  with `today`, gates drag-and-drop drops on future cells. */
  isCurrentMonth?: boolean
  loggedDays?: LoggedDay[]
  selectedDay?: number | null
  selectedDayLabel?: string
  daySessions?: DaySession[]
  onPrevMonth?: () => void
  onNextMonth?: () => void
  onDayPress?: (day: number) => void
  onQuickLog?: (emoji: string) => void
  /** Fires when an emoji chip is dropped onto a day cell via drag-and-drop. */
  onDayDrop?: (day: number, emoji: string) => void
  onSessionPress?: (id: string) => void
  quickLogEmojis?: string[]
  /** When non-null, shows the green-check overlay confirming a quick-log. */
  loggedOverlay?: SuccessOverlayDetails | null
}

/* ── Helpers ── */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]


/* ── Sub-components ── */

const NavHeader: React.FC = () => (
  <View style={{
    paddingHorizontal: 24,
    paddingTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
  }}>
    <Text style={typography.screenTitle}>Calendar</Text>
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
    paddingTop: 6,
    paddingBottom: 4,
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
        style={({ pressed }) => ({
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: pressed ? colors.surface2 : colors.surface,
          borderWidth: 1,
          borderColor: 'rgba(160,100,80,0.18)',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <ChevronIcon direction="back" />
      </Pressable>
      <Pressable
        onPress={onNext}
        accessibilityLabel="Next month"
        style={({ pressed }) => ({
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: pressed ? colors.surface2 : colors.surface,
          borderWidth: 1,
          borderColor: 'rgba(160,100,80,0.18)',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <ChevronIcon direction="forward" />
      </Pressable>
    </View>
  </View>
)


interface QuickLogWidgetProps {
  onQuickLog?: (emoji: string) => void
  emojis?: string[]
  onDragStart?: () => void
  onDragEnd?: () => void
  isDragging?: boolean
}

interface DraggableQuickLogChipProps {
  emoji: string
  onTap?: (emoji: string) => void
  onDragStart?: () => void
  onDragEnd?: () => void
}

// Wraps Draggable with a key-bump on successful drop so the chip snaps back
// to its origin instead of being absorbed into the drop target (the library's
// default for a hit is to spring the draggable to the slot and leave it there).
// Also scales the chip up while dragging so it pokes out from under the thumb.
const DRAG_SCALE = 1.8
const QUICK_LOG_CHIP_SIZE = 38

const DraggableQuickLogChip: React.FC<DraggableQuickLogChipProps> = ({
  emoji, onTap, onDragStart, onDragEnd,
}) => {
  const [resetKey, setResetKey] = useState(0)
  const scale = useSharedValue(1)
  const animatedChipStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: (scale.value - 1) / (DRAG_SCALE - 1) * 0.25,
  }))
  return (
    <Draggable<string>
      key={resetKey}
      data={emoji}
      preDragDelay={250}
      onDragStart={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        onDragStart?.()
      }}
      onDragEnd={() => onDragEnd?.()}
      onStateChange={(state) => {
        if (state === DraggableState.DRAGGING) {
          scale.value = withSpring(DRAG_SCALE, { damping: 14, stiffness: 180 })
        } else if (state === DraggableState.IDLE) {
          scale.value = withSpring(1, { damping: 16, stiffness: 200 })
        } else if (state === DraggableState.DROPPED) {
          // Remount resets scale to 1 alongside the position snap-back.
          setResetKey(k => k + 1)
        }
      }}
    >
      <Animated.View style={[{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
      }, animatedChipStyle]}>
        <EmojiChip
          emoji={emoji}
          size={QUICK_LOG_CHIP_SIZE}
          borderRadius={QUICK_LOG_CHIP_SIZE / 2}
          backgroundColor={colors.surface}
          onPress={() => onTap?.(emoji)}
        />
      </Animated.View>
    </Draggable>
  )
}

const QuickLogWidget: React.FC<QuickLogWidgetProps> = ({ onQuickLog, emojis = [], onDragStart, onDragEnd, isDragging = false }) => (
  // zIndex: 2 sits this section above the calendar block (zIndex: 1) so the
  // chip's upward drag transform paints over the calendar grid instead of
  // slipping behind it. The widget is rendered OUTSIDE the body ScrollView
  // (see main layout) so no overflow clipping interferes. flexShrink: 0
  // keeps the row from collapsing when the body ScrollView fills.
  <View style={{ paddingHorizontal: 22, paddingTop: 10, paddingBottom: 8, zIndex: 2, flexShrink: 0 }}>
    {/* Inline header: "QUICK LOG · Drag to a date · Tap to log today" on a
        single line. The terra-uppercase title carries the visual weight; the
        muted italic tail explains the affordance. */}
    <Text style={{ marginBottom: 8 }}>
      <Text style={{
        fontFamily: font('dmSans', '500'),
        fontSize: 12,
        letterSpacing: 2.5,
        textTransform: 'uppercase',
        color: colors.terra,
      }}>Quick Log</Text>
      <Text style={{
        fontFamily: font('dmSans', '300'),
        fontSize: 12,
        color: colors.muted,
      }}>{'  ·  '}</Text>
      <Text style={{
        fontFamily: font('dmSans', '300'),
        fontSize: 12,
        color: colors.muted,
        fontStyle: 'italic',
      }}>Drag to a date · Tap to log today</Text>
    </Text>
    {/* overflow: clip horizontally scrolled chips when idle; open up while
        dragging so the chip can travel up to the calendar grid. */}
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ overflow: isDragging ? 'visible' : 'hidden' }}
      contentContainerStyle={{ overflow: isDragging ? 'visible' : 'hidden' }}
    >
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {emojis.map((emoji) => (
          <DraggableQuickLogChip
            key={emoji}
            emoji={emoji}
            onTap={onQuickLog}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </View>
    </ScrollView>
  </View>
)


const SessionRow: React.FC<{ session: DaySession; onPress?: () => void }> = ({ session, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    style={({ pressed }) => ({
      backgroundColor: pressed ? colors.surface2 : colors.surface,
      borderWidth: 1,
      borderColor: 'rgba(160,100,80,0.15)',
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginHorizontal: 16,
      marginBottom: 8,
      gap: 10,
      opacity: pressed ? 0.85 : 1,
    })}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <AvatarStack partners={session.partners} size={36} borderWidth={2} />
      <View style={{ flex: 1 }}>
        <Text style={{
          fontFamily: font('playfair', '600'),
          fontSize: 16,
          color: colors.ink,
        }}>{formatPartnerLabel(session.partners.map(p => p.name))}</Text>
      </View>
      <StarRating rating={session.rating} size={12} />
    </View>
    <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
      {session.tags.map((t) => (
        <TagPill key={t.emoji} emoji={t.emoji} label={t.label} variant="display" />
      ))}
    </View>
    {session.noteSnippet && (
      <Text numberOfLines={1} style={{
        fontSize: 14,
        color: colors.stone,
        fontStyle: 'italic',
        fontFamily: font('dmSans', '300'),
      }}>{session.noteSnippet}</Text>
    )}
  </Pressable>
)

/* ── Main Screen ── */

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  month,
  year,
  today,
  isCurrentMonth = false,
  loggedDays = [],
  selectedDay,
  selectedDayLabel,
  daySessions = [],
  onPrevMonth,
  onNextMonth,
  onDayPress,
  onQuickLog,
  onDayDrop,
  onSessionPress,
  quickLogEmojis = [],
  loggedOverlay = null,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const handleDragStart = useCallback(() => setIsDragging(true), [])
  const handleDragEnd = useCallback(() => setIsDragging(false), [])

  return (
  <View style={{
    width: '100%',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.warmSand,
  }}>
    <DecorativeGlow position="top-right" size={220} opacity={0.09} />
    <StatusBarSpacer />
    <NavHeader />

    <View style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
      <CalendarHeader month={month} year={year} onPrev={onPrevMonth} onNext={onNextMonth} />
      <View style={{ paddingHorizontal: 18 }}>
        <CalendarGrid
          month={month - 1}
          year={year}
          today={today}
          isCurrentMonth={isCurrentMonth}
          selectedDay={selectedDay ?? undefined}
          loggedDays={loggedDays}
          onDayPress={onDayPress}
          onDayDrop={onDayDrop}
          isDragging={isDragging}
        />
      </View>
    </View>

    <View style={{ height: 1, backgroundColor: 'rgba(160,100,80,0.12)', marginHorizontal: 22, marginTop: 6, flexShrink: 0 }} />

    {/* QuickLog lives OUTSIDE the body ScrollView so its draggable chip can
        transform upward into the calendar's screen area without being clipped
        by the ScrollView's bounds. flexShrink: 0 keeps its height stable
        regardless of body content. The body ScrollView below holds only the
        selected-day sessions list, which gets all remaining vertical space. */}
    <QuickLogWidget
      onQuickLog={onQuickLog}
      emojis={quickLogEmojis}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      isDragging={isDragging}
    />

    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 16 }}
      scrollEnabled={!isDragging}
    >
      {selectedDay != null && (
        <>
          <SectionLabel label={selectedDayLabel || `Day ${selectedDay}`} style={{ marginHorizontal: 16, marginTop: 14 }} />
          {daySessions.length > 0 ? (
            daySessions.map((s) => (
              <SessionRow key={s.id} session={s} onPress={() => onSessionPress?.(s.id)} />
            ))
          ) : (
            <Text style={{
              marginHorizontal: 16,
              fontSize: 14,
              color: colors.muted,
              fontStyle: 'italic',
              fontFamily: font('dmSans', '300'),
            }}>No sessions logged</Text>
          )}
        </>
      )}
    </ScrollView>

    <SuccessOverlay
      visible={loggedOverlay != null}
      label="Session logged"
      details={loggedOverlay ?? undefined}
    />
  </View>
  )
}
