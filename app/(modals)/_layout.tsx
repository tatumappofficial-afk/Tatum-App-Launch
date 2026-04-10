import { Stack } from 'expo-router';
import { colors, fonts } from '@/lib/theme';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.warmSand },
        headerTintColor: colors.terra,
        headerTitle: '',
        headerShadowVisible: false,
        headerBackTitle: 'Back',
        contentStyle: { backgroundColor: colors.warmSand },
      }}
    >
      <Stack.Screen name="quick-log" />
      <Stack.Screen name="note-editor" />
      <Stack.Screen name="partner-create" />
      <Stack.Screen name="partner-detail" />
      <Stack.Screen name="encounter-detail" />
      <Stack.Screen name="whisper-compose" />
      <Stack.Screen name="safe-space" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="my-affirmations" />
    </Stack>
  );
}
