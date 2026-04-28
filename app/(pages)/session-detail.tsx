import { useLiveQuery } from '@tanstack/react-db'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SessionDetailScreen } from '@/lib/screens/SessionDetailScreen'
import { encounters, partners } from '@/src/db'
import { useActivityTagMap } from '@/src/hooks/useActivityTagMap'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function SessionDetailRoute() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters }))
  )
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners }))
  )
  const tagMap = useActivityTagMap()

  const encounter = allEncounters.find(e => e.id === id)

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

  const partner = allPartners.find(p => p.id === encounter.partnerId)

  const dateObj = new Date(encounter.date + 'T00:00:00')
  const dayOfWeek = DAY_NAMES[dateObj.getDay()]
  const dateStr = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const sessionPartners = partner ? [{
    initials: partner.avatarValue,
    name: partner.displayName,
    gradient: partner.avatarGradient,
    sessionCount: allEncounters.filter(e => e.partnerId === partner.id).length,
    avgSatisfaction: (() => {
      const rated = allEncounters.filter(e => e.partnerId === partner.id && e.stars && e.stars > 0)
      return rated.length > 0
        ? Math.round(rated.reduce((s, e) => s + (e.stars || 0), 0) / rated.length * 10) / 10
        : 0
    })(),
  }] : []

  const activities = encounter.activities.map(emoji => {
    return { emoji, label: tagMap.get(emoji) || emoji }
  })

  return (
    <SessionDetailScreen
      partners={sessionPartners}
      partnerNames={partner?.displayName || 'Solo'}
      date={dateStr}
      rating={encounter.stars || 0}
      dayOfWeek={dayOfWeek.slice(0, 3)}
      activities={activities}
      note={encounter.notes ?? undefined}
      onBack={() => router.back()}
      onEdit={() => router.push(`/(sheets)/log-session?id=${encounter.id}`)}
      onEditNote={() => router.push(`/(sheets)/log-session?id=${encounter.id}`)}
      onPartnerPress={() => {
        if (partner) router.push(`/(pages)/partner-profile?id=${partner.id}`)
      }}
    />
  )
}
