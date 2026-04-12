import React from 'react'
import { View, Text } from 'react-native'
import { colors, font, fontFamily, gradientStyle } from '../theme'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { GradientButton } from '../components/GradientButton'

/* -- Shared onboarding primitives -- */

const StepDots: React.FC<{ active: number; total?: number }> = ({ active, total = 4 }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
    {Array.from({ length: total }, (_, i) => {
      const isDone = i < active
      const isActive = i === active
      return (
        <View
          key={i}
          style={{
            width: isActive ? 20 : 7,
            height: 7,
            borderRadius: isActive ? 4 : 3.5,
            backgroundColor: isActive
              ? colors.terra
              : isDone
                ? 'rgba(192,120,88,0.4)'
                : 'rgba(160,100,80,0.2)',
          }}
        />
      )
    })}
  </View>
)

/* -- Promise item -- */

const PromiseItem: React.FC<{ emoji: string; title: string; desc: string }> = ({ emoji, title, desc }) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
    <Text style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{emoji}</Text>
    <View>
      <Text style={{ fontFamily: font('dmSans', '500'), fontSize: 13, color: colors.ink, marginBottom: 2 }}>
        {title}
      </Text>
      <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 12, color: colors.stone, lineHeight: 18.6 }}>
        {desc}
      </Text>
    </View>
  </View>
)

/* -- Screen -- */

export const OnboardingPrivacyScreen: React.FC = () => (
  <View
    style={{
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      flexDirection: 'column',
      backgroundColor: colors.warmSand,
    }}
  >
    <DecorativeGlow position="center" size={320} opacity={0.13} />
    <View style={{ height: 54 }} />

    {/* Content */}
    <View
      style={{
        flex: 1,
        overflow: 'hidden',
        flexDirection: 'column',
        paddingHorizontal: 28,
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* App icon */}
      <View style={{ marginTop: 18, marginBottom: 16, flexDirection: 'row', justifyContent: 'center' }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            ...gradientStyle('linear-gradient(135deg, #C07858, #7C4A5A)'),
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(124,74,90,0.3)',
          }}
        >
          <Text style={{ fontSize: 16, color: colors.white, lineHeight: 16 }}>&#10022;</Text>
        </View>
      </View>

      {/* Letter-style headline */}
      <View style={{ alignItems: 'center', marginBottom: 18 }}>
        <Text
          style={{
            fontFamily: fontFamily.playfair,
            fontSize: 13,
            fontWeight: '400',
            fontStyle: 'italic',
            color: colors.stone,
            marginBottom: 6,
            letterSpacing: 0.3,
          }}
        >
          before we begin —
        </Text>
        <Text
          style={{
            fontFamily: font('playfair', '700'),
            fontSize: 26,
            color: colors.ink,
            lineHeight: 32.5,
            marginBottom: 10,
            textAlign: 'center',
          }}
        >
          This is yours.{'\n'}Only yours.
        </Text>
        <Text
          style={{
            fontFamily: font('dmSans', '300'),
            fontSize: 13,
            color: '#7A5A50',
            lineHeight: 22.1,
            textAlign: 'center',
          }}
        >
          Everything you log in Tatum lives on your device and nowhere else. That way your data stays yours.
        </Text>
      </View>

      {/* Divider */}
      <View style={{ width: 40, height: 1, backgroundColor: 'rgba(192,120,88,0.3)', alignSelf: 'center', marginVertical: 16 }} />

      {/* Promise list */}
      <View style={{ flexDirection: 'column', gap: 14, marginBottom: 16 }}>
        <PromiseItem
          emoji="🔒"
          title="Stored only on your phone"
          desc="Your logs, notes, and ratings never leave your device without your permission."
        />
        <PromiseItem
          emoji="🗑️"
          title="Delete the app, delete everything"
          desc="Uninstalling Tatum permanently removes all of your data. No traces left behind."
        />
        <PromiseItem
          emoji="📱"
          title="Switch phones safely"
          desc="If you choose to turn it on, your data can move with you via iCloud or Google backup when you get a new device."
        />
      </View>

      {/* Signature */}
      <View style={{ alignItems: 'center', marginBottom: 14 }}>
        <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 11, color: colors.stone, marginBottom: 3 }}>with love,</Text>
        <Text
          style={{
            fontFamily: font('playfair', '600'),
            fontSize: 18,
            fontStyle: 'italic',
            color: colors.terra,
          }}
        >
          Tatum
        </Text>
      </View>
    </View>

    {/* Bottom area */}
    <View style={{ flexShrink: 0, paddingHorizontal: 28, paddingBottom: 32 }}>
      <View style={{ marginBottom: 14 }}>
        <GradientButton label="I Understand, Let's Begin" />
      </View>
      <StepDots active={0} />
    </View>
  </View>
)
