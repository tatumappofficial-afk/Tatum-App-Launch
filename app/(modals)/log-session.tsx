import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useLiveQuery } from '@tanstack/react-db'
import { generateId as uuid } from '@/src/utils/uuid'
import { LogSessionScreen } from '@/lib/screens/LogSessionScreen'
import { BottomSheet } from '@/lib/components/BottomSheet'
import { encounters, partners } from '@/src/db'
import { ACTIVITY_EMOJIS } from '@/src/db/schema'

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function LogSessionRoute() {
  const router = useRouter()
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners }))
  )

  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([])
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [rating, setRating] = useState(7)
  const [notes, setNotes] = useState('')

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const partnerItems = allPartners.filter(p => p.isActive).map(p => ({
    id: p.id,
    initials: getInitials(p.displayName),
    gradient: p.avatarGradient,
    name: p.displayName,
  }))

  const activityItems = ACTIVITY_EMOJIS.map(a => ({
    id: a.code,
    emoji: a.code,
    label: a.label,
  }))

  function handlePartnerToggle(id: string) {
    setSelectedPartnerIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  function handleActivityToggle(id: string) {
    setSelectedActivities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  async function handleSave() {
    const now = new Date().toISOString()
    const dateStr = now.split('T')[0]
    const partnerId = selectedPartnerIds[0] || null

    try {
      encounters.insert({
        id: uuid(),
        date: dateStr,
        activities: selectedActivities,
        partnerId,
        rating: 'up',
        stars: rating,
        vibes: [],
        noteId: null,
        createdAt: now,
        updatedAt: now,
      })
    } catch (err) {
      console.error('Failed to save encounter:', err)
    } finally {
      router.back()
    }
  }

  return (
    <BottomSheet heightFraction={0.88}>
      <LogSessionScreen
        date={today}
        partners={partnerItems}
        selectedPartnerIds={selectedPartnerIds}
        activities={activityItems}
        selectedActivityIds={selectedActivities}
        rating={rating}
        notes={notes}
        onPartnerToggle={handlePartnerToggle}
        onActivityToggle={handleActivityToggle}
        onRatingChange={setRating}
        onNotesChange={setNotes}
        onSave={handleSave}
        onAddPartner={() => router.push('/(modals)/edit-partner')}
      />
    </BottomSheet>
  )
}
