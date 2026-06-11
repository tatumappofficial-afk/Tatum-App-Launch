import type { SQLiteDatabase } from 'expo-sqlite'
import { generateId as uuid } from '@/src/utils/uuid'

/**
 * Dev-only data seed.
 *
 * Populates tatum.db with a realistic, heavy dataset and marks the user as
 * onboarded, so a fresh install boots straight into a fully-populated app —
 * no onboarding click-through, no auth, identical on iOS and Android. This
 * exists purely so automated testing (iOS simulator + Maestro on Android) can
 * exercise real screens without a manual sign-in flow.
 *
 * Two independent gates keep this out of production (see callsite in index.ts):
 *   1. `__DEV__` is false in release builds.
 *   2. `EXPO_PUBLIC_DEV_SEED === '1'` must be set (only in .env.local, never in
 *      the EAS production profile).
 *
 * Fresh-aware: if any sessions already exist, this no-ops, so manual edits made
 * while poking around are never clobbered. To get a clean reseed, wipe app data
 * (Maestro `launchApp: clearState: true`, or reinstall on the simulator).
 *
 * Deterministic: no Math.random / no wall-clock variability in the *content*
 * (only the anchor "today" comes from the clock). Both platforms get identical
 * data, which keeps cross-platform diffing and Maestro assertions stable.
 */

// ── Deterministic PRNG (mulberry32) ──
// Seeded with a constant so every run produces the same dataset.
function makeRng(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

// Local YYYY-MM-DD for a Date (mirrors the app's local-date convention).
function localDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const GRADIENTS = [
  'linear-gradient(135deg, #C07858, #7C4A5A)', // terra
  'linear-gradient(135deg, #7C9A8E, #4A6A5A)', // sage
  'linear-gradient(135deg, #9A8878, #6A5A4A)', // sand
  'linear-gradient(135deg, #A87C9A, #5A4A6A)', // plum
  'linear-gradient(135deg, #C0A058, #7C6A4A)', // amber
]

// Activity emojis snapshotted into encounters. These mirror the *current*
// DEFAULT_ACTIVITY_TAGS emoji set on this branch (schema.ts), minus 🩸 which is
// seeded separately as period logs. Encounters store the emoji string itself,
// not a tag id, so this list just needs to match shipping emojis.
const ACTIVITY_EMOJIS = ['🥂', '🤭', '👉', '🏁', '👄', '⌛️', '🏡', '😛', '👅', '☀️', '🤝', '😴', '🌅', '🛁', '🏖', '😡', '✋', '💦', '🍑', '🍆', '🌬️', '✨', '💃', '🥸']
const PERIOD_EMOJI = '🩸'

const SAMPLE_NOTES = [
  'Felt really connected tonight.',
  'Spontaneous and easy.',
  'Slow morning, no rush.',
  'Tried something new.',
  'Both wiped out after — good kind of tired.',
  null,
  null,
  null,
]

export async function seedDevData(db: SQLiteDatabase): Promise<void> {
  // Fresh-aware guard: bail if there's already session data.
  const existing = await db.getAllAsync<{ id: string }>('SELECT id FROM encounters LIMIT 1')
  if (existing.length > 0) {
    console.log('[devSeed] sessions already present — skipping seed')
    return
  }

  console.log('[devSeed] seeding heavy dev dataset…')
  const rng = makeRng(0x7a701234) // constant seed → deterministic dataset
  const now = new Date()
  const nowIso = now.toISOString()

  // ── Partners ──
  // initDatabase() already inserted a non-removable Solo (✨). Add three named
  // partners; the first becomes the main (quick-log default), and we clear
  // Solo's main flag so the named partner wins.
  const namedPartners = [
    { name: 'Jordan Reyes', initials: 'JR' },
    { name: 'Sam Avery', initials: 'SA' },
    { name: 'Riley Quinn', initials: 'RQ' },
  ]
  const partnerIds: string[] = []
  for (let i = 0; i < namedPartners.length; i++) {
    const p = namedPartners[i]
    const id = uuid()
    partnerIds.push(id)
    // Stagger createdAt so ordering is stable.
    const created = new Date(now.getTime() - (180 - i) * 86400000).toISOString()
    await db.runAsync(
      'INSERT INTO partners (id, displayName, avatarType, avatarValue, avatarGradient, isActive, isMain, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, p.name, 'initials', p.initials, GRADIENTS[i % GRADIENTS.length], 1, i === 0 ? 1 : 0, created, created],
    )
  }
  // Clear Solo's main flag (initDatabase's backfill may have promoted it).
  await db.runAsync("UPDATE partners SET isMain = 0 WHERE displayName = 'Solo'")

  // Grab Solo's id so some sessions can be logged solo.
  const soloRows = await db.getAllAsync<{ id: string }>("SELECT id FROM partners WHERE displayName = 'Solo' LIMIT 1")
  const soloId = soloRows[0]?.id ?? null

  // ── Custom activity tag (isDefault = 0) so the tags screen shows a user tag ──
  const maxOrderRows = await db.getAllAsync<{ m: number | null }>('SELECT MAX(sortOrder) as m FROM activity_tags')
  const nextOrder = (maxOrderRows[0]?.m ?? 0) + 1
  await db.runAsync(
    'INSERT INTO activity_tags (id, emoji, label, sortOrder, isDefault, isActive) VALUES (?, ?, ?, ?, 0, 1)',
    [uuid(), '🔥', 'Spicy', nextOrder],
  )

  // ── Encounters: ~45 sessions spread across the last ~150 days ──
  const SESSION_COUNT = 45
  for (let i = 0; i < SESSION_COUNT; i++) {
    // Walk backwards from today with a varied 1–5 day gap.
    const daysAgo = Math.floor((i / SESSION_COUNT) * 150 + rng() * 4)
    const d = new Date(now.getTime() - daysAgo * 86400000)
    const id = uuid()

    // 1–4 activities, weighted toward main partner.
    const activityCount = 1 + Math.floor(rng() * 4)
    const activities = new Set<string>()
    while (activities.size < activityCount) activities.add(pick(rng, ACTIVITY_EMOJIS))

    // Partner mix: ~60% main, ~25% other named, ~15% solo (no partner).
    const roll = rng()
    let partners: string[]
    if (roll < 0.6) partners = [partnerIds[0]]
    else if (roll < 0.85) partners = [pick(rng, partnerIds.slice(1))]
    else partners = soloId && rng() < 0.5 ? [soloId] : []
    // Occasionally a multi-partner session.
    if (rng() < 0.08 && partnerIds.length > 1) partners = [partnerIds[0], partnerIds[1]]

    const stars = rng() < 0.15 ? null : Math.floor(rng() * 11) // 0–10 or null
    const notes = pick(rng, SAMPLE_NOTES)
    const created = d.toISOString()
    await db.runAsync(
      'INSERT INTO encounters (id, date, activities, partnerIds, stars, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, localDate(d), JSON.stringify([...activities]), JSON.stringify(partners), stars, notes, created, created],
    )
  }

  // ── Period logs: partnerless sessions tagged 🩸 (exercises partner-optional
  // logging + the calendar's period overlay). Two recent cycles, ~28 days
  // apart, 4 consecutive days each. ──
  for (let cycle = 0; cycle < 2; cycle++) {
    for (let day = 0; day < 4; day++) {
      const d = new Date(now.getTime() - (cycle * 28 + day) * 86400000)
      const created = d.toISOString()
      await db.runAsync(
        'INSERT INTO encounters (id, date, activities, partnerIds, stars, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [uuid(), localDate(d), JSON.stringify([PERIOD_EMOJI]), JSON.stringify([]), null, null, created, created],
      )
    }
  }

  // ── Desire entries (Safe Space) ──
  const desireBodies = [
    'Been thinking about trying the new thing we talked about.',
    'Want a slow weekend morning together.',
    'Craving more spontaneity lately.',
  ]
  for (let i = 0; i < desireBodies.length; i++) {
    const d = new Date(now.getTime() - (i * 5 + 2) * 86400000)
    const created = d.toISOString()
    await db.runAsync(
      'INSERT INTO desire_entries (id, timestamp, intensity, body, partnerId, actedOn, linkedEncounterId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [uuid(), created, 1 + Math.floor(rng() * 5), desireBodies[i], partnerIds[0], i === 0 ? 1 : 0, null, created],
    )
  }

  // ── Whisper message ──
  {
    const d = new Date(now.getTime() - 3 * 86400000)
    const created = d.toISOString()
    await db.runAsync(
      'INSERT INTO whisper_messages (id, partnerId, templateId, customBody, finalMessage, deliveryMethod, sentAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [uuid(), partnerIds[0], null, 'Thinking about you.', 'Thinking about you.', 'copy', created, created],
    )
  }

  // ── Affirmations ──
  const affirmations = [
    { body: 'My desires are valid and worth honoring.', fav: 1 },
    { body: 'I deserve pleasure and connection.', fav: 0 },
    { body: 'I communicate my needs with confidence.', fav: 0 },
  ]
  for (const a of affirmations) {
    await db.runAsync(
      'INSERT INTO affirmations (id, body, source, isFavorite, isActive, lastShownAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uuid(), a.body, 'curated', a.fav, 1, null, nowIso],
    )
  }

  // ── Flip settings: onboarded, lock off (so automation isn't blocked) ──
  await db.runAsync("UPDATE user_settings SET hasOnboarded = 1, biometricLock = 0 WHERE id = 'singleton'")

  // Give the main user profile a display name so the profile screen isn't blank.
  await db.runAsync("UPDATE user_profile SET displayName = COALESCE(displayName, 'Alex') WHERE id = 'default'")

  console.log(`[devSeed] done — ${SESSION_COUNT} sessions + period logs + ${namedPartners.length} partners`)
}
