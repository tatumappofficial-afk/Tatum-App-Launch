import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg'
import { colors, font, fontFamily, gradientPoints, gradients, shadows } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { SectionLabel } from './shared/SectionLabel'
import { AvatarCircle } from '../components/AvatarCircle'
import { StarRating } from '../components/StarRating'

// Parent views provide spacing around these, so strip the shared defaults.
const INLINE_LABEL_STYLE = { marginVertical: 0, marginHorizontal: 0, marginBottom: 0, flexShrink: 0 } as const

// ── Types ──

export interface Activity {
  emoji: string
  label: string
  count: number
  percent: number
}

export interface Partner {
  initials: string
  gradient: string
  sessions: number
  avgSatisfaction: number
  topActivityEmoji: string
}

export interface Session {
  partnerInitials: string
  partnerGradient: string
  date: string
  rating: number
  activityEmojis: string[]
  note?: string
}

export interface EmptyPartner {
  initials: string
  name: string
  gradient: string
}

export interface HomeScreenProps {
  activePeriod?: number
  periodDateLabel?: string
  sessionsCount?: number
  avgRating?: number
  topActivities?: Activity[]
  partners?: Partner[]
  recentSessions?: Session[]
  isEmpty?: boolean
  userName?: string
  emptyPartners?: EmptyPartner[]
  onPartnerPress?: (index: number) => void
  onSessionPress?: (index: number) => void
  onLogFirstSession?: () => void
  onAddPartner?: () => void
}

// ── Sub-components ──

const Wordmark: React.FC = () => (
  <View style={{
    paddingHorizontal: 24,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
  }}>
    <Text style={{
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 22,
      letterSpacing: 6,
      color: colors.terra,
    }}>TATUM</Text>
  </View>
)

interface PeriodTabsProps {
  activeIndex?: number
  dateLabel?: string
  isEmpty?: boolean
}

const periodNames = ['Week', 'Month', 'Year', 'All Time']

const PeriodTabs: React.FC<PeriodTabsProps> = ({ activeIndex, dateLabel, isEmpty }) => (
  <View style={{
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: 'row',
    gap: 6,
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
  }}>
    {periodNames.map((name, i) => {
      const isActive = !isEmpty && activeIndex === i
      return (
        <Pressable
          key={name}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive }}
          accessibilityLabel={name}
          style={{
            flex: 1,
            borderRadius: 9999,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isActive ? undefined : colors.surface2,
            height: 32,
            overflow: 'hidden',
            ...(isActive ? shadows.pillSoft : shadows.pillFlat),
          }}
        >
          {isActive && (
            <LinearGradient
              colors={gradients.primaryCta}
              start={gradientPoints.diagonal.start}
              end={gradientPoints.diagonal.end}
              style={StyleSheet.absoluteFill}
            />
          )}
          <Text style={{
            fontFamily: font('dmSans', '500'),
            fontSize: 11,
            letterSpacing: 0.5,
            lineHeight: 13.2,
            color: isActive ? colors.white : colors.stone,
          }}>{name}</Text>
          {isActive && dateLabel && (
            <Text style={{
              fontFamily: font('dmSans', '300'),
              fontSize: 8,
              opacity: 0.8,
              lineHeight: 9.6,
              color: colors.white,
            }}>{dateLabel}</Text>
          )}
        </Pressable>
      )
    })}
  </View>
)

const OverviewCard: React.FC<{
  sessionsCount: number
  avgRating: number
}> = ({ sessionsCount, avgRating }) => {
  const stats = [
    { label: 'Sessions', value: String(sessionsCount) },
    { label: 'Avg Rating', value: avgRating.toFixed(1) },
  ]
  return (
    <View style={{
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 16,
      flexDirection: 'row',
      flexShrink: 0,
    }}>
      {stats.map((s, i) => (
        <View key={s.label} style={{
          flex: 1,
          paddingHorizontal: 10,
          borderRightWidth: i < stats.length - 1 ? 1 : 0,
          borderRightColor: 'rgba(160,100,80,0.12)',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 7.5,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: colors.stone,
            marginBottom: 3,
            fontFamily: font('dmSans', '500'),
          }}>{s.label}</Text>
          <Text style={{
            fontFamily: font('playfair', '600'),
            fontSize: 28,
            color: colors.terra,
            lineHeight: 28,
            marginBottom: 2,
          }}>{s.value}</Text>
        </View>
      ))}
    </View>
  )
}

const ActivityBar: React.FC<{ activities: Activity[] }> = ({ activities }) => (
  <View style={{
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexShrink: 0,
  }}>
    {activities.map((a, i) => (
      <View key={a.label} style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        marginBottom: i < activities.length - 1 ? 7 : 0,
      }}>
        <Text style={{ fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0 }}>{a.emoji}</Text>
        <Text style={{
          fontSize: 10,
          color: colors.stone,
          width: 62,
          flexShrink: 0,
          fontFamily: fontFamily.dmSans,
        }}>{a.label}</Text>
        <View style={{
          flex: 1,
          height: 5,
          backgroundColor: colors.surface2,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <LinearGradient
            colors={gradients.activityBar}
            start={gradientPoints.horizontal.start}
            end={gradientPoints.horizontal.end}
            style={{ height: 5, borderRadius: 3, width: `${a.percent}%` }}
          />
        </View>
        <Text style={{
          fontSize: 10,
          color: colors.mauve,
          width: 12,
          textAlign: 'right',
          flexShrink: 0,
          fontFamily: font('dmSans', '500'),
        }}>{a.count}</Text>
      </View>
    ))}
  </View>
)

const HomePartnerCard: React.FC<{ partner: Partner; onPress?: () => void }> = ({ partner, onPress }) => (
  <Pressable onPress={onPress} style={{
    flexShrink: 0,
    width: 126,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
  }}>
    <AvatarCircle
      initials={partner.initials}
      gradient={partner.gradient}
      size={52}
      borderWidth={2.5}
    />
    <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{
          fontFamily: font('playfair', '600'),
          fontSize: 17,
          color: colors.terra,
          lineHeight: 17,
        }}>{partner.sessions}</Text>
        <Text style={{
          fontSize: 7,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          color: colors.stone,
          marginTop: 2,
          fontFamily: fontFamily.dmSans,
        }}>Sessions</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{
          fontFamily: font('playfair', '600'),
          fontSize: 17,
          color: colors.terra,
          lineHeight: 17,
        }}>{partner.avgSatisfaction.toFixed(1)}</Text>
        <Text style={{
          fontSize: 7,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          color: colors.stone,
          marginTop: 2,
          fontFamily: fontFamily.dmSans,
        }}>Avg Sat.</Text>
      </View>
    </View>
    {partner.sessions > 0 && (
      <Text style={{
        fontSize: 10,
        color: colors.muted,
        fontFamily: font('dmSans', '300'),
      }}>{partner.topActivityEmoji} Most common</Text>
    )}
  </Pressable>
)

const HomeSessionCard: React.FC<{ session: Session; onPress?: () => void }> = ({ session, onPress }) => (
  <Pressable onPress={onPress} style={{
    flexShrink: 0,
    width: 158,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    paddingHorizontal: 14,
    gap: 10,
  }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
      <AvatarCircle
        initials={session.partnerInitials}
        gradient={session.partnerGradient}
        size={36}
        borderWidth={2}
      />
      <Text style={{
        fontSize: 9,
        color: colors.stone,
        fontFamily: font('dmSans', '300'),
      }}>{session.date}</Text>
    </View>
    <StarRating rating={session.rating} size={13} />
    <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
      {session.activityEmojis.map((e, i) => (
        <View key={i} style={{
          backgroundColor: colors.surface2,
          borderRadius: 6,
          paddingVertical: 3,
          paddingHorizontal: 6,
        }}>
          <Text style={{ fontSize: 14 }}>{e}</Text>
        </View>
      ))}
    </View>
    <Text numberOfLines={2} style={{
      fontSize: 10,
      color: colors.stone,
      fontStyle: 'italic',
      lineHeight: 14.5,
      borderTopWidth: 1,
      borderTopColor: 'rgba(160,100,80,0.1)',
      paddingTop: 6,
      marginTop: 2,
      fontFamily: font('dmSans', '300'),
    }}>{session.note}</Text>
  </Pressable>
)

const ViewAllCard: React.FC = () => (
  <Pressable style={{
    flexShrink: 0,
    width: 72,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(160,100,80,0.28)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginRight: 24,
  }}>
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={3} y={3} width={7} height={7} />
      <Rect x={14} y={3} width={7} height={7} />
      <Rect x={3} y={14} width={7} height={7} />
      <Rect x={14} y={14} width={7} height={7} />
    </Svg>
    <Text style={{
      fontSize: 8,
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colors.terra,
      textAlign: 'center',
      lineHeight: 10.4,
      fontFamily: font('dmSans', '500'),
    }}>View All</Text>
  </Pressable>
)

// ── Empty State Sub-components ──

const HeroEmpty: React.FC<{ userName: string; onLogSession?: () => void }> = ({ userName, onLogSession }) => (
  <View style={{
    marginTop: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(160,100,80,0.13)',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  }}>
    <Image source={require('@/assets/tatum-logo.png')} style={{ width: 64, height: 64, marginBottom: 14 }} />
    <Text style={{
      fontFamily: font('playfair', '700'),
      fontSize: 22,
      color: colors.ink,
      marginBottom: 8,
      lineHeight: 28.6,
      textAlign: 'center',
    }}>Welcome to Tatum, {userName}.</Text>
    <Text style={{
      fontSize: 13,
      color: colors.stone,
      lineHeight: 22.1,
      marginBottom: 20,
      fontFamily: font('dmSans', '300'),
      textAlign: 'center',
    }}>
      This is your private space. As you start logging, your stats, patterns, and sessions will show up here — all yours, all on your device.
    </Text>
    <Pressable
      onPress={onLogSession}
      accessibilityRole="button"
      accessibilityLabel="Log your first session"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        borderRadius: 9999,
        paddingVertical: 13,
        paddingHorizontal: 28,
        overflow: 'hidden',
        ...shadows.primaryButton,
      }}
    >
      <LinearGradient
        colors={gradients.primaryCta}
        start={gradientPoints.diagonal.start}
        end={gradientPoints.diagonal.end}
        style={StyleSheet.absoluteFill}
      />
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round">
        <Line x1={12} y1={5} x2={12} y2={19} />
        <Line x1={5} y1={12} x2={19} y2={12} />
      </Svg>
      <Text style={{
        fontFamily: font('dmSans', '500'),
        fontSize: 13,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: colors.white,
      }}>Log your first session</Text>
    </Pressable>
  </View>
)

const EmptyStatsStrip: React.FC = () => {
  const labels = ['Sessions', 'Avg Sat.', 'Avg Rating']
  return (
    <View style={{
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: 'rgba(160,100,80,0.13)',
      borderRadius: 16,
      paddingVertical: 14,
      flexDirection: 'row',
    }}>
      {labels.map((label, i) => (
        <View key={label} style={{
          flex: 1,
          alignItems: 'center',
          borderRightWidth: i < 2 ? 1 : 0,
          borderRightColor: 'rgba(160,100,80,0.1)',
          paddingHorizontal: 4,
        }}>
          <View style={{
            width: 36,
            height: 20,
            backgroundColor: colors.surface2,
            borderRadius: 6,
            marginBottom: 5,
          }} />
          <Text style={{
            fontSize: 7.5,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: '#C4B0A0',
            fontFamily: font('dmSans', '500'),
          }}>{label}</Text>
        </View>
      ))}
    </View>
  )
}

const EmptyPartnerCard: React.FC<{ partner: EmptyPartner }> = ({ partner }) => (
  <View style={{
    flexShrink: 0,
    width: 110,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(160,100,80,0.13)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
  }}>
    <AvatarCircle
      initials={partner.initials}
      gradient={partner.gradient}
      size={44}
      borderWidth={2}
    />
    <Text style={{
      fontSize: 12,
      color: colors.ink,
      fontFamily: font('dmSans', '500'),
    }}>{partner.name}</Text>
    <Text style={{
      fontSize: 10,
      color: '#C4B0A0',
      fontStyle: 'italic',
      fontFamily: font('dmSans', '300'),
    }}>No sessions yet</Text>
  </View>
)

const AddPartnerChip: React.FC<{ onPress?: () => void }> = ({ onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      flexShrink: 0,
      width: 110,
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: 'rgba(192,120,88,0.3)',
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 10,
      alignItems: 'center',
      gap: 6,
    }}
  >
    <View style={{
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(192,120,88,0.08)',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" opacity={0.7}>
        <Path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <Circle cx={8.5} cy={7} r={4} />
        <Line x1={20} y1={8} x2={20} y2={14} />
        <Line x1={23} y1={11} x2={17} y2={11} />
      </Svg>
    </View>
    <Text style={{
      fontSize: 11,
      fontWeight: '400',
      color: colors.terra,
      fontFamily: fontFamily.dmSans,
    }}>Add partner</Text>
  </Pressable>
)

const EmptySessionsPlaceholder: React.FC = () => (
  <View style={{
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(160,100,80,0.13)',
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
  }}>
    <Text style={{ fontSize: 28, marginBottom: 8, opacity: 0.5 }}>{'\uD83D\uDCD6'}</Text>
    <Text style={{
      fontSize: 12,
      color: colors.stone,
      lineHeight: 19.8,
      fontFamily: font('dmSans', '300'),
      textAlign: 'center',
    }}>
      Once you start logging, your sessions will show up here. Every entry is a part of your story.
    </Text>
  </View>
)

// ── Main Component ──

export const HomeScreen: React.FC<HomeScreenProps> = ({
  activePeriod = 0,
  periodDateLabel,
  sessionsCount = 0,
  avgRating = 0,
  topActivities = [],
  partners = [],
  recentSessions = [],
  isEmpty = false,
  userName = 'Alanna',
  emptyPartners = [],
  onPartnerPress,
  onSessionPress,
  onLogFirstSession,
  onAddPartner,
}) => {
  if (isEmpty) {
    return (
      <View style={{
        width: '100%',
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: colors.warmSand,
      }}>
        <DecorativeGlow position="center" size={320} />
        <View style={{ height: 54 }} />
        <Wordmark />
        <PeriodTabs isEmpty />

        <ScrollView
          style={{ flex: 1, paddingHorizontal: 24, position: 'relative', zIndex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <HeroEmpty userName={userName} onLogSession={onLogFirstSession} />

          <View style={{ marginTop: 16, marginBottom: 10 }}>
            <SectionLabel label="Overview" style={INLINE_LABEL_STYLE} />
          </View>
          <EmptyStatsStrip />

          <View style={{ marginTop: 16, marginBottom: 10 }}>
            <SectionLabel label="Partners" style={INLINE_LABEL_STYLE} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ overflow: 'visible' }}>
            <View style={{ flexDirection: 'row', gap: 8, paddingRight: 40 }}>
              {emptyPartners.map((p, i) => (
                <EmptyPartnerCard key={i} partner={p} />
              ))}
              <AddPartnerChip onPress={onAddPartner} />
            </View>
          </ScrollView>

          <View style={{ marginTop: 16, marginBottom: 10 }}>
            <SectionLabel label="Recent Sessions" style={INLINE_LABEL_STYLE} />
          </View>
          <EmptySessionsPlaceholder />

        </ScrollView>
      </View>
    )
  }

  return (
    <View style={{
      width: '100%',
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: colors.warmSand,
    }}>
      <DecorativeGlow position="top-right" size={240} />
      <View style={{ height: 54 }} />
      <Wordmark />
      <PeriodTabs activeIndex={activePeriod} dateLabel={periodDateLabel} />

      {/* Main content */}
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 10,
          position: 'relative',
          zIndex: 1,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{ gap: 9 }}>
          <OverviewCard
            sessionsCount={sessionsCount}
            avgRating={avgRating}
          />

          <SectionLabel label="Top Activities" style={INLINE_LABEL_STYLE} />
          <ActivityBar activities={topActivities} />

          <SectionLabel label="Partners" showChevron style={INLINE_LABEL_STYLE} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginRight: -24, overflow: 'visible' }}>
            <View style={{ flexDirection: 'row', gap: 8, paddingRight: 40 }}>
              {partners.map((p, i) => (
                <HomePartnerCard key={i} partner={p} onPress={() => onPartnerPress?.(i)} />
              ))}
            </View>
          </ScrollView>

          <SectionLabel label="Sessions" style={INLINE_LABEL_STYLE} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginRight: -24, overflow: 'visible' }}>
            <View style={{ flexDirection: 'row', gap: 8, paddingRight: 40 }}>
              {recentSessions.map((s, i) => (
                <HomeSessionCard key={i} session={s} onPress={() => onSessionPress?.(i)} />
              ))}
              <ViewAllCard />
            </View>
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  )
}
