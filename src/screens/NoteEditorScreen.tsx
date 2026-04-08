import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, fonts, spacing, radii } from '@/lib/theme';
import { Button, SectionDivider, EmojiItem } from '@/lib/components';
import { insertNote } from '@/src/store';

const NOTE_EMOJI_TAGS = ['💕', '🔥', '😊', '😢', '💭', '🌟', '❤️‍🔥', '🦋'];

export function NoteEditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string; encounterId?: string }>();
  const [body, setBody] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!body.trim()) return;
    await insertNote({
      body: body.trim(),
      encounterId: params.encounterId || null,
      emojiTags: selectedTags,
    });
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.handle} />

      <Text style={styles.title}>Private Note</Text>
      {params.date && <Text style={styles.date}>{params.date}</Text>}

      <SectionDivider label="Tags" />
      <View style={styles.tagRow}>
        {NOTE_EMOJI_TAGS.map((tag) => (
          <EmojiItem key={tag} emoji={tag} size={32} isSelected={selectedTags.includes(tag)} onPress={() => toggleTag(tag)} />
        ))}
      </View>

      <SectionDivider label="Your thoughts" />
      <TextInput
        style={styles.textArea}
        value={body}
        onChangeText={setBody}
        placeholder="How did it feel? What do you want to remember?"
        placeholderTextColor={colors.muted}
        multiline
        textAlignVertical="top"
        maxLength={2000}
      />
      <Text style={styles.charCount}>{body.length}/2000</Text>

      <Button title="Save Note" onPress={handleSave} disabled={!body.trim()} style={{ marginTop: 16 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmSand },
  content: { padding: spacing.xl, paddingBottom: 40 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 16 },
  title: { fontFamily: fonts.playfair.semiBold, fontSize: 22, color: colors.ink, textAlign: 'center' },
  date: { fontFamily: fonts.dmSans.light, fontSize: 11, color: colors.stone, textAlign: 'center', marginTop: 4, marginBottom: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  textArea: {
    backgroundColor: colors.surface2, borderRadius: radii.md, padding: 14,
    fontFamily: fonts.dmSans.regular, fontSize: 12, color: colors.ink,
    minHeight: 150, lineHeight: 20,
  },
  charCount: { fontFamily: fonts.dmSans.light, fontSize: 9, color: colors.muted, textAlign: 'right', marginTop: 4 },
});
