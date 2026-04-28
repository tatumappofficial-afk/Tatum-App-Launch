import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import { colors, font, fontFamily, gradientStyle } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
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
  activities: Activity[]
  recentSessions: Session[]
  onBack?: () => void
  onEdit?: () => void
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
  activities,
  recentSessions,
  onBack,
  onEdit,
}) => (
  <View style={{
    flex: 1,
    backgroundColor: colors.warmSand,
    position: 'relative', overflow: 'hidden',
    flexDirection: 'column',
  }}>
    {/* Glow */}
    <DecorativeGlow position="center" size={320} opacity={0.13} />
    <View style={{ height: 54 }} />

    {/* Header: back + edit */}
    <View style={{
      paddingTop: 6,
      paddingHorizontal: 24,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0, position: 'relative', zIndex: 2,
    }}>
      <Pressable
        onPress={onBack}
        style={{
          width: 34, height: 34, borderRadius: 17,
          backgroundColor: colors.surface2,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"
          stroke={colors.stone} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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
        <Text style={{
          fontFamily: font('dmSans', '500'),
          fontSize: 11, color: colors.terra,
          letterSpacing: 0.5,
        }}>Edit</Text>
      </Pressable>
    </View>

    {/* Hero */}
    <View style={{
      flexShrink: 0,
      flexDirection: 'column', alignItems: 'center',
      paddingTop: 14, paddingHorizontal: 24,
      position: 'relative', zIndex: 1,
    }}>
      <AvatarCircle
        initials={initials}
        gradient={gradient}
        size={72}
        borderWidth={3}
      />
      <View style={{ marginBottom: 10 }} />
      <Text style={{
        fontFamily: font('playfair', '700'),
        fontSize: 26, color: colors.ink, marginBottom: 2,
      }}>{name}</Text>
      <Text style={{
        fontSize: 10, fontWeight: '300', color: colors.stone, letterSpacing: 0.5,
      }}>{since}</Text>
    </View>

    {/* Stat strip */}
    <View style={{ marginTop: 14, marginHorizontal: 24, flexShrink: 0 }}>
      <StatStrip stats={[
        { value: String(sessions), label: 'Sessions' },
        { value: avgRating, label: 'Avg Rating' },
        { value: topDay, label: 'Top Day' },
      ]} />
    </View>

    {/* Top Activities */}
    <SectionLabel label="Top Activities" />
    <View style={{
      marginHorizontal: 24,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: 'rgba(160,100,80,0.15)',
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 14,
      flexShrink: 0,
    }}>
      {activities.map((a, i) => (
        <View key={i} style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
          marginBottom: i < activities.length - 1 ? 7 : 0,
        }}>
          <Text style={{ fontSize: 13, width: 18, textAlign: 'center', flexShrink: 0 }}>{a.emoji}</Text>
          <Text style={{ fontSize: 10, color: colors.stone, width: 68, flexShrink: 0 }}>{a.label}</Text>
          <View style={{
            flex: 1, height: 5, backgroundColor: colors.surface2,
            borderRadius: 3, overflow: 'hidden',
          }}>
            <View style={{
              height: 5, width: `${a.percent}%`,
              ...gradientStyle(`linear-gradient(to right, ${colors.terra}, ${colors.mauve})`),
              borderRadius: 3,
            }} />
          </View>
          <Text style={{
            fontSize: 10, fontWeight: '500', color: colors.mauve,
            width: 14, textAlign: 'right', flexShrink: 0,
          }}>{a.count}</Text>
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
        {recentSessions.map((s, i) => (
          <View key={i} style={{
            flexShrink: 0, width: 155,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: 'rgba(160,100,80,0.15)',
            borderRadius: 14, padding: 12,
            flexDirection: 'column', gap: 6,
          }}>
            {/* Top row */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 9, color: colors.stone, fontWeight: '300', paddingTop: 2 }}>{s.date}</Text>
              <StarRating rating={s.rating} size={12} />
            </View>
            {/* Tags */}
            <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
              {s.tags.map((t, ti) => (
                <Text key={ti} style={{
                  fontSize: 13, backgroundColor: colors.surface2,
                  borderRadius: 6, paddingVertical: 2, paddingHorizontal: 5,
                }}>{t}</Text>
              ))}
            </View>
            {/* Note */}
            <Text
              numberOfLines={2}
              style={{
                fontSize: 10, fontWeight: '300', color: colors.stone,
                fontStyle: 'italic', lineHeight: 14.5,
                overflow: 'hidden',
                borderTopWidth: 1,
                borderTopColor: 'rgba(160,100,80,0.1)',
                paddingTop: 5, marginTop: 1,
              }}
            >{s.note}</Text>
          </View>
        ))}
      </ScrollView>
    </View>

  </View>
)
