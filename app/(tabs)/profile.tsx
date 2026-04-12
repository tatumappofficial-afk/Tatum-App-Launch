import { useLiveQuery } from '@tanstack/react-db'
import { useRouter } from 'expo-router'
import { ProfileScreen } from '@/lib/screens/ProfileScreen'
import { encounters, partners } from '@/src/db'
import { ACTIVITY_EMOJIS } from '@/src/db/schema'

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function ProfileRoute() {
  const router = useRouter()
  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters }))
  )
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners }))
  )

  // Activity tags
  const activityCounts = new Map<string, number>()
  for (const enc of allEncounters) {
    for (const a of enc.activities) {
      activityCounts.set(a, (activityCounts.get(a) || 0) + 1)
    }
  }
  const activityTags = [...activityCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([emoji]) => {
      const known = ACTIVITY_EMOJIS.find(a => a.code === emoji)
      return { emoji, label: known?.label || emoji }
    })

  // Partners (matches ProfileScreen Partner interface: initials, gradient, since)
  const partnerList = allPartners.filter(p => p.isActive).map(p => ({
    initials: getInitials(p.displayName),
    gradient: p.avatarGradient,
    since: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  }))

  // Recent sessions (matches RecentSession: partnerInitials, partnerGradient, date, ratingPercent, tags, note)
  const recentSessions = allEncounters
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
    .map(enc => {
      const partner = allPartners.find(p => p.id === enc.partnerId)
      return {
        partnerInitials: partner ? getInitials(partner.displayName) : '✨',
        partnerGradient: partner?.avatarGradient || 'linear-gradient(135deg, #8BA888, #5A8060)',
        date: new Date(enc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rating: enc.stars || 0,
        tags: enc.activities,
        note: 'A beautiful moment worth remembering.',
      }
    })

  const avgSat = allEncounters.length > 0
    ? allEncounters.reduce((s, e) => s + (e.stars || 0), 0) / allEncounters.length
    : 0

  return (
    <ProfileScreen
      userName="Alanna"
      userInitial="A"
      sinceDate="April 2026"
      stats={{
        sessions: allEncounters.length,
        avgSat: Math.round(avgSat * 10) / 10,
        partners: allPartners.filter(p => p.isActive).length,
      }}
      partners={partnerList}
      activityTags={activityTags}
      recentSessions={recentSessions}
      onEdit={() => router.push('/(modals)/edit-profile')}
      onSettings={() => router.push('/(modals)/settings')}
      onPartnersSection={() => router.push('/(modals)/partners')}
      onAddTag={() => router.push('/(modals)/add-tag')}
      onAddPartner={() => router.push('/(modals)/partners')}
      onDevTools={() => router.push('/(modals)/dev-tools')}
    />
  )
}
