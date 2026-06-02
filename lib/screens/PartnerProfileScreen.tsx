import React, { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Line, Polyline } from 'react-native-svg'
import { colors, font, gradientPoints } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { StatusBarSpacer } from './shared/StatusBarSpacer'
import { SectionLabel } from './shared/SectionLabel'
import { AvatarCircle } from '../components/AvatarCircle'
import { StatStrip } from '../components/StatStrip'
import { StarRating } from '../components/StarRating'

interface Activity {
  emoji: string
  label: string
  count: number
  /** Bar fill 0-100 */
  percent: number
}

interface Session {
  id: string
  date: string
  /** Star fill 0-100 */
  rating: number
  tags: string[]
  note?: string
}

export interface PartnerProfileScreenProps {
  initials: string
  gradient: string
  name: string
  since: string
  sessions: number
  avgRating: string
  topDay: string
  isMain?: boolean
  activities: Activity[]
  recentSessions: Session[]
  onBack?: () => void
  onEdit?: () => void
  onSessionPress?: (id: string) => void
  /** When provided, renders a "Show more" tile at the end of the scroller. */
  onShowMoreSessions?: () => void
}

/* ── main component ── */

export const PartnerProfileScreen: React.FC<PartnerProfileScreenProps> = ({
  initials,
  gradient,
  name,
  since,
  sessions,
  avgRating,
  topDay,
  isMain,
  activities,
  recentSessions,
  onBack,
  onEdit,
  onSessionPress,
  onShowMoreSessions,
}) => {
  const [mainInfoVisible, setMainInfoVisible] = useState(false)

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.warmSand,
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'column',
      }}
    >
      {/* Glow */}
      <DecorativeGlow position="center" size={320} opacity={0.13} />
      <StatusBarSpacer />

      {/* Header: back + edit */}
      <View
        style={{
          paddingTop: 6,
          paddingHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Pressable
          onPress={onBack}
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: colors.surface2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.stone}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Polyline points="15 18 9 12 15 6" />
          </Svg>
        </Pressable>

        <Pressable
          onPress={onEdit}
          style={{
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: 'rgba(160,100,80,0.3)',
            borderRadius: 9999,
            paddingVertical: 5,
            paddingHorizontal: 14,
          }}
        >
          <Text
            style={{
              fontFamily: font('dmSans', '500'),
              fontSize: 14,
              color: colors.terra,
              letterSpacing: 0.5,
            }}
          >
            Edit
          </Text>
        </Pressable>
      </View>

      {/* Hero */}
      <View
        style={{
          flexShrink: 0,
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 14,
          paddingHorizontal: 24,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <AvatarCircle initials={initials} gradient={gradient} size={72} borderWidth={3} />
        {isMain ? (
          <Pressable
            onPress={() => setMainInfoVisible((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel="What does main mean?"
            accessibilityState={{ expanded: mainInfoVisible }}
            hitSlop={8}
            style={({ pressed }) => ({
              marginTop: 8,
              marginBottom: 4,
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderRadius: 9999,
              overflow: 'hidden',
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <LinearGradient
              colors={[colors.terra, colors.mauve]}
              start={gradientPoints.diagonal.start}
              end={gradientPoints.diagonal.end}
              style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}
            />
            <Text
              style={{
                fontFamily: font('dmSans', '600'),
                fontSize: 10,
                letterSpacing: 1.5,
                color: colors.white,
              }}
            >
              MAIN
            </Text>
          </Pressable>
        ) : (
          <View style={{ marginBottom: 10 }} />
        )}
        <Text
          style={{
            fontFamily: font('playfair', '700'),
            fontSize: 26,
            color: colors.ink,
            marginBottom: 2,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '300',
            color: colors.stone,
            letterSpacing: 0.5,
          }}
        >
          {since}
        </Text>
      </View>

      {/* Stat strip */}
      <View style={{ marginTop: 14, marginHorizontal: 24, flexShrink: 0 }}>
        <StatStrip
          stats={[
            { value: String(sessions), label: 'Sessions' },
            { value: avgRating, label: 'Avg Rating' },
            { value: topDay, label: 'Top Day' },
          ]}
        />
      </View>

      {/* Top Activities */}
      <SectionLabel label="Top Activities" />
      <View
        style={{
          marginHorizontal: 24,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: 'rgba(160,100,80,0.15)',
          borderRadius: 14,
          paddingVertical: 12,
          paddingHorizontal: 14,
          flexShrink: 0,
        }}
      >
        {activities.map((a, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: i < activities.length - 1 ? 7 : 0,
            }}
          >
            <Text style={{ fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>{a.emoji}</Text>
            <Text style={{ fontSize: 12, color: colors.stone, width: 68, flexShrink: 0 }}>{a.label}</Text>
            <View
              style={{
                flex: 1,
                height: 5,
                backgroundColor: colors.surface2,
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={[colors.terra, colors.mauve]}
                start={gradientPoints.horizontal.start}
                end={gradientPoints.horizontal.end}
                style={{ height: 5, width: `${a.percent}%`, borderRadius: 3 }}
              />
            </View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: colors.mauve,
                width: 14,
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              {a.count}
            </Text>
          </View>
        ))}
      </View>

      {/* Recent Sessions */}
      <SectionLabel label="Recent Sessions" />
      <View style={{ flexShrink: 0, overflow: 'hidden' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 8,
            paddingLeft: 24,
            paddingRight: 40,
          }}
        >
          {recentSessions.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => onSessionPress?.(s.id)}
              accessibilityRole="button"
              style={({ pressed }) => ({
                flexShrink: 0,
                width: 155,
                backgroundColor: pressed ? colors.surface2 : colors.surface,
                borderWidth: 1,
                borderColor: 'rgba(160,100,80,0.15)',
                borderRadius: 14,
                padding: 12,
                flexDirection: 'column',
                gap: 6,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              {/* Top row */}
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, color: colors.stone, fontWeight: '300', paddingTop: 2 }}>{s.date}</Text>
                <StarRating rating={s.rating} size={12} />
              </View>
              {/* Tags */}
              <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
                {s.tags.map((t, ti) => (
                  <Text
                    key={ti}
                    style={{
                      fontSize: 14,
                      backgroundColor: colors.surface2,
                      borderRadius: 6,
                      paddingVertical: 2,
                      paddingHorizontal: 5,
                    }}
                  >
                    {t}
                  </Text>
                ))}
              </View>
              {/* Note */}
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 12,
                  fontWeight: '300',
                  color: colors.stone,
                  fontStyle: 'italic',
                  lineHeight: 14.5,
                  overflow: 'hidden',
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(160,100,80,0.1)',
                  paddingTop: 5,
                  marginTop: 1,
                }}
              >
                {s.note}
              </Text>
            </Pressable>
          ))}
          {onShowMoreSessions && (
            <Pressable
              onPress={onShowMoreSessions}
              accessibilityRole="button"
              accessibilityLabel="Show all sessions"
              style={({ pressed }) => ({
                flexShrink: 0,
                width: 155,
                backgroundColor: pressed ? colors.surface2 : colors.surface,
                borderWidth: 1,
                borderColor: 'rgba(160,100,80,0.15)',
                borderStyle: 'dashed',
                borderRadius: 14,
                padding: 12,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.85 : 1,
                gap: 6,
              })}
            >
              <Svg
                width={28}
                height={28}
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.terra}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.7}
              >
                <Polyline points="9 18 15 12 9 6" />
              </Svg>
              <Text
                style={{
                  fontFamily: font('dmSans', '500'),
                  fontSize: 13,
                  color: colors.terra,
                  letterSpacing: 0.4,
                  textAlign: 'center',
                }}
              >
                Show more
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </View>

      {/* MAIN-tag info popup. */}
      {isMain && mainInfoVisible && (
        <Pressable
          onPress={() => setMainInfoVisible(false)}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(30,18,12,0.45)',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 28,
            zIndex: 100,
          }}
        >
          {/* Absorbs taps so reading the popup doesn't bubble to the dismissing backdrop. */}
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 18,
              paddingTop: 22,
              paddingHorizontal: 22,
              paddingBottom: 20,
              maxWidth: 340,
              width: '100%',
              shadowColor: '#3D2B25',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.22,
              shadowRadius: 18,
              elevation: 10,
            }}
          >
            {/* Close X */}
            <Pressable
              onPress={() => setMainInfoVisible(false)}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={10}
              style={({ pressed }) => ({
                position: 'absolute',
                top: 12,
                right: 12,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: pressed ? 'rgba(160,100,80,0.18)' : colors.surface2,
                alignItems: 'center',
                justifyContent: 'center',
              })}
            >
              <Svg
                width={14}
                height={14}
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

            <Text
              style={{
                fontFamily: font('playfair', '700'),
                fontSize: 20,
                color: colors.ink,
                marginBottom: 10,
                paddingRight: 32, // leave room for the X
              }}
            >
              What does main mean?
            </Text>

            <Text
              style={{
                fontFamily: font('dmSans', '400'),
                fontSize: 14,
                color: colors.stone,
                lineHeight: 21,
              }}
            >
              When you log a session in a hurry — like dragging an activity onto the calendar — Tatum picks this person
              for you so you don't have to. To make someone else your main partner, open their edit screen and turn on
              "Set as main partner."
            </Text>
          </Pressable>
        </Pressable>
      )}
    </View>
  )
}
