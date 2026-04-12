import { useLiveQuery } from '@tanstack/react-db'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SessionDetailScreen } from '@/lib/screens/SessionDetailScreen'
import { encounters, partners, privateNotes } from '@/src/db'
import { ACTIVITY_EMOJIS } from '@/src/db/schema'

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

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
  const { data: allNotes = [] } = useLiveQuery((q) =>
    q.from({ privateNotes }).select(({ privateNotes }) => ({ ...privateNotes }))
  )

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
  const note = allNotes.find(n => n.encounterId === encounter.id)

  const dateObj = new Date(encounter.date)
  const dayOfWeek = DAY_NAMES[dateObj.getDay()]
  const dateStr = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const sessionPartners = partner ? [{
    initials: getInitials(partner.displayName),
    name: partner.displayName,
    gradient: partner.avatarGradient,
    sessionCount: allEncounters.filter(e => e.partnerId === partner.id).length,
    avgSatisfaction: (() => {
      const pEnc = allEncounters.filter(e => e.partnerId === partner.id)
      return pEnc.length > 0
        ? Math.round(pEnc.reduce((s, e) => s + (e.stars || 0), 0) / pEnc.length * 10) / 10
        : 0
    })(),
  }] : []

  const activities = encounter.activities.map(emoji => {
    const known = ACTIVITY_EMOJIS.find(a => a.code === emoji)
    return { emoji, label: known?.label || emoji }
  })

  return (
    <SessionDetailScreen
      partners={sessionPartners}
      partnerNames={partner?.displayName || 'Solo'}
      date={dateStr}
      rating={encounter.stars || 0}
      dayOfWeek={dayOfWeek.slice(0, 3)}
      activities={activities}
      note={note?.body}
      onBack={() => router.back()}
      onPartnerPress={(p) => {
        const matched = allPartners.find(mp => getInitials(mp.displayName) === p.initials)
        if (matched) router.push(`/(modals)/partner-profile?id=${matched.id}`)
      }}
    />
  )
}
