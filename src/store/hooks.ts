import { useLiveQuery } from '@tanstack/react-db';
import { eq, and, gte, lt, lte } from '@tanstack/db';
import {
  encountersCollection, partnersCollection, notesCollection,
  desiresCollection, whispersCollection, appStateCollection,
} from './collections';
import type { Partner, Encounter, DesireEntry, WhisperMessage, UserProfile } from '@/client/schemas';
import { nowISO } from '@/src/utils/id';

// --- Encounters ---

export function useEncountersByMonth(year: number, month: number) {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;
  const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

  const { data } = useLiveQuery(
    (q) => q.from({ e: encountersCollection })
      .where(({ e }) => and(gte(e.date, startDate), lt(e.date, endDate)))
      .select(({ e }) => ({
        id: e.id, date: e.date, activities: e.activities, partnerId: e.partnerId,
        rating: e.rating, stars: e.stars, vibes: e.vibes, noteId: e.noteId,
        createdAt: e.createdAt, updatedAt: e.updatedAt,
      })),
    [year, month]
  );
  return (data ?? []) as Encounter[];
}

export function useEncountersByDateRange(start: string, end: string) {
  const { data } = useLiveQuery(
    (q) => q.from({ e: encountersCollection })
      .where(({ e }) => and(gte(e.date, start), lte(e.date, end)))
      .select(({ e }) => ({
        id: e.id, date: e.date, activities: e.activities, partnerId: e.partnerId,
        rating: e.rating, stars: e.stars, vibes: e.vibes, noteId: e.noteId,
        createdAt: e.createdAt, updatedAt: e.updatedAt,
      })),
    [start, end]
  );
  return (data ?? []) as Encounter[];
}

export function useEncounterById(id: string | undefined) {
  const { data } = useLiveQuery(
    (q) => id
      ? q.from({ e: encountersCollection }).where(({ e }) => eq(e.id, id)).findOne()
      : null,
    [id]
  );
  return data as Encounter | undefined;
}

export function useEncountersByPartnerId(partnerId: string | undefined) {
  const { data } = useLiveQuery(
    (q) => partnerId
      ? q.from({ e: encountersCollection }).where(({ e }) => eq(e.partnerId, partnerId))
      : null,
    [partnerId]
  );
  return (data ?? []) as Encounter[];
}

export function useEncountersCount(): number {
  return encountersCollection.size;
}

// --- Partners ---

export function useActivePartners(): Partner[] {
  const { data } = useLiveQuery(
    (q) => q.from({ p: partnersCollection })
      .where(({ p }) => eq(p.isActive, true))
      .select(({ p }) => ({
        id: p.id, displayName: p.displayName, avatarType: p.avatarType,
        avatarValue: p.avatarValue, avatarGradient: p.avatarGradient,
        isActive: p.isActive, createdAt: p.createdAt, updatedAt: p.updatedAt,
      }))
  );
  return (data ?? []) as Partner[];
}

export function usePartnerById(id: string | null | undefined): Partner | undefined {
  const { data } = useLiveQuery(
    (q) => id
      ? q.from({ p: partnersCollection }).where(({ p }) => eq(p.id, id)).findOne()
      : null,
    [id]
  );
  return data as Partner | undefined;
}

export function usePartnerMap(): Map<string, Partner> {
  const { data } = useLiveQuery(
    (q) => q.from({ p: partnersCollection })
  );
  const map = new Map<string, Partner>();
  (data ?? []).forEach((p: any) => map.set(p.id, p as Partner));
  return map;
}

// --- Desires ---

export function useRecentDesires(limit: number = 30): DesireEntry[] {
  const { data } = useLiveQuery(
    (q) => q.from({ d: desiresCollection }),
    [limit]
  );
  // Sort in JS since TanStack DB local collections may not support orderBy + limit
  const sorted = [...(data ?? [])].sort((a: any, b: any) => b.timestamp.localeCompare(a.timestamp));
  return sorted.slice(0, limit) as DesireEntry[];
}

// --- Whispers ---

export function useWhisperHistory(limit: number = 50): WhisperMessage[] {
  const { data } = useLiveQuery(
    (q) => q.from({ w: whispersCollection })
  );
  const sorted = [...(data ?? [])].sort((a: any, b: any) => b.sentAt.localeCompare(a.sentAt));
  return sorted.slice(0, limit) as WhisperMessage[];
}

// --- App State ---

export function useUserProfile(): UserProfile {
  const { data } = useLiveQuery(
    (q) => q.from({ s: appStateCollection }).where(({ s }) => eq(s.key, 'user_profile')).findOne()
  );
  if (data && (data as any).value) {
    return JSON.parse((data as any).value);
  }
  // Default
  return {
    id: '', displayName: null, createdAt: nowISO(), tier: 'free', premiumExpiresAt: null,
    settings: { notifications: false, whisperDeliveryDefault: 'sms', calendarStartDay: 'sunday', biometricLock: false, theme: 'warm' },
  };
}

export function useShownMilestones(): Set<string> {
  const { data } = useLiveQuery(
    (q) => q.from({ s: appStateCollection }).where(({ s }) => eq(s.key, 'shown_milestones')).findOne()
  );
  if (data && (data as any).value) {
    return new Set(JSON.parse((data as any).value));
  }
  return new Set();
}

export function useLastAffirmation(): { date: string | null; id: string | null } {
  const { data } = useLiveQuery(
    (q) => q.from({ s: appStateCollection }).where(({ s }) => eq(s.key, 'last_affirmation')).findOne()
  );
  if (data && (data as any).value) {
    return JSON.parse((data as any).value);
  }
  return { date: null, id: null };
}
