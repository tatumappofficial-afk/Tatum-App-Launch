import { createCollection, localOnlyCollectionOptions } from '@tanstack/db';
import type { Partner, Encounter, PrivateNote, DesireEntry, WhisperMessage, Affirmation } from '@/client/schemas';

// AppState replaces MMKV - stores key-value pairs in SQLite
export interface AppState {
  key: string;
  value: string;
}

export const partnersCollection = createCollection<Partner, string>(
  localOnlyCollectionOptions({ id: 'partners', getKey: (p) => p.id })
);

export const encountersCollection = createCollection<Encounter, string>(
  localOnlyCollectionOptions({ id: 'encounters', getKey: (e) => e.id })
);

export const notesCollection = createCollection<PrivateNote, string>(
  localOnlyCollectionOptions({ id: 'notes', getKey: (n) => n.id })
);

export const desiresCollection = createCollection<DesireEntry, string>(
  localOnlyCollectionOptions({ id: 'desires', getKey: (d) => d.id })
);

export const whispersCollection = createCollection<WhisperMessage, string>(
  localOnlyCollectionOptions({ id: 'whispers', getKey: (w) => w.id })
);

export const affirmationsCollection = createCollection<Affirmation, string>(
  localOnlyCollectionOptions({ id: 'affirmations', getKey: (a) => a.id })
);

export const appStateCollection = createCollection<AppState, string>(
  localOnlyCollectionOptions({ id: 'appState', getKey: (s) => s.key })
);
