import { Platform } from 'react-native'

const PAYWALL_ENABLED = process.env.EXPO_PUBLIC_REVENUECAT_PAYWALL_ENABLED === '1'
const IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY
const ANDROID_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY
const ENTITLEMENT_ID = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID ?? 'premium'

export type RevenueCatPaywallResult = 'not_enabled' | 'unlocked' | 'blocked' | 'error'

let configured = false
let configuredAppUserID: string | null = null

function getApiKey(): string | undefined {
  if (Platform.OS === 'ios') return IOS_API_KEY
  if (Platform.OS === 'android') return ANDROID_API_KEY
  return undefined
}

export function isRevenueCatPaywallConfigured(): boolean {
  return PAYWALL_ENABLED && Boolean(getApiKey()) && Boolean(ENTITLEMENT_ID)
}

export async function presentRevenueCatPaywallIfNeeded(appUserID?: string | null): Promise<RevenueCatPaywallResult> {
  const apiKey = getApiKey()
  if (!PAYWALL_ENABLED || !apiKey || !ENTITLEMENT_ID) {
    return 'not_enabled'
  }

  try {
    const normalizedAppUserID = appUserID?.trim() || null
    const [{ default: Purchases, LOG_LEVEL }, { default: RevenueCatUI }] = await Promise.all([
      import('react-native-purchases'),
      import('react-native-purchases-ui'),
    ])

    if (!configured) {
      await Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN)
      const alreadyConfigured = await Purchases.isConfigured()
      if (!alreadyConfigured) {
        Purchases.configure({ apiKey, appUserID: normalizedAppUserID })
      } else if (normalizedAppUserID) {
        await Purchases.logIn(normalizedAppUserID)
      }
      configured = true
      configuredAppUserID = normalizedAppUserID
    } else if (normalizedAppUserID && configuredAppUserID !== normalizedAppUserID) {
      await Purchases.logIn(normalizedAppUserID)
      configuredAppUserID = normalizedAppUserID
    }

    const result = String(
      await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: ENTITLEMENT_ID,
      }),
    )

    if (result === 'NOT_PRESENTED' || result === 'PURCHASED' || result === 'RESTORED') {
      return 'unlocked'
    }

    if (result === 'CANCELLED') {
      return 'blocked'
    }

    console.warn(`[revenueCat] paywall returned ${result}`)
    return 'error'
  } catch (err) {
    console.warn('[revenueCat] paywall failed:', err)
    return 'error'
  }
}
