import * as SQLite from 'expo-sqlite'

const DB_NAME = 'tatum.db'

let db: SQLite.SQLiteDatabase | null = null

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db
  db = await SQLite.openDatabaseAsync(DB_NAME)
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
      partnerId TEXT,
      rating TEXT,
      stars INTEGER,
      vibes TEXT NOT NULL DEFAULT '[]',
      noteId TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (partnerId) REFERENCES partners(id)
    );

    CREATE TABLE IF NOT EXISTS private_notes (
      id TEXT PRIMARY KEY NOT NULL,
      encounterId TEXT,
      partnerId TEXT,
      body TEXT NOT NULL DEFAULT '',
      emojiTags TEXT NOT NULL DEFAULT '[]',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (encounterId) REFERENCES encounters(id),
      FOREIGN KEY (partnerId) REFERENCES partners(id)
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

    CREATE TABLE IF NOT EXISTS user_settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_encounters_date ON encounters(date);
    CREATE INDEX IF NOT EXISTS idx_encounters_partnerId ON encounters(partnerId);
    CREATE INDEX IF NOT EXISTS idx_private_notes_encounterId ON private_notes(encounterId);
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
