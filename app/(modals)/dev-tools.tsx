import { useState, useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { colors, font } from '@/lib/theme'
import { resetAllData, getDbStats } from '@/src/db'
import { seedDevelopmentData } from '@/src/db/seed'

export default function DevToolsRoute() {
  const router = useRouter()
  const [stats, setStats] = useState({ partners: 0, encounters: 0, notes: 0 })
  const [status, setStatus] = useState('')

  async function refreshStats() {
    const s = await getDbStats()
    setStats(s)
  }

  useEffect(() => { refreshStats() }, [])

  async function handleSeed() {
    setStatus('Seeding...')
    await seedDevelopmentData()
    await refreshStats()
    setStatus('Seeded!')
  }

  async function handleReset() {
    setStatus('Resetting...')
    await resetAllData()
    await refreshStats()
    setStatus('Reset complete')
  }

  async function handleClearAndReseed() {
    setStatus('Clearing & reseeding...')
    await resetAllData()
    await seedDevelopmentData()
    await refreshStats()
    setStatus('Ready')
  }

  // Button helper
  const DevButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
      }}
    >
      <Text style={{ fontFamily: font('dmSans', '500'), fontSize: 15, color: colors.ink }}>{label}</Text>
    </Pressable>
  )

  return (
    <View style={{ flex: 1, backgroundColor: colors.warmSand, paddingTop: 20, paddingHorizontal: 24 }}>
      <Text style={{ fontFamily: font('playfair', '700'), fontSize: 24, color: colors.ink, marginBottom: 20 }}>
        Dev Tools
      </Text>

      {/* Stats */}
      <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ fontFamily: font('dmSans', '500'), fontSize: 12, color: colors.stone, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Database Stats</Text>
        <Text style={{ fontSize: 14, color: colors.ink }}>Partners: {stats.partners}</Text>
        <Text style={{ fontSize: 14, color: colors.ink }}>Encounters: {stats.encounters}</Text>
        <Text style={{ fontSize: 14, color: colors.ink }}>Notes: {stats.notes}</Text>
        {status ? <Text style={{ fontSize: 12, color: colors.terra, marginTop: 8 }}>{status}</Text> : null}
      </View>

      <DevButton label="Seed Test Data" onPress={handleSeed} />
      <DevButton label="Reset All Data" onPress={handleReset} />
      <DevButton label="Clear & Reseed" onPress={handleClearAndReseed} />

      <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 14, color: colors.terra, textAlign: 'center' }}>Close</Text>
      </Pressable>
    </View>
  )
}
