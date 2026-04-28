import { useLiveQuery } from '@tanstack/react-db'
import { useRouter } from 'expo-router'
import { HomeScreen } from '@/lib/screens/HomeScreen'
import { encounters, partners } from '@/src/db'
import { useActivityTagMap } from '@/src/hooks/useActivityTagMap'
import type { Encounter, Partner } from '@/src/db/schema'

function computeHomeProps(allEncounters: Encounter[], allPartners: Partner[], tagMap: Map<string, string>) {
  if (allEncounters.length === 0) {
    return {
      isEmpty: true,
      userName: 'Alanna',
      emptyPartners: allPartners.map(p => ({
        initials: p.avatarValue,
        name: p.displayName,
        gradient: p.avatarGradient,
      })),
    }
  }

  // Compute stats for the week
  const now = new Date()
  const weekAgo = new Date(now)
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekStr = weekAgo.toISOString().split('T')[0]

  const weekEncounters = allEncounters.filter(e => e.date >= weekStr)
  const sessionsCount = weekEncounters.length
  const ratedWeekEncounters = weekEncounters.filter(e => e.stars && e.stars > 0)
  const avgRating = ratedWeekEncounters.length > 0
    ? ratedWeekEncounters.reduce((sum, e) => sum + (e.stars || 0), 0) / ratedWeekEncounters.length
    : 0

  // Top activities
  const activityCounts = new Map<string, number>()
  for (const enc of weekEncounters) {
    for (const a of enc.activities) {
      activityCounts.set(a, (activityCounts.get(a) || 0) + 1)
    }
  }
  const maxCount = Math.max(...activityCounts.values(), 1)
  const topActivities = [...activityCounts.entries()]
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

  // Partner stats
  const partnerStats = allPartners.filter(p => p.isActive).map(p => {
    const pEncounters = allEncounters.filter(e => e.partnerId === p.id)
    const topEmoji = [...pEncounters.flatMap(e => e.activities)].sort()[0] || '✨'
    return {
      initials: p.avatarValue,
      gradient: p.avatarGradient,
      sessions: pEncounters.length,
      avgSatisfaction: (() => {
        const rated = pEncounters.filter(e => e.stars && e.stars > 0)
        return rated.length > 0 ? rated.reduce((s, e) => s + (e.stars || 0), 0) / rated.length : 0
      })(),
      topActivityEmoji: topEmoji,
    }
  })

  // Recent sessions
  const recentSessions = allEncounters
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
    .map(enc => {
      const partner = allPartners.find(p => p.id === enc.partnerId)
      return {
        partnerInitials: partner ? partner.avatarValue : '✨',
        partnerGradient: partner?.avatarGradient || 'linear-gradient(135deg, #8BA888, #5A8060)',
        date: new Date(enc.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rating: enc.stars || 0,
        activityEmojis: enc.activities,
        note: enc.notes ?? undefined,
      }
    })

  return {
    isEmpty: false,
    activePeriod: 0,
    periodDateLabel: `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    sessionsCount,
    avgRating: Math.round(avgRating * 10) / 10,
    topActivities,
    partners: partnerStats,
    recentSessions,
    userName: 'Alanna',
    emptyPartners: [],
  }
}

export default function HomeRoute() {
  const router = useRouter()
  const { data: allEncounters = [], isReady: encReady } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters }))
  )
  const { data: allPartners = [], isReady: partReady } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners }))
  )

  const readyEncounters = encReady ? allEncounters : []
  const readyPartners = partReady ? allPartners : []

  const tagMap = useActivityTagMap()

  const props = computeHomeProps(readyEncounters, readyPartners, tagMap)

  const sortedEncounters = [...readyEncounters].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <HomeScreen
      {...props}
      onPartnerPress={(index) => {
        const partner = readyPartners[index]
        if (partner) router.push(`/(pages)/partner-profile?id=${partner.id}`)
      }}
      onSessionPress={(index) => {
        const enc = sortedEncounters[index]
        if (enc) router.push(`/(pages)/session-detail?id=${enc.id}`)
      }}
      onLogFirstSession={() => router.push('/(sheets)/log-session')}
      onAddPartner={() => router.push('/(sheets)/edit-partner')}
    />
  )
}
