import { createCollection } from '@tanstack/db'
import type { SQLiteDatabase } from 'expo-sqlite'
import type {
  ActivityTag,
  Encounter,
  EncounterTagLabel,
  Partner,
  DesireEntry,
  WhisperMessage,
  Affirmation,
  UserProfile,
} from './schema'
import { parseJsonColumn, serializeJsonColumn } from './sqlite'

// ── SQLite sync factory ──
// Creates a TanStack DB collection backed by an expo-sqlite table.
// The sync function loads all rows on init, and onInsert/onUpdate/onDelete
// persist mutations back to SQLite.

function createSqliteCollection<T extends { id: string }>(config: {
  id: string
  table: string
  db: () => SQLiteDatabase
  jsonColumns?: string[]
  boolColumns?: string[]
}) {
  const { id, table, db: getDb, jsonColumns = [], boolColumns = [] } = config

  function rowToEntity(row: Record<string, unknown>): T {
    const entity = { ...row } as Record<string, unknown>
    for (const col of jsonColumns) {
      entity[col] = parseJsonColumn(row[col] as string | null, [])
    }
    for (const col of boolColumns) {
      entity[col] = row[col] === 1 || row[col] === true
    }
    return entity as T
  }

  function entityToRow(entity: T): Record<string, unknown> {
    const row = { ...entity } as Record<string, unknown>
    for (const col of jsonColumns) {
      row[col] = serializeJsonColumn((entity as Record<string, unknown>)[col])
    }
    for (const col of boolColumns) {
      row[col] = (entity as Record<string, unknown>)[col] ? 1 : 0
    }
    return row
  }

  return createCollection<T>({
    id,
    getKey: (item) => item.id,
    sync: {
      sync: ({ begin, write, commit, markReady }) => {
        // Load all rows from SQLite on init
        const database = getDb()
        database
          .getAllAsync<Record<string, unknown>>(`SELECT * FROM ${table}`)
          .then((rows) => {
            begin()
            for (const row of rows) {
              write({
                value: rowToEntity(row),
                type: 'insert',
              })
            }
            commit()
            markReady()
          })
          .catch((err) => {
            // A swallowed rejection here permanently kills the collection:
            // live queries stay empty and every queued mutation handler waits
            // forever. Surface it loudly — and still markReady so the app can
            // at least write (the table exists; only this load failed).
            console.error(`[db] collection ${table} initial load failed:`, err)
            markReady()
          })
      },
    },
    onInsert: async ({ transaction }) => {
      const database = getDb()
      for (const mutation of transaction.mutations) {
        const row = entityToRow(mutation.modified)
        const columns = Object.keys(row)
        const placeholders = columns.map(() => '?').join(', ')
        const values = columns.map((c) => row[c])
        const sql = `INSERT OR REPLACE INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`
        try {
          await database.runAsync(sql, values as (string | number | null)[])
        } catch (err) {
          // Never log `values` outside dev — it carries sensitive row data
          // (notes, partner names). Surface table + error only in production.
          console.error(`INSERT into ${table} failed:`, err)
          if (__DEV__) console.error('[db] failed statement:', { sql, values })
          throw err
        }
      }
    },
    onUpdate: async ({ transaction }) => {
      const database = getDb()
      for (const mutation of transaction.mutations) {
        const row = entityToRow(mutation.modified)
        const columns = Object.keys(row).filter((c) => c !== 'id')
        const setClause = columns.map((c) => `${c} = ?`).join(', ')
        const values = columns.map((c) => row[c])
        try {
          await database.runAsync(`UPDATE ${table} SET ${setClause} WHERE id = ?`, [
            ...(values as (string | number | null)[]),
            mutation.key as string,
          ])
        } catch (err) {
          console.error(`UPDATE ${table} failed:`, err, { setClause, key: mutation.key })
          throw err
        }
      }
    },
    onDelete: async ({ transaction }) => {
      const database = getDb()
      for (const mutation of transaction.mutations) {
        await database.runAsync(`DELETE FROM ${table} WHERE id = ?`, [mutation.key as string])
      }
    },
  })
}

// ── Collection instances ──
// These are lazy — they need the db reference passed at init time.

let _db: SQLiteDatabase | null = null

function db(): SQLiteDatabase {
  if (!_db) throw new Error('Database not initialized. Call initCollections() first.')
  return _db
}

export const activityTags = createSqliteCollection<ActivityTag>({
  id: 'activity_tags',
  table: 'activity_tags',
  db,
  boolColumns: ['isDefault', 'isActive'],
})

export const encounterTagLabels = createSqliteCollection<EncounterTagLabel>({
  id: 'encounter_tag_labels',
  table: 'encounter_tag_labels',
  db,
})

export const encounters = createSqliteCollection<Encounter>({
  id: 'encounters',
  table: 'encounters',
  db,
  jsonColumns: ['activities', 'partnerIds'],
})

export const partners = createSqliteCollection<Partner>({
  id: 'partners',
  table: 'partners',
  db,
  boolColumns: ['isActive', 'isMain'],
})

export const desireEntries = createSqliteCollection<DesireEntry>({
  id: 'desire_entries',
  table: 'desire_entries',
  db,
  boolColumns: ['actedOn'],
})

export const whisperMessages = createSqliteCollection<WhisperMessage>({
  id: 'whisper_messages',
  table: 'whisper_messages',
  db,
})

export const affirmations = createSqliteCollection<Affirmation>({
  id: 'affirmations',
  table: 'affirmations',
  db,
  boolColumns: ['isFavorite', 'isActive'],
})

export const userProfiles = createSqliteCollection<UserProfile>({
  id: 'user_profile',
  table: 'user_profile',
  db,
})

// ── Initialization ──

export function initCollections(database: SQLiteDatabase) {
  _db = database
}
