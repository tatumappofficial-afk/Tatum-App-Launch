import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Line, Polyline } from 'react-native-svg'
import { colors, font, gradientPoints, gradients, shadows } from '../theme'
import { AvatarStack } from '../components/AvatarStack'
import { StarRating } from '../components/StarRating'
import { GradientButton } from '../components/GradientButton'

/* ── Types ── */

export interface LoggedDay {
  day: number
  emoji: string
  hasMultiple?: boolean
}

export interface SessionRowPartner {
  initials: string
  gradient: string
}

export interface SessionRow {
  id: string
  partners: SessionRowPartner[]
  partnerName: string
  tags: string[]
  rating: number // 1-10 rating
  noteSnippet?: string
}

export interface CalendarDayModalProps {
  month: number
  year: number
  today?: number
  loggedDays?: LoggedDay[]
  selectedDay: number
  dayLabel: string // e.g. "Thursday, March 19"
  sessions?: SessionRow[]
  onLogSession?: () => void
  onSessionPress?: (id: string) => void
  onDismiss?: () => void
  onClose?: () => void
}

/* ── Empty State ── */

const EmptyState: React.FC<{ onLogSession?: () => void }> = ({ onLogSession }) => (
  <View
    style={{
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingBottom: 16,
    }}
  >
    {/* Gradient square placeholder for tatum logo */}
    <View
      style={{
        width: 96,
        height: 96,
        marginBottom: 16,
        opacity: 0.5,
        borderRadius: 16,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LinearGradient
        colors={['rgba(192,120,88,0.3)', 'rgba(124,74,90,0.2)']}
        start={gradientPoints.diagonal.start}
        end={gradientPoints.diagonal.end}
        style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
      />
      <Text
        style={{
          fontFamily: font('playfair', '700'),
          fontSize: 28,
          color: colors.terra,
          opacity: 0.6,
        }}
      >
        T
      </Text>
    </View>
    <Text
      style={{
        fontFamily: font('playfair', '600'),
        fontSize: 18,
        color: colors.ink,
        marginBottom: 6,
        textAlign: 'center',
      }}
    >
      Nothing logged yet
    </Text>
    <Text
      style={{
        fontFamily: font('dmSans', '300'),
        fontSize: 14,
        color: colors.stone,
        lineHeight: 13 * 1.6,
        marginBottom: 24,
        textAlign: 'center',
      }}
    >
      You haven't logged anything for this day. Want to capture a moment?
    </Text>
    <Pressable
      onPress={onLogSession}
      accessibilityRole="button"
      accessibilityLabel="Log a Session"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        borderRadius: 9999,
        paddingVertical: 12,
        paddingHorizontal: 28,
        overflow: 'hidden',
        ...shadows.primaryButtonStrong,
      }}
    >
      <LinearGradient
        colors={gradients.primaryCta}
        start={gradientPoints.diagonal.start}
        end={gradientPoints.diagonal.end}
        style={[StyleSheet.absoluteFill, { borderRadius: 9999 }]}
      />
      <Svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2.5}
        strokeLinecap="round"
      >
        <Line x1={12} y1={5} x2={12} y2={19} />
        <Line x1={5} y1={12} x2={19} y2={12} />
      </Svg>
      <Text
        style={{
          fontFamily: font('dmSans', '500'),
          fontSize: 14,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: 'white',
        }}
      >
        Log a Session
      </Text>
    </Pressable>
  </View>
)

/* ── Sessions State ── */

const SessionsState: React.FC<{
  sessions: SessionRow[]
  onSessionPress?: (id: string) => void
  onLogSession?: () => void
}> = ({ sessions, onSessionPress, onLogSession }) => (
  <>
    <ScrollView style={{ flex: 1, paddingTop: 10, paddingHorizontal: 20 }}>
      {sessions.map((s) => (
        <Pressable
          key={s.id}
          onPress={() => onSessionPress?.(s.id)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: 'rgba(160,100,80,0.13)',
            borderRadius: 14,
            paddingVertical: 12,
            paddingHorizontal: 14,
            marginBottom: 8,
          }}
        >
          <AvatarStack partners={s.partners} size={38} borderWidth={2} />
          <View style={{ flex: 1 }}>
            {s.partnerName ? (
              <Text
                style={{
                  fontFamily: font('dmSans', '500'),
                  fontSize: 14,
                  color: colors.ink,
                }}
              >
                {s.partnerName}
              </Text>
            ) : null}
            <View style={{ flexDirection: 'row', gap: 4, marginTop: 3 }}>
              {s.tags.map((t, i) => (
                <Text key={i} style={{ fontSize: 14 }}>
                  {t}
                </Text>
              ))}
            </View>
            {s.noteSnippet && (
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: font('dmSans', '300'),
                  fontSize: 12,
                  color: colors.muted,
                  fontStyle: 'italic',
                  marginTop: 3,
                  maxWidth: 140,
                }}
              >
                &ldquo;{s.noteSnippet}&rdquo;
              </Text>
            )}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <StarRating rating={s.rating} size={13} />
          </View>
          <Pressable
            style={{
              opacity: 0.5,
              marginLeft: 4,
              alignItems: 'center',
              padding: 0,
            }}
          >
            <Svg
              width={17}
              height={17}
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.terra}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Line x1={7} y1={17} x2={17} y2={7} />
              <Polyline points="7 7 17 7 17 17" />
            </Svg>
          </Pressable>
        </Pressable>
      ))}
    </ScrollView>

    {/* Footer */}
    <View
      style={{
        flexShrink: 0,
        paddingVertical: 8,
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(160,100,80,0.1)',
        backgroundColor: colors.warmSand,
      }}
    >
      <GradientButton
        label="Log Another Session"
        variant="outline"
        height={46}
        fontSize={12}
        letterSpacing={1.5}
        onPress={onLogSession}
        icon={
          <Svg
            width={15}
            height={15}
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.terra}
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            <Line x1={12} y1={5} x2={12} y2={19} />
            <Line x1={5} y1={12} x2={19} y2={12} />
          </Svg>
        }
      />
    </View>
  </>
)

/* ── Main Component ── */

export const CalendarDayModal: React.FC<CalendarDayModalProps> = ({
  selectedDay,
  dayLabel,
  sessions = [],
  onLogSession,
  onSessionPress,
  onClose,
}) => {
  const hasSessions = sessions.length > 0
  const subtitle = hasSessions ? `${sessions.length} session${sessions.length > 1 ? 's' : ''}` : 'No sessions logged'

  return (
    <View style={{ flex: 1, backgroundColor: colors.warmSand }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 12,
          flexShrink: 0,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: font('playfair', '700'),
              fontSize: 22,
              color: colors.ink,
            }}
          >
            {dayLabel}
          </Text>
          <Text
            style={{
              fontFamily: font('dmSans', '300'),
              fontSize: 14,
              color: colors.stone,
              marginTop: 1,
            }}
          >
            {subtitle}
          </Text>
        </View>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: colors.surface2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.stone}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Line x1={18} y1={6} x2={6} y2={18} />
            <Line x1={6} y1={6} x2={18} y2={18} />
          </Svg>
        </Pressable>
      </View>

      {/* Content */}
      {hasSessions ? (
        <SessionsState sessions={sessions} onSessionPress={onSessionPress} onLogSession={onLogSession} />
      ) : (
        <EmptyState onLogSession={onLogSession} />
      )}
    </View>
  )
}
