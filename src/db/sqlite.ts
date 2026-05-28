import * as SQLite from 'expo-sqlite'

const DB_NAME = 'tatum.db'

/**
 * Forward-only migrations.
 *
 * Each entry creates or modifies schema at a specific `version`. On launch,
 * we read SQLite's `PRAGMA user_version` and run every migration whose
 * version is greater than that value, in order, each wrapped in a transaction.
 *
 * Rules:
 * 1. **Never edit a migration after it ships.** Once users have run it, the
 *    SQL in that entry is part of their database history. To change schema,
 *    add a new migration with a higher version number.
 * 2. **Migrations must be additive.** No dropping columns/tables on data
 *    users care about. `ALTER TABLE … ADD COLUMN` is fine; renames need a
 *    create-new / copy-data / drop-old dance.
 * 3. **Each migration is atomic.** If the SQL throws partway through, the
 *    transaction rolls back and `user_version` doesn't advance, so the same
 *    migration retries cleanly on the next launch.
 *
 * The current setup baseline is migration 1, which creates every table from
 * scratch. This is intentional: pre-launch we wiped the destructive
 * "drop-and-recreate" history. Future schema changes append migration 2,
 * migration 3, etc.
 */
interface Migration {
  version: number
  up: string
}

const MIGRATIONS: Migration[] = [
  {
    version: 1,
    up: `
      CREATE TABLE partners (
        id TEXT PRIMARY KEY NOT NULL,
        displayName TEXT NOT NULL,
        avatarType TEXT NOT NULL DEFAULT 'initials',
        avatarValue TEXT NOT NULL DEFAULT '',
        avatarGradient TEXT NOT NULL DEFAULT '',
        isActive INTEGER NOT NULL DEFAULT 1,
        isMain INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      CREATE TABLE encounters (
        id TEXT PRIMARY KEY NOT NULL,
        date TEXT NOT NULL,
        activities TEXT NOT NULL DEFAULT '[]',
        partnerIds TEXT NOT NULL DEFAULT '[]',
        stars INTEGER,
        notes TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      CREATE TABLE desire_entries (
        id TEXT PRIMARY KEY NOT NULL,
        timestamp TEXT NOT NULL,
        intensity INTEGER,
        body TEXT,
        partnerId TEXT,
        actedOn INTEGER NOT NULL DEFAULT 0,
        linkedEncounterId TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (partnerId) REFERENCES partners(id),
        FOREIGN KEY (linkedEncounterId) REFERENCES encounters(id)
      );

      CREATE TABLE whisper_messages (
        id TEXT PRIMARY KEY NOT NULL,
        partnerId TEXT NOT NULL,
        templateId TEXT,
        customBody TEXT,
        finalMessage TEXT NOT NULL,
        deliveryMethod TEXT NOT NULL DEFAULT 'copy',
        sentAt TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (partnerId) REFERENCES partners(id)
      );

      CREATE TABLE affirmations (
        id TEXT PRIMARY KEY NOT NULL,
        body TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'curated',
        isFavorite INTEGER NOT NULL DEFAULT 0,
        isActive INTEGER NOT NULL DEFAULT 1,
        lastShownAt TEXT,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE user_profile (
        id TEXT PRIMARY KEY NOT NULL,
        displayName TEXT,
        avatarValue TEXT,
        avatarGradient TEXT,
        createdAt TEXT NOT NULL,
        tier TEXT NOT NULL DEFAULT 'free',
        premiumExpiresAt TEXT
      );

      CREATE TABLE activity_tags (
        id TEXT PRIMARY KEY NOT NULL,
        emoji TEXT NOT NULL,
        label TEXT NOT NULL,
        sortOrder INTEGER NOT NULL,
        isDefault INTEGER NOT NULL DEFAULT 1,
        isActive INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE user_settings (
        id TEXT PRIMARY KEY NOT NULL,
        notifications INTEGER NOT NULL DEFAULT 1,
        whisperDeliveryDefault TEXT NOT NULL DEFAULT 'copy',
        calendarStartDay TEXT NOT NULL DEFAULT 'sunday',
        biometricLock INTEGER NOT NULL DEFAULT 0,
        hasOnboarded INTEGER NOT NULL DEFAULT 0,
        theme TEXT NOT NULL DEFAULT 'warm'
      );

      INSERT INTO user_settings
        (id, notifications, whisperDeliveryDefault, calendarStartDay, biometricLock, hasOnboarded, theme)
      VALUES
        ('singleton', 1, 'copy', 'sunday', 0, 0, 'warm');

      CREATE INDEX idx_encounters_date ON encounters(date);
    `,
  },
  {
    version: 2,
    up: `
      ALTER TABLE user_profile ADD COLUMN email TEXT;
      ALTER TABLE user_profile ADD COLUMN authProvider TEXT;
    `,
  },
]

const TARGET_VERSION = MIGRATIONS[MIGRATIONS.length - 1].version

let db: SQLite.SQLiteDatabase | null = null

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db
  db = await SQLite.openDatabaseAsync(DB_NAME)

  // Connection-level PRAGMAs. journal_mode persists in the file; foreign_keys
  // is per-connection and must be set on every open. Both are safe to re-run.
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `)

  await runMigrations(db)
  return db
}

async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
  const versionRows = await database.getAllAsync<{ user_version: number }>('PRAGMA user_version')
  const currentVersion = versionRows[0]?.user_version ?? 0

  console.log(`[db] current user_version=${currentVersion}, target=${TARGET_VERSION}`)

  if (currentVersion >= TARGET_VERSION) {
    if (currentVersion > TARGET_VERSION) {
      // This shouldn't happen in production — it means the DB was created by
      // a newer version of the app, or by the old destructive-bump system in
      // dev. The migration runner can't help here; the dev needs to wipe.
      console.warn(
        `[db] DB version (${currentVersion}) is ahead of code's target (${TARGET_VERSION}). ` +
        `If you're a developer transitioning from the old destructive migration system, ` +
        `you need to fully uninstall the app to wipe the SQLite file.`,
      )
    }
    return
  }

  console.log(`[db] migrating from v${currentVersion} → v${TARGET_VERSION}`)

  for (const migration of MIGRATIONS) {
    if (migration.version <= currentVersion) continue
    console.log(`[db] applying migration v${migration.version}`)
    try {
      await database.withTransactionAsync(async () => {
        await database.execAsync(migration.up)
        // PRAGMA inside the transaction so a SQL failure rolls back both the
        // schema change AND the version bump. Otherwise we'd be stuck at a
        // version we never fully reached.
        await database.execAsync(`PRAGMA user_version = ${migration.version}`)
      })
    } catch (err) {
      console.error(`[db] migration v${migration.version} failed:`, err)
      throw err
    }
  }
}

// ── JSON column helpers ──

export function serializeJsonColumn(value: unknown): string {
  return JSON.stringify(value)
}

export function parseJsonColumn<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try { return JSON.parse(value) } catch { return fallback }
}
