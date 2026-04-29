import { useEffect } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SessionDetailModal } from '@/lib/screens/SessionDetailModal'
import { encounters, partners } from '@/src/db'
import { useActivityTagMap } from '@/src/hooks/useActivityTagMap'
import { formatPartnerLabel } from '@/src/utils/partnerLabel'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function SheetSessionDetailRoute() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: allEncounters = [], isReady: encReady } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters }))
  )
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners }))
  )
  const tagMap = useActivityTagMap()

  const encounter = allEncounters.find(e => e.id === id)

  useEffect(() => {
    if (encReady && !encounter && router.canGoBack()) {
      router.back()
    }
  }, [encReady, encounter, router])

  if (!encounter) {
    return (
      <SessionDetailModal
        month={1}
        year={2026}
        selectedDay={1}
        backLabel="Back"
        partnerName=""
        partners={[]}
        dateLabel=""
        rating={0}
        dayOfWeek=""
        tags={[]}
        onBack={() => router.back()}
      />
    )
  }

  const sessionPartners = encounter.partnerIds
    .map(pid => allPartners.find(p => p.id === pid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  const dateObj = new Date(encounter.date + 'T00:00:00')
  const dayOfWeek = DAY_NAMES[dateObj.getDay()]
  const monthName = MONTH_NAMES[dateObj.getMonth()]
  const dayNum = dateObj.getDate()

  const backLabel = `${monthName} ${dayNum}`
  const dateLabel = `${dayOfWeek}, ${monthName} ${dayNum}, ${dateObj.getFullYear()}`

  const activities = encounter.activities.map(emoji => ({
    emoji,
    label: tagMap.get(emoji) || emoji,
  }))

  return (
    <SessionDetailModal
      month={dateObj.getMonth() + 1}
      year={dateObj.getFullYear()}
      selectedDay={dayNum}
      backLabel={backLabel}
      partnerName={formatPartnerLabel(sessionPartners.map(p => p.displayName))}
      partners={sessionPartners.map(p => ({ initials: p.avatarValue, gradient: p.avatarGradient, name: p.displayName }))}
      dateLabel={dateLabel}
      rating={encounter.stars || 0}
      dayOfWeek={dayOfWeek.slice(0, 3)}
      tags={activities}
      noteText={encounter.notes ?? undefined}
      onBack={() => router.back()}
      onEdit={() => router.push(`/(sheets)/log-session?id=${encounter.id}`)}
      onClose={() => router.dismiss()}
    />
  )
}
