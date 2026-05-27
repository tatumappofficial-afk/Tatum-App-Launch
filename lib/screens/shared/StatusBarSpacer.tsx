import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface StatusBarSpacerProps {
  /** Extra padding below the safe-area inset, in points. Default 6. */
  extra?: number
}

/**
 * Vertical space equal to the device's top safe-area inset (status bar /
 * Dynamic Island / notch area), plus a small breathing-room offset.
 *
 * Replaces the hard-coded `<View style={{ height: 54 }} />` placeholders
 * that assumed iPhone safe-area dimensions.
 */
export const StatusBarSpacer: React.FC<StatusBarSpacerProps> = ({ extra = 6 }) => {
  const insets = useSafeAreaInsets()
  return <View style={{ height: insets.top + extra }} />
}
