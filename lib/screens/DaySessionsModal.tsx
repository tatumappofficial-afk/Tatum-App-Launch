import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg'
import { colors, font, fontFamily, gradientStyle } from '../theme'

/* ── Types ── */

export interface LoggedDay {
  day: number
  emoji: string
  hasMultiple?: boolean
}

export interface SessionCardData {
  id: string
  partners: {
    initials: string
    gradient: string
  }[]
  partnerName: string   // display name, e.g. "Alex" or "Alex + Jordan"
  time: string          // e.g. "Evening · 9:30 pm"
  score: number         // out of 10
  tags: string[]        // emoji tags
  duration?: string     // e.g. "45 min"
  noteSnippet?: string
}

export interface DaySessionsModalProps {
  month: number
  year: number
  today?: number
  loggedDays?: LoggedDay[]
  selectedDay: number
  dayLabel: string
  sessionCount: number
  sessions: SessionCardData[]
  onLogAnother?: () => void
  onLogSession?: () => void
  onSessionPress?: (id: string) => void
  onDismiss?: () => void
}

/* ── Session Card ── */

const SessionCard: React.FC<{
  session: SessionCardData
  onPress?: () => void
}> = ({ session, onPress }) => {
  const isMultiPartner = session.partners.length > 1

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1, borderColor: 'rgba(160,100,80,0.14)',
        borderRadius: 18, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 10,
        position: 'relative',
        boxShadow: '3px 4px 0 0 #EDE3D8',
        overflow: 'hidden',
      }}
    >
      {/* Card top row */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 10, position: 'relative', zIndex: 1,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {/* Avatar(s) */}
          {isMultiPartner ? (
            <View style={{ flexDirection: 'row', position: 'relative', width: 54, height: 38, flexShrink: 0 }}>
              <View style={{
                position: 'absolute', left: 0, zIndex: 2,
                width: 38, height: 38, borderRadius: 19,
                alignItems: 'center', justifyContent: 'center',
                ...gradientStyle(session.partners[0].gradient),
                borderWidth: 2, borderColor: colors.warmSand, boxShadow: '0 2px 8px rgba(61,43,37,0.12)',
              }}>
                <Text style={{ fontFamily: font('playfair', '700'), fontSize: 13, color: 'white' }}>
                  {session.partners[0].initials}
                </Text>
              </View>
              <View style={{
                position: 'absolute', left: 18, zIndex: 1,
                width: 38, height: 38, borderRadius: 19,
                alignItems: 'center', justifyContent: 'center',
                ...gradientStyle(session.partners[1].gradient),
                borderWidth: 2, borderColor: colors.warmSand, boxShadow: '0 2px 8px rgba(61,43,37,0.12)',
              }}>
                <Text style={{ fontFamily: font('playfair', '700'), fontSize: 13, color: 'white' }}>
                  {session.partners[1].initials}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{
              width: 38, height: 38, borderRadius: 19, flexShrink: 0,
              alignItems: 'center', justifyContent: 'center',
              ...gradientStyle(session.partners[0].gradient),
              borderWidth: 2, borderColor: colors.warmSand, boxShadow: '0 2px 8px rgba(61,43,37,0.12)',
            }}>
              <Text style={{ fontFamily: font('playfair', '700'), fontSize: 13, color: 'white' }}>
                {session.partners[0].initials}
              </Text>
            </View>
          )}
          <View style={{ marginLeft: isMultiPartner ? 6 : 0 }}>
            <Text style={{
              fontFamily: font('playfair', '600'), fontSize: 14, color: colors.ink,
            }}>{session.partnerName}</Text>
            <Text style={{
              fontFamily: font('dmSans', '300'), fontSize: 9, color: colors.stone, marginTop: 2,
            }}>{session.time}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 1 }}>
            <Text style={{
              fontFamily: font('playfair', '700'), fontSize: 24, color: colors.terra,
            }}>{session.score}</Text>
            <Text style={{ fontSize: 13, fontWeight: '300', color: '#C4B0A0', marginHorizontal: 1 }}>/</Text>
            <Text style={{ fontSize: 12, fontWeight: '300', color: '#C4B0A0' }}>10</Text>
          </View>
          <Pressable style={{
            opacity: 0.45, padding: 0,
          }}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <Line x1={7} y1={17} x2={17} y2={7} /><Polyline points="7 7 17 7 17 17" />
            </Svg>
          </Pressable>
        </View>
      </View>

      {/* Tags + duration row */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap',
        marginBottom: session.noteSnippet ? 8 : 0,
        position: 'relative', zIndex: 1,
      }}>
        {session.tags.map((tag, i) => (
          <Text key={i} style={{
            fontSize: 15, backgroundColor: 'rgba(237,227,216,0.9)',
            borderRadius: 7, paddingVertical: 2, paddingHorizontal: 6,
            overflow: 'hidden',
          }}>{tag}</Text>
        ))}
        {session.duration && (
          <View style={{
            marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 3,
          }}>
            <Svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <Circle cx={12} cy={12} r={10} /><Polyline points="12 6 12 12 16 14" />
            </Svg>
            <Text style={{
              fontFamily: font('dmSans', '300'), fontSize: 9.5, color: colors.muted,
            }}>{session.duration}</Text>
          </View>
        )}
      </View>

      {/* Note snippet */}
      {session.noteSnippet && (
        <Text
          numberOfLines={2}
          style={{
            fontFamily: fontFamily.playfair, fontSize: 12, fontStyle: 'italic',
            color: '#7A5040', lineHeight: 26, position: 'relative', zIndex: 1,
          }}
        >{session.noteSnippet}</Text>
      )}
    </Pressable>
  )
}

/* ── Main Component ── */

export const DaySessionsModal: React.FC<DaySessionsModalProps> = ({
  sessionCount, sessions, dayLabel,
  onLogAnother, onLogSession, onSessionPress,
}) => (
  <View style={{ flex: 1, backgroundColor: colors.warmSand }}>
    {/* Header */}
    <View style={{
      flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
      paddingHorizontal: 20, paddingTop: 12, flexShrink: 0,
    }}>
      <View>
        <Text style={{ fontFamily: font('playfair', '700'), fontSize: 22, color: colors.ink }}>
          {dayLabel}
        </Text>
        <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 12, color: colors.stone, marginTop: 2 }}>
          {sessionCount} session{sessionCount !== 1 ? 's' : ''} logged
        </Text>
      </View>
      <Pressable
        onPress={onLogAnother}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 4,
          borderWidth: 1, borderColor: 'rgba(192,120,88,0.35)',
          borderRadius: 9999, paddingVertical: 5, paddingHorizontal: 12,
          flexShrink: 0, marginTop: 4,
        }}
      >
        <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={2.5} strokeLinecap="round">
          <Line x1={12} y1={5} x2={12} y2={19} /><Line x1={5} y1={12} x2={19} y2={12} />
        </Svg>
        <Text style={{
          fontFamily: fontFamily.dmSans, fontSize: 11, fontWeight: '400', color: colors.terra,
        }}>Log another</Text>
      </Pressable>
    </View>

    {/* Session cards scroll */}
    <ScrollView style={{
      flex: 1, paddingHorizontal: 16, paddingTop: 12,
    }}>
      {sessions.map((s) => (
        <SessionCard key={s.id} session={s} onPress={() => onSessionPress?.(s.id)} />
      ))}
    </ScrollView>

    {/* Footer */}
    <View style={{
      flexShrink: 0, paddingVertical: 8, paddingHorizontal: 16, paddingBottom: 24,
      borderTopWidth: 1, borderTopColor: 'rgba(160,100,80,0.1)',
    }}>
      <Pressable
        onPress={onLogSession}
        style={{
          width: '100%', height: 46,
          borderWidth: 1.5, borderColor: 'rgba(192,120,88,0.3)', borderRadius: 9999,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}
      >
        <Svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={2.5} strokeLinecap="round">
          <Line x1={12} y1={5} x2={12} y2={19} /><Line x1={5} y1={12} x2={19} y2={12} />
        </Svg>
        <Text style={{
          fontFamily: font('dmSans', '500'), fontSize: 12,
          letterSpacing: 1.5, textTransform: 'uppercase', color: colors.terra,
        }}>Log a Session</Text>
      </Pressable>
    </View>
  </View>
)
