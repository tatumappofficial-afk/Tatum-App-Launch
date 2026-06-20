import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Rect, Line, Path, Polyline } from 'react-native-svg'
import { useRouter } from 'expo-router'
import { useLiveQuery } from '@tanstack/react-db'
import { useBlockBack } from '@/src/hooks/useBlockBack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, font, gradientPoints } from '@/lib/theme'
import { GradientButton } from '@/lib/components/GradientButton'
import { RadialGlow } from '@/lib/screens/shared/DecorativeGlow'
import { StatusBarSpacer } from '@/lib/screens/shared/StatusBarSpacer'
import { useUpdateSettings } from '@/src/hooks/useSettings'
import { presentRevenueCatPaywallIfNeeded } from '@/src/services/revenueCat'
import { userProfiles } from '@/src/db'

const CalendarIcon: React.FC = () => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.terra}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Rect x={3} y={4} width={18} height={18} rx={2} ry={2} />
    <Line x1={16} y1={2} x2={16} y2={6} />
    <Line x1={8} y1={2} x2={8} y2={6} />
    <Line x1={3} y1={10} x2={21} y2={10} />
  </Svg>
)

const HomeIcon: React.FC = () => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.terra}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
)

const BookIcon: React.FC = () => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.terra}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </Svg>
)

const FeaturePill: React.FC<{ icon: React.ReactNode; text: React.ReactNode }> = ({ icon, text }) => (
  <View
    style={{
      backgroundColor: 'rgba(251,247,242,0.8)',
      borderWidth: 1,
      borderColor: 'rgba(160,100,80,0.15)',
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    }}
  >
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
    <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: '#6A4A40', lineHeight: 17.5, flex: 1 }}>
      {text}
    </Text>
  </View>
)

export default function ReadyScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const updateSettings = useUpdateSettings()
  const [starting, setStarting] = useState(false)
  const { data: profiles = [] } = useLiveQuery((q) =>
    q.from({ userProfiles }).select(({ userProfiles }) => ({ ...userProfiles })),
  )
  const appUserID = profiles.find((profile) => profile.id === 'default')?.providerUserId ?? null
  useBlockBack()

  const logoRotation = useSharedValue(0)
  const logoOpacity = useSharedValue(0)
  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) })
    logoRotation.value = withTiming(360, { duration: 1100, easing: Easing.out(Easing.cubic) })
  }, [logoOpacity, logoRotation])
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ rotate: `${logoRotation.value}deg` }],
  }))

  async function handleStart() {
    if (starting) return

    setStarting(true)
    try {
      const paywallResult = await presentRevenueCatPaywallIfNeeded(appUserID)
      if (paywallResult === 'blocked' || paywallResult === 'error') return

      // Context update is synchronous — Stack.Protected guards in _layout.tsx
      // re-evaluate on the next render, so (tabs) is mounted by the time
      // router.replace fires.
      updateSettings({ hasOnboarded: true })
      router.replace('/(tabs)')
    } finally {
      setStarting(false)
    }
  }

  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      <LinearGradient
        colors={['#F5EFE8', '#EDE3D8', '#E0D0C0']}
        locations={[0, 0.6, 1]}
        start={gradientPoints.almostVertical.start}
        end={gradientPoints.almostVertical.end}
        style={StyleSheet.absoluteFill}
      />

      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: '42%', alignSelf: 'center', width: 400, height: 400 }}
      >
        <RadialGlow size={400} color="rgb(192,120,88)" opacity={0.18} falloff={65} />
      </View>

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: 260,
          height: 260,
          borderRadius: 130,
          borderWidth: 1,
          borderColor: 'rgba(192,120,88,0.12)',
          top: '42%',
          alignSelf: 'center',
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: 340,
          height: 340,
          borderRadius: 170,
          borderWidth: 1,
          borderColor: 'rgba(192,120,88,0.12)',
          top: '42%',
          alignSelf: 'center',
        }}
      />

      <StatusBarSpacer />

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 36,
        }}
      >
        <Animated.Image
          source={require('@/assets/tatum-logo.png')}
          style={[{ width: 160, height: 160, marginBottom: 28 }, logoStyle]}
        />

        <Text
          style={{
            fontFamily: font('playfair', '700'),
            fontSize: 36,
            color: colors.ink,
            lineHeight: 41.4,
            marginBottom: 14,
            textAlign: 'center',
          }}
        >
          You're all set.
        </Text>

        <Text
          style={{
            fontFamily: font('dmSans', '300'),
            fontSize: 14,
            color: colors.stone,
            textAlign: 'center',
            marginBottom: 18,
            letterSpacing: 0.3,
          }}
        >
          Here's what's waiting for you.
        </Text>

        <View style={{ gap: 8, width: '100%', marginBottom: 32 }}>
          <FeaturePill
            icon={<CalendarIcon />}
            text={
              <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: '#6A4A40', lineHeight: 17.5 }}>
                <Text style={{ fontWeight: '500', color: colors.ink }}>Calendar</Text> — every moment logged and mapped,
                month by month.
              </Text>
            }
          />
          <FeaturePill
            icon={<HomeIcon />}
            text={
              <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: '#6A4A40', lineHeight: 17.5 }}>
                <Text style={{ fontWeight: '500', color: colors.ink }}>Home</Text> — your stats, your partners, your
                patterns at a glance.
              </Text>
            }
          />
          <FeaturePill
            icon={<BookIcon />}
            text={
              <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: '#6A4A40', lineHeight: 17.5 }}>
                <Text style={{ fontWeight: '500', color: colors.ink }}>Journal</Text> — write notes on any session,
                private and yours.
              </Text>
            }
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 28, paddingBottom: Math.max(insets.bottom + 8, 40) }}>
        <View style={{ marginBottom: 12 }}>
          <GradientButton
            label={starting ? 'Starting...' : 'Start Logging'}
            height={56}
            fontSize={14}
            onPress={handleStart}
            disabled={starting}
          />
        </View>
        <Text
          style={{
            fontFamily: font('dmSans', '300'),
            textAlign: 'center',
            fontSize: 14,
            color: colors.muted,
            lineHeight: 16.5,
          }}
        >
          Your data is private and yours alone.
        </Text>
      </View>
    </View>
  )
}
