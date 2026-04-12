import { getDatabase } from './sqlite'
import { initCollections, encounters, partners, privateNotes, desireEntries, whisperMessages, affirmations, userProfiles } from './collections'
import { DEFAULT_SETTINGS, type UserSettings } from './schema'

export { encounters, partners, privateNotes, desireEntries, whisperMessages, affirmations, userProfiles } from './collections'
export * from './schema'

let initialized = false

export async function initDatabase() {
  if (initialized) return
  const db = await getDatabase()
  initCollections(db)

  // Ensure default user profile exists
  const profiles = await db.getAllAsync<{ id: string }>('SELECT id FROM user_profile LIMIT 1')
  if (profiles.length === 0) {
    const now = new Date().toISOString()
    await db.runAsync(
      'INSERT INTO user_profile (id, displayName, createdAt, tier, premiumExpiresAt) VALUES (?, ?, ?, ?, ?)',
      ['default', null, now, 'free', null],
    )
  }

  // Ensure default settings exist
  const settings = await db.getAllAsync<{ key: string }>('SELECT key FROM user_settings LIMIT 1')
  if (settings.length === 0) {
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      await db.runAsync(
        'INSERT OR IGNORE INTO user_settings (key, value) VALUES (?, ?)',
        [key, JSON.stringify(value)],
      )
    }
  }

  initialized = true
}

// ── Settings helpers (using expo-sqlite directly, not TanStack DB) ──

export async function getSettings(): Promise<UserSettings> {
  const db = await getDatabase()
  const rows = await db.getAllAsync<{ key: string; value: string }>('SELECT * FROM user_settings')
  const settings = { ...DEFAULT_SETTINGS }
  for (const row of rows) {
    try {
      ;(settings as Record<string, unknown>)[row.key] = JSON.parse(row.value)
    } catch { /* ignore parse errors */ }
  }
  return settings
}

export async function updateSetting(key: keyof UserSettings, value: unknown) {
  const db = await getDatabase()
  await db.runAsync(
    'INSERT OR REPLACE INTO user_settings (key, value) VALUES (?, ?)',
    [key, JSON.stringify(value)],
  )
}

// ── Reset helper for dev tools / testing ──

export async function resetAllData() {
  const db = await getDatabase()
  await db.execAsync(`
    DELETE FROM whisper_messages;
    DELETE FROM desire_entries;
    DELETE FROM private_notes;
    DELETE FROM encounters;
    DELETE FROM partners;
    DELETE FROM affirmations;
    DELETE FROM user_settings;
    DELETE FROM user_profile;
  `)
  // Re-create defaults
  const now = new Date().toISOString()
  await db.runAsync(
    'INSERT INTO user_profile (id, displayName, createdAt, tier, premiumExpiresAt) VALUES (?, ?, ?, ?, ?)',
    ['default', null, now, 'free', null],
  )
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await db.runAsync(
      'INSERT INTO user_settings (key, value) VALUES (?, ?)',
      [key, JSON.stringify(value)],
    )
  }
}

export async function getDbStats() {
  const db = await getDatabase()
  const [p] = await db.getAllAsync<{ count: number }>('SELECT COUNT(*) as count FROM partners')
  const [e] = await db.getAllAsync<{ count: number }>('SELECT COUNT(*) as count FROM encounters')
  const [n] = await db.getAllAsync<{ count: number }>('SELECT COUNT(*) as count FROM private_notes')
  return { partners: p.count, encounters: e.count, notes: n.count }
}
