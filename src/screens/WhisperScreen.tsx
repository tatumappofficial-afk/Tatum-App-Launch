import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, radii } from '@/lib/theme';
import { Card, Button, EmptyState, SectionDivider } from '@/lib/components';
import { useWhisperHistory, usePartnerMap } from '@/src/store';
import type { WhisperMessage, Partner } from '@/client/schemas';

export function WhisperScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const history = useWhisperHistory(50);
  const partnerMap = usePartnerMap();

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Tatum Whisper</Text>
      <Text style={styles.subtitle}>
        She knows what she wants.{'\n'}Tatum says it for her.
      </Text>

      <Button
        title="Send a Whisper"
        onPress={() => router.push('/(modals)/whisper-compose')}
        style={{ marginVertical: 20 }}
      />

      {history.length > 0 ? (
        <>
          <SectionDivider label="History" />
          {history.map((msg) => {
            const partner = partnerMap.get(msg.partnerId);
            return (
              <Card key={msg.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyPartner}>
                    To {partner?.displayName ?? 'Someone'}
                  </Text>
                  <Text style={styles.historyTime}>{formatTime(msg.sentAt)}</Text>
                </View>
                <Text style={styles.historyPreview} numberOfLines={2}>
                  {msg.finalMessage}
                </Text>
                <View style={styles.deliveryBadge}>
                  <Text style={styles.deliveryText}>
                    {msg.deliveryMethod === 'sms' ? 'SMS' : msg.deliveryMethod === 'copy' ? 'Copied' : 'In-App'}
                  </Text>
                </View>
              </Card>
            );
          })}
        </>
      ) : (
        <EmptyState
          emoji="💬"
          title="No whispers yet"
          subtitle="When you're ready to say something, Tatum will help you find the words."
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmSand },
  content: { paddingHorizontal: spacing.xl, paddingBottom: 100 },
  title: {
    fontFamily: fonts.playfair.bold,
    fontSize: 28,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fonts.playfair.italic,
    fontSize: 14,
    color: colors.fig,
    marginTop: 4,
    lineHeight: 22,
  },
  historyCard: {
    marginBottom: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyPartner: {
    fontFamily: fonts.dmSans.medium,
    fontSize: 12,
    color: colors.ink,
  },
  historyTime: {
    fontFamily: fonts.dmSans.light,
    fontSize: 10,
    color: colors.stone,
  },
  historyPreview: {
    fontFamily: fonts.dmSans.regular,
    fontSize: 12,
    color: colors.ink,
    lineHeight: 18,
    marginBottom: 8,
  },
  deliveryBadge: {
    backgroundColor: colors.surface2,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  deliveryText: {
    fontFamily: fonts.dmSans.medium,
    fontSize: 8,
    color: colors.stone,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
