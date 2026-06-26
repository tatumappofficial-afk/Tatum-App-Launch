import { useState } from 'react'
import { Platform, StyleSheet, View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path } from 'react-native-svg'
import { useRouter } from 'expo-router'
import { useBlockBack } from '@/src/hooks/useBlockBack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, font, gradientPoints, gradients } from '@/lib/theme'
import { GradientButton } from '@/lib/components/GradientButton'
import { StepDots } from '@/lib/components/StepDots'
import { DecorativeGlow } from '@/lib/screens/shared/DecorativeGlow'
import { StatusBarSpacer } from '@/lib/screens/shared/StatusBarSpacer'

const ShieldIcon: React.FC = () => (
  <Svg
    width={28}
    height={28}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.white}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M9 12l2 2 4-4" />
  </Svg>
)

export default function SafeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  useBlockBack()

  const [busy, setBusy] = useState(false)
  const deviceLockLabel = Platform.OS === 'ios' ? 'Face ID' : 'your device lock'
  const backupLabel = Platform.OS === 'ios' ? 'iCloud' : 'Google backup'

  // Stays busy through router.push so a second tap can't queue a duplicate
  // navigation while the next screen is animating in.
  function handlePrimary() {
    if (busy) return
    setBusy(true)
    router.push('/(onboarding)/partner')
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.warmSand }}>
      <DecorativeGlow position="top-right" size={240} opacity={0.1} />
      <StatusBarSpacer />

      <View style={{ flex: 1, paddingHorizontal: 28 }}>
        {/* Header */}
        <View style={{ marginTop: 36, marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: font('dmSans', '500'),
              fontSize: 12,
              letterSpacing: 3.5,
              textTransform: 'uppercase',
              color: colors.terra,
              marginBottom: 8,
            }}
          >
            Step 5 of 7
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
            Your data stays yours
          </Text>
          <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: colors.stone, lineHeight: 20.8 }}>
            Everything you log lives on your phone, protected by {deviceLockLabel}. It can back up with {backupLabel} so
            you won't lose it when you switch phones — and you're always in control.
          </Text>
        </View>

        {/* Reassurance card */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderWidth: 2,
            borderColor: colors.terra,
            borderRadius: 18,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            shadowColor: '#7C4A5A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={gradients.primaryCta}
              start={gradientPoints.diagonal.start}
              end={gradientPoints.diagonal.end}
              style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
            />
            <ShieldIcon />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: font('dmSans', '500'), fontSize: 16, color: colors.ink, marginBottom: 2 }}>
              You're in control
            </Text>
            <Text
              style={{
                fontFamily: font('dmSans', '300'),
                fontSize: 13,
                color: colors.stone,
                lineHeight: 17.5,
              }}
            >
              Prefer to keep it off the cloud? Turn backup off anytime in Settings.
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom area */}
      <View style={{ flexShrink: 0, paddingHorizontal: 28, paddingBottom: Math.max(insets.bottom + 8, 32) }}>
        <View style={{ marginBottom: 14 }}>
          <GradientButton label="Got it" onPress={handlePrimary} disabled={busy} />
        </View>
        <StepDots current={4} total={7} />
      </View>
    </View>
  )
}
