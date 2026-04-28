import React from 'react'
import { Text, View, type ViewStyle } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import { colors, typography } from '../../theme'

interface SectionLabelProps {
  label: string
  showChevron?: boolean
  style?: ViewStyle
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ label, showChevron = false, style }) => (
  <View style={[{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 12,
    marginHorizontal: 24,
    marginBottom: 8,
  }, style]}>
    <Text style={typography.sectionLabelTerra}>{label}</Text>
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
