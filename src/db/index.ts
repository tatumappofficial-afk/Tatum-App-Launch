import { getDatabase } from './sqlite'
import { initCollections } from './collections'
import { DEFAULT_ACTIVITY_TAGS, PERIOD_TAG_ID } from './schema'
import { generateId as uuid } from '@/src/utils/uuid'
import { deriveInitials } from '@/src/utils/initials'

export {
  activityTags,
  encounters,
  partners,
  desireEntries,
  whisperMessages,
  affirmations,
  userProfiles,
} from './collections'
export * from './schema'

let initialized = false

export async function initDatabase() {
  if (initialized) return
  const db = await getDatabase()
  initCollections(db)

  // Ensure default user profile exists
  const profiles = await db.getAllAsync<{ id: string; avatarValue: string | null; avatarGradient: string | null }>(
    'SELECT id, avatarValue, avatarGradient FROM user_profile LIMIT 1',
  )
  const DEFAULT_AVATAR_GRADIENT = 'linear-gradient(135deg, #C07858, #7C4A5A)' // partnerGradients[0] (terra)
  if (profiles.length === 0) {
    const now = new Date().toISOString()
    await db.runAsync(
      'INSERT INTO user_profile (id, displayName, avatarValue, avatarGradient, createdAt, tier, premiumExpiresAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['default', null, 'A', DEFAULT_AVATAR_GRADIENT, now, 'free', null],
    )
  } else {
    // Backfill avatar fields for legacy rows that pre-date these columns
    const existing = profiles[0]
    if (existing.avatarValue == null || existing.avatarGradient == null) {
      await db.runAsync(
        'UPDATE user_profile SET avatarValue = COALESCE(avatarValue, ?), avatarGradient = COALESCE(avatarGradient, ?) WHERE id = ?',
        ['A', DEFAULT_AVATAR_GRADIENT, existing.id],
      )
    }
  }

  // Ensure default activity tags exist
  const existingTags = await db.getAllAsync<{ id: string }>('SELECT id FROM activity_tags LIMIT 1')
  if (existingTags.length === 0) {
    for (let i = 0; i < DEFAULT_ACTIVITY_TAGS.length; i++) {
      const tag = DEFAULT_ACTIVITY_TAGS[i]
      await db.runAsync(
        'INSERT INTO activity_tags (id, emoji, label, sortOrder, isDefault, isActive) VALUES (?, ?, ?, ?, 1, 1)',
        [tag.id ?? uuid(), tag.emoji, tag.label, i],
      )
    }
  }

  // Period tag is special: it's the one protected default and must always
  // exist with the stable PERIOD_TAG_ID so downstream checks (lock state,
  // partner-optional logging) can find it. Two heal passes:
  // 1. Pre-stable-id installs seeded Period with a random UUID — rewrite that
  //    row's id to PERIOD_TAG_ID. Encounters snapshot the emoji+label, not the
  //    tag id, so updating activity_tags.id has no foreign-key consequences.
  // 2. If Period was deleted (soft via isActive=0 or hard) in any prior build,
  //    re-insert/re-activate it. Period can never be missing for any user.
  await db.runAsync(
    `UPDATE activity_tags SET id = ?
     WHERE emoji = '🩸' AND isDefault = 1 AND id != ?`,
    [PERIOD_TAG_ID, PERIOD_TAG_ID],
  )
  const periodRow = await db.getAllAsync<{ id: string; isActive: number }>(
    'SELECT id, isActive FROM activity_tags WHERE id = ?',
    [PERIOD_TAG_ID],
  )
  if (periodRow.length === 0) {
    // Slot Period at the end so it doesn't reshuffle whatever the user already has.
    const [{ maxOrder }] = await db.getAllAsync<{ maxOrder: number }>(
      'SELECT COALESCE(MAX(sortOrder), -1) AS maxOrder FROM activity_tags',
    )
    await db.runAsync(
      'INSERT INTO activity_tags (id, emoji, label, sortOrder, isDefault, isActive) VALUES (?, ?, ?, ?, 1, 1)',
      [PERIOD_TAG_ID, '🩸', 'Period', maxOrder + 1],
    )
  } else if (periodRow[0].isActive === 0) {
    await db.runAsync('UPDATE activity_tags SET isActive = 1 WHERE id = ?', [PERIOD_TAG_ID])
  }

  // Ensure at least one partner exists so the log-session picker is never
  // empty. Solo is now a regular partner row — the user can rename or delete
  // it like any other.
  const existingPartners = await db.getAllAsync<{ id: string }>('SELECT id FROM partners LIMIT 1')
  if (existingPartners.length === 0) {
    const now = new Date().toISOString()
    await db.runAsync(
      'INSERT INTO partners (id, displayName, avatarType, avatarValue, avatarGradient, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [uuid(), 'Solo', 'emoji', '✨', 'linear-gradient(135deg, #9A8878, #6A5A4A)', 1, now, now],
    )
  }

  // user_settings singleton is seeded by SQL in sqlite.ts (INSERT OR IGNORE),
  // so no JS-side seeding is needed here.

  // Backfill: every user with at least one active partner should have a main
  // partner. If none is set, promote the oldest active partner so quick-log
  // has a deterministic target and the profile badge is always visible.
  const mainCheck = await db.getAllAsync<{ id: string }>(
    'SELECT id FROM partners WHERE isMain = 1 AND isActive = 1 LIMIT 1',
  )
  if (mainCheck.length === 0) {
    const oldest = await db.getAllAsync<{ id: string }>(
      'SELECT id FROM partners WHERE isActive = 1 ORDER BY createdAt ASC LIMIT 1',
    )
    if (oldest.length > 0) {
      await db.runAsync('UPDATE partners SET isMain = 1, updatedAt = ? WHERE id = ?', [
        new Date().toISOString(),
        oldest[0].id,
      ])
    }
  }

  // Backfill 1-character partner initials written by the legacy
  // first-letter-of-each-word derivation. Skip rows where re-deriving
  // can't produce 2+ chars (e.g. a 1-letter displayName). Restrict to
  // initials-type rows so we don't clobber emoji avatars (a single emoji
  // is one "char" and would otherwise match the LENGTH < 2 filter).
  const stalePartners = await db.getAllAsync<{ id: string; displayName: string; avatarValue: string }>(
    "SELECT id, displayName, avatarValue FROM partners WHERE LENGTH(avatarValue) < 2 AND avatarType = 'initials'",
  )
  for (const row of stalePartners) {
    const fresh = deriveInitials(row.displayName)
    if (fresh.length >= 2) {
      await db.runAsync('UPDATE partners SET avatarValue = ?, updatedAt = ? WHERE id = ?', [
        fresh,
        new Date().toISOString(),
        row.id,
      ])
    }
  }

  // Fix legacy quick-log encounters whose `date` was written from the UTC date
  // of `createdAt` instead of the local date — they're invisible to the year /
  // all-time stats because their date string ends up on the exclusive boundary.
  // Only rewrite rows where `date` matches the UTC slice AND differs from the
  // local equivalent — leaves manually-dated full-log entries untouched.
  const staleEncounters = await db.getAllAsync<{ id: string; date: string; createdAt: string }>(
    'SELECT id, date, createdAt FROM encounters',
  )
  for (const row of staleEncounters) {
    const utcDateStr = row.createdAt.split('T')[0]
    if (row.date !== utcDateStr) continue // wasn't created with the bug
    const local = new Date(row.createdAt)
    const localDateStr = `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, '0')}-${String(local.getDate()).padStart(2, '0')}`
    if (localDateStr === row.date) continue // local matches UTC — no fix needed (timezone is UTC, or session created near midday UTC)
    await db.runAsync('UPDATE encounters SET date = ? WHERE id = ?', [localDateStr, row.id])
  }

  initialized = true
}

// ── Reset helper for dev tools / testing ──

export async function resetAllData() {
  const db = await getDatabase()
  await db.execAsync(`
    DELETE FROM whisper_messages;
    DELETE FROM desire_entries;
    DELETE FROM encounters;
    DELETE FROM partners;
    DELETE FROM affirmations;
    DELETE FROM activity_tags;
    DELETE FROM user_settings;
    DELETE FROM user_profile;
  `)
  // Re-create defaults
  const now = new Date().toISOString()
  await db.runAsync(
    'INSERT INTO user_profile (id, displayName, createdAt, tier, premiumExpiresAt) VALUES (?, ?, ?, ?, ?)',
    ['default', null, now, 'free', null],
  )
  for (let i = 0; i < DEFAULT_ACTIVITY_TAGS.length; i++) {
    const tag = DEFAULT_ACTIVITY_TAGS[i]
    await db.runAsync(
      'INSERT INTO activity_tags (id, emoji, label, sortOrder, isDefault, isActive) VALUES (?, ?, ?, ?, 1, 1)',
      [tag.id ?? uuid(), tag.emoji, tag.label, i],
    )
  }
  await db.runAsync(
    `INSERT INTO user_settings
      (id, notifications, whisperDeliveryDefault, calendarStartDay, biometricLock, hasOnboarded, theme)
     VALUES ('singleton', 1, 'copy', 'sunday', 0, 0, 'warm')`,
  )
}

export async function getDbStats() {
  const db = await getDatabase()
  const [p] = await db.getAllAsync<{ count: number }>('SELECT COUNT(*) as count FROM partners')
  const [e] = await db.getAllAsync<{ count: number }>('SELECT COUNT(*) as count FROM encounters')
  return { partners: p.count, encounters: e.count }
}
