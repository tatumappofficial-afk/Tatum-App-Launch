import React from 'react'
import { Pressable, Text, View, type ViewStyle } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import { colors, typography } from '../../theme'

interface SectionLabelProps {
  label: string
  showChevron?: boolean
  onPress?: () => void
  style?: ViewStyle
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ label, showChevron = false, onPress, style }) => {
  const containerStyle = [{
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginVertical: 12,
    marginHorizontal: 24,
    marginBottom: 8,
  }, style]

  const content = (
    <>
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
    </>
  )

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={containerStyle}>
        {content}
      </Pressable>
    )
  }
  return <View style={containerStyle}>{content}</View>
}
