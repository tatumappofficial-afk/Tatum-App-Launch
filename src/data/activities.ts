import type { ActivityEmoji } from '@/client/schemas';

export const ACTIVITIES: ActivityEmoji[] = [
  { code: '🍆', label: 'Intercourse', category: 'sexual' },
  { code: '✋', label: 'Hand', category: 'sexual' },
  { code: '👉', label: 'Fingering', category: 'sexual' },
  { code: '💋', label: 'Oral (received)', category: 'sexual' },
  { code: '🌬️', label: 'Oral (given)', category: 'sexual' },
  { code: '😘', label: 'Kiss', category: 'intimate' },
  { code: '🍑', label: 'Anal', category: 'sexual' },
  { code: '✨', label: 'Solo', category: 'sexual' },
  { code: '🌙', label: 'Cuddle', category: 'intimate' },
  { code: '🩷', label: 'First I Love You', category: 'milestone' },
  { code: '🩸', label: 'Period Start', category: 'cycle' },
];

export const ACTIVITY_MAP = new Map(ACTIVITIES.map((a) => [a.code, a]));

export function getActivityLabel(code: string): string {
  return ACTIVITY_MAP.get(code)?.label ?? code;
}
