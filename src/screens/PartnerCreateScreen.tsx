import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, spacing, radii, partnerGradients } from '@/lib/theme';
import { Button, SectionDivider } from '@/lib/components';
import { insertPartner } from '@/src/store';

export function PartnerCreateScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [avatarType, setAvatarType] = useState<'initials' | 'emoji' | 'color'>('initials');
  const [selectedGradient, setSelectedGradient] = useState(0);

  const handleSave = async () => {
    if (!name.trim()) return;
    await insertPartner({
      displayName: name.trim(),
      avatarType,
      avatarValue: avatarType === 'initials' ? name.trim().slice(0, 2).toUpperCase() : '',
      avatarGradient: partnerGradients[selectedGradient],
    });
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.handle} />
      <Text style={styles.title}>New Partner</Text>

      <SectionDivider label="Name" />
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nickname or initials"
        placeholderTextColor={colors.muted}
        autoFocus
      />

      <SectionDivider label="Avatar Style" />
      <View style={styles.typeRow}>
        {(['initials', 'emoji', 'color'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setAvatarType(t)}
            style={[styles.typeBtn, avatarType === t && styles.typeBtnActive]}
          >
            <Text style={[styles.typeText, avatarType === t && styles.typeTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionDivider label="Color" />
      <View style={styles.gradientRow}>
        {partnerGradients.map((g, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setSelectedGradient(i)}
            style={[
              styles.gradientCircle,
              { backgroundColor: g[0] },
              selectedGradient === i && styles.gradientSelected,
            ]}
          />
        ))}
      </View>

      <Button title="Save" onPress={handleSave} disabled={!name.trim()} style={{ marginTop: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmSand },
  content: { padding: spacing.xl, paddingBottom: 40 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 16 },
  title: { fontFamily: fonts.playfair.semiBold, fontSize: 22, color: colors.ink, textAlign: 'center', marginBottom: 8 },
  input: {
    backgroundColor: colors.surface2, borderRadius: radii.md, padding: 14,
    fontFamily: fonts.dmSans.regular, fontSize: 14, color: colors.ink, marginBottom: 8,
  },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  typeBtn: {
    flex: 1, paddingVertical: 10, borderRadius: radii.md,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center',
  },
  typeBtnActive: { backgroundColor: colors.terra, borderColor: colors.terra },
  typeText: { fontFamily: fonts.dmSans.medium, fontSize: 11, color: colors.stone },
  typeTextActive: { color: colors.white },
  gradientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gradientCircle: { width: 36, height: 36, borderRadius: 18 },
  gradientSelected: { borderWidth: 3, borderColor: colors.ink },
});
