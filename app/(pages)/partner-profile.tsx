import { useLiveQuery } from '@tanstack/react-db'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { PartnerProfileScreen } from '@/lib/screens/PartnerProfileScreen'
import { partnerGradients } from '@/lib/theme'
import { encounters, partners } from '@/src/db'
import { useActivityTagMap } from '@/src/hooks/useActivityTagMap'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function PartnerProfileRoute() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners })),
  )
  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters })),
  )

  const tagMap = useActivityTagMap()

  const partner = allPartners.find((p) => p.id === id)
  const partnerEncounters = allEncounters
    .filter((e) => e.partnerIds.includes(id))
    .sort((a, b) => b.date.localeCompare(a.date))

  if (!partner) {
    return (
      <PartnerProfileScreen
        initials="?"
        gradient={partnerGradients[0].gradient}
        name="Unknown"
        since=""
        sessions={0}
        avgRating="--"
        topDay="--"
        activities={[]}
        recentSessions={[]}
        onBack={() => router.back()}
      />
    )
  }

  const sessionsCount = partnerEncounters.length
  const ratedEncounters = partnerEncounters.filter((e) => e.stars && e.stars > 0)
  const avgRating =
    ratedEncounters.length > 0
      ? (ratedEncounters.reduce((s, e) => s + (e.stars || 0), 0) / ratedEncounters.length).toFixed(1)
      : '--'

  // Top day of week
  const dayCounts = new Map<number, number>()
  for (const enc of partnerEncounters) {
    const dow = new Date(enc.date + 'T00:00:00').getDay()
    dayCounts.set(dow, (dayCounts.get(dow) || 0) + 1)
  }
  let topDay = '--'
  if (dayCounts.size > 0) {
    const maxDow = [...dayCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]
    topDay = DAY_NAMES[maxDow]
  }

  // Activity breakdown
  const activityCounts = new Map<string, number>()
  for (const enc of partnerEncounters) {
    for (const a of enc.activities) {
      activityCounts.set(a, (activityCounts.get(a) || 0) + 1)
    }
  }
  const maxCount = Math.max(...activityCounts.values(), 1)
  const activities = [...activityCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([emoji, count]) => {
      return {
        emoji,
        label: tagMap.get(emoji) || emoji,
        count,
        percent: Math.round((count / maxCount) * 100),
      }
    })

  // Recent sessions — up to 10 inline; "Show more" routes to the full list.
  const RECENT_LIMIT = 10
  const recentSessions = partnerEncounters.slice(0, RECENT_LIMIT).map((enc) => ({
    id: enc.id,
    date: new Date(enc.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    rating: enc.stars || 0,
    tags: enc.activities,
    note: enc.notes ?? undefined,
  }))
  const hasMoreSessions = partnerEncounters.length > RECENT_LIMIT

  return (
    <PartnerProfileScreen
      initials={partner.avatarValue}
      gradient={partner.avatarGradient}
      name={partner.displayName}
      since={new Date(partner.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      sessions={sessionsCount}
      avgRating={avgRating}
      topDay={topDay}
      isMain={partner.isMain}
      activities={activities}
      recentSessions={recentSessions}
      onBack={() => router.back()}
      onEdit={() => router.push(`/(sheets)/edit-partner?id=${id}&from=partner-profile`)}
      onSessionPress={(sessionId) => router.push(`/(pages)/session-detail?id=${sessionId}`)}
      onShowMoreSessions={hasMoreSessions ? () => router.push(`/(pages)/partner-sessions?id=${id}`) : undefined}
    />
  )
}
