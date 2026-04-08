import * as SQLite from 'expo-sqlite';
import type { Partner, Encounter, PrivateNote, DesireEntry, WhisperMessage, Affirmation } from '@/client/schemas';
import {
  partnersCollection, encountersCollection, notesCollection,
  desiresCollection, whispersCollection, affirmationsCollection,
  appStateCollection, type AppState,
} from './collections';

let _db: SQLite.SQLiteDatabase | null = null;

export function setDb(db: SQLite.SQLiteDatabase) { _db = db; }
export function getDb(): SQLite.SQLiteDatabase {
  if (!_db) throw new Error('Database not initialized');
  return _db;
}

// --- Row converters ---

function rowToPartner(row: any): Partner {
  return {
    id: row.id,
    displayName: row.displayName,
    avatarType: row.avatarType,
    avatarValue: row.avatarValue,
    avatarGradient: [row.avatarGradient0, row.avatarGradient1],
    isActive: Boolean(row.isActive),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function rowToEncounter(row: any): Encounter {
  return {
    id: row.id,
    date: row.date,
    activities: JSON.parse(row.activities),
    partnerId: row.partnerId,
    rating: row.rating,
    stars: row.stars,
    vibes: JSON.parse(row.vibes),
    noteId: row.noteId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function rowToNote(row: any): PrivateNote {
  return {
    id: row.id,
    encounterId: row.encounterId,
    partnerId: row.partnerId,
    body: row.body,
    emojiTags: JSON.parse(row.emojiTags),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function rowToDesire(row: any): DesireEntry {
  return {
    id: row.id,
    timestamp: row.timestamp,
    intensity: row.intensity,
    body: row.body,
    partnerId: row.partnerId,
    actedOn: Boolean(row.actedOn),
    linkedEncounterId: row.linkedEncounterId,
    createdAt: row.createdAt,
  };
}

function rowToWhisper(row: any): WhisperMessage {
  return {
    id: row.id,
    partnerId: row.partnerId,
    templateId: row.templateId,
    customBody: row.customBody,
    finalMessage: row.finalMessage,
    deliveryMethod: row.deliveryMethod,
    sentAt: row.sentAt,
    createdAt: row.createdAt,
  };
}

function rowToAffirmation(row: any): Affirmation {
  return {
    id: row.id,
    body: row.body,
    source: row.source,
    isFavorite: Boolean(row.isFavorite),
    isActive: Boolean(row.isActive),
    lastShownAt: row.lastShownAt,
    createdAt: row.createdAt,
  };
}

// --- Hydration ---

export async function hydrateCollections(db: SQLite.SQLiteDatabase): Promise<void> {
  setDb(db);

  const [partners, encounters, notes, desires, whispers, affirmations, appState] = await Promise.all([
    db.getAllAsync('SELECT * FROM partners'),
    db.getAllAsync('SELECT * FROM encounters'),
    db.getAllAsync('SELECT * FROM private_notes'),
    db.getAllAsync('SELECT * FROM desire_entries'),
    db.getAllAsync('SELECT * FROM whisper_messages'),
    db.getAllAsync('SELECT * FROM affirmations'),
    db.getAllAsync('SELECT * FROM app_state'),
  ]);

  partners.forEach((row: any) => partnersCollection.insert(rowToPartner(row)));
  encounters.forEach((row: any) => encountersCollection.insert(rowToEncounter(row)));
  notes.forEach((row: any) => notesCollection.insert(rowToNote(row)));
  desires.forEach((row: any) => desiresCollection.insert(rowToDesire(row)));
  whispers.forEach((row: any) => whispersCollection.insert(rowToWhisper(row)));
  affirmations.forEach((row: any) => affirmationsCollection.insert(rowToAffirmation(row)));
  appState.forEach((row: any) => appStateCollection.insert({ key: row.key, value: row.value }));

  // Ensure default user profile exists
  if (!appStateCollection.has('user_profile')) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const now = new Date().toISOString();
    const defaultProfile = {
      id,
      displayName: null,
      createdAt: now,
      tier: 'free',
      premiumExpiresAt: null,
      settings: {
        notifications: false,
        whisperDeliveryDefault: 'sms',
        calendarStartDay: 'sunday',
        biometricLock: false,
        theme: 'warm',
      },
    };
    appStateCollection.insert({ key: 'user_profile', value: JSON.stringify(defaultProfile) });
    await db.runAsync('INSERT OR REPLACE INTO app_state (key, value) VALUES (?, ?)', 'user_profile', JSON.stringify(defaultProfile));
  }

  if (!appStateCollection.has('shown_milestones')) {
    appStateCollection.insert({ key: 'shown_milestones', value: '[]' });
    await db.runAsync('INSERT OR REPLACE INTO app_state (key, value) VALUES (?, ?)', 'shown_milestones', '[]');
  }
}

// --- Write-through helpers ---

export async function sqlInsertPartner(p: Partner): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO partners (id, displayName, avatarType, avatarValue, avatarGradient0, avatarGradient1, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    p.id, p.displayName, p.avatarType, p.avatarValue, p.avatarGradient[0], p.avatarGradient[1], p.isActive ? 1 : 0, p.createdAt, p.updatedAt
  );
}

export async function sqlUpdatePartner(p: Partner): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `UPDATE partners SET displayName=?, avatarType=?, avatarValue=?, avatarGradient0=?, avatarGradient1=?, isActive=?, updatedAt=? WHERE id=?`,
    p.displayName, p.avatarType, p.avatarValue, p.avatarGradient[0], p.avatarGradient[1], p.isActive ? 1 : 0, p.updatedAt, p.id
  );
}

export async function sqlInsertEncounter(e: Encounter): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO encounters (id, date, activities, partnerId, rating, stars, vibes, noteId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    e.id, e.date, JSON.stringify(e.activities), e.partnerId, e.rating, e.stars, JSON.stringify(e.vibes), e.noteId, e.createdAt, e.updatedAt
  );
}

export async function sqlUpdateEncounter(e: Encounter): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `UPDATE encounters SET date=?, activities=?, partnerId=?, rating=?, stars=?, vibes=?, noteId=?, updatedAt=? WHERE id=?`,
    e.date, JSON.stringify(e.activities), e.partnerId, e.rating, e.stars, JSON.stringify(e.vibes), e.noteId, e.updatedAt, e.id
  );
}

export async function sqlDeleteRow(table: string, id: string): Promise<void> {
  const db = getDb();
  await db.runAsync(`DELETE FROM ${table} WHERE id = ?`, id);
}

export async function sqlInsertNote(n: PrivateNote): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO private_notes (id, encounterId, partnerId, body, emojiTags, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    n.id, n.encounterId, n.partnerId, n.body, JSON.stringify(n.emojiTags), n.createdAt, n.updatedAt
  );
}

export async function sqlInsertDesire(d: DesireEntry): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO desire_entries (id, timestamp, intensity, body, partnerId, actedOn, linkedEncounterId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    d.id, d.timestamp, d.intensity, d.body, d.partnerId, d.actedOn ? 1 : 0, d.linkedEncounterId, d.createdAt
  );
}

export async function sqlUpdateDesire(id: string, actedOn: boolean, linkedEncounterId: string | null): Promise<void> {
  const db = getDb();
  await db.runAsync('UPDATE desire_entries SET actedOn=?, linkedEncounterId=? WHERE id=?', actedOn ? 1 : 0, linkedEncounterId, id);
}

export async function sqlInsertWhisper(w: WhisperMessage): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO whisper_messages (id, partnerId, templateId, customBody, finalMessage, deliveryMethod, sentAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    w.id, w.partnerId, w.templateId, w.customBody, w.finalMessage, w.deliveryMethod, w.sentAt, w.createdAt
  );
}

export async function sqlSetAppState(key: string, value: string): Promise<void> {
  const db = getDb();
  await db.runAsync('INSERT OR REPLACE INTO app_state (key, value) VALUES (?, ?)', key, value);
}
