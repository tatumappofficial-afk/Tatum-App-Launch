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

  const params = useLocalSearchParams<{ email?: string; fullName?: string; provider?: 'apple' | 'google' }>()
  const initialName = (params.fullName ?? '').trim()
  const email = params.email ?? ''
  const provider = (params.provider ?? null) as 'apple' | 'google' | null
  const isRelayEmail = email.endsWith('@privaterelay.appleid.com')

  const [firstName, setFirstName] = useState(initialName)
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
      userProfiles.update(profile.id, (draft) => {
        draft.displayName = firstName.trim()
        draft.email = email || null
        draft.authProvider = provider
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
              What should we call you?
            </Text>
            <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: colors.stone, lineHeight: 20.8 }}>
              Just a first name — it stays on your device with the rest of your data.
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
              First name
            </Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Your first name"
              placeholderTextColor="rgba(154,136,120,0.5)"
              autoCapitalize="words"
              autoCorrect={false}
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

          {email ? (
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
              <View
                style={{
                  backgroundColor: 'rgba(160,100,80,0.05)',
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                }}
              >
                <Text style={{ fontSize: 15, color: colors.stone, fontFamily: font('dmSans', '400') }}>
                  {email}
                </Text>
              </View>
              {isRelayEmail && (
                <Text
                  style={{
                    fontFamily: font('dmSans', '300'),
                    fontSize: 12,
                    color: colors.stone,
                    lineHeight: 16,
                    marginTop: 8,
                  }}
                >
                  You chose to hide your address — Apple forwards anything we send to your real email.
                </Text>
              )}
            </View>
          ) : null}
        </ScrollView>

        <View style={{ flexShrink: 0, paddingHorizontal: 28, paddingBottom: Math.max(insets.bottom + 8, 32) }}>
          <GradientButton label="Continue" onPress={handleContinue} disabled={!canContinue} />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
