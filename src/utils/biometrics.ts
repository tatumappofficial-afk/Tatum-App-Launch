import { Platform } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'

const { AuthenticationType } = LocalAuthentication

export interface BiometricCapabilities {
  hasHardware: boolean
  isEnrolled: boolean
  // Friendly label for the lock card / prompt — adapts to what's actually
  // enrolled. Falls back to "device passcode" when no biometric is available.
  label: string
}

export async function getBiometricCapabilities(): Promise<BiometricCapabilities> {
  const [hasHardware, isEnrolled, supported] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ])

  const label = resolveLabel(supported, hasHardware && isEnrolled)
  return { hasHardware, isEnrolled, label }
}

function resolveLabel(
  supported: LocalAuthentication.AuthenticationType[],
  biometricUsable: boolean,
): string {
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

export async function authenticate(promptMessage = 'Unlock Tatum'): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    disableDeviceFallback: false, // device passcode is always the safety net
    cancelLabel: 'Cancel',
  })
  return result.success
}
