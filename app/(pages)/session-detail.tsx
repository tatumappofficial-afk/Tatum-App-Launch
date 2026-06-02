import { useEffect } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SessionDetailScreen } from '@/lib/screens/SessionDetailScreen'
import { encounters, partners } from '@/src/db'
import { useActivityTagMap } from '@/src/hooks/useActivityTagMap'
import { formatPartnerLabel } from '@/src/utils/partnerLabel'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function SessionDetailRoute() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: allEncounters = [], isReady: encReady } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters })),
  )
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners })),
  )
  const tagMap = useActivityTagMap()

  const encounter = allEncounters.find((e) => e.id === id)

  // If the encounter is gone (e.g. the user deleted it via the edit sheet),
  // pop this page so the user lands on whatever they were viewing before —
  // not a blank detail screen.
  useEffect(() => {
    if (encReady && !encounter && router.canGoBack()) {
      router.back()
    }
  }, [encReady, encounter, router])

  if (!encounter) {
    return (
      <SessionDetailScreen
        partners={[]}
        partnerNames=""
        date=""
        rating={0}
        dayOfWeek=""
        activities={[]}
        onBack={() => router.back()}
      />
    )
  }

  const dateObj = new Date(encounter.date + 'T00:00:00')
  const dayOfWeek = DAY_NAMES[dateObj.getDay()]
  const dateStr = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const sessionPartners = encounter.partnerIds
    .map((pid) => allPartners.find((p) => p.id === pid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => {
      const pEncs = allEncounters.filter((e) => e.partnerIds.includes(p.id))
      const rated = pEncs.filter((e) => e.stars && e.stars > 0)
      const avg =
        rated.length > 0 ? Math.round((rated.reduce((s, e) => s + (e.stars || 0), 0) / rated.length) * 10) / 10 : 0
      return {
        id: p.id,
        initials: p.avatarValue,
        name: p.displayName,
        gradient: p.avatarGradient,
        sessionCount: pEncs.length,
        avgSatisfaction: avg,
      }
    })

  const activities = encounter.activities.map((emoji) => {
    return { emoji, label: tagMap.get(emoji) || emoji }
  })

  return (
    <SessionDetailScreen
      partners={sessionPartners}
      partnerNames={formatPartnerLabel(sessionPartners.map((p) => p.name))}
      date={dateStr}
      rating={encounter.stars || 0}
      dayOfWeek={dayOfWeek.slice(0, 3)}
      activities={activities}
      note={encounter.notes ?? undefined}
      onBack={() => router.back()}
      onEdit={() => router.push(`/(sheets)/log-session?id=${encounter.id}`)}
      onEditNote={() => router.push(`/(sheets)/log-session?id=${encounter.id}`)}
      onPartnerPress={(p) => router.push(`/(pages)/partner-profile?id=${p.id}`)}
    />
  )
}
