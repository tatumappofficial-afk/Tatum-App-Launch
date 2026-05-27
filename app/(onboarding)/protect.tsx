import { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Polyline, Path, Rect, Circle } from 'react-native-svg'
import { useRouter } from 'expo-router'
import { useBlockBack } from '@/src/hooks/useBlockBack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, font, gradientPoints, gradients } from '@/lib/theme'
import { GradientButton } from '@/lib/components/GradientButton'
import { StepDots } from '@/lib/components/StepDots'
import { DecorativeGlow } from '@/lib/screens/shared/DecorativeGlow'
import { StatusBarSpacer } from '@/lib/screens/shared/StatusBarSpacer'
import { authenticate, getBiometricCapabilities, type BiometricCapabilities } from '@/src/utils/biometrics'
import { useUpdateSettings } from '@/src/hooks/useSettings'

const LockIcon: React.FC = () => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={colors.white} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
    <Path d="M7 11V7a5 5 0 0110 0v4" />
    <Circle cx={12} cy={16} r={1} />
  </Svg>
)

const CheckCircle: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
)

export default function ProtectScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const updateSettings = useUpdateSettings()
  useBlockBack()

  const [caps, setCaps] = useState<BiometricCapabilities | null>(null)
  const [busy, setBusy] = useState(false)
  const [enableLock, setEnableLock] = useState(true)

  useEffect(() => {
    getBiometricCapabilities().then(setCaps).catch((err) => {
      console.error('Failed to load biometric capabilities:', err)
      setCaps({ hasHardware: false, isEnrolled: false, label: 'Use device passcode' })
    })
  }, [])

  async function handlePrimary() {
    if (busy) return
    setBusy(true)
    if (!enableLock) {
      // Skip path: stay busy through the nav so a second tap can't fire
      // while the next screen is animating in.
      updateSettings({ biometricLock: false })
      router.push('/(onboarding)/partner')
      return
    }
    let ok = false
    try {
      ok = await authenticate('Unlock Tatum')
    } catch (err) {
      console.error('Biometric auth failed:', err)
    }
    if (!ok) {
      // User cancelled or auth failed — re-enable so they can retry or
      // untoggle the lock and proceed without it.
      setBusy(false)
      return
    }
    // Success: keep busy=true through the update + router.push so the
    // protect screen, which is still mounted during the ~200ms nav animation,
    // doesn't accept a second tap and trigger the biometric prompt again.
    updateSettings({ biometricLock: true })
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
            Step 2 of 4
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
            Protect your space
          </Text>
          <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: colors.stone, lineHeight: 20.8 }}>
            Lock Tatum so your data stays private even if someone picks up your phone.
          </Text>
        </View>

        {/* Lock card — tap to toggle whether the user wants to enable biometrics. */}
        <Pressable
          onPress={() => setEnableLock(prev => !prev)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: enableLock }}
          accessibilityLabel="Enable biometric lock"
          style={({ pressed }) => ({
            backgroundColor: colors.surface,
            borderWidth: 2,
            borderColor: enableLock ? colors.terra : 'rgba(160,100,80,0.15)',
            borderRadius: 18,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            shadowColor: '#7C4A5A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: enableLock ? 0.12 : 0.04,
            shadowRadius: 12,
            elevation: enableLock ? 3 : 1,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              opacity: enableLock ? 1 : 0.5,
            }}
          >
            <LinearGradient
              colors={gradients.primaryCta}
              start={gradientPoints.diagonal.start}
              end={gradientPoints.diagonal.end}
              style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
            />
            <LockIcon />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: font('dmSans', '500'), fontSize: 16, color: colors.ink, marginBottom: 2 }}>
              {caps?.label ?? 'Loading…'}
            </Text>
            <Text
              style={{
                fontFamily: font('dmSans', '300'),
                fontSize: 13,
                color: colors.stone,
                lineHeight: 17.5,
              }}
            >
              You'll be prompted each time you open Tatum.
            </Text>
          </View>
          {enableLock && <CheckCircle />}
        </Pressable>
      </View>

      {/* Bottom area */}
      <View style={{ flexShrink: 0, paddingHorizontal: 28, paddingBottom: Math.max(insets.bottom + 8, 32) }}>
        <View style={{ marginBottom: 14 }}>
          <GradientButton
            label={enableLock ? 'Enable Lock' : 'Skip for now'}
            onPress={handlePrimary}
            disabled={!caps || busy}
          />
        </View>
        <StepDots current={1} />
      </View>
    </View>
  )
}
