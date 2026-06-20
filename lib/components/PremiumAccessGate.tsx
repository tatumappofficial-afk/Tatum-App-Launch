import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, font, gradientPoints } from '@/lib/theme'
import { GradientButton } from '@/lib/components/GradientButton'
import { StatusBarSpacer } from '@/lib/screens/shared/StatusBarSpacer'
import {
  getRevenueCatAccessStatus,
  isRevenueCatPaywallConfigured,
  presentRevenueCatPaywallIfNeeded,
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
      const result = await presentRevenueCatPaywallIfNeeded(appUserID)
      if (result === 'unlocked' || result === 'not_enabled') {
        setGateState('active')
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
            Unlock Tatum for life.
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
            Tatum Lifetime is a one-time $24.99 purchase. No subscription, no recurring charge.
          </Text>
        </View>
        <GradientButton
          label={busy ? 'Opening...' : 'Unlock Lifetime Access'}
          height={56}
          fontSize={13}
          onPress={handleUnlock}
          disabled={busy}
        />
        <Text
          style={{
            fontFamily: font('dmSans', '300'),
            fontSize: 13,
            lineHeight: 18,
            color: colors.muted,
            textAlign: 'center',
            marginTop: 14,
          }}
        >
          Already purchased? Use Restore Purchases on the next screen.
        </Text>
      </View>
    </View>
  )
}
