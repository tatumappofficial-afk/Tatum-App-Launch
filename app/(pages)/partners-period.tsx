import { useLiveQuery } from '@tanstack/react-db'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { PartnersScreen } from '@/lib/screens/PartnersScreen'
import { encounters, partners } from '@/src/db'
import {
  filterByWindow,
  formatPeriodCaption,
  getWindow,
  parseDateString,
  partnerPeriodStats,
  type CalendarStartDay,
  type Period,
} from '@/lib/stats'

const CALENDAR_START_DAY: CalendarStartDay = 'sunday'

function isPeriod(value: string | undefined): value is Period {
  return value === 'week' || value === 'month' || value === 'year' || value === 'all'
}

export default function PartnersPeriodRoute() {
  const router = useRouter()
  const params = useLocalSearchParams<{ period?: string; anchor?: string }>()
  const period: Period = isPeriod(params.period) ? params.period : 'week'
  const anchor = params.anchor ? parseDateString(params.anchor) : new Date()

  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners })),
  )
  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters })),
  )

  const window = getWindow(period, anchor, {
    calendarStartDay: CALENDAR_START_DAY,
    encounters: allEncounters,
  })
  const inWindow = window ? filterByWindow(allEncounters, window) : []
  const stats = partnerPeriodStats(inWindow, allPartners)

  const partnerList = stats.map((s) => {
    const pEncounters = inWindow.filter((e) => e.partnerIds.includes(s.partner.id))
    return {
      name: s.partner.displayName,
      initials: s.partner.avatarValue,
      gradient: s.partner.avatarGradient,
      since: new Date(s.partner.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      sessions: s.sessionCount,
      avgSat: s.averageStars === null ? '—' : Math.round(s.averageStars * 10) / 10,
      tags: [...new Set(pEncounters.flatMap((e) => e.activities))].slice(0, 4),
    }
  })

  const caption = formatPeriodCaption(period, anchor, { calendarStartDay: CALENDAR_START_DAY })
  const title = period === 'all' ? 'Partners' : `Partners · ${caption}`

  return (
    <PartnersScreen
      partners={partnerList}
      title={title}
      onBack={() => router.back()}
      onPartnerTap={(index) => {
        const partner = stats[index]?.partner
        if (partner) router.push(`/(pages)/partner-profile?id=${partner.id}`)
      }}
    />
  )
}
