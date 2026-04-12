import React from 'react'
import { Pressable, Text, View } from 'react-native'
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg'
import { colors, font, fontFamily } from '../../theme'

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

const TabIcon: React.FC<{ name: Tab; size: number; color: string }> = ({ name, size, color }) => {
  switch (name) {
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M3 12l9-8 9 8" />
          <Path d="M5 10v9a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-9" />
        </Svg>
      )
    case 'calendar':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <Rect x={3} y={4} width={18} height={18} rx={2} />
          <Line x1={16} y1={2} x2={16} y2={6} />
          <Line x1={8} y1={2} x2={8} y2={6} />
          <Line x1={3} y1={10} x2={21} y2={10} />
        </Svg>
      )
    case 'journal':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </Svg>
      )
    case 'profile':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <Circle cx={12} cy={7} r={4} />
        </Svg>
      )
    default:
      return null
  }
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
            onPress={() => onTabPress?.('log')}
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              ...({ background: 'linear-gradient(135deg, #C07858, #7C4A5A)' } as any),
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -14,
              boxShadow: '0 4px 16px rgba(124,74,90,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
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
          onPress={() => onTabPress?.(tab.id)}
          style={{ alignItems: 'center', gap: 2 }}
        >
          <TabIcon name={tab.id} size={21} color={isActive ? colors.terra : colors.stone} />
          <Text style={{
            fontFamily: font('dmSans', '500'),
            fontSize: 6.5,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            color: isActive ? colors.terra : colors.stone,
          }}>{tab.label}</Text>
        </Pressable>
      )
    })}
  </View>
)
