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
import {
  authenticateWithResult,
  describeAuthFailure,
  getBiometricCapabilities,
  type BiometricCapabilities,
} from '@/src/utils/biometrics'
import { updateOnboardingSession } from '@/src/services/onboardingSession'

const LockIcon: React.FC = () => (
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
    <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
    <Path d="M7 11V7a5 5 0 0110 0v4" />
    <Circle cx={12} cy={16} r={1} />
  </Svg>
)

const CheckCircle: React.FC = () => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.terra}
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
)

export default function ProtectScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  useBlockBack()

  const [caps, setCaps] = useState<BiometricCapabilities | null>(null)
  const [busy, setBusy] = useState(false)
  const [enableLock, setEnableLock] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // A phone with no screen lock at all can never satisfy the prompt, so the
  // card is switched off and made inert rather than offering a button that
  // would fail every time it was pressed.
  const lockUnavailable = caps !== null && !caps.canLock

  useEffect(() => {
    getBiometricCapabilities()
      .then((next) => {
        setCaps(next)
        if (!next.canLock) setEnableLock(false)
      })
      .catch((err) => {
        console.error('Failed to load biometric capabilities:', err)
        // Assume the lock is usable on error: authenticate() surfaces a real
        // reason if it isn't, which beats hiding the option over a probe that
        // happened to fail.
        setCaps({ hasHardware: false, isEnrolled: false, canLock: true, label: 'Use device passcode' })
      })
  }, [])

  function skip() {
    updateOnboardingSession({ biometricLock: false })
    router.push('/(onboarding)/safe')
  }

  // Stays busy through router.push so a second tap can't re-trigger the
  // biometric prompt while the next screen is animating in.
  async function handlePrimary() {
    if (busy) return
    setBusy(true)
    setError(null)
    if (!enableLock) {
      skip()
      return
    }
    let outcome
    try {
      outcome = await authenticateWithResult('Unlock Tatum')
    } catch (err) {
      console.error('Biometric auth failed:', err)
      outcome = { success: false, error: undefined } as const
    }
    if (!outcome.success) {
      // Never fail silently — this screen blocks the hardware back button, so an
      // unexplained no-op reads as the app having frozen.
      setError(describeAuthFailure(outcome.error))
      setBusy(false)
      return
    }
    updateOnboardingSession({ biometricLock: true })
    router.push('/(onboarding)/safe')
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
            Step 4 of 7
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
          onPress={() => {
            if (lockUnavailable) return
            setError(null)
            setEnableLock((prev) => !prev)
          }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: enableLock, disabled: lockUnavailable }}
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
              {lockUnavailable
                ? 'Add a passcode or fingerprint in your phone settings to use this.'
                : "You'll be prompted each time you open Tatum."}
            </Text>
          </View>
          {enableLock && <CheckCircle />}
        </Pressable>
        {error && (
          <Text
            style={{
              fontFamily: font('dmSans', '300'),
              fontSize: 13,
              color: colors.terra,
              textAlign: 'center',
              lineHeight: 18,
              marginTop: 14,
            }}
          >
            {error}
          </Text>
        )}
        <Text
          style={{
            fontFamily: font('dmSans', '300'),
            fontSize: 12,
            color: '#C4B0A0',
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: 16,
            marginTop: 14,
          }}
        >
          You can change this later in Settings.
        </Text>
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
        {/* Standing escape hatch. The card doubles as a toggle, but nothing on
            screen advertises that, so without this a failed prompt leaves the
            user with no visible way forward and no hardware back button. */}
        {enableLock && (
          <Pressable
            onPress={() => {
              if (busy) return
              setBusy(true)
              skip()
            }}
            accessibilityRole="button"
            style={{ alignItems: 'center', paddingVertical: 8, marginBottom: 8 }}
          >
            <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: colors.muted }}>
              Skip for now
            </Text>
          </Pressable>
        )}
        <StepDots current={3} total={7} />
      </View>
    </View>
  )
}
