import React from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import Svg, { Circle, Path, Line } from 'react-native-svg'
import { colors, font, fontFamily, typography } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { StatusBarSpacer } from './shared/StatusBarSpacer'
import { SectionLabel } from './shared/SectionLabel'
import { AvatarCircle } from '../components/AvatarCircle'
import { AvatarStack } from '../components/AvatarStack'
import { StatStrip } from '../components/StatStrip'
import { StarRating } from '../components/StarRating'
import { TagPill } from '../components/TagPill'

/* ── Types ── */

export interface Partner {
  initials: string
  gradient: string
  since: string
}

export interface ActivityTag {
  emoji: string
  label: string
}

export interface RecentSessionPartner {
  initials: string
  gradient: string
}

export interface RecentSession {
  partners: RecentSessionPartner[]
  date: string
  /** 0-100 percentage for the star fill width */
  rating: number
  tags: string[]
  note?: string
}

export interface ProfileScreenProps {
  userName: string
  userInitial: string
  sinceDate: string
  tagline?: string
  stats: {
    sessions: number | string
    avgSat: number | string
    partners: number | string
  }
  partners: Partner[]
  activityTags: ActivityTag[]
  recentSessions: RecentSession[]
  onEdit?: () => void
  onSettings?: () => void
  onAddPartner?: () => void
  onAddTag?: () => void
  onPartnersSection?: () => void
  onPartnerPress?: (index: number) => void
}

/* ── Inline icon helpers ── */

const SettingsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = colors.stone }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </Svg>
)

const AddCircleIcon: React.FC<{ size?: number; color?: string; opacity?: number }> = ({ size = 20, color = colors.terra, opacity = 0.6 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="8" x2="12" y2="16" />
    <Line x1="8" y1="12" x2="16" y2="12" />
  </Svg>
)

const AddIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = colors.terra }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
    <Line x1="12" y1="5" x2="12" y2="19" />
    <Line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
)

/* ── Main component ── */

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userName,
  userInitial,
  sinceDate,
  tagline,
  stats,
  partners,
  activityTags,
  recentSessions,
  onEdit,
  onSettings,
  onAddPartner,
  onAddTag,
  onPartnersSection,
  onPartnerPress,
}) => {
  return (
    <View style={{
      width: '100%',
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      flexDirection: 'column',
    }}>
      <DecorativeGlow position="top-right" size={220} opacity={0.09} />
      <StatusBarSpacer />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>

      {/* ── Screen Header ── */}
      <View style={{
        paddingTop: 6,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
      }}>
        <Text style={typography.screenTitle}>Profile</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
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
              fontSize: 11,
              color: colors.terra,
              letterSpacing: 0.5,
              fontFamily: font('dmSans', '500'),
            }}>Edit</Text>
          </Pressable>
          <Pressable
            onPress={onSettings}
            accessibilityLabel="Settings"
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: colors.surface2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SettingsIcon />
          </Pressable>
        </View>
      </View>

      {/* ── Identity Block ── */}
      <View style={{
        paddingTop: 14,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flexShrink: 0,
      }}>
        <AvatarCircle
          initials={userInitial}
          gradient="linear-gradient(135deg, #C07858, #7C4A5A)"
          size={58}
          borderWidth={3}
        />
        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: font('playfair', '700'),
            fontSize: 20,
            color: colors.ink,
            lineHeight: 22,
          }}>{userName}</Text>
          <Text style={{
            fontSize: 10,
            fontWeight: '300',
            color: colors.stone,
            letterSpacing: 0.5,
            marginTop: 2,
          }}>{sinceDate}</Text>
          {tagline && (
            <Text style={{
              fontFamily: fontFamily.playfair,
              fontSize: 11,
              fontStyle: 'italic',
              color: colors.mauve,
              marginTop: 3,
              lineHeight: 15.4,
            }}>{tagline}</Text>
          )}
        </View>
      </View>

      {/* ── Stat Strip ── */}
      <View style={{ marginTop: 12, marginHorizontal: 24, flexShrink: 0 }}>
        <StatStrip stats={[
          { value: stats.sessions, label: 'Sessions' },
          { value: stats.avgSat, label: 'Avg Sat.' },
          { value: stats.partners, label: 'Partners' },
        ]} />
      </View>

      {/* ── Partners Section ── */}
      <SectionLabel label="Partners" showChevron onPress={onPartnersSection} />
      <View style={{ flexShrink: 0, marginRight: -24 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
          gap: 8,
          paddingLeft: 24,
          paddingBottom: 2,
          paddingRight: 40,
        }}>
          {partners.map((p, i) => (
            <Pressable key={i} onPress={() => onPartnerPress?.(i)} style={{
              flexShrink: 0,
              width: 110,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: 'rgba(160,100,80,0.15)',
              borderRadius: 14,
              paddingVertical: 12,
              paddingHorizontal: 10,
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
            }}>
              <AvatarCircle
                initials={p.initials}
                gradient={p.gradient}
                size={44}
                borderWidth={2}
              />
              <Text style={{
                fontSize: 9,
                color: colors.stone,
                fontWeight: '300',
              }}>{p.since}</Text>
            </Pressable>
          ))}
          {/* Add partner ghost card */}
          <Pressable
            onPress={onAddPartner}
            style={{
              flexShrink: 0,
              width: 72,
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: 'rgba(160,100,80,0.28)',
              borderRadius: 14,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              marginRight: 24,
            }}
          >
            <AddCircleIcon />
            <Text style={{
              fontSize: 8,
              fontWeight: '500',
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: colors.terra,
              opacity: 0.6,
              textAlign: 'center',
            }}>Add</Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* ── Activity Tags ── */}
      <SectionLabel label="My Activity Tags" />
      <View style={{ flexShrink: 0, paddingHorizontal: 24 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {activityTags.map((tag, i) => (
            <TagPill key={i} emoji={tag.emoji} label={tag.label} variant="display" />
          ))}
          {/* Add tag chip */}
          <Pressable
            onPress={onAddTag}
            style={{
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: 'rgba(160,100,80,0.15)',
              borderRadius: 9999,
              paddingVertical: 5,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              opacity: 0.5,
            }}
          >
            <AddIcon />
            <Text style={{ fontSize: 10, fontWeight: '400', color: colors.stone }}>Add tag</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Recent Sessions ── */}
      <SectionLabel label="Recent Sessions" />
      <View style={{ flexShrink: 0, marginRight: -24 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
          gap: 8,
          paddingLeft: 24,
          paddingRight: 40,
        }}>
          {recentSessions.map((session, i) => (
            <View key={i} style={{
              flexShrink: 0,
              width: 150,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: 'rgba(160,100,80,0.15)',
              borderRadius: 14,
              padding: 12,
              flexDirection: 'column',
              gap: 7,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                <AvatarStack partners={session.partners} size={32} borderWidth={1.5} />
                <Text style={{
                  fontSize: 8.5,
                  color: colors.stone,
                  fontWeight: '300',
                }}>{session.date}</Text>
              </View>
              <StarRating rating={session.rating} size={12} />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, overflow: 'hidden', maxHeight: 52 }}>
                {session.tags.map((tag, j) => (
                  <Text key={j} style={{
                    fontSize: 13,
                    backgroundColor: colors.surface2,
                    borderRadius: 6,
                    paddingVertical: 2,
                    paddingHorizontal: 5,
                  }}>{tag}</Text>
                ))}
              </View>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 10,
                  fontWeight: '300',
                  color: colors.stone,
                  fontStyle: 'italic',
                  lineHeight: 14.5,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(160,100,80,0.1)',
                  paddingTop: 6,
                  marginTop: 2,
                }}
              >{session.note}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      </ScrollView>

    </View>
  )
}
