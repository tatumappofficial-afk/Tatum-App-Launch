import { useState } from 'react'
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Pressable, Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useLiveQuery } from '@tanstack/react-db'
import Svg, { Polyline } from 'react-native-svg'
import { useBlockBack } from '@/src/hooks/useBlockBack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, font } from '@/lib/theme'
import { GradientButton } from '@/lib/components/GradientButton'
import { DecorativeGlow } from '@/lib/screens/shared/DecorativeGlow'
import { StatusBarSpacer } from '@/lib/screens/shared/StatusBarSpacer'
import { userProfiles } from '@/src/db'
import { useSettings } from '@/src/hooks/useSettings'

const Checkmark: React.FC = () => (
  <Svg
    width={15}
    height={15}
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
)

export default function IdentityScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { hasOnboarded } = useSettings()
  useBlockBack()

  const params = useLocalSearchParams<{
    email?: string
    fullName?: string
    provider?: 'apple' | 'google'
    providerUserId?: string
  }>()
  const initialName = (params.fullName ?? '').trim()
  const initialEmail = params.email ?? ''
  const provider = (params.provider ?? null) as 'apple' | 'google' | null
  const providerUserId = params.providerUserId ?? null

  const [firstName, setFirstName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [attests18, setAttests18] = useState(false)
  const [busy, setBusy] = useState(false)

  const { data: profileRows } = useLiveQuery((q) =>
    q.from({ userProfiles }).select(({ userProfiles }) => ({ ...userProfiles })),
  )
  const profile = profileRows?.[0] ?? null

  const nameFilled = firstName.trim().length > 0

  async function handleContinue() {
    if (busy || !profile) return
    // Name is required; surface why the button isn't advancing.
    if (!nameFilled) {
      Alert.alert('Add your name', 'Please enter your name to continue.')
      return
    }
    // 18+ self-attestation is mandatory. The platform age signal already ran
    // at sign-in (auth.tsx) and blocks confirmed minors; this is the explicit
    // user attestation Tatum requires from everyone.
    if (!attests18) {
      Alert.alert('Confirm your age', 'You must confirm that you are 18 or older to continue.')
      return
    }
    setBusy(true)
    try {
      const trimmedEmail = email.trim()
      userProfiles.update(profile.id, (draft) => {
        draft.displayName = firstName.trim()
        draft.email = trimmedEmail.length > 0 ? trimmedEmail : null
        draft.authProvider = provider
        draft.providerUserId = providerUserId
      })
      // Existing user (v1.0 → v1.1 migration, or a sign-back-in after an
      // erase) skips the rest of onboarding — they already have settings,
      // partners, encounters etc., and showing them /protect/partner/tags
      // would be confusing. Fresh users continue through the full flow.
      if (hasOnboarded) {
        router.replace('/(tabs)')
      } else {
        router.push('/(onboarding)/protect')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.warmSand }}
    >
      <View style={{ flex: 1 }}>
        <DecorativeGlow position="top-right" size={240} opacity={0.1} />
        <StatusBarSpacer />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 28, paddingTop: 36 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: 28 }}>
            <Text
              style={{
                fontFamily: font('playfair', '700'),
                fontSize: 30,
                color: colors.ink,
                lineHeight: 36,
                marginBottom: 10,
              }}
            >
              A little about you
            </Text>
            <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: colors.stone, lineHeight: 20.8 }}>
              Your name and email help Tatum send you product updates and check in on how it's going. You can leave
              email blank.
            </Text>
          </View>

          <View style={{ marginBottom: 22 }}>
            <Text
              style={{
                fontFamily: font('dmSans', '500'),
                fontSize: 12,
                color: colors.stone,
                letterSpacing: 1.5,
                marginBottom: 8,
                textTransform: 'uppercase',
              }}
            >
              Name
            </Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Your name"
              placeholderTextColor="rgba(154,136,120,0.5)"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1.5,
                borderColor: 'rgba(160,100,80,0.18)',
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 17,
                fontFamily: font('dmSans', '400'),
                color: colors.ink,
              }}
            />
          </View>

          <View style={{ marginBottom: 22 }}>
            <Text
              style={{
                fontFamily: font('dmSans', '500'),
                fontSize: 12,
                color: colors.stone,
                letterSpacing: 1.5,
                marginBottom: 8,
                textTransform: 'uppercase',
              }}
            >
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="rgba(154,136,120,0.5)"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1.5,
                borderColor: 'rgba(160,100,80,0.18)',
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 17,
                fontFamily: font('dmSans', '400'),
                color: colors.ink,
              }}
            />
          </View>

          <Pressable
            onPress={() => setAttests18((prev) => !prev)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: attests18 }}
            accessibilityLabel="I confirm that I am 18 years of age or older"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              backgroundColor: colors.surface,
              borderWidth: 1.5,
              borderColor: attests18 ? colors.terra : 'rgba(160,100,80,0.18)',
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 7,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: attests18 ? colors.terra : 'transparent',
                borderWidth: attests18 ? 0 : 2,
                borderColor: 'rgba(160,100,80,0.35)',
              }}
            >
              {attests18 && <Checkmark />}
            </View>
            <Text
              style={{ flex: 1, fontFamily: font('dmSans', '400'), fontSize: 14, color: colors.ink, lineHeight: 19 }}
            >
              I confirm that I am 18 years of age or older.
            </Text>
          </Pressable>
        </ScrollView>

        <View style={{ flexShrink: 0, paddingHorizontal: 28, paddingBottom: Math.max(insets.bottom + 8, 32) }}>
          <GradientButton label="Continue" onPress={handleContinue} disabled={busy} />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
