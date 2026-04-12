import { useLiveQuery } from '@tanstack/react-db'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { PartnerProfileScreen } from '@/lib/screens/PartnerProfileScreen'
import { encounters, partners } from '@/src/db'
import { ACTIVITY_EMOJIS } from '@/src/db/schema'

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function PartnerProfileRoute() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners }))
  )
  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters }))
  )

  const partner = allPartners.find(p => p.id === id)
  const partnerEncounters = allEncounters.filter(e => e.partnerId === id)
    .sort((a, b) => b.date.localeCompare(a.date))

  if (!partner) {
    return (
      <PartnerProfileScreen
        initials="?"
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
  const avgRating = sessionsCount > 0
    ? (partnerEncounters.reduce((s, e) => s + (e.stars || 0), 0) / sessionsCount).toFixed(1)
    : '--'

  // Top day of week
  const dayCounts = new Map<number, number>()
  for (const enc of partnerEncounters) {
    const dow = new Date(enc.date).getDay()
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
      const known = ACTIVITY_EMOJIS.find(a => a.code === emoji)
      return {
        emoji,
        label: known?.label || emoji,
        count,
        percent: Math.round((count / maxCount) * 100),
      }
    })

  // Recent sessions
  const recentSessions = partnerEncounters.slice(0, 5).map(enc => ({
    date: new Date(enc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    rating: enc.stars || 0,
    tags: enc.activities,
    note: 'A beautiful moment worth remembering.',
  }))

  return (
    <PartnerProfileScreen
      initials={getInitials(partner.displayName)}
      name={partner.displayName}
      since={new Date(partner.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      sessions={sessionsCount}
      avgRating={avgRating}
      topDay={topDay}
      activities={activities}
      recentSessions={recentSessions}
      onBack={() => router.back()}
      onEdit={() => router.push(`/(modals)/edit-partner?id=${id}`)}
    />
  )
}
