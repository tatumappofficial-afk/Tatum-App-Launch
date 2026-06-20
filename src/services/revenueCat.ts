import { Platform } from 'react-native'

const PAYWALL_ENABLED = process.env.EXPO_PUBLIC_REVENUECAT_PAYWALL_ENABLED === '1'
const IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY
const ANDROID_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY
const ENTITLEMENT_ID = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID ?? 'premium'

export type RevenueCatPaywallResult = 'not_enabled' | 'unlocked' | 'blocked' | 'error'
export type RevenueCatAccessStatus = 'not_enabled' | 'active' | 'inactive' | 'error'

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

async function ensureRevenueCatConfigured(appUserID?: string | null) {
  const apiKey = getApiKey()
  if (!PAYWALL_ENABLED || !apiKey || !ENTITLEMENT_ID) return null

  const normalizedAppUserID = appUserID?.trim() || null
  const { default: Purchases, LOG_LEVEL } = await import('react-native-purchases')

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

  return Purchases
}

export async function getRevenueCatAccessStatus(appUserID?: string | null): Promise<RevenueCatAccessStatus> {
  if (!isRevenueCatPaywallConfigured()) return 'not_enabled'

  try {
    const Purchases = await ensureRevenueCatConfigured(appUserID)
    if (!Purchases) return 'not_enabled'
    const customerInfo = await Purchases.getCustomerInfo()
    const activeEntitlements = customerInfo.entitlements.active as Record<string, unknown>
    return activeEntitlements[ENTITLEMENT_ID] ? 'active' : 'inactive'
  } catch (err) {
    console.warn('[revenueCat] entitlement check failed:', err)
    return 'error'
  }
}

export async function presentRevenueCatPaywallIfNeeded(appUserID?: string | null): Promise<RevenueCatPaywallResult> {
  if (!isRevenueCatPaywallConfigured()) return 'not_enabled'

  try {
    const Purchases = await ensureRevenueCatConfigured(appUserID)
    if (!Purchases) return 'not_enabled'
    const { default: RevenueCatUI } = await import('react-native-purchases-ui')

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
