import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { colors, font, fontFamily } from '../theme'

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
  <Pressable
    onPress={onPress}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      paddingHorizontal: 16,
      borderBottomWidth: showBorder ? 1 : 0,
      borderBottomColor: 'rgba(160,100,80,0.1)',
    }}
  >
    <View style={{
      width: 32,
      height: 32,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginRight: 12,
      backgroundColor: iconBg,
    }}>
      {icon}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{
        fontSize: 16,
        fontFamily: font('dmSans', '500'),
        color: destructive ? colors.mauve : colors.ink,
        lineHeight: 16.8,
      }}>{title}</Text>
      <Text style={{
        fontSize: 14,
        fontFamily: font('dmSans', '300'),
        color: colors.stone,
        marginTop: 1,
      }}>{subtitle}</Text>
    </View>
    {trailing}
  </Pressable>
)
