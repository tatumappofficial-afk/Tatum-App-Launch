import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import Svg, { Line } from 'react-native-svg'
import { Ionicons } from '@expo/vector-icons'
import { colors, font, gradientPoints, gradients } from '../../theme'

type Tab = 'home' | 'calendar' | 'log' | 'journal' | 'profile'

interface BottomNavProps {
  activeTab?: Tab
  onTabPress?: (tab: Tab) => void
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'log', label: '' },
  { id: 'journal', label: 'Sessions' },
  { id: 'profile', label: 'Profile' },
]

const TAB_ICONS: Record<Exclude<Tab, 'log'>, keyof typeof Ionicons.glyphMap> = {
  home: 'home-outline',
  calendar: 'calendar-outline',
  journal: 'book-outline',
  profile: 'person-outline',
}

const TabIcon: React.FC<{ name: Tab; size: number; color: string }> = ({ name, size, color }) => {
  if (name === 'log') return null
  return <Ionicons name={TAB_ICONS[name]} size={size} color={color} />
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab = 'home', onTabPress }) => (
  <View style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(160,100,80,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 100,
    paddingBottom: 8,
  }}>
    {tabs.map((tab) => {
      if (tab.id === 'log') {
        return (
          <Pressable
            key="log"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              onTabPress?.('log')
            }}
            accessibilityRole="button"
            accessibilityLabel="Log a session"
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -14,
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
              style={[StyleSheet.absoluteFill, { borderRadius: 26 }]}
            />
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round">
              <Line x1={12} y1={5} x2={12} y2={19} />
              <Line x1={5} y1={12} x2={19} y2={12} />
            </Svg>
          </Pressable>
        )
      }
      const isActive = activeTab === tab.id
      return (
        <Pressable
          key={tab.id}
          onPress={() => {
            if (!isActive) Haptics.selectionAsync()
            onTabPress?.(tab.id)
          }}
          accessibilityRole="tab"
          accessibilityLabel={tab.label}
          accessibilityState={{ selected: isActive }}
          hitSlop={8}
          style={{ alignItems: 'center', gap: 2 }}
        >
          <TabIcon name={tab.id} size={21} color={isActive ? colors.terra : colors.stone} />
          <Text style={{
            fontFamily: font('dmSans', '500'),
            fontSize: 11,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            color: isActive ? colors.terra : colors.stone,
          }}>{tab.label}</Text>
        </Pressable>
      )
    })}
  </View>
)
