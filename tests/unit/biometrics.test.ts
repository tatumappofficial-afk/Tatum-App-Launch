/**
 * Guards the two decisions that stranded users on the Protect step of onboarding:
 * whether the app believes the phone can lock at all, and whether a failed
 * prompt produces something to show the user. Both are pure logic, so they fit
 * the plain-Node suite; the screen wiring around them is not covered here.
 */

const mockAuthenticateAsync = jest.fn()
const mockHasHardwareAsync = jest.fn()
const mockIsEnrolledAsync = jest.fn()
const mockSupportedTypesAsync = jest.fn()
const mockGetEnrolledLevelAsync = jest.fn()

// Mirrors the real enums so the values under test are the ones the native
// module actually returns.
const mockSecurityLevel = { NONE: 0, SECRET: 1, BIOMETRIC_WEAK: 2, BIOMETRIC_STRONG: 3 } as const
const mockAuthenticationType = { FINGERPRINT: 1, FACIAL_RECOGNITION: 2, IRIS: 3 } as const

jest.mock('expo-local-authentication', () => ({
  authenticateAsync: (...args: unknown[]) => mockAuthenticateAsync(...args),
  hasHardwareAsync: () => mockHasHardwareAsync(),
  isEnrolledAsync: () => mockIsEnrolledAsync(),
  supportedAuthenticationTypesAsync: () => mockSupportedTypesAsync(),
  getEnrolledLevelAsync: () => mockGetEnrolledLevelAsync(),
  // Inlined rather than referencing the consts above: jest hoists this factory
  // above their initialisation, and the module reads both eagerly on import.
  SecurityLevel: { NONE: 0, SECRET: 1, BIOMETRIC_WEAK: 2, BIOMETRIC_STRONG: 3 },
  AuthenticationType: { FINGERPRINT: 1, FACIAL_RECOGNITION: 2, IRIS: 3 },
}))

jest.mock('react-native', () => ({ Platform: { OS: 'android' } }))

import { authenticate, describeAuthFailure, getBiometricCapabilities } from '@/src/utils/biometrics'

function primeCapabilities({
  hasHardware = false,
  isEnrolled = false,
  supported = [] as number[],
  level = mockSecurityLevel.NONE as number,
} = {}) {
  mockHasHardwareAsync.mockResolvedValue(hasHardware)
  mockIsEnrolledAsync.mockResolvedValue(isEnrolled)
  mockSupportedTypesAsync.mockResolvedValue(supported)
  mockGetEnrolledLevelAsync.mockResolvedValue(level)
}

describe('getBiometricCapabilities — canLock', () => {
  it('is false only when the phone has no screen lock at all', async () => {
    primeCapabilities({ level: mockSecurityLevel.NONE })
    await expect(getBiometricCapabilities()).resolves.toMatchObject({ canLock: false })
  })

  // The regression that caused the bug report: a passcode-only phone reports
  // isEnrolled: false because that flag tracks biometrics alone, yet it locks
  // perfectly well through the device-credential fallback. Gating the UI on
  // isEnrolled would wrongly deny those users the lock.
  it('is true for a passcode-only phone even though no biometric is enrolled', async () => {
    primeCapabilities({ hasHardware: false, isEnrolled: false, level: mockSecurityLevel.SECRET })
    await expect(getBiometricCapabilities()).resolves.toMatchObject({ canLock: true, isEnrolled: false })
  })

  it.each([
    ['weak biometrics', mockSecurityLevel.BIOMETRIC_WEAK],
    ['strong biometrics', mockSecurityLevel.BIOMETRIC_STRONG],
  ])('is true with %s enrolled', async (_label, level) => {
    primeCapabilities({ hasHardware: true, isEnrolled: true, supported: [mockAuthenticationType.FINGERPRINT], level })
    await expect(getBiometricCapabilities()).resolves.toMatchObject({ canLock: true })
  })

  it('still reports a usable label when only a passcode is set', async () => {
    primeCapabilities({ level: mockSecurityLevel.SECRET })
    await expect(getBiometricCapabilities()).resolves.toMatchObject({ label: 'Use device passcode' })
  })
})

describe('describeAuthFailure', () => {
  // Every code either platform can emit must produce guidance. A blank or
  // missing message is what made the screen look frozen in the first place.
  const everyEmittedCode = [
    'not_enrolled',
    'user_cancel',
    'app_cancel',
    'not_available',
    'lockout',
    'no_space',
    'timeout',
    'unable_to_process',
    'unknown',
    'system_cancel',
    'user_fallback',
    'invalid_context',
    'passcode_not_set',
    'authentication_failed',
  ] as const

  it.each(everyEmittedCode)('returns actionable copy for %s', (code) => {
    const message = describeAuthFailure(code)
    expect(message.trim().length).toBeGreaterThan(0)
    expect(message).toMatch(/try again|skip|settings/i)
  })

  it('falls back to guidance when the code is missing entirely', () => {
    expect(describeAuthFailure(undefined)).toMatch(/skip/i)
  })

  it('tells a phone with no screen lock how to get one', () => {
    expect(describeAuthFailure('not_enrolled')).toMatch(/passcode or fingerprint/i)
  })

  // A non-matching scan is the commonest failure for users who do have
  // biometrics; it must invite a retry rather than send them away to Settings.
  it('invites a retry when the scan simply did not match', () => {
    expect(describeAuthFailure('authentication_failed')).toMatch(/try again/i)
  })
})

describe('authenticate', () => {
  it('reports success through the boolean wrapper', async () => {
    mockAuthenticateAsync.mockResolvedValue({ success: true })
    await expect(authenticate()).resolves.toBe(true)
  })

  it('reports failure without throwing', async () => {
    mockAuthenticateAsync.mockResolvedValue({ success: false, error: 'not_enrolled' })
    await expect(authenticate()).resolves.toBe(false)
  })

  it('keeps the device-passcode fallback enabled', async () => {
    mockAuthenticateAsync.mockResolvedValue({ success: true })
    await authenticate('Unlock Tatum')
    expect(mockAuthenticateAsync).toHaveBeenCalledWith(expect.objectContaining({ disableDeviceFallback: false }))
  })
})
