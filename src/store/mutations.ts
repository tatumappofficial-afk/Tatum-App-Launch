import {
  partnersCollection, encountersCollection, notesCollection,
  desiresCollection, whispersCollection, appStateCollection,
} from './collections';
import {
  sqlInsertPartner, sqlUpdatePartner, sqlInsertEncounter, sqlUpdateEncounter,
  sqlDeleteRow, sqlInsertNote, sqlInsertDesire, sqlUpdateDesire,
  sqlInsertWhisper, sqlSetAppState,
} from './persistence';
import { partnerGradients } from '@/lib/theme';
import { generateId, nowISO } from '@/src/utils/id';
import type { Partner, Encounter, PrivateNote, DesireEntry, WhisperMessage, UserProfile, UserSettings } from '@/client/schemas';

// --- Encounters ---

export async function insertEncounter(data: {
  date: string;
  activities: string[];
  partnerId?: string | null;
  rating?: 'up' | 'down' | null;
  stars?: number | null;
  vibes?: string[];
  noteId?: string | null;
}): Promise<Encounter> {
  const now = nowISO();
  const encounter: Encounter = {
    id: generateId(),
    date: data.date,
    activities: data.activities,
    partnerId: data.partnerId ?? null,
    rating: data.rating ?? null,
    stars: data.stars ?? null,
    vibes: (data.vibes ?? []) as Encounter['vibes'],
    noteId: data.noteId ?? null,
    createdAt: now,
    updatedAt: now,
  };
  encountersCollection.insert(encounter);
  await sqlInsertEncounter(encounter);
  return encounter;
}

export async function updateEncounter(id: string, data: Partial<Omit<Encounter, 'id' | 'createdAt'>>): Promise<void> {
  encountersCollection.update(id, (draft) => {
    Object.assign(draft, data, { updatedAt: nowISO() });
  });
  const updated = encountersCollection.get(id);
  if (updated) await sqlUpdateEncounter(updated as Encounter);
}

export async function removeEncounter(id: string): Promise<void> {
  encountersCollection.delete(id);
  await sqlDeleteRow('encounters', id);
}

// --- Partners ---

export async function insertPartner(data: {
  displayName: string;
  avatarType?: 'initials' | 'emoji' | 'color';
  avatarValue?: string;
  avatarGradient?: [string, string];
}): Promise<Partner> {
  const now = nowISO();
  const activeCount = [...partnersCollection.values()].filter((p: any) => p.isActive).length;
  const gradient = data.avatarGradient ?? partnerGradients[activeCount % partnerGradients.length];
  const avatarValue = data.avatarValue || data.displayName.slice(0, 2).toUpperCase();
  const partner: Partner = {
    id: generateId(),
    displayName: data.displayName,
    avatarType: data.avatarType ?? 'initials',
    avatarValue,
    avatarGradient: gradient,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  partnersCollection.insert(partner);
  await sqlInsertPartner(partner);
  return partner;
}

export async function updatePartner(id: string, data: Partial<Pick<Partner, 'displayName' | 'avatarType' | 'avatarValue' | 'avatarGradient'>>): Promise<void> {
  partnersCollection.update(id, (draft) => {
    if (data.displayName !== undefined) draft.displayName = data.displayName;
    if (data.avatarType !== undefined) draft.avatarType = data.avatarType;
    if (data.avatarValue !== undefined) draft.avatarValue = data.avatarValue;
    if (data.avatarGradient !== undefined) draft.avatarGradient = data.avatarGradient;
    draft.updatedAt = nowISO();
  });
  const updated = partnersCollection.get(id);
  if (updated) await sqlUpdatePartner(updated as Partner);
}

export async function archivePartner(id: string): Promise<void> {
  partnersCollection.update(id, (draft) => {
    draft.isActive = false;
    draft.updatedAt = nowISO();
  });
  const updated = partnersCollection.get(id);
  if (updated) await sqlUpdatePartner(updated as Partner);
}

// --- Notes ---

export async function insertNote(data: {
  body: string;
  encounterId?: string | null;
  partnerId?: string | null;
  emojiTags?: string[];
}): Promise<PrivateNote> {
  const now = nowISO();
  const note: PrivateNote = {
    id: generateId(),
    encounterId: data.encounterId ?? null,
    partnerId: data.partnerId ?? null,
    body: data.body,
    emojiTags: data.emojiTags ?? [],
    createdAt: now,
    updatedAt: now,
  };
  notesCollection.insert(note);
  await sqlInsertNote(note);
  return note;
}

export async function removeNote(id: string): Promise<void> {
  notesCollection.delete(id);
  await sqlDeleteRow('private_notes', id);
}

// --- Desires ---

export async function insertDesireEntry(data: {
  intensity?: number | null;
  body?: string | null;
  partnerId?: string | null;
}): Promise<DesireEntry> {
  const now = nowISO();
  const entry: DesireEntry = {
    id: generateId(),
    timestamp: now,
    intensity: data.intensity ?? null,
    body: data.body ?? null,
    partnerId: data.partnerId ?? null,
    actedOn: false,
    linkedEncounterId: null,
    createdAt: now,
  };
  desiresCollection.insert(entry);
  await sqlInsertDesire(entry);
  return entry;
}

export async function markDesireActedOn(id: string, encounterId: string): Promise<void> {
  desiresCollection.update(id, (draft) => {
    draft.actedOn = true;
    draft.linkedEncounterId = encounterId;
  });
  await sqlUpdateDesire(id, true, encounterId);
}

export async function removeDesireEntry(id: string): Promise<void> {
  desiresCollection.delete(id);
  await sqlDeleteRow('desire_entries', id);
}

// --- Whispers ---

export async function insertWhisperMessage(data: {
  partnerId: string;
  templateId?: string | null;
  customBody?: string | null;
  finalMessage: string;
  deliveryMethod: 'sms' | 'in-app' | 'copy';
}): Promise<WhisperMessage> {
  const now = nowISO();
  const msg: WhisperMessage = {
    id: generateId(),
    partnerId: data.partnerId,
    templateId: data.templateId ?? null,
    customBody: data.customBody ?? null,
    finalMessage: data.finalMessage,
    deliveryMethod: data.deliveryMethod,
    sentAt: now,
    createdAt: now,
  };
  whispersCollection.insert(msg);
  await sqlInsertWhisper(msg);
  return msg;
}

// --- App State ---

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
  const raw = appStateCollection.get('user_profile');
  const current: UserProfile = raw ? JSON.parse(raw.value) : {};
  const updated = { ...current, ...updates };
  const value = JSON.stringify(updated);
  if (appStateCollection.has('user_profile')) {
    appStateCollection.update('user_profile', (draft) => { draft.value = value; });
  } else {
    appStateCollection.insert({ key: 'user_profile', value });
  }
  await sqlSetAppState('user_profile', value);
}

export async function updateUserSettings(updates: Partial<UserSettings>): Promise<void> {
  const raw = appStateCollection.get('user_profile');
  const current: UserProfile = raw ? JSON.parse(raw.value) : {};
  const updated = { ...current, settings: { ...current.settings, ...updates } };
  const value = JSON.stringify(updated);
  appStateCollection.update('user_profile', (draft) => { draft.value = value; });
  await sqlSetAppState('user_profile', value);
}

export async function markMilestoneShown(key: string): Promise<void> {
  const raw = appStateCollection.get('shown_milestones');
  const milestones: string[] = raw ? JSON.parse(raw.value) : [];
  if (!milestones.includes(key)) milestones.push(key);
  const value = JSON.stringify(milestones);
  if (appStateCollection.has('shown_milestones')) {
    appStateCollection.update('shown_milestones', (draft) => { draft.value = value; });
  } else {
    appStateCollection.insert({ key: 'shown_milestones', value });
  }
  await sqlSetAppState('shown_milestones', value);
}

export async function setLastAffirmation(date: string, id: string): Promise<void> {
  const value = JSON.stringify({ date, id });
  if (appStateCollection.has('last_affirmation')) {
    appStateCollection.update('last_affirmation', (draft) => { draft.value = value; });
  } else {
    appStateCollection.insert({ key: 'last_affirmation', value });
  }
  await sqlSetAppState('last_affirmation', value);
}

export async function setOnboardingComplete(): Promise<void> {
  const value = 'true';
  if (appStateCollection.has('onboarding_complete')) {
    appStateCollection.update('onboarding_complete', (draft) => { draft.value = value; });
  } else {
    appStateCollection.insert({ key: 'onboarding_complete', value });
  }
  await sqlSetAppState('onboarding_complete', value);
}
