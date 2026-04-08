import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as SMS from 'expo-sms';
import * as Haptics from 'expo-haptics';
import { colors, fonts, spacing, radii } from '@/lib/theme';
import { Card, Button, AvatarBubble, SectionDivider } from '@/lib/components';
import { useActivePartners, useUserProfile, insertWhisperMessage } from '@/src/store';
import { WHISPER_TEMPLATES, getTemplatesByCategory } from '@/src/data/whisper-templates';
import { isPremium } from '@/src/utils/premium';
import type { Partner, WhisperTemplate } from '@/client/schemas';

type Step = 'choose' | 'partner' | 'preview';
type Tab = 'browse' | 'custom';
type Category = 'desire' | 'appreciation' | 'invitation' | 'playful';

export function WhisperComposeScreen() {
  const router = useRouter();
  const profile = useUserProfile();
  const premium = isPremium(profile);

  const [step, setStep] = useState<Step>('choose');
  const [tab, setTab] = useState<Tab>('browse');
  const [category, setCategory] = useState<Category>('desire');
  const [selectedTemplate, setSelectedTemplate] = useState<WhisperTemplate | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const partners = useActivePartners();

  const templates = getTemplatesByCategory(category).filter(
    (t) => premium || t.tier === 'free'
  );

  const finalMessage = selectedTemplate?.messageBody ?? customMessage;

  const handleSend = async (method: 'sms' | 'copy') => {
    if (!selectedPartner || !finalMessage) return;

    if (method === 'sms') {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync([], finalMessage);
      } else {
        Alert.alert('SMS not available', 'Copy the message to clipboard instead.');
        return;
      }
    } else {
      await Clipboard.setStringAsync(finalMessage);
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    await insertWhisperMessage({
      partnerId: selectedPartner.id,
      templateId: selectedTemplate?.id ?? null,
      customBody: tab === 'custom' ? customMessage : null,
      finalMessage,
      deliveryMethod: method,
    });

    Alert.alert(
      method === 'sms' ? 'Whisper sent' : 'Copied!',
      method === 'copy' ? 'Paste it wherever feels right.' : "You said what you needed to say.",
      [{ text: 'Done', onPress: () => router.back() }]
    );
  };

  // Step 1: Choose message
  if (step === 'choose') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.handle} />
        <Text style={styles.title}>Compose Whisper</Text>

        <View style={styles.tabRow}>
          <TouchableOpacity onPress={() => setTab('browse')} style={[styles.tabBtn, tab === 'browse' && styles.tabActive]}>
            <Text style={[styles.tabText, tab === 'browse' && styles.tabTextActive]}>Browse</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('custom')} style={[styles.tabBtn, tab === 'custom' && styles.tabActive]}>
            <Text style={[styles.tabText, tab === 'custom' && styles.tabTextActive]}>Write Your Own</Text>
          </TouchableOpacity>
        </View>

        {tab === 'browse' ? (
          <>
            <View style={styles.categoryRow}>
              {(['desire', 'appreciation', 'invitation', 'playful'] as Category[]).map((c) => (
                <TouchableOpacity key={c} onPress={() => setCategory(c)} style={[styles.catBtn, category === c && styles.catActive]}>
                  <Text style={[styles.catText, category === c && styles.catTextActive]}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {templates.map((t) => (
              <TouchableOpacity key={t.id} onPress={() => { setSelectedTemplate(t); setStep('partner'); }}>
                <Card style={StyleSheet.flatten([styles.templateCard, selectedTemplate?.id === t.id ? styles.templateSelected : undefined])}>
                  <Text style={styles.templatePrompt}>{t.prompt}</Text>
                  <Text style={styles.templatePreview}>{t.messageBody}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <TextInput
              style={styles.customInput}
              value={customMessage}
              onChangeText={setCustomMessage}
              placeholder="What do you wish you could say?"
              placeholderTextColor={colors.muted}
              multiline
              textAlignVertical="top"
            />
            <Button
              title="Next"
              onPress={() => setStep('partner')}
              disabled={!customMessage.trim()}
              style={{ marginTop: 16 }}
            />
          </>
        )}
      </ScrollView>
    );
  }

  // Step 2: Select partner
  if (step === 'partner') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.handle} />
        <Text style={styles.title}>Who is this for?</Text>

        <View style={styles.partnerGrid}>
          {partners.map((p) => (
            <AvatarBubble
              key={p.id}
              partner={p}
              isSelected={selectedPartner?.id === p.id}
              onPress={() => { setSelectedPartner(p); setStep('preview'); }}
              showLabel
            />
          ))}
        </View>

        {partners.length === 0 && (
          <Button title="Add a Partner First" onPress={() => router.push('/(modals)/partner-create')} variant="secondary" />
        )}

        <TouchableOpacity onPress={() => setStep('choose')} style={styles.backLink}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Step 3: Preview and send
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.handle} />
      <Text style={styles.title}>Preview</Text>

      <Card style={styles.previewCard}>
        <Text style={styles.previewTo}>To {selectedPartner?.displayName}</Text>
        <Text style={styles.previewMessage}>{finalMessage}</Text>
      </Card>

      <SectionDivider label="Send via" />
      <Button title="Send as SMS" onPress={() => handleSend('sms')} style={{ marginBottom: 10 }} />
      <Button title="Copy to Clipboard" variant="secondary" onPress={() => handleSend('copy')} />

      <TouchableOpacity onPress={() => setStep('partner')} style={styles.backLink}>
        <Text style={styles.backText}>← Edit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmSand },
  content: { padding: spacing.xl, paddingBottom: 40 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 16 },
  title: { fontFamily: fonts.playfair.semiBold, fontSize: 22, color: colors.ink, textAlign: 'center', marginBottom: 16 },
  tabRow: { flexDirection: 'row', backgroundColor: colors.surface2, borderRadius: 12, padding: 3, marginBottom: 16 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: colors.surface },
  tabText: { fontFamily: fonts.dmSans.medium, fontSize: 11, color: colors.stone },
  tabTextActive: { color: colors.terra },
  categoryRow: { flexDirection: 'row', marginBottom: 12, gap: 6 },
  catBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  catActive: { backgroundColor: colors.terra, borderColor: colors.terra },
  catText: { fontFamily: fonts.dmSans.medium, fontSize: 10, color: colors.stone },
  catTextActive: { color: colors.white },
  templateCard: { marginBottom: 8 },
  templateSelected: { borderColor: colors.terra, borderWidth: 2 },
  templatePrompt: { fontFamily: fonts.playfair.italic, fontSize: 14, color: colors.fig, marginBottom: 4 },
  templatePreview: { fontFamily: fonts.dmSans.light, fontSize: 11, color: colors.stone, lineHeight: 16 },
  customInput: {
    backgroundColor: colors.surface2, borderRadius: radii.md, padding: 14,
    fontFamily: fonts.dmSans.regular, fontSize: 12, color: colors.ink, minHeight: 120, lineHeight: 20,
  },
  partnerGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginVertical: 20 },
  backLink: { alignSelf: 'center', paddingVertical: 12 },
  backText: { fontFamily: fonts.dmSans.medium, fontSize: 12, color: colors.terra },
  previewCard: { padding: 20, marginBottom: 16 },
  previewTo: { fontFamily: fonts.dmSans.medium, fontSize: 10, color: colors.stone, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 },
  previewMessage: { fontFamily: fonts.dmSans.regular, fontSize: 14, color: colors.ink, lineHeight: 22 },
});
