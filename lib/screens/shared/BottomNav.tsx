import React from 'react'
import { colors, webFonts } from '../../theme'

type Tab = 'home' | 'calendar' | 'log' | 'journal' | 'profile'

interface BottomNavProps {
  activeTab?: Tab
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'home-outline' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar-outline' },
  { id: 'log', label: '', icon: '' },
  { id: 'journal', label: 'Sessions', icon: 'book-outline' },
  { id: 'profile', label: 'Profile', icon: 'person-outline' },
]

const IonIcon: React.FC<{ name: string; size: number; color: string }> = ({ name, size, color }) => {
  // Simple SVG icons matching Ionicons outline style
  const icons: Record<string, React.ReactNode> = {
    'home-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-8 9 8"/>
        <path d="M5 10v9a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-9"/>
      </svg>
    ),
    'calendar-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    'book-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
    'person-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  }
  return <>{icons[name] || null}</>
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab = 'home' }) => (
  <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: colors.surface,
    borderTop: `1px solid rgba(160,100,80,0.15)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 100,
    paddingBottom: 8,
  }}>
    {tabs.map((tab) => {
      if (tab.id === 'log') {
        return (
          <div key="log" style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #C07858, #7C4A5A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: -14,
            boxShadow: '0 4px 16px rgba(124,74,90,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            cursor: 'pointer',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
        )
      }
      const isActive = activeTab === tab.id
      return (
        <div key={tab.id} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          cursor: 'pointer',
        }}>
          <IonIcon name={tab.icon} size={21} color={isActive ? colors.terra : colors.stone} />
          <span style={{
            fontFamily: webFonts.dmSans,
            fontSize: 6.5,
            fontWeight: 500,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            color: isActive ? colors.terra : colors.stone,
          }}>{tab.label}</span>
        </div>
      )
    })}
  </div>
)
