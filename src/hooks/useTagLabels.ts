import { useCallback, useMemo } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { activityTags, encounterTagLabels } from '@/src/db'
import { buildSnapshotMap, currentTagLabel, sessionTagLabel } from '@/src/utils/tagLabels'

/**
 * Live tag-label resolvers (see src/utils/tagLabels.ts for the rules):
 *
 *   sessionLabel(encounterId, emoji) — what one session displays for one of
 *     its activities: the log-time snapshot, else the current label.
 *   currentLabel(emoji) — the emoji's current name, for surfaces not tied to
 *     a single session (aggregates, pickers).
 */
export function useTagLabels() {
  const { data: tags = [] } = useLiveQuery((q) =>
    q.from({ activityTags }).select(({ activityTags }) => ({ ...activityTags })),
  )
  const { data: snapshots = [] } = useLiveQuery((q) =>
    q.from({ encounterTagLabels }).select(({ encounterTagLabels }) => ({ ...encounterTagLabels })),
  )

  const snapshotMap = useMemo(() => buildSnapshotMap(snapshots), [snapshots])

  const sessionLabel = useCallback(
    (encounterId: string, emoji: string) => sessionTagLabel(encounterId, emoji, snapshotMap, tags),
    [snapshotMap, tags],
  )
  const currentLabel = useCallback((emoji: string) => currentTagLabel(emoji, tags), [tags])

  return { sessionLabel, currentLabel }
}
