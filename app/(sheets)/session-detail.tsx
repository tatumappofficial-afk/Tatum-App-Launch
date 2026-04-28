import { useLiveQuery } from '@tanstack/react-db'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SessionDetailModal } from '@/lib/screens/SessionDetailModal'
import { encounters, partners } from '@/src/db'
import { useActivityTagMap } from '@/src/hooks/useActivityTagMap'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function SheetSessionDetailRoute() {
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
      <SessionDetailModal
        month={1}
        year={2026}
        selectedDay={1}
        backLabel="Back"
        partnerName=""
        partnerInitials="?"
        partnerGradient="linear-gradient(135deg, #8BA888, #5A8060)"
        dateLabel=""
        rating={0}
        dayOfWeek=""
        tags={[]}
        onBack={() => router.back()}
      />
    )
  }

  const partner = allPartners.find(p => p.id === encounter.partnerId)

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
      partnerName={partner?.displayName || 'Solo'}
      partnerInitials={partner ? partner.avatarValue : "\u2728"}
      partnerGradient={partner?.avatarGradient || 'linear-gradient(135deg, #8BA888, #5A8060)'}
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
