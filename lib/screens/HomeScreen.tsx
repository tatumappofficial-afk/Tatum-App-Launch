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
  <View style={styles.wordmarkContainer}>
    <Text style={styles.wordmarkText}>TATUM</Text>
  </View>
)

// ── Empty-state (Scenario A — zero encounters anywhere) ──

const HeroEmpty: React.FC<{ userName: string; onLogSession?: () => void }> = ({ userName, onLogSession }) => (
  <View style={styles.heroEmpty}>
    <Image source={require('@/assets/tatum-logo.png')} style={styles.heroLogo} />
    <Text style={styles.heroTitle}>Welcome to Tatum, {userName}.</Text>
    <Text style={styles.heroSubtitle}>
      This is your private space. As you start logging, your stats, patterns, and sessions will show up here — all yours, all on your device.
    </Text>
    <Pressable
      onPress={onLogSession}
      accessibilityRole="button"
      accessibilityLabel="Log your first session"
      style={styles.heroCta}
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
      <Text style={styles.heroCtaText}>Log your first session</Text>
    </Pressable>
  </View>
)

const EmptyStatsStrip: React.FC = () => {
  const labels = ['Sessions', 'Avg Sat.', 'Avg Rating']
  return (
    <View style={styles.statsStrip}>
      {labels.map((label, i) => (
        <View
          key={label}
          style={[styles.statsCell, { borderRightWidth: i < 2 ? 1 : 0 }]}
        >
          <View style={styles.statsPlaceholder} />
          <Text style={styles.statsLabel}>{label}</Text>
        </View>
      ))}
    </View>
  )
}

const EmptyPartnerCard: React.FC<{ partner: EmptyPartner; onPress?: () => void }> = ({ partner, onPress }) => (
  <Pressable onPress={onPress} style={styles.emptyPartnerCard}>
    <AvatarCircle
      initials={partner.initials}
      gradient={partner.gradient}
      size={44}
      borderWidth={2}
    />
    <Text style={styles.emptyPartnerLabel}>No sessions yet</Text>
  </Pressable>
)

const AddPartnerChip: React.FC<{ onPress?: () => void }> = ({ onPress }) => (
  <Pressable
    onPress={onPress}
    style={styles.addPartnerChip}
  >
    <View style={styles.addPartnerIconCircle}>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" opacity={0.7}>
        <Path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <Circle cx={8.5} cy={7} r={4} />
        <Line x1={20} y1={8} x2={20} y2={14} />
        <Line x1={23} y1={11} x2={17} y2={11} />
      </Svg>
    </View>
    <Text style={styles.addPartnerLabel}>Add partner</Text>
  </Pressable>
)

const EmptySessionsPlaceholder: React.FC = () => (
  <View style={styles.emptySessionsPlaceholder}>
    <Text style={styles.emptySessionsEmoji}>{'📖'}</Text>
    <Text style={styles.emptySessionsText}>
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
      <View style={styles.screenRoot}>
        <DecorativeGlow position="center" size={320} />
        <StatusBarSpacer />
        <Wordmark />
        <PeriodTabs active={period} onChange={onPeriodChange} inert />

        <ScrollView
          style={styles.emptyScroll}
          contentContainerStyle={styles.scrollContent}
        >
          <HeroEmpty userName={userName} onLogSession={onLogFirstSession} />

          <View style={styles.sectionLabelWrap}>
            <SectionLabel label="Overview" style={INLINE_LABEL_STYLE} />
          </View>
          <EmptyStatsStrip />

          <View style={styles.sectionLabelWrap}>
            <SectionLabel label="Partners" style={INLINE_LABEL_STYLE} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.partnersRow}>
              {emptyPartners.map((p, i) => (
                <EmptyPartnerCard key={i} partner={p} onPress={() => onPartnerPress?.(i)} />
              ))}
              <AddPartnerChip onPress={onAddPartner} />
            </View>
          </ScrollView>

          <View style={styles.sectionLabelWrap}>
            <SectionLabel label="Recent Sessions" style={INLINE_LABEL_STYLE} />
          </View>
          <EmptySessionsPlaceholder />
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={styles.screenRoot}>
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
        <View style={styles.pickerWrap}>
          {pickerContent}
        </View>
      )}

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.scrollContent}
      >
        {children}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screenRoot: {
    width: '100%',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.warmSand,
  },
  wordmarkContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
  },
  wordmarkText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    letterSpacing: 6,
    color: colors.terra,
  },
  heroEmpty: {
    marginTop: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(160,100,80,0.13)',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroLogo: {
    width: 64,
    height: 64,
    marginBottom: 14,
  },
  heroTitle: {
    fontFamily: font('playfair', '700'),
    fontSize: 22,
    color: colors.ink,
    marginBottom: 8,
    lineHeight: 28.6,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.stone,
    lineHeight: 22.1,
    marginBottom: 20,
    fontFamily: font('dmSans', '300'),
    textAlign: 'center',
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 9999,
    paddingVertical: 13,
    paddingHorizontal: 28,
    overflow: 'hidden',
    ...shadows.primaryButton,
  },
  heroCtaText: {
    fontFamily: font('dmSans', '500'),
    fontSize: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.white,
  },
  statsStrip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(160,100,80,0.13)',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
  },
  statsCell: {
    flex: 1,
    alignItems: 'center',
    borderRightColor: 'rgba(160,100,80,0.1)',
    paddingHorizontal: 4,
  },
  statsPlaceholder: {
    width: 36,
    height: 20,
    backgroundColor: colors.surface2,
    borderRadius: 6,
    marginBottom: 5,
  },
  statsLabel: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#C4B0A0',
    fontFamily: font('dmSans', '500'),
  },
  emptyPartnerCard: {
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
  },
  emptyPartnerLabel: {
    fontSize: 12,
    color: '#C4B0A0',
    fontStyle: 'italic',
    fontFamily: font('dmSans', '300'),
  },
  addPartnerChip: {
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
  },
  addPartnerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(192,120,88,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPartnerLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.terra,
    fontFamily: fontFamily.dmSans,
  },
  emptySessionsPlaceholder: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(160,100,80,0.13)',
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptySessionsEmoji: {
    fontSize: 28,
    marginBottom: 8,
    opacity: 0.5,
  },
  emptySessionsText: {
    fontSize: 14,
    color: colors.stone,
    lineHeight: 19.8,
    fontFamily: font('dmSans', '300'),
    textAlign: 'center',
  },
  emptyScroll: {
    flex: 1,
    paddingHorizontal: 24,
    position: 'relative',
    zIndex: 1,
  },
  mainScroll: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 4,
    position: 'relative',
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionLabelWrap: {
    marginTop: 16,
    marginBottom: 10,
  },
  partnersRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 40,
  },
  pickerWrap: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    position: 'relative',
    zIndex: 50,
  },
})
