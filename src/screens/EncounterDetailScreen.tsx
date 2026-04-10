import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, fonts, spacing, radii } from '@/lib/theme';
import { Card, Button, Tag, SectionDivider } from '@/lib/components';
import { useEncounterById, useEncountersByDate, usePartnerById, usePartnerMap, removeEncounter } from '@/src/store';
import { getActivityLabel } from '@/src/data/activities';

function DayView({ date }: { date: string }) {
  const router = useRouter();
  const encounters = useEncountersByDate(date);
  const partnerMap = usePartnerMap();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.handle} />
      <Text style={styles.dateTitle}>{formatDate(date)}</Text>

      {encounters.length === 0 ? (
        <Text style={styles.loading}>No encounters for this day.</Text>
      ) : (
        encounters.map((enc) => {
          const partner = enc.partnerId ? partnerMap.get(enc.partnerId) : null;
          return (
            <TouchableOpacity
              key={enc.id}
              onPress={() => router.push({ pathname: '/(modals)/quick-log', params: { id: enc.id, date } })}
            >
              <Card style={styles.encounterCard}>
                <View style={styles.encounterRow}>
                  <Text style={styles.encounterEmojis}>
                    {enc.activities.join(' ')}
                  </Text>
                  {partner && (
                    <Text style={styles.encounterPartner}>{partner.displayName}</Text>
                  )}
                  {!partner && !enc.partnerId && (
                    <Text style={styles.encounterPartner}>Solo</Text>
                  )}
                </View>
                {enc.vibes.length > 0 && (
                  <View style={styles.encounterVibes}>
                    {enc.vibes.map((v) => (
                      <Tag key={v} label={v} isActive />
                    ))}
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          );
        })
      )}

      <Button
        title="Add Another"
        variant="secondary"
        onPress={() => router.push({ pathname: '/(modals)/quick-log', params: { date } })}
        style={{ marginTop: 16 }}
      />
    </ScrollView>
  );
}

function SingleEncounterView({ id }: { id: string }) {
  const router = useRouter();
  const encounter = useEncounterById(id);
  const partner = usePartnerById(encounter?.partnerId);

  const handleDelete = () => {
    Alert.alert(
      'Delete this encounter?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (id) {
              await removeEncounter(id);
              router.back();
            }
          },
        },
      ]
    );
  };

  if (!encounter) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.handle} />

      <Text style={styles.dateTitle}>{formatDate(encounter.date)}</Text>

      <SectionDivider label="Activities" />
      <View style={styles.activitiesRow}>
        {encounter.activities.map((code, i) => (
          <View key={i} style={styles.activityChip}>
            <Text style={styles.activityEmoji}>{code}</Text>
            <Text style={styles.activityLabel}>{getActivityLabel(code)}</Text>
          </View>
        ))}
      </View>

      {partner && (
        <>
          <SectionDivider label="Partner" />
          <Card style={styles.partnerCard}>
            <Text style={styles.partnerName}>{partner.displayName}</Text>
          </Card>
        </>
      )}

      {encounter.rating && (
        <>
          <SectionDivider label="Rating" />
          <Text style={styles.ratingEmoji}>
            {encounter.rating === 'up' ? '\u{1F44D}' : '\u{1F44E}'}
          </Text>
        </>
      )}

      {encounter.vibes.length > 0 && (
        <>
          <SectionDivider label="Vibes" />
          <View style={styles.vibeRow}>
            {encounter.vibes.map((v) => (
              <Tag key={v} label={v} isActive />
            ))}
          </View>
        </>
      )}

      <View style={styles.actions}>
        <Button title="Edit" variant="secondary" onPress={() => {
          router.push({ pathname: '/(modals)/quick-log', params: { id: encounter.id, date: encounter.date } });
        }} />
        <Button title="Delete" variant="secondary" onPress={handleDelete} style={{ marginTop: 8 }} />
      </View>
    </ScrollView>
  );
}

export function EncounterDetailScreen() {
  const { id, date } = useLocalSearchParams<{ id?: string; date?: string }>();

  if (date && !id) {
    return <DayView date={date} />;
  }

  if (id) {
    return <SingleEncounterView id={id} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.loading}>No encounter specified.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmSand },
  content: { padding: spacing.xl, paddingBottom: 40 },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: colors.border, alignSelf: 'center', marginBottom: 16,
  },
  loading: { fontFamily: fonts.dmSans.regular, fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: 40 },
  dateTitle: {
    fontFamily: fonts.playfair.semiBold, fontSize: 22, color: colors.ink, textAlign: 'center', marginBottom: 8,
  },
  activitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  activityChip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  activityEmoji: { fontSize: 18, marginRight: 6 },
  activityLabel: { fontFamily: fonts.dmSans.regular, fontSize: 11, color: colors.ink },
  partnerCard: { padding: 14, marginBottom: 8 },
  partnerName: { fontFamily: fonts.dmSans.medium, fontSize: 14, color: colors.ink },
  ratingEmoji: { fontSize: 32, textAlign: 'center', marginBottom: 8 },
  vibeRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  actions: { marginTop: 24 },
  encounterCard: { padding: 14, marginBottom: 8 },
  encounterRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  encounterEmojis: { fontSize: 20 },
  encounterPartner: { fontFamily: fonts.dmSans.medium, fontSize: 13, color: colors.stone },
  encounterVibes: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
});
