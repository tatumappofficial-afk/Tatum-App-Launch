import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useLiveQuery } from '@tanstack/react-db'
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native'
import { colors, font } from '@/lib/theme'
import { GradientButton } from '@/lib/components/GradientButton'
import { userProfiles } from '@/src/db'

export default function EditProfileModal() {
  const router = useRouter()
  const { data: profiles = [] } = useLiveQuery((q) =>
    q.from({ userProfiles }).select(({ userProfiles }) => ({ ...userProfiles }))
  )
  const profile = profiles.find(p => p.id === 'default')

  const [displayName, setDisplayName] = useState(profile?.displayName ?? '')

  function handleSave() {
    const name = displayName.trim()
    if (profile) {
      userProfiles.update(profile.id, (draft) => {
        draft.displayName = name || null
      })
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
          Edit Profile
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
          placeholder="Your name"
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
            marginBottom: 32,
          }}
        />

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
