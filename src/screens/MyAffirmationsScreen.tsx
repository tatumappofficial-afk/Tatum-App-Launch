import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, spacing, radii } from '@/lib/theme';
import { Card, Button, SectionDivider, PremiumGate, EmptyState } from '@/lib/components';
import { useUserProfile } from '@/src/store';
import { isPremium } from '@/src/utils/premium';
import { CURATED_AFFIRMATIONS } from '@/src/data/affirmations';

export function MyAffirmationsScreen() {
  const router = useRouter();
  const profile = useUserProfile();
  const premium = isPremium(profile);
  const [customAffirmations, setCustomAffirmations] = useState<string[]>([]);
  const [newText, setNewText] = useState('');

  const addAffirmation = () => {
    if (!newText.trim()) return;
    setCustomAffirmations([...customAffirmations, newText.trim()]);
    setNewText('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.handle} />
      <Text style={styles.title}>My Affirmations</Text>

      <PremiumGate isLocked={!premium}>
        <SectionDivider label="Add Your Own" />
        <TextInput
          style={styles.input}
          value={newText}
          onChangeText={setNewText}
          placeholder="Write something you need to hear"
          placeholderTextColor={colors.muted}
        />
        <Button title="Add" onPress={addAffirmation} disabled={!newText.trim()} style={{ marginTop: 8 }} />

        {customAffirmations.length > 0 && (
          <>
            <SectionDivider label="Your Affirmations" />
            {customAffirmations.map((a, i) => (
              <Card key={i} style={styles.affirmationCard}>
                <Text style={styles.affirmationText}>{a}</Text>
              </Card>
            ))}
          </>
        )}
      </PremiumGate>

      <SectionDivider label="Curated" />
      {CURATED_AFFIRMATIONS.slice(0, 15).map((a, i) => (
        <Card key={i} style={styles.affirmationCard}>
          <Text style={styles.affirmationText}>{a}</Text>
        </Card>
      ))}

      <Button title="Done" variant="secondary" onPress={() => router.back()} style={{ marginTop: 16 }} />
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
    fontFamily: fonts.dmSans.regular, fontSize: 12, color: colors.ink,
  },
  affirmationCard: { marginBottom: 6, padding: 14 },
  affirmationText: { fontFamily: fonts.playfair.italic, fontSize: 13, color: colors.fig, lineHeight: 20 },
});
