/**
 * Shared helpers for the db integration catalog. NOT a test suite (no `.test`
 * suffix, so jest's default testMatch skips it). Everything here takes the db
 * handle or the freshly-required module as an argument so it always operates on
 * the current jest module registry — never a stale cross-registry singleton.
 */
import type { SQLiteDatabase } from 'expo-sqlite'

/** Count rows in a table. */
export async function countRows(db: SQLiteDatabase, table: string): Promise<number> {
  const [row] = await db.getAllAsync<{ n: number }>(`SELECT COUNT(*) AS n FROM ${table}`)
  return row.n
}

/**
 * Dump a table as plain objects, dropping the columns in `omit` (e.g. random
 * UUID ids and any column derived from them) and sorting by the JSON of what
 * remains so two runs are order-independent to compare.
 */
export async function dumpTable(
  db: SQLiteDatabase,
  table: string,
  omit: string[] = [],
): Promise<Record<string, unknown>[]> {
  const rows = await db.getAllAsync<Record<string, unknown>>(`SELECT * FROM ${table}`)
  const projected = rows.map((r) => {
    const copy: Record<string, unknown> = { ...r }
    for (const col of omit) delete copy[col]
    return copy
  })
  projected.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
  return projected
}

/**
 * Let queued collection persistence (optimistic onInsert/onUpdate/onDelete
 * handlers) drain to SQLite. TanStack collection mutations that aren't returned
 * as a Transaction can't be awaited via `isPersisted.promise`, so we yield to
 * the macrotask queue until the database row-state stops changing (two
 * identical consecutive snapshots), bounded at ~1s so a genuine hang still
 * fails the test instead of spinning. A fixed short sleep flakes on slow CI.
 * Uses real timers — never call under fake timers.
 */
export async function flush(db?: SQLiteDatabase): Promise<void> {
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  if (!db) {
    await sleep(25)
    return
  }
  const TABLES = [
    'encounters',
    'partners',
    'activity_tags',
    'desire_entries',
    'whisper_messages',
    'affirmations',
    'user_profile',
  ]
  const snapshot = async () => {
    const counts: number[] = []
    for (const t of TABLES) counts.push(await countRows(db, t))
    return counts.join(',')
  }
  let prev = await snapshot()
  for (let i = 0; i < 40; i++) {
    await sleep(25)
    const next = await snapshot()
    if (next === prev) return
    prev = next
  }
}
