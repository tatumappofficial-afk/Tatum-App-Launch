import React from 'react'
import { colors, webFonts } from '../theme'

export interface SettingsRowProps {
  icon: React.ReactNode
  iconBg: string
  title: string
  subtitle: string
  trailing?: React.ReactNode
  destructive?: boolean
  onPress?: () => void
  showBorder?: boolean
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  iconBg,
  title,
  subtitle,
  trailing,
  destructive = false,
  onPress,
  showBorder = true,
}) => (
  <div
    onClick={onPress}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '14px 16px',
      borderBottom: showBorder ? '1px solid rgba(160,100,80,0.1)' : 'none',
      cursor: 'pointer',
      position: 'relative',
    }}
  >
    <div style={{
      width: 32,
      height: 32,
      borderRadius: 9,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginRight: 12,
      background: iconBg,
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{
        fontSize: 14,
        fontWeight: 500,
        fontFamily: webFonts.dmSans,
        color: destructive ? colors.mauve : colors.ink,
        lineHeight: 1.2,
      }}>{title}</div>
      <div style={{
        fontSize: 11,
        fontWeight: 300,
        fontFamily: webFonts.dmSans,
        color: colors.stone,
        marginTop: 1,
      }}>{subtitle}</div>
    </div>
    {trailing}
  </div>
)
