import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Circle, Line, Path } from 'react-native-svg'
import { colors, font, fontFamily, gradientPoints, gradients, shadows } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { SectionLabel } from './shared/SectionLabel'
import { StatusBarSpacer } from './shared/StatusBarSpacer'
import { AvatarCircle } from '../components/AvatarCircle'
import { PeriodTabs } from './home/shared/PeriodTabs'
import { PeriodCaptionRow } from './home/shared/PeriodCaptionRow'
import type { Period } from '../stats'

const INLINE_LABEL_STYLE = { marginVertical: 0, marginHorizontal: 0, marginBottom: 0, flexShrink: 0 } as const

export interface EmptyPartner {
  initials: string
  gradient: string
}

export interface HomeScreenProps {
  period: Period
  onPeriodChange: (period: Period) => void
  /** Date-range caption shown under the tabs (e.g. "Apr 26 – May 2"). */
  caption: string
  /** When `period === 'all'`, the "since X" caption rendered inside the static pill. */
  staticPillCaption?: string
  onPickerPress?: () => void
  /** Whether the period picker dropdown is open. */
  pickerOpen?: boolean
  /** The dropdown JSX shown beneath the caption row when `pickerOpen`. */
  pickerContent?: React.ReactNode
  /** True only when the user has zero encounters anywhere — Scenario A empty. */
  isEmpty?: boolean
  userName?: string
  emptyPartners?: EmptyPartner[]
  onPartnerPress?: (index: number) => void
  onLogFirstSession?: () => void
  onAddPartner?: () => void
  /** The active period view's content. Ignored when `isEmpty`. */
  children?: React.ReactNode
}

// ── Wordmark ──

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

// ── Empty-state (Scenario A — zero encounters anywhere) ──

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
        style={[StyleSheet.absoluteFill, { borderRadius: 9999 }]}
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

const EmptyPartnerCard: React.FC<{ partner: EmptyPartner; onPress?: () => void }> = ({ partner, onPress }) => (
  <Pressable onPress={onPress} style={{
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
      fontSize: 10,
      color: '#C4B0A0',
      fontStyle: 'italic',
      fontFamily: font('dmSans', '300'),
    }}>No sessions yet</Text>
  </Pressable>
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
    <Text style={{ fontSize: 28, marginBottom: 8, opacity: 0.5 }}>{'📖'}</Text>
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

// ── Main ──

export const HomeScreen: React.FC<HomeScreenProps> = ({
  period,
  onPeriodChange,
  caption,
  staticPillCaption,
  onPickerPress,
  pickerOpen = false,
  pickerContent,
  isEmpty = false,
  userName = 'Alanna',
  emptyPartners = [],
  onPartnerPress,
  onLogFirstSession,
  onAddPartner,
  children,
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
        <StatusBarSpacer />
        <Wordmark />
        <PeriodTabs active={period} onChange={onPeriodChange} inert />

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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8, paddingRight: 40 }}>
              {emptyPartners.map((p, i) => (
                <EmptyPartnerCard key={i} partner={p} onPress={() => onPartnerPress?.(i)} />
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
      <StatusBarSpacer />
      <Wordmark />
      <PeriodTabs active={period} onChange={onPeriodChange} />
      <PeriodCaptionRow
        period={period}
        caption={caption}
        staticPillCaption={staticPillCaption}
        onPickerPress={onPickerPress}
      />

      {pickerOpen && pickerContent && (
        <View style={{ paddingHorizontal: 24, paddingBottom: 8, position: 'relative', zIndex: 50 }}>
          {pickerContent}
        </View>
      )}

      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 4,
          position: 'relative',
          zIndex: 1,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {children}
      </ScrollView>
    </View>
  )
}
