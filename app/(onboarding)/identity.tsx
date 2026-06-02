import { useState } from 'react'
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useLiveQuery } from '@tanstack/react-db'
import { useBlockBack } from '@/src/hooks/useBlockBack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, font } from '@/lib/theme'
import { GradientButton } from '@/lib/components/GradientButton'
import { DecorativeGlow } from '@/lib/screens/shared/DecorativeGlow'
import { StatusBarSpacer } from '@/lib/screens/shared/StatusBarSpacer'
import { userProfiles } from '@/src/db'

export default function IdentityScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
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
  const [busy, setBusy] = useState(false)

  const { data: profileRows } = useLiveQuery((q) =>
    q.from({ userProfiles }).select(({ userProfiles }) => ({ ...userProfiles })),
  )
  const profile = profileRows?.[0] ?? null

  const canContinue = firstName.trim().length > 0 && !busy

  async function handleContinue() {
    if (!canContinue || !profile) return
    setBusy(true)
    try {
      const trimmedEmail = email.trim()
      userProfiles.update(profile.id, (draft) => {
        draft.displayName = firstName.trim()
        draft.email = trimmedEmail.length > 0 ? trimmedEmail : null
        draft.authProvider = provider
        draft.providerUserId = providerUserId
      })
      router.push('/(onboarding)/protect')
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
              Your name and email help Tatum send you product updates and check in on how it's going. You can leave email blank.
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
        </ScrollView>

        <View style={{ flexShrink: 0, paddingHorizontal: 28, paddingBottom: Math.max(insets.bottom + 8, 32) }}>
          <GradientButton label="Continue" onPress={handleContinue} disabled={!canContinue} />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
