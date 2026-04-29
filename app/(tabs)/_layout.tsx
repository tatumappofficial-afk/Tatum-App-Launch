import { Tabs } from 'expo-router/tabs'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import Svg, { Line } from 'react-native-svg'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, fontFamily, gradientPoints, gradients } from '@/lib/theme'

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: 'home-outline',
  calendar: 'calendar-outline',
  journal: 'book-outline',
  profile: 'person-outline',
}

function TabIcon({ name, color, size = 22 }: { name: string; color: string; size?: number }) {
  const iconName = TAB_ICONS[name]
  if (!iconName) return null
  return <Ionicons name={iconName} size={size} color={color} />
}

function FAB(props: any) {
  const router = useRouter()
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel="Log a session"
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        router.push('/(sheets)/log-session')
      }}
      style={[props.style, { alignItems: 'center', justifyContent: 'center' }]}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          shadowColor: '#7C4A5A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <LinearGradient
          colors={gradients.primaryCta}
          start={gradientPoints.diagonal.start}
          end={gradientPoints.diagonal.end}
          style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
        />
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round">
          <Line x1={12} y1={5} x2={12} y2={19} />
          <Line x1={5} y1={12} x2={19} y2={12} />
        </Svg>
      </View>
    </Pressable>
  )
}

export default function TabLayout() {
  const insets = useSafeAreaInsets()
  const androidExtra = insets.bottom + 12
  // Only override paddingBottom / height on Android. On iOS, React Navigation
  // applies the bottom safe-area inset automatically — overriding it (even with
  // 0 / undefined) hides the bar behind the home indicator.
  const tabBarStyle =
    Platform.OS === 'android'
      ? {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: 'rgba(160,100,80,0.15)',
          paddingBottom: androidExtra,
          height: 60 + androidExtra,
        }
      : {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: 'rgba(160,100,80,0.15)',
        }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.warmSand },
        tabBarActiveTintColor: colors.terra,
        tabBarInactiveTintColor: colors.stone,
        tabBarStyle,
        tabBarLabelStyle: {
          fontFamily: fontFamily.dmSans,
          fontSize: 12,
          fontWeight: '500',
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <TabIcon name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="fab"
        options={{
          title: '',
          tabBarButton: (props) => <FAB {...props} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Sessions',
          tabBarIcon: ({ color }) => <TabIcon name="journal" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon name="profile" color={color} />,
        }}
      />
    </Tabs>
  )
}
