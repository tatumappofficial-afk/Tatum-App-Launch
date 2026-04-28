import { useLiveQuery } from '@tanstack/react-db'
import { PartnersScreen } from '@/lib/screens/PartnersScreen'
import { useRouter } from 'expo-router'
import { partners, encounters } from '@/src/db'

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
    const rated = pEncounters.filter(e => e.stars && e.stars > 0)
    const avgSat = rated.length > 0
      ? Math.round(rated.reduce((s, e) => s + (e.stars || 0), 0) / rated.length * 10) / 10
      : 0
    return {
      name: p.displayName,
      initials: p.avatarValue,
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
        if (partner) router.push(`/(pages)/partner-profile?id=${partner.id}`)
      }}
      onAddPartner={() => router.push('/(sheets)/edit-partner')}
    />
  )
}
