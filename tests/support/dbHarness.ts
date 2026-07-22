/**
 * Integration-test harness for the db layer.
 *
 * The db modules are module-load singletons (sqlite.ts's `db`, collections'
 * `_db` + collection instances, index.ts's `initialized` flag), so isolation
 * comes from jest.resetModules(): every loadFreshDb() call is a fresh app
 * process. Passing back the `raw` handle from a previous call re-opens the
 * SAME database in that fresh process — i.e. an app relaunch against the
 * same file. That's the primitive behind upgrade/idempotency/reload tests.
 *
 * Conventions for tests using this harness:
 *  - await collection mutations: `await tx.isPersisted.promise`
 *  - await `collection.preload()` before reading `collection.toArray`
 */
import type { DatabaseSync } from 'node:sqlite'

export interface FreshDb {
  /** The fully-initialized src/db module (collections, initDatabase, etc.). */
  mod: typeof import('@/src/db')
  /** The shimmed expo-sqlite database handle. */
  db: import('expo-sqlite').SQLiteDatabase
  /** The underlying node:sqlite handle — pass back in to simulate relaunch. */
  raw: DatabaseSync
}

export async function loadFreshDb(opts: { raw?: DatabaseSync; devSeed?: boolean } = {}): Promise<FreshDb> {
  jest.resetModules()
  if (opts.devSeed) process.env.EXPO_PUBLIC_DEV_SEED = '1'
  else delete process.env.EXPO_PUBLIC_DEV_SEED

  // Resolves to tests/shims/expo-sqlite.ts via moduleNameMapper — required
  // inside the fresh registry so the hook lands on the copy src/db will use.
  const shim = require('expo-sqlite') as typeof import('../shims/expo-sqlite')
  if (opts.raw) shim.__setNextRawDatabase(opts.raw)

  const mod = require('@/src/db') as typeof import('@/src/db')
  await mod.initDatabase()

  const sqlite = require('@/src/db/sqlite') as typeof import('@/src/db/sqlite')
  const db = await sqlite.getDatabase()
  return { mod, db, raw: (db as unknown as { raw: DatabaseSync }).raw }
}
