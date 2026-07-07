import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import {
  canBypassRevenueCatPaywall,
  getRevenueCatAccessStatus,
  getRevenueCatDiagnosticMessage,
  isRevenueCatPaywallConfigured,
  purchaseRevenueCatPremium,
  restoreRevenueCatPurchases,
} from '@/src/services/revenueCat'
import { PremiumPaywall } from '@/lib/components/PremiumPaywall'

type GateState = 'checking' | 'active' | 'needs_purchase'

export function PremiumAccessGate({
  active,
  appUserID,
  hasLocalPremiumAccess,
  children,
}: {
  active: boolean
  appUserID?: string | null
  hasLocalPremiumAccess?: boolean
  children: React.ReactNode
}) {
  const [gateState, setGateState] = useState<GateState>('checking')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function checkAccess() {
      if (!active || hasLocalPremiumAccess || canBypassRevenueCatPaywall()) {
        setGateState('active')
        return
      }

      if (!isRevenueCatPaywallConfigured()) {
        setGateState('needs_purchase')
        return
      }

      setGateState('checking')
      const status = await getRevenueCatAccessStatus(appUserID)
      if (cancelled) return
      setGateState(status === 'active' ? 'active' : 'needs_purchase')
    }

    void checkAccess()
    return () => {
      cancelled = true
    }
  }, [active, appUserID, hasLocalPremiumAccess])

  async function handleUnlock() {
    if (busy) return
    setBusy(true)
    try {
      const result = await purchaseRevenueCatPremium(appUserID)
      if (result === 'unlocked') {
        setGateState('active')
      } else if (result === 'not_enabled') {
        Alert.alert('Purchase unavailable', 'Tatum Premium is not enabled for this build.')
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
      if (result === 'unlocked') {
        setGateState('active')
      } else if (result === 'blocked') {
        Alert.alert('No purchase found', 'We could not find Tatum Premium on this Apple or Google account.')
      } else if (result === 'not_enabled') {
        Alert.alert('Restore unavailable', 'Tatum Premium is not enabled for this build.')
      } else {
        Alert.alert('Restore unavailable', getRevenueCatDiagnosticMessage())
      }
    } finally {
      setBusy(false)
    }
  }

  if (gateState === 'active') return <>{children}</>
  if (gateState === 'checking') return null

  return <PremiumPaywall busy={busy} onUnlock={handleUnlock} onRestore={handleRestore} />
}
