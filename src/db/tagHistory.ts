import { activityTags, encounterTagLabels } from './collections'
import { encounterTagLabelId } from './schema'
import { currentTagLabel } from '@/src/utils/tagLabels'

/**
 * Tag-name history writes. Everything that creates, edits, or deletes the
 * things history depends on funnels through here so the invariants live in
 * one place:
 *
 *   - every session activity gets a label snapshot at write time
 *   - every soft-deleted tag row records WHEN it stopped being current
 *
 * See src/utils/tagLabels.ts for how these are read back.
 */

/**
 * Bring an encounter's label snapshots in line with its activities array.
 * Diff-based on purpose:
 *   - emojis already snapshotted keep their existing (older) label — editing
 *     a session's notes/rating/date/partners never re-labels its activities
 *   - newly added emojis snapshot the label the picker showed just now
 *   - removed emojis drop their snapshot
 *
 * Runs after the encounter write. The two writes aren't atomic; if this half
 * is lost (crash between them) the session just falls back to the current
 * label until the next edit — same rendering as pre-snapshot legacy sessions.
 */
export function syncEncounterTagSnapshots(encounterId: string, emojis: string[]) {
  const tags = activityTags.toArray
  const desired = new Set(emojis)

  const existing = new Map<string, string>() // emoji -> row id
  for (const row of encounterTagLabels.values()) {
    if (row.encounterId === encounterId) existing.set(row.emoji, row.id)
  }

  for (const [emoji, rowId] of existing) {
    if (!desired.has(emoji)) encounterTagLabels.delete(rowId)
  }
  for (const emoji of desired) {
    if (existing.has(emoji)) continue
    encounterTagLabels.insert({
      id: encounterTagLabelId(encounterId, emoji),
      encounterId,
      emoji,
      label: currentTagLabel(emoji, tags),
    })
  }
}

/** Drop all label snapshots for a deleted encounter. */
export function removeEncounterTagSnapshots(encounterId: string) {
  for (const row of [...encounterTagLabels.values()]) {
    if (row.encounterId === encounterId) encounterTagLabels.delete(row.id)
  }
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
