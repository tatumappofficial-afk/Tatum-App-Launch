import React from 'react'
import { Linking, Pressable, Text, View } from 'react-native'
import { colors, font } from '@/lib/theme'

const PRIVACY_POLICY_URL = 'https://www.tatumapp.com/privacy.html'
const TERMS_URL = 'https://www.tatumapp.com/terms.html'

function LegalLink({ label, url }: { label: string; url: string }) {
  return (
    <Pressable onPress={() => Linking.openURL(url).catch(() => {})} accessibilityRole="link" accessibilityLabel={label} hitSlop={8}>
      <Text
        style={{
          fontFamily: font('dmSans', '300'),
          fontSize: 12,
          lineHeight: 16,
          color: colors.muted,
          textDecorationLine: 'underline',
        }}
      >
        {label}
      </Text>
    </Pressable>
  )
}

/**
 * Privacy Policy / Terms links shown on both paywall surfaces (onboarding
 * /ready and the PremiumAccessGate). The hard paywall gates the whole app,
 * so these must be reachable pre-purchase — App Review looks for them on
 * the paywall when they aren't discoverable anywhere else before buying.
 */
export function PaywallLegalLinks({ marginTop = 14 }: { marginTop?: number }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop }}>
      <LegalLink label="Privacy Policy" url={PRIVACY_POLICY_URL} />
      <Text style={{ fontFamily: font('dmSans', '300'), fontSize: 12, color: colors.muted }}>·</Text>
      <LegalLink label="Terms & Conditions" url={TERMS_URL} />
    </View>
  )
}
