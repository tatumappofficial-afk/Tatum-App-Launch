import { useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useLiveQuery } from '@tanstack/react-db'
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native'
import { generateId } from '@/src/utils/uuid'
import { colors, font, gradientStyle } from '@/lib/theme'
import { GradientButton } from '@/lib/components/GradientButton'
import { partners } from '@/src/db'

const GRADIENT_OPTIONS = [
  { key: 'terra', gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)' },
  { key: 'mauve', gradient: 'linear-gradient(135deg, #B07080, #7C4A5A)' },
  { key: 'sage', gradient: 'linear-gradient(135deg, #8BA888, #5A8060)' },
  { key: 'gold', gradient: 'linear-gradient(135deg, #C4993A, #8A6A20)' },
] as const

function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function EditPartnerModal() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners }))
  )

  const existing = id ? allPartners.find(p => p.id === id) : undefined
  const isEdit = Boolean(existing)

  const [displayName, setDisplayName] = useState(existing?.displayName ?? '')
  const [selectedGradient, setSelectedGradient] = useState(
    existing?.avatarGradient || GRADIENT_OPTIONS[0].gradient,
  )

  function handleSave() {
    const name = displayName.trim()
    if (!name) return

    const now = new Date().toISOString()
    const initials = getInitials(name)

    try {
      if (isEdit && existing) {
        partners.update(existing.id, (draft) => {
          draft.displayName = name
          draft.avatarValue = initials
          draft.avatarGradient = selectedGradient
          draft.updatedAt = now
        })
      } else {
        partners.insert({
          id: generateId(),
          displayName: name,
          avatarType: 'initials',
          avatarValue: initials,
          avatarGradient: selectedGradient,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        })
      }
    } catch (err) {
      console.error('Failed to save partner:', err)
    }

    router.back()
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.warmSand }}>
      <ScrollView
        contentContainerStyle={{ padding: 28, paddingTop: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{
          fontFamily: font('playfair', '700'),
          fontSize: 28,
          color: colors.ink,
          marginBottom: 32,
        }}>
          {isEdit ? 'Edit Partner' : 'New Partner'}
        </Text>

        <Text style={{
          fontFamily: font('dmSans', '500'),
          fontSize: 13,
          color: colors.stone,
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}>
          Display Name
        </Text>

        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Partner name"
          placeholderTextColor={colors.muted}
          style={{
            fontFamily: font('dmSans', '400'),
            fontSize: 16,
            color: colors.ink,
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 16,
            paddingVertical: 14,
            marginBottom: 28,
          }}
        />

        <Text style={{
          fontFamily: font('dmSans', '500'),
          fontSize: 13,
          color: colors.stone,
          marginBottom: 12,
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}>
          Avatar Color
        </Text>

        <View style={{ flexDirection: 'row', gap: 14, marginBottom: 32 }}>
          {GRADIENT_OPTIONS.map(opt => {
            const isSelected = selectedGradient === opt.gradient
            return (
              <Pressable
                key={opt.key}
                onPress={() => setSelectedGradient(opt.gradient)}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  ...gradientStyle(opt.gradient),
                  borderWidth: isSelected ? 3 : 0,
                  borderColor: isSelected ? colors.ink : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isSelected && (
                  <Text style={{ color: colors.white, fontSize: 18 }}>✓</Text>
                )}
              </Pressable>
            )
          })}
        </View>

        <GradientButton label="Save" onPress={handleSave} />

        <Pressable onPress={() => router.back()} style={{ alignItems: 'center', marginTop: 16 }}>
          <Text style={{
            fontFamily: font('dmSans', '500'),
            fontSize: 14,
            color: colors.terra,
          }}>
            Cancel
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}
