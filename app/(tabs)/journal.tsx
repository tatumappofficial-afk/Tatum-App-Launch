import { useLiveQuery } from '@tanstack/react-db'
import { useRouter } from 'expo-router'
import { JournalScreen } from '@/lib/screens/JournalScreen'
import { encounters, partners, privateNotes } from '@/src/db'

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function JournalRoute() {
  const router = useRouter()
  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters }))
  )
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners }))
  )
  const { data: allNotes = [] } = useLiveQuery((q) =>
    q.from({ privateNotes }).select(({ privateNotes }) => ({ ...privateNotes }))
  )

  const entries = allEncounters
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(enc => {
      const partner = allPartners.find(p => p.id === enc.partnerId)
      const note = allNotes.find(n => n.encounterId === enc.id)
      return {
        id: enc.id,
        partners: partner ? [{
          initials: getInitials(partner.displayName),
          gradient: partner.avatarGradient,
        }] : [],
        partnerName: partner?.displayName || 'Solo',
        date: new Date(enc.date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        score: enc.stars || 0,
        maxScore: 10,
        tags: enc.activities,
        note: note?.body,
      }
    })

  return (
    <JournalScreen
      entries={entries}
      onEntryPress={(id) => router.push(`/(modals)/session-detail?id=${id}`)}
    />
  )
}
