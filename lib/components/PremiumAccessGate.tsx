import React, { useEffect, useState } from 'react'
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, font, gradientPoints } from '@/lib/theme'
import { GradientButton } from '@/lib/components/GradientButton'
import { StatusBarSpacer } from '@/lib/screens/shared/StatusBarSpacer'
import {
  getRevenueCatAccessStatus,
  getRevenueCatDiagnosticMessage,
  isRevenueCatPaywallConfigured,
  purchaseRevenueCatPremium,
  restoreRevenueCatPurchases,
} from '@/src/services/revenueCat'

type GateState = 'checking' | 'active' | 'needs_purchase'

export function PremiumAccessGate({
  active,
  appUserID,
  children,
}: {
  active: boolean
  appUserID?: string | null
  children: React.ReactNode
}) {
  const [gateState, setGateState] = useState<GateState>('checking')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function checkAccess() {
      if (!active || !isRevenueCatPaywallConfigured()) {
        setGateState('active')
        return
      }

      setGateState('checking')
      const status = await getRevenueCatAccessStatus(appUserID)
      if (cancelled) return
      setGateState(status === 'active' || status === 'not_enabled' ? 'active' : 'needs_purchase')
    }

    void checkAccess()
    return () => {
      cancelled = true
    }
  }, [active, appUserID])

  async function handleUnlock() {
    if (busy) return
    setBusy(true)
    try {
      const result = await purchaseRevenueCatPremium(appUserID)
      if (result === 'unlocked' || result === 'not_enabled') {
        setGateState('active')
      } else if (result === 'error') {
        Alert.alert('Purchase unavailable', getRevenueCatDiagnosticMessage())
      }
    } finally {
      setBusy(false)
    }
  }

  async function handleRestore() {
    if (busy) return
    setBusy(true)
    try {
      const result = await restoreRevenueCatPurchases(appUserID)
      if (result === 'unlocked' || result === 'not_enabled') {
        setGateState('active')
      } else if (result === 'blocked') {
        Alert.alert('No purchase found', 'We could not find Tatum Premium on this Apple or Google account.')
      } else {
        Alert.alert('Restore unavailable', getRevenueCatDiagnosticMessage())
      }
    } finally {
      setBusy(false)
    }
  }

  if (gateState === 'active') return <>{children}</>
  if (gateState === 'checking') return null

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
          onPress={handleUnlock}
          disabled={busy}
        />
        <Pressable
          onPress={handleRestore}
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
      </View>
    </View>
  )
}
