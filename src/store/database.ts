import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('tatum.db');
  await runMigrations(db);
  return db;
}

async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS partners (
      id TEXT PRIMARY KEY,
      displayName TEXT NOT NULL,
      avatarType TEXT NOT NULL DEFAULT 'initials',
      avatarValue TEXT NOT NULL DEFAULT '',
      avatarGradient0 TEXT NOT NULL DEFAULT '#C07858',
      avatarGradient1 TEXT NOT NULL DEFAULT '#7C4A5A',
      isActive INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS encounters (
      id TEXT PRIMARY KEY,
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
      id TEXT PRIMARY KEY,
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
      id TEXT PRIMARY KEY,
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
      id TEXT PRIMARY KEY,
      partnerId TEXT NOT NULL,
      templateId TEXT,
      customBody TEXT,
      finalMessage TEXT NOT NULL,
      deliveryMethod TEXT NOT NULL DEFAULT 'sms',
      sentAt TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (partnerId) REFERENCES partners(id)
    );

    CREATE TABLE IF NOT EXISTS affirmations (
      id TEXT PRIMARY KEY,
      body TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'curated',
      isFavorite INTEGER NOT NULL DEFAULT 0,
      isActive INTEGER NOT NULL DEFAULT 1,
      lastShownAt TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_encounters_date ON encounters(date);
    CREATE INDEX IF NOT EXISTS idx_encounters_partnerId ON encounters(partnerId);
    CREATE INDEX IF NOT EXISTS idx_desire_entries_timestamp ON desire_entries(timestamp);
    CREATE INDEX IF NOT EXISTS idx_whisper_messages_partnerId ON whisper_messages(partnerId);
  `);
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}
