import React, { useEffect, useRef, useState } from 'react'
import { AppState, type AppStateStatus } from 'react-native'
import { getSettings } from '@/src/db'
import { authenticate } from '@/src/utils/biometrics'
import { LockOverlay } from './LockOverlay'

export interface LockGateProps {
  /** Initial value of the biometricLock setting, read by the parent during init. */
  initialLocked: boolean
  children: React.ReactNode
}

/**
 * Wraps the app and re-locks on every `background` event when biometricLock is enabled.
 *
 * Cold start: if `initialLocked` is true, renders LockOverlay and immediately triggers
 * the OS auth prompt. On success, hides the overlay and shows children.
 *
 * Foreground (after background): re-reads biometricLock from settings, locks if true,
 * triggers auth.
 */
export function LockGate({ initialLocked, children }: LockGateProps) {
  const [locked, setLocked] = useState(initialLocked)
  const [needsRetry, setNeedsRetry] = useState(false)
  const lastState = useRef<AppStateStatus>(AppState.currentState)
  const isAuthenticating = useRef(false)

  useEffect(() => {
    // Cold start: if locked, prompt immediately.
    if (initialLocked) {
      attemptUnlock()
    }

    const sub = AppState.addEventListener('change', async (state) => {
      const prev = lastState.current
      lastState.current = state

      // Only react to background → active and active → background transitions.
      // Ignore the brief 'inactive' state (control center, app switcher, etc).
      if (state === 'background') {
        // Re-read in case user toggled biometricLock in Settings this session.
        try {
          const settings = await getSettings()
          if (settings.biometricLock) {
            setLocked(true)
            setNeedsRetry(false)
          }
        } catch (err) {
          console.error('Failed to re-read biometricLock setting:', err)
        }
      } else if (state === 'active' && prev === 'background') {
        // Returning from background — auto-prompt if we're locked.
        attemptUnlock()
      }
    })

    return () => sub.remove()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function attemptUnlock() {
    if (isAuthenticating.current) return
    isAuthenticating.current = true
    try {
      const ok = await authenticate('Unlock Tatum')
      if (ok) {
        setLocked(false)
        setNeedsRetry(false)
      } else {
        setNeedsRetry(true)
      }
    } catch (err) {
      console.error('Lock auth failed:', err)
      setNeedsRetry(true)
    } finally {
      isAuthenticating.current = false
    }
  }

  return (
    <>
      {children}
      {locked && <LockOverlay showRetry={needsRetry} onUnlock={attemptUnlock} />}
    </>
  )
}
