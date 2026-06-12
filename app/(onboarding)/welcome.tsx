import { Image, View, Text, ScrollView } from 'react-native'
import { Redirect, useRouter } from 'expo-router'
import { useLiveQuery } from '@tanstack/react-db'
import { useBlockBack } from '@/src/hooks/useBlockBack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, font, fontFamily } from '@/lib/theme'
import { GradientButton } from '@/lib/components/GradientButton'
import { StepDots } from '@/lib/components/StepDots'
import { DecorativeGlow } from '@/lib/screens/shared/DecorativeGlow'
import { StatusBarSpacer } from '@/lib/screens/shared/StatusBarSpacer'
import { useSettings } from '@/src/hooks/useSettings'
import { userProfiles } from '@/src/db'

const PromiseItem: React.FC<{ emoji: string; title: string; desc: string }> = ({ emoji, title, desc }) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
    <Text style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{emoji}</Text>
    <View style={{ flex: 1 }}>
      <Text style={{ fontFamily: font('dmSans', '500'), fontSize: 14, color: colors.ink, marginBottom: 2 }}>
        {title}
      </Text>
      <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: colors.stone, lineHeight: 18.6 }}>
        {desc}
      </Text>
    </View>
  </View>
)

export default function WelcomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { hasOnboarded } = useSettings()
  const { data: profiles = [] } = useLiveQuery((q) =>
    q.from({ userProfiles }).select(({ userProfiles }) => ({ ...userProfiles })),
  )
  useBlockBack()

  // v1.0 user updating to v1.1: they already completed onboarding but never
  // had auth. Skip the welcome introduction and drop them on /auth so they
  // sign in once and return to their existing data.
  const needsAuthMigration = hasOnboarded && profiles.length > 0 && !profiles.some((p) => p.authProvider !== null)
  if (needsAuthMigration) {
    return <Redirect href="/(onboarding)/auth" />
  }

  return (
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
      <StatusBarSpacer />

      <ScrollView
        style={{ flex: 1, position: 'relative', zIndex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 28,
          paddingTop: 24,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* App logo — iOS-style rounded-square icon */}
        <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'center' }}>
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
            }}
          >
            <Image source={require('@/assets/icon.png')} style={{ width: 96, height: 96 }} />
          </View>
        </View>

        {/* Letter-style headline */}
        <View style={{ alignItems: 'center', marginBottom: 18 }}>
          <Text
            style={{
              fontFamily: fontFamily.playfair,
              fontSize: 14,
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
              fontSize: 14,
              color: '#7A5A50',
              lineHeight: 22.1,
              textAlign: 'center',
            }}
          >
            Everything you log in Tatum lives on your device and nowhere else. That way your data stays yours.
          </Text>
        </View>

        <View
          style={{
            width: 40,
            height: 1,
            backgroundColor: 'rgba(192,120,88,0.3)',
            alignSelf: 'center',
            marginVertical: 16,
          }}
        />

        {/* Promise list */}
        <View style={{ flexDirection: 'column', gap: 14, marginBottom: 16 }}>
          <PromiseItem
            emoji="🔒"
            title="Yours, not ours"
            desc="What you log stays in your hands. Tatum's servers never see your sessions, notes, or tags. Export a copy whenever you want."
          />
          <PromiseItem
            emoji="🗑️"
            title="Delete any time"
            desc="Delete all your data from the app at any time from the settings page."
          />
          <PromiseItem
            emoji="📱"
            title="Switch phones safely"
            desc="If you choose to turn it on, your data can move with you via iCloud or Google backup when you get a new device."
          />
        </View>

        {/* Signature */}
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 14, color: colors.stone, marginBottom: 3 }}>
            with love,
          </Text>
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
      </ScrollView>

      <View style={{ flexShrink: 0, paddingHorizontal: 28, paddingBottom: Math.max(insets.bottom + 8, 32) }}>
        <View style={{ marginBottom: 14 }}>
          <GradientButton label="I Understand, Let's Begin" onPress={() => router.push('/(onboarding)/auth')} />
        </View>
        <StepDots current={0} />
      </View>
    </View>
  )
}
