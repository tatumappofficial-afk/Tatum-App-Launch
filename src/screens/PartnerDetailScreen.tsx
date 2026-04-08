import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, fonts, spacing, radii } from '@/lib/theme';
import { Card, Button, StatCard, SectionDivider, EmptyState } from '@/lib/components';
import { usePartnerById, useEncountersByPartnerId, archivePartner } from '@/src/store';

export function PartnerDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const partner = usePartnerById(id);
  const encounters = useEncountersByPartnerId(id);

  const handleArchive = () => {
    Alert.alert('Archive this partner?', 'Their encounters will be preserved.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Archive', onPress: async () => { if (id) { await archivePartner(id); router.back(); } } },
    ]);
  };

  if (!partner) return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;

  const thumbsUp = encounters.filter((e) => e.rating === 'up').length;
  const thumbsDown = encounters.filter((e) => e.rating === 'down').length;
  const total = encounters.length;
  const ratio = total > 0 ? `${Math.round((thumbsUp / total) * 100)}%` : '—';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.handle} />

      <View style={[styles.avatar, { backgroundColor: partner.avatarGradient[0] }]}>
        {partner.avatarType === 'emoji' ? (
          <Text style={styles.avatarEmoji}>{partner.avatarValue}</Text>
        ) : (
          <Text style={styles.avatarInitials}>{partner.avatarValue}</Text>
        )}
      </View>
      <Text style={styles.name}>{partner.displayName}</Text>

      <SectionDivider label="Stats" />
      <View style={styles.statGrid}>
        <StatCard value={total} label="Times" />
        <StatCard value={ratio} label="👍 Rate" />
      </View>

      <SectionDivider label="Encounters" />
      {encounters.length > 0 ? (
        encounters.slice(0, 20).map((enc) => (
          <Card key={enc.id} style={styles.encCard}>
            <Text style={styles.encDate}>{enc.date}</Text>
            <Text style={styles.encEmojis}>{enc.activities.join(' ')}</Text>
          </Card>
        ))
      ) : (
        <EmptyState emoji="🌙" title="No encounters yet" />
      )}

      <Button title="Archive Partner" variant="secondary" onPress={handleArchive} style={{ marginTop: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmSand },
  content: { padding: spacing.xl, paddingBottom: 40, alignItems: 'center' },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 16 },
  loading: { fontFamily: fonts.dmSans.regular, fontSize: 12, color: colors.muted, marginTop: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatarEmoji: { fontSize: 38 },
  avatarInitials: { fontFamily: fonts.playfair.semiBold, fontSize: 26, color: colors.white },
  name: { fontFamily: fonts.playfair.bold, fontSize: 22, color: colors.ink, marginBottom: 8 },
  statGrid: { flexDirection: 'row', gap: 8, width: '100%', marginBottom: 8 },
  encCard: { marginBottom: 6, width: '100%', padding: 12, flexDirection: 'row', justifyContent: 'space-between' },
  encDate: { fontFamily: fonts.dmSans.regular, fontSize: 11, color: colors.stone },
  encEmojis: { fontSize: 14 },
});
