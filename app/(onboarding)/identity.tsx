import { useState } from 'react'
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, Pressable } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useLiveQuery } from '@tanstack/react-db'
import Svg, { Polyline } from 'react-native-svg'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useBlockBack } from '@/src/hooks/useBlockBack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, font } from '@/lib/theme'
import { GradientButton } from '@/lib/components/GradientButton'
import { DecorativeGlow } from '@/lib/screens/shared/DecorativeGlow'
import { StatusBarSpacer } from '@/lib/screens/shared/StatusBarSpacer'
import { userProfiles } from '@/src/db'
import { useSettings } from '@/src/hooks/useSettings'
import { recordSignup } from '@/src/services/signupSync'
import type { AgeSignalVerdict } from '@/src/services/ageSignal'
import { deriveInitials } from '@/src/utils/initials'

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
    ageVerdict?: string
    attested18?: string
  }>()
  const initialName = (params.fullName ?? '').trim()
  const initialEmail = params.email ?? ''
  const provider = (params.provider ?? null) as 'apple' | 'google' | null
  const providerUserId = params.providerUserId ?? null
  const ageVerdict = (params.ageVerdict ?? 'unavailable') as AgeSignalVerdict

  const [firstName, setFirstName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [attests18, setAttests18] = useState(params.attested18 === 'true')
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
    if (!attests18) {
      Alert.alert('Confirm your age', 'Please confirm that you are 18 or older to continue.')
      return
    }
    setBusy(true)
    try {
      const trimmedName = firstName.trim()
      const trimmedEmail = email.trim()
      const derivedAvatarValue = deriveInitials(trimmedName) || 'A'
      userProfiles.update(profile.id, (draft) => {
        const hadGeneratedAvatar = !draft.avatarValue || (draft.avatarValue === 'A' && !draft.displayName)
        draft.displayName = trimmedName
        draft.email = trimmedEmail.length > 0 ? trimmedEmail : null
        draft.authProvider = provider
        draft.providerUserId = providerUserId
        if (!hasOnboarded || hadGeneratedAvatar) {
          draft.avatarValue = derivedAvatarValue
        }
      })
      // Log the signup (name + email + 18+ attestation + platform age verdict)
      // to Alanna's Firestore. Fire-and-forget — never blocks onboarding.
      void recordSignup({
        name: trimmedName,
        email: trimmedEmail,
        attested18: true,
        ageVerdict,
        provider,
        providerUserId,
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

  async function handleExistingAccount() {
    if (provider === 'google') await GoogleSignin.signOut().catch(() => {})
    router.replace('/(onboarding)/auth')
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
              Create your account
            </Text>
            <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: colors.stone, lineHeight: 20.8 }}>
              Your account uses the Apple or Google sign-in you just chose. Add your name, confirm you're 18 or older,
              and choose the email Tatum can use for welcome notes and product updates.
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
              paddingHorizontal: 4,
              marginBottom: 22,
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
                borderColor: 'rgba(160,100,80,0.4)',
              }}
            >
              {attests18 && <Checkmark />}
            </View>
            <Text
              style={{ flex: 1, fontFamily: font('dmSans', '400'), fontSize: 13, color: colors.stone, lineHeight: 18 }}
            >
              I confirm that I am 18 years of age or older.
            </Text>
          </Pressable>
          <Text
            style={{
              fontFamily: font('dmSans', '300'),
              fontSize: 12,
              color: '#C4B0A0',
              fontStyle: 'italic',
              textAlign: 'center',
              lineHeight: 16,
              paddingHorizontal: 10,
            }}
          >
            You can update your profile details later.
          </Text>
        </ScrollView>

        <View style={{ flexShrink: 0, paddingHorizontal: 28, paddingBottom: Math.max(insets.bottom + 8, 32), gap: 14 }}>
          <GradientButton label="Continue" onPress={handleContinue} disabled={busy} />
          <Pressable
            onPress={handleExistingAccount}
            accessibilityRole="button"
            accessibilityLabel="Sign in with existing account"
            style={({ pressed }) => ({ alignItems: 'center', opacity: pressed ? 0.6 : 1 })}
          >
            <Text style={{ fontFamily: font('dmSans', '500'), fontSize: 14, color: colors.terra }}>
              Sign in with existing account?
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
