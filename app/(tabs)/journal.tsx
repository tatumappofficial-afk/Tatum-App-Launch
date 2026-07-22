import { useLiveQuery } from '@tanstack/react-db'
import { useRouter } from 'expo-router'
import { JournalScreen } from '@/lib/screens/JournalScreen'
import { encounters, partners } from '@/src/db'
import { compareEncountersNewestFirst } from '@/lib/stats'

export default function JournalRoute() {
  const router = useRouter()
  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters })),
  )
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners })),
  )
  // .slice() first — .sort() in place would mutate the live-query array.
  const entries = allEncounters
    .slice()
    .sort(compareEncountersNewestFirst)
    .map((enc) => {
      const sessionPartners = enc.partnerIds
        .map((pid) => allPartners.find((p) => p.id === pid))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
      return {
        id: enc.id,
        partners: sessionPartners.map((p) => ({
          initials: p.avatarValue,
          gradient: p.avatarGradient,
        })),
        date: new Date(enc.date + 'T00:00:00').toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        isoDate: enc.date,
        score: enc.stars && enc.stars > 0 ? enc.stars : null,
        maxScore: 10,
        tags: enc.activities,
        note: enc.notes ?? undefined,
      }
    })

  return (
    <JournalScreen
      entries={entries}
      onEntryPress={(id) => router.push(`/(pages)/session-detail?id=${id}`)}
      onLogFirstSession={() => router.push('/(sheets)/log-session')}
    />
  )
}
