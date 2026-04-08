import { Stack } from 'expo-router';
import { colors, fonts } from '@/lib/theme';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.warmSand },
        headerTintColor: colors.terra,
        headerTitleStyle: {
          fontFamily: fonts.playfair.semiBold,
          fontSize: 17,
          color: colors.ink,
        },
        headerShadowVisible: false,
        headerBackTitle: 'Back',
        contentStyle: { backgroundColor: colors.warmSand },
      }}
    >
      <Stack.Screen name="quick-log" options={{ title: 'Quick Log' }} />
      <Stack.Screen name="note-editor" options={{ title: 'Private Note' }} />
      <Stack.Screen name="partner-create" options={{ title: 'New Partner' }} />
      <Stack.Screen name="partner-detail" options={{ title: 'Partner' }} />
      <Stack.Screen name="encounter-detail" options={{ title: 'Encounter' }} />
      <Stack.Screen name="whisper-compose" options={{ title: 'Compose' }} />
      <Stack.Screen name="safe-space" options={{ title: 'Safe Space' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="my-affirmations" options={{ title: 'Affirmations' }} />
    </Stack>
  );
}
