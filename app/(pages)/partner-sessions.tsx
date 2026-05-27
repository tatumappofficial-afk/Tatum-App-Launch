import { useMemo } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SessionsListScreen, type SessionsListEntry } from '@/lib/screens/SessionsListScreen'
import { encounters, partners } from '@/src/db'

export default function PartnerSessionsRoute() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters })),
  )
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners })),
  )

  const partner = allPartners.find(p => p.id === id)

  const entries: SessionsListEntry[] = useMemo(() => {
    if (!id) return []
    const partnerById = new Map(allPartners.map(p => [p.id, p]))
    return allEncounters
      .filter(e => e.partnerIds.includes(id))
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(enc => {
        const sessionPartners = enc.partnerIds
          .map(pid => partnerById.get(pid))
          .filter((p): p is NonNullable<typeof p> => Boolean(p))
        return {
          id: enc.id,
          partners: sessionPartners.map(p => ({
            initials: p.avatarValue,
            gradient: p.avatarGradient,
          })),
          date: new Date(enc.date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          rating: enc.stars,
          tags: enc.activities,
          note: enc.notes ?? undefined,
        }
      })
  }, [id, allEncounters, allPartners])

  const title = 'All sessions'
  const subtitle = partner
    ? `${entries.length} ${entries.length === 1 ? 'session' : 'sessions'} · all time`
    : undefined

  return (
    <SessionsListScreen
      title={title}
      subtitle={subtitle}
      entries={entries}
      onBack={() => router.back()}
      onEntryPress={(sessionId) => router.push(`/(pages)/session-detail?id=${sessionId}`)}
    />
  )
}
