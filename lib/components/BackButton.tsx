import React from 'react'
import { Pressable } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import { colors } from '../theme'

export interface BackButtonProps {
  onPress?: () => void
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.surface2,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke={colors.stone}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Polyline points="15 18 9 12 15 6" />
    </Svg>
  </Pressable>
)
