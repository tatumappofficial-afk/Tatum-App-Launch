import { Platform } from 'react-native'

const PAYWALL_ENABLED = process.env.EXPO_PUBLIC_REVENUECAT_PAYWALL_ENABLED === '1'
const IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY
const ANDROID_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY
const ENTITLEMENT_ID = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID ?? 'premium'
const DEV_SEED_BYPASS = __DEV__ && process.env.EXPO_PUBLIC_DEV_SEED === '1'
const EXPLICIT_PAYWALL_BYPASS = process.env.EXPO_PUBLIC_REVENUECAT_PAYWALL_BYPASS === '1'

export type RevenueCatPaywallResult = 'not_enabled' | 'unlocked' | 'blocked' | 'error'
export type RevenueCatAccessStatus = 'not_enabled' | 'active' | 'inactive' | 'error'

let configured = false
let configuredAppUserID: string | null = null

type RevenueCatDiagnosticKind = 'access' | 'no_package' | 'purchase' | 'restore' | 'already_purchased'

type RevenueCatDiagnostic = {
  kind: RevenueCatDiagnosticKind
  code?: string
  readableCode?: string
  message?: string
  underlyingMessage?: string
}

let lastDiagnostic: RevenueCatDiagnostic | null = null

function getApiKey(): string | undefined {
  if (Platform.OS === 'ios') return IOS_API_KEY
  if (Platform.OS === 'android') return ANDROID_API_KEY
  return undefined
}

export function isRevenueCatPaywallConfigured(): boolean {
  if (canBypassRevenueCatPaywall()) return false
  return PAYWALL_ENABLED && Boolean(getApiKey()) && Boolean(ENTITLEMENT_ID)
}

export function canBypassRevenueCatPaywall(): boolean {
  return DEV_SEED_BYPASS || EXPLICIT_PAYWALL_BYPASS
}

function hasActiveEntitlement(customerInfo: { entitlements?: { active?: Record<string, unknown> } }): boolean {
  return Boolean(customerInfo.entitlements?.active?.[ENTITLEMENT_ID])
}

function isUserCancelled(err: unknown): boolean {
  return Boolean(
    err && typeof err === 'object' && 'userCancelled' in err && (err as { userCancelled?: boolean }).userCancelled,
  )
}

function getRevenueCatErrorDetails(err: unknown) {
  if (!err || typeof err !== 'object') return null

  return err as {
    code?: string | number
    readableErrorCode?: string
    message?: string
    underlyingErrorMessage?: string
    userInfo?: { readableErrorCode?: string }
  }
}

function isProductAlreadyPurchased(err: unknown): boolean {
  const details = getRevenueCatErrorDetails(err)
  if (!details) return false

  const readableCode = details.userInfo?.readableErrorCode ?? details.readableErrorCode
  return String(details.code) === '6' || readableCode === 'PRODUCT_ALREADY_PURCHASED_ERROR'
}

function captureRevenueCatDiagnostic(kind: RevenueCatDiagnosticKind, err?: unknown) {
  const details = getRevenueCatErrorDetails(err)
  if (details) {
    lastDiagnostic = {
      kind,
      code: details.code === undefined ? undefined : String(details.code),
      readableCode: details.userInfo?.readableErrorCode ?? details.readableErrorCode,
      message: details.message,
      underlyingMessage: details.underlyingErrorMessage,
    }
    return
  }

  lastDiagnostic = { kind }
}

function clearRevenueCatDiagnostic() {
  lastDiagnostic = null
}

export function getRevenueCatDiagnosticMessage(): string {
  if (!lastDiagnostic) return 'Please try again in a moment.'

  const readableCode = lastDiagnostic.readableCode ?? lastDiagnostic.code
  const suffix = readableCode ? ` (${readableCode})` : ''
  const detail = lastDiagnostic.underlyingMessage ?? lastDiagnostic.message
  const detailSentence = detail ? ` ${detail}` : ''

  if (lastDiagnostic.kind === 'no_package') {
    return `Tatum Premium is not available from the App Store for this build yet. Check App Store Connect and RevenueCat product setup.${suffix}`
  }

  if (lastDiagnostic.code === '5' || lastDiagnostic.readableCode === 'PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR') {
    return `The App Store says Tatum Premium is not available for purchase in this TestFlight build yet.${detailSentence}${suffix}`
  }

  if (lastDiagnostic.code === '23' || lastDiagnostic.readableCode === 'CONFIGURATION_ERROR') {
    return `RevenueCat found a purchase configuration issue for this build.${detailSentence}${suffix}`
  }

  if (
    lastDiagnostic.kind === 'already_purchased' ||
    lastDiagnostic.code === '6' ||
    lastDiagnostic.readableCode === 'PRODUCT_ALREADY_PURCHASED_ERROR'
  ) {
    return `Google Play says this Google account already owns Tatum Premium, but we could not attach the purchase to this Tatum account yet. Check that the Play Store app is using the intended tester account, then tap Restore purchases.${suffix}`
  }

  if (lastDiagnostic.code === '10' || lastDiagnostic.code === '35') {
    return `The App Store purchase service could not be reached. Please check connection and try again.${suffix}`
  }

  if (lastDiagnostic.kind === 'restore') return `Restore is unavailable right now. Please try again in a moment.${suffix}`
  return `Please try again in a moment.${suffix}`
}

async function ensureRevenueCatConfigured(appUserID?: string | null) {
  const apiKey = getApiKey()
  if (canBypassRevenueCatPaywall() || !PAYWALL_ENABLED || !apiKey || !ENTITLEMENT_ID) return null

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
    clearRevenueCatDiagnostic()
    return hasActiveEntitlement(customerInfo) ? 'active' : 'inactive'
  } catch (err) {
    captureRevenueCatDiagnostic('access', err)
    console.warn('[revenueCat] entitlement check failed:', err)
    return 'error'
  }
}

export async function purchaseRevenueCatPremium(appUserID?: string | null): Promise<RevenueCatPaywallResult> {
  if (!isRevenueCatPaywallConfigured()) return 'not_enabled'

  try {
    const Purchases = await ensureRevenueCatConfigured(appUserID)
    if (!Purchases) return 'not_enabled'

    const currentStatus = await getRevenueCatAccessStatus(appUserID)
    if (currentStatus === 'active') return 'unlocked'
    if (currentStatus === 'not_enabled') return 'not_enabled'

    const offerings = await Purchases.getOfferings()
    const packageToPurchase = offerings.current?.availablePackages?.[0]
    if (!packageToPurchase) {
      captureRevenueCatDiagnostic('no_package')
      console.warn('[revenueCat] no available package on current offering')
      return 'error'
    }

    const result = await Purchases.purchasePackage(packageToPurchase)
    clearRevenueCatDiagnostic()
    return hasActiveEntitlement(result.customerInfo) ? 'unlocked' : 'blocked'
  } catch (err) {
    if (isUserCancelled(err)) return 'blocked'
    if (isProductAlreadyPurchased(err)) {
      const restoreResult = await restoreRevenueCatPurchases(appUserID)
      if (restoreResult === 'unlocked') return 'unlocked'
      captureRevenueCatDiagnostic('already_purchased', err)
      return 'error'
    }
    captureRevenueCatDiagnostic('purchase', err)
    console.warn('[revenueCat] purchase failed:', err)
    return 'error'
  }
}

export async function restoreRevenueCatPurchases(appUserID?: string | null): Promise<RevenueCatPaywallResult> {
  if (!isRevenueCatPaywallConfigured()) return 'not_enabled'

  try {
    const Purchases = await ensureRevenueCatConfigured(appUserID)
    if (!Purchases) return 'not_enabled'
    const customerInfo = await Purchases.restorePurchases()
    clearRevenueCatDiagnostic()
    return hasActiveEntitlement(customerInfo) ? 'unlocked' : 'blocked'
  } catch (err) {
    captureRevenueCatDiagnostic('restore', err)
    console.warn('[revenueCat] restore failed:', err)
    return 'error'
  }
}
