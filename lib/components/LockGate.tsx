import React, { useEffect, useRef, useState } from 'react'
import { AppState, type AppStateStatus } from 'react-native'
import { authenticate } from '@/src/utils/biometrics'
import { useSettings } from '@/src/hooks/useSettings'
import { LockOverlay } from './LockOverlay'

export interface LockGateProps {
  /**
   * The biometricLock value at the moment this component first mounts.
   * Determines whether to show the lock overlay on cold start. The component
   * reads live updates from `useSettings()` after that — this prop is just
   * the seed value so we get the right initial render with no flicker.
   */
  initialLocked: boolean
  children: React.ReactNode
}

/**
 * Gates the app behind biometric auth when settings.biometricLock is true.
 *
 * Cold start: if `initialLocked` is true, renders LockOverlay and immediately
 * triggers the OS auth prompt.
 *
 * Foreground (after background): re-checks the live biometricLock setting
 * (via useSettings); if it's true, locks and prompts.
 */
export function LockGate({ initialLocked, children }: LockGateProps) {
  const [locked, setLocked] = useState(initialLocked)
  const [needsRetry, setNeedsRetry] = useState(false)
  const lastState = useRef<AppStateStatus>(AppState.currentState)
  const isAuthenticating = useRef(false)

  // Keep a ref to the live biometricLock setting so the AppState callback
  // (registered once on mount) always reads the latest value.
  const settings = useSettings()
  const biometricLockRef = useRef(settings.biometricLock)
  useEffect(() => {
    biometricLockRef.current = settings.biometricLock
  }, [settings])

  useEffect(() => {
    // Cold start: if locked, prompt immediately.
    if (initialLocked) {
      attemptUnlock()
    }

    const sub = AppState.addEventListener('change', (state) => {
      const prev = lastState.current
      lastState.current = state

      // Only react to background → active and active → background transitions.
      // Ignore the brief 'inactive' state (control center, app switcher, etc).
      if (state === 'background') {
        if (biometricLockRef.current) {
          setLocked(true)
          setNeedsRetry(false)
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
