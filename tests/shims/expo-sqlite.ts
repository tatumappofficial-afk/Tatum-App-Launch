/**
 * In-memory stand-in for expo-sqlite, backed by node:sqlite (Node 22+).
 * Implements exactly the API surface src/db uses: openDatabaseAsync,
 * execAsync, runAsync, getAllAsync, getFirstAsync, withTransactionAsync,
 * closeAsync. Wired in via jest.config.js moduleNameMapper.
 *
 * If node:sqlite ever drifts, better-sqlite3 is a drop-in fallback — only
 * the constructor and prepare/run/all/get lines below would change.
 */
import { DatabaseSync } from 'node:sqlite'

let nextRawDb: DatabaseSync | null = null

/**
 * Test hook: the next openDatabaseAsync() adopts this handle instead of a
 * fresh :memory: db. This is the "relaunch the app against the same database
 * file" primitive — build a legacy db (tests/support/legacyDb.ts) or keep the
 * raw handle from a previous "launch", then re-init the app modules on it.
 */
export function __setNextRawDatabase(raw: DatabaseSync) {
  nextRawDb = raw
}

type Param = string | number | boolean | null | undefined

// node:sqlite rejects undefined and booleans; expo-sqlite coerces them.
const coerce = (v: Param) => (v === undefined ? null : typeof v === 'boolean' ? (v ? 1 : 0) : v)

// node:sqlite rows are null-prototype objects; normalize for spread/equality.
const toPlain = (r: unknown) => ({ ...(r as Record<string, unknown>) })

export class SQLiteDatabase {
  constructor(public readonly raw: DatabaseSync) {}

  async execAsync(sql: string): Promise<void> {
    this.raw.exec(sql)
  }

  async runAsync(sql: string, params: Param[] = []): Promise<{ changes: number; lastInsertRowId: number }> {
    const result = this.raw.prepare(sql).run(...params.map(coerce))
    return { changes: Number(result.changes), lastInsertRowId: Number(result.lastInsertRowid) }
  }

  async getAllAsync<T>(sql: string, params: Param[] = []): Promise<T[]> {
    return this.raw
      .prepare(sql)
      .all(...params.map(coerce))
      .map(toPlain) as T[]
  }

  async getFirstAsync<T>(sql: string, params: Param[] = []): Promise<T | null> {
    const row = this.raw.prepare(sql).get(...params.map(coerce))
    return row == null ? null : (toPlain(row) as T)
  }

  async withTransactionAsync(fn: () => Promise<void>): Promise<void> {
    this.raw.exec('BEGIN')
    try {
      await fn()
      this.raw.exec('COMMIT')
    } catch (err) {
      this.raw.exec('ROLLBACK')
      throw err
    }
  }

  async closeAsync(): Promise<void> {
    this.raw.close()
  }
}

export async function openDatabaseAsync(_name: string): Promise<SQLiteDatabase> {
  const raw = nextRawDb ?? new DatabaseSync(':memory:')
  nextRawDb = null
  return new SQLiteDatabase(raw)
}
