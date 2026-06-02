import { useEffect } from 'react'
import { View, Text, Image, Platform, Alert, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Svg, { Path } from 'react-native-svg'
import * as AppleAuthentication from 'expo-apple-authentication'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import * as Haptics from 'expo-haptics'
import { useLiveQuery } from '@tanstack/react-db'
import { useBlockBack } from '@/src/hooks/useBlockBack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, font } from '@/lib/theme'
import { DecorativeGlow } from '@/lib/screens/shared/DecorativeGlow'
import { StatusBarSpacer } from '@/lib/screens/shared/StatusBarSpacer'
import { userProfiles } from '@/src/db'

const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID

const GoogleLogo: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 48 48">
    <Path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <Path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <Path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <Path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </Svg>
)

export default function AuthScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  useBlockBack()

  const { data: profiles = [] } = useLiveQuery((q) =>
    q.from({ userProfiles }).select(({ userProfiles }) => ({ ...userProfiles })),
  )

  useEffect(() => {
    if (GOOGLE_WEB_CLIENT_ID) {
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        scopes: ['profile', 'email'],
      })
    }
  }, [])

  const handleSignedIn = (params: {
    email: string
    fullName: string | null
    provider: 'apple' | 'google'
  }) => {
    // Migration path: an existing profile with a displayName means this is a
    // v1.0 user updating to v1.1 — their data is intact, just stamp the auth
    // fields and drop into the app. Skip /identity (no need to re-ask for the
    // name they already entered).
    const existing = profiles.find((p) => p.displayName && p.displayName.trim().length > 0)
    if (existing) {
      userProfiles.update(existing.id, (draft) => {
        draft.email = params.email || null
        draft.authProvider = params.provider
      })
      router.replace('/(tabs)')
      return
    }

    router.push({
      pathname: '/(onboarding)/identity',
      params: {
        email: params.email,
        fullName: params.fullName ?? '',
        provider: params.provider,
      },
    })
  }

  async function handleApple() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })
      // Apple returns fullName/email only on the first sign-in for a given
      // Apple ID + app pair. On reinstall after a previous sign-in, both can
      // be null — we accept null name and let the user fill it on /identity.
      const fullName = credential.fullName?.givenName ?? null
      const email = credential.email ?? ''
      handleSignedIn({ email, fullName, provider: 'apple' })
    } catch (err: unknown) {
      if ((err as { code?: string }).code === 'ERR_REQUEST_CANCELED') return
      console.error('Apple sign-in failed:', err)
      Alert.alert('Sign in failed', 'Apple Sign In could not complete. Please try again.')
    }
  }

  async function handleGoogle() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (!GOOGLE_WEB_CLIENT_ID) {
      Alert.alert(
        'Setup incomplete',
        'Google client IDs are not configured yet. See docs/ship-plan.md Phase 2B.',
      )
      return
    }
    try {
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      }
      const response = await GoogleSignin.signIn()
      if (response.type === 'cancelled') return
      const user = response.data.user
      if (!user?.email) throw new Error('Google sign-in returned no email')
      handleSignedIn({
        email: user.email,
        fullName: user.givenName ?? null,
        provider: 'google',
      })
    } catch (err: unknown) {
      console.error('Google sign-in failed:', err)
      Alert.alert('Sign in failed', 'Google Sign In could not complete. Please try again.')
    }
  }

  return (
    <View style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: colors.warmSand }}>
      <DecorativeGlow position="center" size={320} opacity={0.13} />
      <StatusBarSpacer />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 }}>
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 22,
            overflow: 'hidden',
            shadowColor: '#7C4A5A',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.28,
            shadowRadius: 28,
            elevation: 10,
            marginBottom: 22,
          }}
        >
          <Image source={require('@/assets/icon.png')} style={{ width: 96, height: 96 }} />
        </View>

        <Text
          style={{
            fontFamily: font('playfair', '700'),
            fontSize: 44,
            color: colors.terra,
            letterSpacing: 7,
            marginBottom: 12,
          }}
        >
          TATUM
        </Text>

        <Text
          style={{
            fontFamily: font('dmSans', '400'),
            fontSize: 11,
            color: colors.stone,
            letterSpacing: 2,
            textAlign: 'center',
            textTransform: 'uppercase',
            lineHeight: 16,
          }}
        >
          Feel seen, validated,{'\n'}and completely empowered
        </Text>
      </View>

      <View style={{ flexShrink: 0, paddingHorizontal: 28, paddingBottom: Math.max(insets.bottom + 8, 32) }}>
        <View style={{ gap: 12, marginBottom: 20 }}>
          {Platform.OS === 'ios' && (
            <Pressable
              onPress={handleApple}
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
              style={({ pressed }) => ({
                height: 52,
                borderRadius: 9999,
                backgroundColor: '#000',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons name="logo-apple" size={20} color="#fff" />
              <Text style={{ fontFamily: font('dmSans', '500'), fontSize: 16, color: '#fff' }}>
                Continue with Apple
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={handleGoogle}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            style={({ pressed }) => ({
              height: 52,
              borderRadius: 9999,
              backgroundColor: '#fff',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              shadowColor: '#7C4A5A',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 2,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <GoogleLogo />
            <Text style={{ fontFamily: font('dmSans', '500'), fontSize: 16, color: colors.ink }}>
              Continue with Google
            </Text>
          </Pressable>
        </View>

        <Text
          style={{
            fontFamily: font('dmSans', '300'),
            fontSize: 12,
            color: colors.stone,
            textAlign: 'center',
          }}
        >
          Your data never leaves your device.
        </Text>
      </View>
    </View>
  )
}
