import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, fonts, shadows } from '@/lib/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabButtonProps {
  icon: IoniconsName;
  label: string;
  isFocused?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

const TabButton = forwardRef<View, TabButtonProps>(
  ({ icon, label, isFocused, ...props }, ref) => {
    return (
      <TouchableOpacity
        ref={ref as any}
        {...props}
        style={styles.tabButton}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isFocused ? (icon.replace('-outline', '') as IoniconsName) : icon}
          size={22}
          color={isFocused ? colors.terra : colors.stone}
        />
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }
);

export default function TabLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot />

      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <TabTrigger name="home" href="/" asChild>
          <TabButton icon="calendar-outline" label="Calendar" />
        </TabTrigger>

        <TabTrigger name="stats" href="/stats" asChild>
          <TabButton icon="bar-chart-outline" label="Stats" />
        </TabTrigger>

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => router.push('/(modals)/quick-log')}
          accessibilityLabel="Quick Log"
        >
          <Text style={styles.fabIcon}>✦</Text>
        </TouchableOpacity>

        <TabTrigger name="whisper" href="/whisper" asChild>
          <TabButton icon="chatbubble-outline" label="Whisper" />
        </TabTrigger>

        <TabTrigger name="profile" href="/profile" asChild>
          <TabButton icon="person-outline" label="Profile" />
        </TabTrigger>
      </View>

      <TabList style={styles.hidden}>
        <TabTrigger name="home" href="/" />
        <TabTrigger name="stats" href="/stats" />
        <TabTrigger name="whisper" href="/whisper" />
        <TabTrigger name="profile" href="/profile" />
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontFamily: fonts.dmSans.medium,
    fontSize: 8.5,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.stone,
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.terra,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.terra,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    ...shadows.button,
  },
  fabIcon: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  hidden: {
    display: 'none',
  },
});
