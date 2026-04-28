import React from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path } from 'react-native-svg'
import { colors, font, fontFamily, gradientPoints, gradients, shadows } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { StatusBarSpacer } from './shared/StatusBarSpacer'
import { StepDots } from '../components/StepDots'

const GradientButton: React.FC<{ label: string; onPress?: () => void }> = ({ label, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={{
      width: '100%',
      height: 52,
      borderRadius: 9999,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      ...shadows.primaryButtonStrong,
    }}
  >
    <LinearGradient
      colors={gradients.primaryCta}
      start={gradientPoints.diagonal.start}
      end={gradientPoints.diagonal.end}
      style={[StyleSheet.absoluteFill, { borderRadius: 9999 }]}
    />
    <Text
      style={{
        fontFamily: font('dmSans', '500'),
        fontSize: 13,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: 'white',
      }}
    >
      {label}
    </Text>
  </Pressable>
)

/* -- Tag data -- */

const TAGS = [
  { emoji: '🍆', label: 'Penetration' },
  { emoji: '👉', label: 'Fingering' },
  { emoji: '🫱', label: 'Manual' },
  { emoji: '💋', label: 'Giving' },
  { emoji: '😛', label: 'Receiving' },
  { emoji: '🌬️', label: 'Blow Job' },
  { emoji: '🍑', label: 'Anal' },
  { emoji: '💦', label: 'Cumming' },
  { emoji: '✨', label: 'Solo' },
  { emoji: '💃', label: 'She Initiated' },
  { emoji: '🤝', label: 'Mutual' },
  { emoji: '😴', label: 'Sleepy' },
  { emoji: '⌛️', label: 'Long' },
  { emoji: '🏁', label: 'Fast' },
  { emoji: '🌙', label: 'Night' },
  { emoji: '🌄', label: 'Morning' },
  { emoji: '🛁', label: 'Shower' },
  { emoji: '🏡', label: 'At Home' },
  { emoji: '🏖', label: 'Vacation' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '🩸', label: 'Period' },
] as const

/* -- Tag chip -- */

const TagChip: React.FC<{ emoji: string; label: string; active?: boolean }> = ({ emoji, label, active = true }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ selected: active }}
    style={{ flexDirection: 'column', alignItems: 'center', gap: 5, width: 72 }}
  >
    <View
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...(active
          ? {
              shadowColor: '#7C4A5A',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.32,
              shadowRadius: 14,
              elevation: 5,
            }
          : {
              backgroundColor: colors.surface2,
              borderWidth: 1.5,
              borderColor: 'rgba(160,100,80,0.2)',
            }),
      }}
    >
      {active && (
        <LinearGradient
          colors={gradients.primaryCta}
          start={gradientPoints.diagonal.start}
          end={gradientPoints.diagonal.end}
          style={[StyleSheet.absoluteFill, { borderRadius: 32 }]}
        />
      )}
      <Text style={{ fontSize: 26 }}>{emoji}</Text>
    </View>
    <Text
      style={{
        fontFamily: font('dmSans', active ? '500' : '400'),
        fontSize: 9,
        color: active ? colors.terra : colors.stone,
        textAlign: 'center',
        lineHeight: 10.8,
        letterSpacing: 0.2,
      }}
    >
      {label}
    </Text>
  </Pressable>
)

/* -- Add chip -- */

const AddChip: React.FC = () => (
  <Pressable style={{ flexDirection: 'column', alignItems: 'center', gap: 5, width: 72 }}>
    <View
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: 'rgba(192,120,88,0.4)',
      }}
    >
      <Text style={{ fontSize: 22, color: colors.terra }}>＋</Text>
    </View>
    <Text
      style={{
        fontFamily: fontFamily.dmSans,
        fontSize: 9,
        fontWeight: '400',
        color: colors.terra,
        textAlign: 'center',
        lineHeight: 10.8,
        letterSpacing: 0.2,
      }}
    >
      Add yours
    </Text>
  </Pressable>
)

/* -- Hand icon -- */

const HandIcon: React.FC = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#C4B0A0" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 11V6a2 2 0 00-4 0v5" />
    <Path d="M14 10V4a2 2 0 00-4 0v6" />
    <Path d="M10 10.5V6a2 2 0 00-4 0v8" />
    <Path d="M18 11a2 2 0 014 0v3a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 012.83-2.82L7 15" />
  </Svg>
)

/* -- Helper: chunk array into rows of N -- */
const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

/* -- Screen -- */

export const OnboardingTagsScreen: React.FC = () => {
  // Build columns of 3 for horizontal scroll (matching the original 3-row grid)
  const allItems = [{ emoji: '＋', label: 'Add yours', isAdd: true as const }, ...TAGS.map(t => ({ ...t, isAdd: false as const }))]
  const columns = chunkArray(allItems, 3)

  return (
    <View
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'column',
        backgroundColor: colors.warmSand,
      }}
    >
      <DecorativeGlow position="top-right" size={240} opacity={0.1} />
      <StatusBarSpacer />

      {/* Content */}
      <View
        style={{
          flex: 1,
          overflow: 'hidden',
          flexDirection: 'column',
          paddingLeft: 28,
          zIndex: 1,
        }}
      >
        {/* Title area */}
        <View style={{ marginTop: 22, marginBottom: 20, paddingRight: 28 }}>
          <Text
            style={{
              fontFamily: font('dmSans', '500'),
              fontSize: 9,
              letterSpacing: 3.5,
              textTransform: 'uppercase',
              color: colors.terra,
              marginBottom: 8,
            }}
          >
            Step 4 of 4
          </Text>
          <Text
            style={{
              fontFamily: font('playfair', '700'),
              fontSize: 30,
              color: colors.ink,
              lineHeight: 36,
              marginBottom: 8,
            }}
          >
            Make it{'\n'}yours
          </Text>
          <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 13, color: colors.stone, lineHeight: 20.8 }}>
            These are your activity tags. Keep what fits, remove what doesn't, and add your own.
          </Text>
        </View>

        {/* Explainer card */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: 'rgba(160,100,80,0.15)',
            borderRadius: 14,
            paddingVertical: 13,
            paddingHorizontal: 14,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
            marginBottom: 20,
            marginRight: 28,
          }}
        >
          <Text style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>🏷️</Text>
          <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 12, color: '#7A5A50', lineHeight: 18.6, flex: 1 }}>
            <Text style={{ fontWeight: '500', color: colors.ink }}>Activity tags</Text> are the emoji labels you tap
            when logging a session. They're completely private and fully customizable — you can rename, delete, or add new
            ones at any time.
          </Text>
        </View>

        {/* Horizontally scrollable tag grid -- 3 rows */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 14 }}
          contentContainerStyle={{ gap: 8, paddingRight: 40 }}
        >
          {columns.map((col, ci) => (
            <View key={ci} style={{ flexDirection: 'column', gap: 10 }}>
              {col.map((item, ri) =>
                item.isAdd ? (
                  <AddChip key={`add-${ri}`} />
                ) : (
                  <TagChip key={`${ci}-${ri}`} emoji={item.emoji} label={item.label} active={true} />
                )
              )}
            </View>
          ))}
        </ScrollView>

        {/* Hint */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            paddingRight: 28,
          }}
        >
          <HandIcon />
          <Text
            style={{
              fontFamily: font('dmSans', '300'),
              fontSize: 10,
              color: '#C4B0A0',
              fontStyle: 'italic',
            }}
          >
            Swipe to see more · Hold to rename or remove
          </Text>
        </View>
      </View>

      {/* Bottom area */}
      <View style={{ flexShrink: 0, paddingHorizontal: 28, paddingBottom: 32 }}>
        <GradientButton label="These Look Good" />
        <StepDots current={3} />
      </View>
    </View>
  )
}
