/**
 * Build an in-memory database at a specific historical schema version by
 * replaying the REAL shipped migrations — never hand-written schema copies.
 * Insert legacy-shaped rows into the returned handle, then hand it to
 * loadFreshDb({ raw }) to run the upgrade + JS heals against it.
 */
import { DatabaseSync } from 'node:sqlite'
import { MIGRATIONS } from '@/src/db/sqlite'

export function buildDbAtVersion(version: number): DatabaseSync {
  const raw = new DatabaseSync(':memory:')
  for (const migration of MIGRATIONS) {
    if (migration.version > version) break
    raw.exec('BEGIN')
    raw.exec(migration.up)
    raw.exec(`PRAGMA user_version = ${migration.version}`)
    raw.exec('COMMIT')
  }
  return raw
}
