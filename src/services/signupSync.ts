import { Platform } from 'react-native'
import type { AgeSignalVerdict } from './ageSignal'

const WEBHOOK_URL = process.env.EXPO_PUBLIC_SIGNUP_WEBHOOK_URL
const TOKEN = process.env.EXPO_PUBLIC_SIGNUP_TOKEN

export interface SignupRecord {
  name: string
  email: string
  attested18: boolean
  ageVerdict: AgeSignalVerdict
  provider?: string | null
  providerUserId?: string | null
}

/**
 * Records a completed signup (name, email, 18+ attestation, platform age
 * verdict) to the Cloud Function backing Alanna's Firestore. Fire-and-forget:
 * a missing config or a failed request never blocks onboarding — the user's
 * own data already lives on-device; this is a one-way notification.
 */
export async function recordSignup(record: SignupRecord): Promise<void> {
  if (!WEBHOOK_URL || !TOKEN) return // not configured (e.g. local dev) — no-op
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: TOKEN,
        name: record.name,
        email: record.email,
        attested18: record.attested18,
        ageVerdict: record.ageVerdict,
        provider: record.provider,
        providerUserId: record.providerUserId,
        platform: Platform.OS,
      }),
    })
    if (!response.ok) {
      console.warn(`[signupSync] failed with ${response.status}: ${response.statusText}`)
    }
  } catch (err) {
    console.warn('[signupSync] failed (non-blocking):', err)
  }
}
