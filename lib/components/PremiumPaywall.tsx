import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, font, gradientPoints } from '@/lib/theme'
import { GradientButton } from '@/lib/components/GradientButton'
import { PaywallLegalLinks } from '@/lib/components/PaywallLegalLinks'
import { StatusBarSpacer } from '@/lib/screens/shared/StatusBarSpacer'

export function PremiumPaywall({
  busy,
  onUnlock,
  onRestore,
  onClose,
}: {
  busy: boolean
  onUnlock: () => void
  onRestore: () => void
  onClose?: () => void
}) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.warmSand }}>
      <LinearGradient
        colors={['#F5EFE8', '#EDE3D8', '#E0D0C0']}
        locations={[0, 0.62, 1]}
        start={gradientPoints.almostVertical.start}
        end={gradientPoints.almostVertical.end}
        style={StyleSheet.absoluteFill}
      />
      <StatusBarSpacer />
      {onClose && (
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close premium purchase"
          hitSlop={12}
          style={({ pressed }) => ({
            position: 'absolute',
            top: 58,
            right: 18,
            zIndex: 2,
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(251,247,242,0.72)',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Ionicons name="close-outline" size={26} color={colors.stone} />
        </Pressable>
      )}
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Image source={require('@/assets/tatum-logo.png')} style={{ width: 132, height: 132, marginBottom: 24 }} />
          <Text
            style={{
              fontFamily: font('playfair', '700'),
              fontSize: 34,
              lineHeight: 39,
              color: colors.ink,
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            Tatum Premium
          </Text>
          <Text
            style={{
              fontFamily: font('dmSans', '300'),
              fontSize: 15,
              lineHeight: 22,
              color: colors.stone,
              textAlign: 'center',
            }}
          >
            One-time purchase of $24.99. No subscription or recurring charge.
          </Text>
        </View>
        <GradientButton
          label={busy ? 'Opening...' : 'Unlock Tatum Premium'}
          height={56}
          fontSize={13}
          onPress={onUnlock}
          disabled={busy}
        />
        <Pressable
          onPress={onRestore}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel="Restore purchases"
        >
          <Text
            style={{
              fontFamily: font('dmSans', '300'),
              fontSize: 13,
              lineHeight: 18,
              color: colors.muted,
              textAlign: 'center',
              marginTop: 14,
              textDecorationLine: 'underline',
            }}
          >
            Already purchased? Restore purchases.
          </Text>
        </Pressable>
        <Text
          style={{
            fontFamily: font('dmSans', '300'),
            fontSize: 12,
            lineHeight: 16,
            color: colors.muted,
            textAlign: 'center',
            marginTop: 12,
          }}
        >
          Access continues while Tatum is available and supported.
        </Text>
        <PaywallLegalLinks />
      </View>
    </View>
  )
}
