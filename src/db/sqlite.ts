import * as SQLite from 'expo-sqlite'

const DB_NAME = 'tatum.db'

// Bump this number whenever the schema changes to force a fresh database.
// Since this is a pre-release app, we simply drop and recreate rather than migrate.
const SCHEMA_VERSION = 5

let db: SQLite.SQLiteDatabase | null = null

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db
  db = await SQLite.openDatabaseAsync(DB_NAME)

  // Check schema version — drop all tables if stale
  const versionRows = await db.getAllAsync<{ user_version: number }>('PRAGMA user_version')
  const currentVersion = versionRows[0]?.user_version ?? 0
  if (currentVersion < SCHEMA_VERSION) {
    console.log(`Schema version ${currentVersion} → ${SCHEMA_VERSION}, recreating tables…`)
    await db.execAsync(`
      DROP TABLE IF EXISTS whisper_messages;
      DROP TABLE IF EXISTS desire_entries;
      DROP TABLE IF EXISTS encounters;
      DROP TABLE IF EXISTS partners;
      DROP TABLE IF EXISTS affirmations;
      DROP TABLE IF EXISTS activity_tags;
      DROP TABLE IF EXISTS user_settings;
      DROP TABLE IF EXISTS user_profile;
      DROP TABLE IF EXISTS private_notes;
    `)
    await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`)
  }

  await initializeTables(db)
  return db
}

async function initializeTables(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS partners (
      id TEXT PRIMARY KEY NOT NULL,
      displayName TEXT NOT NULL,
      avatarType TEXT NOT NULL DEFAULT 'initials',
      avatarValue TEXT NOT NULL DEFAULT '',
      avatarGradient TEXT NOT NULL DEFAULT '',
      isActive INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS encounters (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT NOT NULL,
      activities TEXT NOT NULL DEFAULT '[]',
      partnerIds TEXT NOT NULL DEFAULT '[]',
      stars INTEGER,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS desire_entries (
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

    CREATE TABLE IF NOT EXISTS whisper_messages (
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

    CREATE TABLE IF NOT EXISTS affirmations (
      id TEXT PRIMARY KEY NOT NULL,
      body TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'curated',
      isFavorite INTEGER NOT NULL DEFAULT 0,
      isActive INTEGER NOT NULL DEFAULT 1,
      lastShownAt TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY NOT NULL,
      displayName TEXT,
      createdAt TEXT NOT NULL,
      tier TEXT NOT NULL DEFAULT 'free',
      premiumExpiresAt TEXT
    );

    CREATE TABLE IF NOT EXISTS activity_tags (
      id TEXT PRIMARY KEY NOT NULL,
      emoji TEXT NOT NULL,
      label TEXT NOT NULL,
      sortOrder INTEGER NOT NULL,
      isDefault INTEGER NOT NULL DEFAULT 1,
      isActive INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS user_settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_encounters_date ON encounters(date);
  `)
}

// ── JSON column helpers ──

export function serializeJsonColumn(value: unknown): string {
  return JSON.stringify(value)
}

export function parseJsonColumn<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try { return JSON.parse(value) } catch { return fallback }
}
