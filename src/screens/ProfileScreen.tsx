import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, radii, shadows } from '@/lib/theme';
import { Card, SectionDivider } from '@/lib/components';
import { useUserProfile } from '@/src/store';
import { isPremium } from '@/src/utils/premium';

interface MenuItem {
  label: string;
  emoji: string;
  route: string;
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Safe Space', emoji: '🔮', route: '/(modals)/safe-space' },
  { label: 'Private Notes', emoji: '📝', route: '/(modals)/note-editor' },
  { label: 'My Affirmations', emoji: '✨', route: '/(modals)/my-affirmations' },
  { label: 'Settings', emoji: '⚙️', route: '/(modals)/settings' },
];

export function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const profile = useUserProfile();
  const premium = isPremium(profile);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {profile.displayName ? `Hey, ${profile.displayName}` : 'Hey, you'}
        </Text>
        <View style={[styles.tierBadge, premium && styles.premiumBadge]}>
          <Text style={[styles.tierText, premium && styles.premiumText]}>
            {premium ? 'PREMIUM' : 'FREE'}
          </Text>
        </View>
      </View>

      <Text style={styles.tagline}>Your truth, all in one place.</Text>

      <SectionDivider label="Your Space" />

      {MENU_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.route}
          onPress={() => router.push(item.route as any)}
          activeOpacity={0.7}
        >
          <Card style={styles.menuCard}>
            <Text style={styles.menuEmoji}>{item.emoji}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </Card>
        </TouchableOpacity>
      ))}

      <SectionDivider label="About" />

      <Card style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>Tatum</Text>
        <Text style={styles.aboutTagline}>
          Track Authentic Truths Unapologetically Mine
        </Text>
        <Text style={styles.aboutVersion}>Version 1.0.0</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmSand },
  content: { paddingHorizontal: spacing.xl, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  greeting: {
    fontFamily: fonts.playfair.bold,
    fontSize: 28,
    color: colors.ink,
  },
  tierBadge: {
    backgroundColor: colors.surface2,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  premiumBadge: {
    backgroundColor: colors.gold,
  },
  tierText: {
    fontFamily: fonts.dmSans.medium,
    fontSize: 8,
    color: colors.stone,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  premiumText: {
    color: colors.white,
  },
  tagline: {
    fontFamily: fonts.playfair.italic,
    fontSize: 14,
    color: colors.fig,
    marginBottom: 16,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 16,
  },
  menuEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  menuLabel: {
    fontFamily: fonts.dmSans.medium,
    fontSize: 14,
    color: colors.ink,
    flex: 1,
  },
  menuArrow: {
    fontFamily: fonts.playfair.semiBold,
    fontSize: 22,
    color: colors.terra,
  },
  aboutCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  aboutTitle: {
    fontFamily: fonts.playfair.bold,
    fontSize: 22,
    color: colors.terra,
  },
  aboutTagline: {
    fontFamily: fonts.dmSans.light,
    fontSize: 10,
    color: colors.stone,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
    textAlign: 'center',
  },
  aboutVersion: {
    fontFamily: fonts.dmSans.light,
    fontSize: 9,
    color: colors.muted,
    marginTop: 8,
  },
});
