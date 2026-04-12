import React from 'react'
import { Text, View } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import { colors, font, fontFamily } from '../../theme'

interface SectionLabelProps {
  label: string
  showChevron?: boolean
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ label, showChevron = false }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 12,
    marginHorizontal: 24,
    marginBottom: 8,
  }}>
    <Text style={{
      fontFamily: font('dmSans', '500'),
      fontSize: 8,
      letterSpacing: 3,
      textTransform: 'uppercase',
      color: colors.terra,
    }}>{label}</Text>
    <View style={{
      flex: 1,
      height: 1,
      backgroundColor: 'rgba(160,100,80,0.18)',
    }} />
    {showChevron && (
      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Polyline points="9 18 15 12 9 6" />
      </Svg>
    )}
  </View>
)
