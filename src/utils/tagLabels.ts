import type { ActivityTag, EncounterTagLabel } from '@/src/db/schema'
import { encounterTagLabelId } from '@/src/db/schema'

/**
 * Deterministic label resolution for activity emojis.
 *
 * Sessions store bare emoji strings. The name a session displays comes from
 * one of two places:
 *
 * 1. Its `encounter_tag_labels` snapshot — the label that was current when
 *    the activity was logged (or edited onto the session). This is what keeps
 *    past sessions stable through tag deletes, re-creates, and renames.
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

/** Map keyed by `${encounterId}:${emoji}` for O(1) snapshot lookup. */
export function buildSnapshotMap(snapshots: EncounterTagLabel[]): Map<string, string> {
  return new Map(snapshots.map((s) => [s.id, s.label]))
}

/**
 * Label for one activity on one session: its log-time snapshot when recorded,
 * else the emoji's current label (pre-snapshot legacy sessions).
 */
export function sessionTagLabel(
  encounterId: string,
  emoji: string,
  snapshotMap: Map<string, string>,
  tags: ActivityTag[],
): string {
  return snapshotMap.get(encounterTagLabelId(encounterId, emoji)) ?? currentTagLabel(emoji, tags)
}
