import { useCallback } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { activityTags } from '@/src/db'
import type { Encounter } from '@/src/db/schema'
import { currentTagLabel, sessionTagLabel } from '@/src/utils/tagLabels'

/**
 * Live tag-label resolvers (see src/utils/tagLabels.ts for the rules):
 *
 *   sessionLabel(encounter, emoji) — what one session displays for one of
 *     its activities: the log-time snapshot on the row, else the current label.
 *   currentLabel(emoji) — the emoji's current name, for surfaces not tied to
 *     a single session (aggregates, pickers).
 */
export function useTagLabels() {
  const { data: tags = [] } = useLiveQuery((q) =>
    q.from({ activityTags }).select(({ activityTags }) => ({ ...activityTags })),
  )

  const sessionLabel = useCallback(
    (encounter: Encounter, emoji: string) => sessionTagLabel(encounter, emoji, tags),
    [tags],
  )
  const currentLabel = useCallback((emoji: string) => currentTagLabel(emoji, tags), [tags])

  return { sessionLabel, currentLabel }
}
