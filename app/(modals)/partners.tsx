import { useLiveQuery } from '@tanstack/react-db'
import { PartnersScreen } from '@/lib/screens/PartnersScreen'
import { useRouter } from 'expo-router'
import { partners, encounters } from '@/src/db'

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function PartnersRoute() {
  const router = useRouter()
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners }))
  )
  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters }))
  )

  const partnerList = allPartners.map(p => {
    const pEncounters = allEncounters.filter(e => e.partnerId === p.id)
    const avgSat = pEncounters.length > 0
      ? Math.round(pEncounters.reduce((s, e) => s + (e.stars || 0), 0) / pEncounters.length * 10) / 10
      : 0
    return {
      name: p.displayName,
      initials: getInitials(p.displayName),
      gradient: p.avatarGradient,
      since: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      sessions: pEncounters.length,
      avgSat,
      tags: [...new Set(pEncounters.flatMap(e => e.activities))].slice(0, 4),
    }
  })

  return (
    <PartnersScreen
      partners={partnerList}
      onBack={() => router.back()}
      onPartnerTap={(index) => {
        const partner = allPartners[index]
        if (partner) router.push(`/(modals)/partner-profile?id=${partner.id}`)
      }}
      onAddPartner={() => router.push('/(modals)/edit-partner')}
    />
  )
}
