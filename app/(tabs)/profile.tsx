import { useLiveQuery } from '@tanstack/react-db'
import { useRouter } from 'expo-router'
import { ProfileScreen } from '@/lib/screens/ProfileScreen'
import { activityTags, encounters, partners } from '@/src/db'
import { useUserProfile } from '@/src/hooks/useUserProfile'
import { compareEncountersNewestFirst } from '@/lib/stats'

export default function ProfileRoute() {
  const router = useRouter()
  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters })),
  )
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners })),
  )

  const { data: allTags = [] } = useLiveQuery((q) =>
    q.from({ activityTags }).select(({ activityTags }) => ({ ...activityTags })),
  )

  const { displayName: userName, initials: userInitial, gradient: userGradient } = useUserProfile()

  // All active activity tags from the DB, sorted by sortOrder
  const activeActivityTags = allTags.filter((t) => t.isActive).sort((a, b) => a.sortOrder - b.sortOrder)
  const activityTagList = activeActivityTags.map((t) => ({ id: t.id, emoji: t.emoji, label: t.label }))

  // Partners (matches ProfileScreen Partner interface: initials, gradient, since)
  // Main partner is always first; remaining sorted by createdAt (oldest first).
  const activePartners = allPartners.filter((p) => p.isActive)
  const sortedActivePartners = [...activePartners].sort((a, b) => {
    if (a.isMain !== b.isMain) return a.isMain ? -1 : 1
    return a.createdAt.localeCompare(b.createdAt)
  })
  const partnerList = sortedActivePartners.map((p) => ({
    initials: p.avatarValue,
    gradient: p.avatarGradient,
    since: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    isMain: p.isMain,
  }))

  // Recent sessions (matches RecentSession: partnerInitials, partnerGradient, date, ratingPercent, tags, note)
  // .slice() first — .sort() in place would mutate the live-query array.
  const recentSessions = allEncounters
    .slice()
    .sort(compareEncountersNewestFirst)
    .slice(0, 5)
    .map((enc) => {
      const sessionPartners = enc.partnerIds
        .map((pid) => allPartners.find((p) => p.id === pid))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
        .map((p) => ({ initials: p.avatarValue, gradient: p.avatarGradient }))
      return {
        id: enc.id,
        partners: sessionPartners,
        date: new Date(enc.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rating: enc.stars || 0,
        tags: enc.activities,
        note: enc.notes ?? undefined,
      }
    })

  const ratedEncounters = allEncounters.filter((e) => e.stars && e.stars > 0)
  const avgSat =
    ratedEncounters.length > 0 ? ratedEncounters.reduce((s, e) => s + (e.stars || 0), 0) / ratedEncounters.length : 0

  return (
    <ProfileScreen
      userName={userName}
      userInitial={userInitial}
      userGradient={userGradient}
      sinceDate="April 2026"
      stats={{
        sessions: allEncounters.length,
        avgSat: Math.round(avgSat * 10) / 10,
        partners: allPartners.filter((p) => p.isActive).length,
      }}
      partners={partnerList}
      activityTags={activityTagList}
      recentSessions={recentSessions}
      onEdit={() => router.push('/(pages)/edit-profile')}
      onSettings={() => router.push('/(pages)/settings')}
      onPartnersSection={() => router.push('/(pages)/partners?showAdd=1')}
      onAddTag={() => router.push('/(sheets)/add-tag')}
      onTagPress={(index) => {
        const tag = activeActivityTags[index]
        if (tag) router.push(`/(sheets)/edit-tag?id=${tag.id}`)
      }}
      onAddPartner={() => router.push('/(sheets)/edit-partner')}
      onPartnerPress={(index) => {
        const partner = sortedActivePartners[index]
        if (partner) router.push(`/(pages)/partner-profile?id=${partner.id}`)
      }}
      onSessionPress={(id) => router.push(`/(pages)/session-detail?id=${id}`)}
    />
  )
}
