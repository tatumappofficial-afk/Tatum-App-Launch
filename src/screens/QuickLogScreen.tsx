import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, fonts, spacing, radii } from '@/lib/theme';
import { EmojiItem, AvatarBubble, SoloAvatar, Button, Tag, MilestoneCelebration, SectionDivider } from '@/lib/components';
import { useActivePartners, useShownMilestones, useEncounterById, insertEncounter, updateEncounter, markMilestoneShown, encountersCollection } from '@/src/store';
import { ACTIVITIES } from '@/src/data/activities';
import { VIBE_TAGS } from '@/src/data/vibes';
import { MILESTONES, getMilestoneByKey } from '@/src/data/milestones';
import type { Encounter } from '@/client/schemas';

export function QuickLogScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ emoji?: string; date?: string; id?: string }>();
  const date = params.date || new Date().toISOString().split('T')[0];
  const isEditing = !!params.id;
  const existingEncounter = useEncounterById(params.id);

  const [selectedEmojis, setSelectedEmojis] = useState<string[]>(
    params.emoji ? [params.emoji] : []
  );
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [isSolo, setIsSolo] = useState(false);
  const partners = useActivePartners();
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [milestone, setMilestone] = useState<any>(null);
  const shownMilestones = useShownMilestones();
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (existingEncounter && !prefilled) {
      setSelectedEmojis(existingEncounter.activities);
      setSelectedPartner(existingEncounter.partnerId);
      setIsSolo(!existingEncounter.partnerId);
      setRating(existingEncounter.rating);
      setSelectedVibes(existingEncounter.vibes);
      if (existingEncounter.rating || existingEncounter.vibes.length > 0) {
        setShowRating(true);
      }
      setPrefilled(true);
    }
  }, [existingEncounter, prefilled]);

  const toggleEmoji = (code: string) => {
    setSelectedEmojis((prev) =>
      prev.includes(code) ? prev.filter((e) => e !== code) : [...prev, code]
    );
  };

  const selectPartner = (id: string) => {
    setIsSolo(false);
    setSelectedPartner(id === selectedPartner ? null : id);
  };

  const selectSolo = () => {
    setSelectedPartner(null);
    setIsSolo(!isSolo);
  };

  const toggleVibe = (vibe: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const handleLog = async () => {
    if (selectedEmojis.length === 0) return;

    if (isEditing && params.id) {
      await updateEncounter(params.id, {
        date,
        activities: selectedEmojis,
        partnerId: selectedPartner,
        rating,
        vibes: selectedVibes as Encounter['vibes'],
      });
      router.back();
      return;
    }

    await insertEncounter({
      date,
      activities: selectedEmojis,
      partnerId: selectedPartner,
      rating,
      vibes: selectedVibes,
    });

    // Check milestones
    const totalCount = encountersCollection.size;

    let triggeredMilestone = null;
    if (totalCount === 1 && !shownMilestones.has('first_log')) {
      triggeredMilestone = getMilestoneByKey('first_log');
      markMilestoneShown('first_log');
    } else if (totalCount === 10 && !shownMilestones.has('encounters_10')) {
      triggeredMilestone = getMilestoneByKey('encounters_10');
      markMilestoneShown('encounters_10');
    } else if (totalCount === 50 && !shownMilestones.has('encounters_50')) {
      triggeredMilestone = getMilestoneByKey('encounters_50');
      markMilestoneShown('encounters_50');
    }

    if (triggeredMilestone) {
      setMilestone(triggeredMilestone);
    } else {
      router.back();
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  if (milestone) {
    return (
      <MilestoneCelebration
        milestone={milestone}
        onDismiss={() => router.back()}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.handle} />

      <Text style={styles.dateTitle}>{formatDate(date)}</Text>

      <SectionDivider label="What happened?" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiRow}>
        {ACTIVITIES.map((a) => (
          <EmojiItem
            key={a.code}
            emoji={a.code}
            isSelected={selectedEmojis.includes(a.code)}
            onPress={() => toggleEmoji(a.code)}
          />
        ))}
      </ScrollView>

      <SectionDivider label="With who?" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.partnerRow}>
        <SoloAvatar isSelected={isSolo} onPress={selectSolo} />
        {partners.map((p) => (
          <AvatarBubble
            key={p.id}
            partner={p}
            isSelected={selectedPartner === p.id}
            onPress={() => selectPartner(p.id)}
            showLabel
          />
        ))}
        <AvatarBubble
          isAdd
          onPress={() => router.push('/(modals)/partner-create')}
          showLabel
        />
      </ScrollView>

      {!showRating ? (
        <TouchableOpacity onPress={() => setShowRating(true)} style={styles.expandLink}>
          <Text style={styles.expandText}>Rate it</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.ratingSection}>
          <SectionDivider label="How was it?" />
          <View style={styles.thumbsRow}>
            <TouchableOpacity
              onPress={() => setRating(rating === 'up' ? null : 'up')}
              style={[styles.thumbBtn, rating === 'up' && styles.thumbUpActive]}
            >
              <Text style={styles.thumbEmoji}>👍</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setRating(rating === 'down' ? null : 'down')}
              style={[styles.thumbBtn, rating === 'down' && styles.thumbDownActive]}
            >
              <Text style={styles.thumbEmoji}>👎</Text>
            </TouchableOpacity>
          </View>

          <SectionDivider label="Vibe" />
          <View style={styles.vibeRow}>
            {VIBE_TAGS.map((v) => (
              <Tag
                key={v}
                label={v}
                isActive={selectedVibes.includes(v)}
                onPress={() => toggleVibe(v)}
              />
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity
        onPress={() => router.push({ pathname: '/(modals)/note-editor', params: { date } })}
        style={styles.expandLink}
      >
        <Text style={styles.expandText}>Add a note</Text>
      </TouchableOpacity>

      <Button
        title={isEditing ? "Save" : "Log It"}
        onPress={handleLog}
        disabled={selectedEmojis.length === 0}
        style={{ marginTop: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmSand },
  content: { padding: spacing.xl, paddingBottom: 40 },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  dateTitle: {
    fontFamily: fonts.playfair.semiBold,
    fontSize: 22,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 8,
  },
  emojiRow: { marginBottom: 8 },
  partnerRow: { marginBottom: 8 },
  expandLink: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  expandText: {
    fontFamily: fonts.dmSans.medium,
    fontSize: 12,
    color: colors.terra,
    textDecorationLine: 'underline',
  },
  ratingSection: { marginBottom: 8 },
  thumbsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12,
  },
  thumbBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbUpActive: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  thumbDownActive: {
    backgroundColor: colors.mauve,
    borderColor: colors.mauve,
  },
  thumbEmoji: { fontSize: 20 },
  vibeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
