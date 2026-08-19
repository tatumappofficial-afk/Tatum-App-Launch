import { Platform } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'

const { AuthenticationType } = LocalAuthentication

export interface BiometricCapabilities {
  hasHardware: boolean
  isEnrolled: boolean
  // Whether the device can lock at all. isEnrolled only covers biometrics, so a
  // phone secured with just a PIN reports isEnrolled: false while still being
  // perfectly lockable through the device-credential fallback. Anything above
  // SecurityLevel.NONE means authenticate() has something to prompt with; NONE
  // means the phone has no screen lock whatsoever and the prompt would fail
  // immediately, so the UI must not offer to enable the lock.
  canLock: boolean
  // Friendly label for the lock card / prompt — adapts to what's actually
  // enrolled. Falls back to "device passcode" when no biometric is available.
  label: string
}

export async function getBiometricCapabilities(): Promise<BiometricCapabilities> {
  const [hasHardware, isEnrolled, supported, level] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
    LocalAuthentication.getEnrolledLevelAsync(),
  ])

  const label = resolveLabel(supported, hasHardware && isEnrolled)
  return { hasHardware, isEnrolled, canLock: level !== LocalAuthentication.SecurityLevel.NONE, label }
}

function resolveLabel(supported: LocalAuthentication.AuthenticationType[], biometricUsable: boolean): string {
  if (!biometricUsable) return 'Use device passcode'

  const hasFace = supported.includes(AuthenticationType.FACIAL_RECOGNITION)
  const hasFinger = supported.includes(AuthenticationType.FINGERPRINT)

  if (Platform.OS === 'ios') {
    // iOS only ever exposes one of FACIAL_RECOGNITION or FINGERPRINT (Touch ID)
    if (hasFace) return 'Use Face ID & device passcode'
    if (hasFinger) return 'Use Touch ID & device passcode'
    return 'Use device passcode'
  }

  // Android: device may have both
  if (hasFace && hasFinger) return 'Use biometrics & device passcode'
  if (hasFace) return 'Use face unlock & device passcode'
  if (hasFinger) return 'Use fingerprint & device passcode'
  return 'Use device passcode'
}

export interface AuthenticationOutcome {
  success: boolean
  // Present only on failure. Callers that need to explain the failure to the
  // user switch on this; callers that just gate access can ignore it.
  error?: LocalAuthentication.LocalAuthenticationError
}

export async function authenticateWithResult(promptMessage = 'Unlock Tatum'): Promise<AuthenticationOutcome> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    disableDeviceFallback: false, // device passcode is always the safety net
    cancelLabel: 'Cancel',
  })
  return result.success ? { success: true } : { success: false, error: result.error }
}

export async function authenticate(promptMessage = 'Unlock Tatum'): Promise<boolean> {
  const { success } = await authenticateWithResult(promptMessage)
  return success
}

// Why the lock could not be turned on, in the user's terms. Every branch has to
// say something actionable: a silent failure here strands the user on a screen
// whose only button appears to do nothing.
export function describeAuthFailure(error: LocalAuthentication.LocalAuthenticationError | undefined): string {
  switch (error) {
    case 'user_cancel':
    case 'system_cancel':
    case 'app_cancel':
      return 'Lock setup was cancelled. Try again, or skip for now.'
    case 'not_enrolled':
    case 'passcode_not_set':
      return 'Your phone does not have a screen lock set up yet. Add a passcode or fingerprint in your phone settings, then turn this on in Tatum settings.'
    case 'not_available':
      return "This phone can't use a lock. You can skip this step — everything else works the same."
    // The likeliest failure for someone who does have biometrics set up: the
    // scan simply did not match. Retrying is the right advice, so this must not
    // fall through to the generic "set it up later" copy.
    case 'authentication_failed':
      return "Your phone didn't recognise you. Try again, or skip for now."
    case 'lockout':
      return 'Too many attempts. Unlock your phone the usual way first, then try again — or skip for now.'
    default:
      return "The lock couldn't be turned on. You can skip for now and set it up later in Settings."
  }
}
