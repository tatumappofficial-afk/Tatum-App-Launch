import type { ActivityTag, Encounter } from '@/src/db/schema'

/**
 * Deterministic label resolution for activity emojis.
 *
 * Sessions store bare emoji strings plus an `activityLabels` snapshot map —
 * the label each activity had when it was logged (or edited onto the
 * session). The name a session displays comes from one of two places:
 *
 * 1. Its own `activityLabels[emoji]` snapshot. This is what keeps past
 *    sessions stable through tag deletes, re-creates, and renames.
 * 2. Failing that (sessions logged before snapshotting existed, or aggregate
 *    surfaces like Top Activities that aren't tied to one session): the
 *    emoji's *current* label via `currentTagLabel`.
 *
 * `currentTagLabel` must be deterministic even with duplicate-emoji rows:
 * soft-deleted tags keep their rows, and older seeds shipped two ACTIVE
 * default tags sharing an emoji (e.g. Manual and Fingering both 👉). Rules:
 *   - an active tag wins; among several, lowest sortOrder (mirrors the
 *     quick-log chip dedupe in calendar.tsx)
 *   - else the most recently deactivated tag ("most recently current" name);
 *     missing deactivatedAt sorts last, ties fall back to sortOrder
 *   - else the emoji itself
 */
export function currentTagLabel(emoji: string, tags: ActivityTag[]): string {
  let best: ActivityTag | null = null
  for (const t of tags) {
    if (t.emoji !== emoji) continue
    if (!best) {
      best = t
      continue
    }
    if (t.isActive !== best.isActive) {
      if (t.isActive) best = t
      continue
    }
    if (t.isActive) {
      if (t.sortOrder < best.sortOrder) best = t
    } else {
      const a = t.deactivatedAt ?? ''
      const b = best.deactivatedAt ?? ''
      if (a > b || (a === b && t.sortOrder < best.sortOrder)) best = t
    }
  }
  return best ? best.label : emoji
}

/**
 * Label for one activity on one session: its log-time snapshot when recorded,
 * else the emoji's current label (pre-snapshot legacy sessions).
 */
export function sessionTagLabel(encounter: Encounter, emoji: string, tags: ActivityTag[]): string {
  return encounter.activityLabels[emoji] ?? currentTagLabel(emoji, tags)
}
