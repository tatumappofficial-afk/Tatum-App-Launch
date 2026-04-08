import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, spacing, radii } from '@/lib/theme';
import { Card, SectionDivider, Button } from '@/lib/components';
import { useUserProfile, updateUserProfile, updateUserSettings } from '@/src/store';
import type { UserSettings } from '@/client/schemas';

export function SettingsScreen() {
  const router = useRouter();
  const profile = useUserProfile();
  const [displayName, setDisplayName] = useState(profile.displayName ?? '');
  const [settings, setSettings] = useState<UserSettings>(profile.settings);

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    updateUserSettings({ [key]: value });
  };

  const saveName = () => {
    updateUserProfile({ displayName: displayName.trim() || null });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.handle} />
      <Text style={styles.title}>Settings</Text>

      <SectionDivider label="Profile" />
      <Card style={styles.row}>
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          onBlur={saveName}
          placeholder="What should we call you?"
          placeholderTextColor={colors.muted}
        />
      </Card>

      <SectionDivider label="Preferences" />

      <Card style={styles.row}>
        <Text style={styles.label}>Calendar starts on Monday</Text>
        <Switch
          value={settings.calendarStartDay === 'monday'}
          onValueChange={(v) => updateSetting('calendarStartDay', v ? 'monday' : 'sunday')}
          trackColor={{ true: colors.terra, false: colors.surface2 }}
          thumbColor={colors.white}
        />
      </Card>

      <Card style={styles.row}>
        <Text style={styles.label}>Biometric Lock</Text>
        <Switch
          value={settings.biometricLock}
          onValueChange={(v) => updateSetting('biometricLock', v)}
          trackColor={{ true: colors.terra, false: colors.surface2 }}
          thumbColor={colors.white}
        />
      </Card>

      <Card style={styles.row}>
        <Text style={styles.label}>Notifications</Text>
        <Switch
          value={settings.notifications}
          onValueChange={(v) => updateSetting('notifications', v)}
          trackColor={{ true: colors.terra, false: colors.surface2 }}
          thumbColor={colors.white}
        />
      </Card>

      <Button title="Done" variant="secondary" onPress={() => router.back()} style={{ marginTop: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.warmSand },
  content: { padding: spacing.xl, paddingBottom: 40 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 16 },
  title: { fontFamily: fonts.playfair.semiBold, fontSize: 22, color: colors.ink, textAlign: 'center', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, marginBottom: 8 },
  label: { fontFamily: fonts.dmSans.medium, fontSize: 13, color: colors.ink, flex: 1 },
  input: { fontFamily: fonts.dmSans.regular, fontSize: 13, color: colors.ink, textAlign: 'right', flex: 1 },
});
