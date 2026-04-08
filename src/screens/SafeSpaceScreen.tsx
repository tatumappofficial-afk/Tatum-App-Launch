import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, fonts, spacing, radii } from '@/lib/theme';
import { Card, Button, AvatarBubble, SectionDivider, EmptyState } from '@/lib/components';
import { useActivePartners, useRecentDesires, usePartnerMap, insertDesireEntry } from '@/src/store';

const INTENSITY_LABELS = ['Whisper', 'Warm', 'Burning', 'On Fire', 'Blazing'];

export function SafeSpaceScreen() {
  const router = useRouter();
  const [showEntry, setShowEntry] = useState(false);
  const [intensity, setIntensity] = useState<number | null>(null);
  const [body, setBody] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const partners = useActivePartners();
  const entries = useRecentDesires(30);
  const partnerMap = usePartnerMap();

  const handleLog = async () => {
    await insertDesireEntry({
      intensity,
      body: body.trim() || null,
      partnerId: selectedPartner,
    });
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowEntry(false);
    setIntensity(null);
    setBody('');
    setSelectedPartner(null);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { weekday: 'long', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.handle} />
      <Text style={styles.title}>Safe Space</Text>
      <Text style={styles.subtitle}>A private place for your desire.</Text>

      {!showEntry ? (
        <Button
          title="I'm feeling it"
          onPress={() => setShowEntry(true)}
          style={{ marginVertical: 20 }}
        />
      ) : (
        <Card style={styles.entryCard}>
          <SectionDivider label="Intensity" />
          <View style={styles.intensityRow}>
            {INTENSITY_LABELS.map((label, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setIntensity(i + 1)}
                style={[styles.intensityBtn, intensity === i + 1 && styles.intensityActive]}
              >
                <Text style={[styles.intensityText, intensity === i + 1 && styles.intensityTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <SectionDivider label="About someone?" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {partners.map((p) => (
              <AvatarBubble
                key={p.id}
                partner={p}
                size={40}
                isSelected={selectedPartner === p.id}
                onPress={() => setSelectedPartner(selectedPartner === p.id ? null : p.id)}
                showLabel
              />
            ))}
          </ScrollView>

          <TextInput
            style={styles.textArea}
            value={body}
            onChangeText={setBody}
            placeholder="What are you feeling?"
            placeholderTextColor={colors.muted}
            multiline
          />

          <Button title="Save" onPress={handleLog} style={{ marginTop: 12 }} />
        </Card>
      )}

      {entries.length > 0 ? (
        <>
          <SectionDivider label="Your Entries" />
          {entries.map((entry) => (
            <Card key={entry.id} style={styles.entryItem}>
              <Text style={styles.entryTime}>{formatTime(entry.timestamp)}</Text>
              {entry.intensity && (
                <Text style={styles.entryIntensity}>{INTENSITY_LABELS[entry.intensity - 1]}</Text>
              )}
              {entry.partnerId && partnerMap.has(entry.partnerId) && (
                <Text style={styles.entryPartner}>{partnerMap.get(entry.partnerId)?.displayName}</Text>
              )}
              {entry.body && <Text style={styles.entryBody}>{entry.body}</Text>}
              {entry.actedOn && <Text style={styles.actedOn}>✓ Acted on</Text>}
            </Card>
          ))}
        </>
      ) : (
        <EmptyState
          emoji="🔮"
          title="Your desire journal is empty"
          subtitle="When you feel something, come here. This space is yours."
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmSand },
  content: { padding: spacing.xl, paddingBottom: 40 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 16 },
  title: { fontFamily: fonts.playfair.bold, fontSize: 28, color: colors.ink, textAlign: 'center' },
  subtitle: { fontFamily: fonts.playfair.italic, fontSize: 14, color: colors.fig, textAlign: 'center', marginBottom: 8 },
  entryCard: { marginVertical: 12, padding: 16 },
  intensityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  intensityBtn: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: radii.pill,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  intensityActive: { backgroundColor: colors.fig, borderColor: colors.fig },
  intensityText: { fontFamily: fonts.dmSans.medium, fontSize: 10, color: colors.stone },
  intensityTextActive: { color: colors.white },
  textArea: {
    backgroundColor: colors.surface2, borderRadius: radii.md, padding: 12,
    fontFamily: fonts.dmSans.regular, fontSize: 12, color: colors.ink, minHeight: 60, lineHeight: 18,
  },
  entryItem: { marginBottom: 8, padding: 14 },
  entryTime: { fontFamily: fonts.dmSans.light, fontSize: 10, color: colors.stone, marginBottom: 4 },
  entryIntensity: { fontFamily: fonts.dmSans.medium, fontSize: 11, color: colors.fig, marginBottom: 2 },
  entryPartner: { fontFamily: fonts.dmSans.medium, fontSize: 11, color: colors.terra, marginBottom: 2 },
  entryBody: { fontFamily: fonts.dmSans.regular, fontSize: 12, color: colors.ink, lineHeight: 18, marginTop: 4 },
  actedOn: { fontFamily: fonts.dmSans.medium, fontSize: 10, color: colors.sage, marginTop: 4 },
});
