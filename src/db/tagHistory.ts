import type { ActivityTag } from './schema'
import { activityTags } from './collections'
import { findCurrentTagLabel } from '@/src/utils/tagLabels'

/**
 * Tag-name history writes.
 *
 * Every session write records the label each activity has at that moment in
 * `encounter.activityLabels` (same row, same write — nothing to keep in sync,
 * nothing to orphan). `buildActivityLabels` computes that map; the caller
 * stores it in the same insert/update as the activities array.
 *
 * Every tag soft-delete stamps `deactivatedAt` via `deactivateTag`, which
 * keeps label resolution deterministic for sessions that predate snapshotting
 * (see src/utils/tagLabels.ts).
 */

/**
 * Labels map for a session's activities. Diff-based on purpose:
 *   - emojis already in `previousLabels` keep their existing (older) label —
 *     editing a session's notes/rating/date/partners never re-labels
 *     activities that already have snapshots
 *   - newly added emojis record the label the picker showed just now
 *   - removed emojis drop out (only current activities are kept)
 *   - emojis with NO tag row at all are left out of the map (never freeze a
 *     bare glyph as a "label"; the live fallback keeps working, including
 *     when a tag is later re-created for that emoji)
 *
 * `tags` comes from the caller's live query so this stays synchronous and
 * can be computed inside the same collection write as the session itself.
 *
 * Legacy sessions (pre-snapshot, empty previousLabels) get their activities
 * pinned at the current labels on their first edit — deliberate: their
 * log-time names are unrecoverable, and pinning at first touch is the
 * earliest possible stop to the "renames rewrite history" behavior they
 * otherwise keep exhibiting via the live fallback.
 */
export function buildActivityLabels(
  activities: string[],
  previousLabels: Record<string, string>,
  tags: ActivityTag[],
): Record<string, string> {
  const labels: Record<string, string> = {}
  for (const emoji of activities) {
    const label = previousLabels[emoji] ?? findCurrentTagLabel(emoji, tags)
    if (label != null) labels[emoji] = label
  }
  return labels
}

/**
 * Soft-delete a tag. The single place that flips isActive off, so the
 * deactivatedAt stamp (which keeps legacy-fallback label resolution
 * deterministic) can't be forgotten by one of the delete surfaces.
 */
export function deactivateTag(tagId: string) {
  activityTags.update(tagId, (draft) => {
    draft.isActive = false
    draft.deactivatedAt = new Date().toISOString()
  })
}
