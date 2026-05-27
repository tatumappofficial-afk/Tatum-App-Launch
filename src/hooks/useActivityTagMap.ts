import { useMemo } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { activityTags } from '@/src/db'

export function useActivityTagMap(): Map<string, string> {
  const { data: tags = [] } = useLiveQuery((q) =>
    q.from({ activityTags }).select(({ activityTags }) => ({ ...activityTags }))
  )
  return useMemo(() => new Map(tags.map(t => [t.emoji, t.label])), [tags])
}
