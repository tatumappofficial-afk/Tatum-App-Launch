import { generateId as uuid } from '@/src/utils/uuid'
import { getDatabase } from './sqlite'
import { serializeJsonColumn } from './sqlite'

// Development seed data — matches Storybook story props
export async function seedDevelopmentData() {
  const db = await getDatabase()

  const now = new Date().toISOString()
  const today = new Date().toISOString().split('T')[0]

  // ── Partners ──
  const alexId = uuid()
  const jordanId = uuid()

  await db.runAsync(
    'INSERT INTO partners (id, displayName, avatarType, avatarValue, avatarGradient, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [alexId, 'Alex', 'initials', 'AM', 'linear-gradient(135deg, #C07858, #7C4A5A)', 1, now, now],
  )
  await db.runAsync(
    'INSERT INTO partners (id, displayName, avatarType, avatarValue, avatarGradient, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [jordanId, 'Jordan', 'initials', 'JR', 'linear-gradient(135deg, #8BA888, #5A8060)', 1, now, now],
  )

  // ── Encounters ──
  const encounterDates = [
    { daysAgo: 1, activities: ['🍆', '💋'], partnerId: alexId, stars: 8 },
    { daysAgo: 3, activities: ['😘', '🌙'], partnerId: alexId, stars: 9 },
    { daysAgo: 5, activities: ['🍆', '✋', '💋'], partnerId: jordanId, stars: 7 },
    { daysAgo: 8, activities: ['✨'], partnerId: null, stars: 8 },
    { daysAgo: 12, activities: ['🍆', '😘'], partnerId: alexId, stars: 10 },
    { daysAgo: 14, activities: ['💋', '🌙'], partnerId: jordanId, stars: 8 },
  ]

  for (const enc of encounterDates) {
    const date = new Date()
    date.setDate(date.getDate() - enc.daysAgo)
    const dateStr = date.toISOString().split('T')[0]
    const encId = uuid()
    const noteId = uuid()

    await db.runAsync(
      'INSERT INTO encounters (id, date, activities, partnerId, rating, stars, vibes, noteId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [encId, dateStr, serializeJsonColumn(enc.activities), enc.partnerId, 'up', enc.stars, '[]', noteId, now, now],
    )

    await db.runAsync(
      'INSERT INTO private_notes (id, encounterId, partnerId, body, emojiTags, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [noteId, encId, enc.partnerId, 'A beautiful moment worth remembering.', '[]', now, now],
    )
  }

  // ── User Profile ──
  await db.runAsync(
    'UPDATE user_profile SET displayName = ? WHERE id = ?',
    ['Alanna', 'default'],
  )
}
