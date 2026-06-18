/**
 * App Store / Play Store reviewer access (TAT-16).
 *
 * Tatum is OAuth-only (Sign in with Apple / Google) with no auth backend. A
 * store reviewer can't complete a real Apple/Google sign-in with a provided
 * account, so without a credentialed way in they can't open the app to review
 * it — which gets the submission rejected. This module is that way in.
 *
 * It is a deliberate, scoped demo door, NOT real authentication:
 *  - The credential is checked on-device against the hardcoded pair below.
 *  - A match skips OAuth and the platform age signal, stamps a local `reviewer`
 *    profile, and drops the reviewer straight into the app. No signup webhook
 *    fires for it (see auth.tsx → handleReviewerSignIn).
 *  - It only ever opens a fresh, local, on-device instance. There is no server
 *    and no other user's data is reachable, so baking the credential into the
 *    bundle (where it's technically extractable) carries no real risk — it's
 *    functionally equivalent to a "skip sign-in for review" button.
 *
 * KILL SWITCH (OTA, no rebuild): once the app is approved, set
 * REVIEWER_ACCESS_ENABLED to false and ship an `eas update`. Because this is a
 * plain JS constant (not a native/env value), the OTA bundle flips it live —
 * which both hides the "Sign in with email" link on the sign-up screen AND
 * makes the credential stop working (isReviewerCredential returns false).
 */

export const REVIEWER_ACCESS_ENABLED = true

// Provide these to Apple App Store Connect ("Sign-In required" demo account)
// and Google Play Console (App access) review notes, verbatim.
const REVIEWER_EMAIL = 'review@tatumapp.com'
const REVIEWER_PASSWORD = 'TatumReview2026!'

/**
 * True only when reviewer access is enabled AND the supplied credential matches
 * the reviewer pair. Email match is case-insensitive and trimmed; the password
 * is compared exactly.
 */
export function isReviewerCredential(email: string, password: string): boolean {
  if (!REVIEWER_ACCESS_ENABLED) return false
  return email.trim().toLowerCase() === REVIEWER_EMAIL && password === REVIEWER_PASSWORD
}
