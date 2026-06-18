import { Platform } from 'react-native'
import type { AgeSignalVerdict } from './ageSignal'

const WEBHOOK_URL = process.env.EXPO_PUBLIC_SIGNUP_WEBHOOK_URL
// EXPO_PUBLIC values are embedded in the app bundle. This is an abuse hint for
// the webhook, not a secret; the server must not trust it for privileged access.
const TOKEN = process.env.EXPO_PUBLIC_SIGNUP_TOKEN

export interface SignupRecord {
  name: string
  email: string
  attested18: boolean
  ageVerdict: AgeSignalVerdict
}

/**
 * Records a completed signup (name, email, 18+ attestation, platform age
 * verdict) to the Cloud Function backing Alanna's Firestore. Fire-and-forget:
 * a missing config or a failed request never blocks onboarding. Logged activity
 * stays on-device; this sends only signup/account metadata.
 */
export async function recordSignup(record: SignupRecord): Promise<void> {
  if (!WEBHOOK_URL || !TOKEN) return // not configured (e.g. local dev) — no-op
  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: TOKEN,
        name: record.name,
        email: record.email,
        attested18: record.attested18,
        ageVerdict: record.ageVerdict,
        platform: Platform.OS,
      }),
    })
  } catch (err) {
    console.warn('[signupSync] failed (non-blocking):', err)
  }
}
