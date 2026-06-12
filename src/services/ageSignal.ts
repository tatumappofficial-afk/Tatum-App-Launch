import { requestAgeRangeAsync } from 'expo-age-range'

export type AgeSignalVerdict = 'clear' | 'minor' | 'unavailable'

// Tatum is 18+. We ask the platform (Apple Declared Age Range on iOS 26+,
// Google Play Age Signals on Android) for the signed-in user's age band and
// reduce it to a verdict. The 13/16/18 thresholds are the statutory bands the
// platforms bucket into; 18 is the one we act on.
const AGE_THRESHOLDS = { threshold1: 13, threshold2: 16, threshold3: 18 }

/**
 * Asks the OS for the user's age range and reduces it to a verdict.
 *
 * - `minor`: the platform definitively reports the user as under 18 — block.
 * - `clear`: the signal indicates 18+. Note this is a declared range, not
 *   identity-verified proof; the in-app attestation checkbox is the primary
 *   gate. On unsupported OSes the module itself returns `lowerBound: 18`
 *   (adult-equivalent), which lands here.
 * - `unavailable`: no usable signal (user not signed in to the OS, declined,
 *   or the request failed). Never blocking — the attestation still applies.
 *
 * The user must be signed into the device (Google/Apple account) for a valid
 * response, so this is called after app sign-in completes.
 */
export async function checkAgeSignal(): Promise<AgeSignalVerdict> {
  try {
    const response = await requestAgeRangeAsync(AGE_THRESHOLDS)
    const { lowerBound, upperBound } = response
    // A known upper bound below 18 is the only definitive "minor" signal.
    // Everything else (18+, or an open-ended upper bound) is treated as clear.
    const verdict: AgeSignalVerdict = upperBound != null && upperBound < 18 ? 'minor' : 'clear'
    console.log(`[ageSignal] verdict=${verdict} lowerBound=${lowerBound} upperBound=${upperBound}`)
    return verdict
  } catch (err) {
    // Declined, unsupported, or transient — supplementary signal, so we don't
    // block on it. The attestation checkbox remains the hard gate.
    console.warn('[ageSignal] unavailable:', err)
    return 'unavailable'
  }
}
