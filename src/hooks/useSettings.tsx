import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getDatabase } from '@/src/db/sqlite'
import { DEFAULT_SETTINGS, SETTINGS_ID, type UserSettings } from '@/src/db/schema'

/**
 * Settings live in a React context, not a TanStack DB collection. There is
 * exactly one settings object; using a collection abstraction was a poor fit
 * and exposed timing edge cases in the sync layer.
 *
 * Reads are synchronous via useSettings(). Updates flip context state
 * immediately (so consumers re-render right away) and persist to SQLite in
 * the background.
 */

interface SettingsContextValue {
  settings: UserSettings
  updateSettings: (changes: Partial<Omit<UserSettings, 'id'>>) => void
  ready: boolean
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function rowFromSettings(s: UserSettings): (string | number)[] {
  return [
    s.id,
    s.notifications ? 1 : 0,
    s.whisperDeliveryDefault,
    s.calendarStartDay,
    s.biometricLock ? 1 : 0,
    s.hasOnboarded ? 1 : 0,
    s.theme,
  ]
}

const UPSERT_SQL = `INSERT OR REPLACE INTO user_settings
    (id, notifications, whisperDeliveryDefault, calendarStartDay, biometricLock, hasOnboarded, theme)
   VALUES (?, ?, ?, ?, ?, ?, ?)`

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [ready, setReady] = useState(false)

  // Read the singleton row from SQLite once on mount. The seed INSERT OR IGNORE
  // in sqlite.ts guarantees the row exists by the time initDatabase resolves.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const db = await getDatabase()
        const rows = await db.getAllAsync<{
          id: string
          notifications: number
          whisperDeliveryDefault: string
          calendarStartDay: string
          biometricLock: number
          hasOnboarded: number
          theme: string
        }>('SELECT * FROM user_settings WHERE id = ?', [SETTINGS_ID])
        if (cancelled) return
        const row = rows[0]
        if (row) {
          setSettings({
            id: SETTINGS_ID,
            notifications: row.notifications === 1,
            whisperDeliveryDefault: row.whisperDeliveryDefault as UserSettings['whisperDeliveryDefault'],
            calendarStartDay: row.calendarStartDay as UserSettings['calendarStartDay'],
            biometricLock: row.biometricLock === 1,
            hasOnboarded: row.hasOnboarded === 1,
            theme: 'warm',
          })
        }
      } catch (err) {
        console.error('[settings] failed to load:', err)
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Keep the latest settings in a ref so updateSettings doesn't need to be
  // recreated on every change (which would invalidate downstream memos).
  const settingsRef = useRef(settings)
  useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  const updateSettings = useCallback((changes: Partial<Omit<UserSettings, 'id'>>) => {
    const next: UserSettings = { ...settingsRef.current, ...changes }
    settingsRef.current = next
    setSettings(next)
    // Persist asynchronously. We don't await — consumers already saw the
    // change via setSettings. A SQLite write failure is a real bug we want
    // to know about, so we log it loudly rather than swallowing.
    ;(async () => {
      try {
        const db = await getDatabase()
        await db.runAsync(UPSERT_SQL, rowFromSettings(next))
      } catch (err) {
        console.error('[settings] failed to persist update:', err, changes)
      }
    })()
  }, [])

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, updateSettings, ready }),
    [settings, updateSettings, ready],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

/**
 * Reactive read of the singleton settings object. Returns the current settings
 * synchronously — consumers don't need to handle a null/loading state since
 * the provider doesn't render children until ready (see _layout.tsx gating).
 */
export function useSettings(): UserSettings {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return ctx.settings
}

/**
 * Mutator for the settings object. Updates flip context state immediately and
 * persist to SQLite in the background.
 *
 * Example:
 *   const updateSettings = useUpdateSettings()
 *   updateSettings({ hasOnboarded: true })
 */
export function useUpdateSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useUpdateSettings must be used within a SettingsProvider')
  }
  return ctx.updateSettings
}

/**
 * Used by the root layout to gate rendering of the tree on the initial
 * settings load. Returns true once the SQLite read has resolved (success or
 * failure — the provider always becomes "ready" so we don't block forever).
 */
export function useSettingsReady(): boolean {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettingsReady must be used within a SettingsProvider')
  }
  return ctx.ready
}
