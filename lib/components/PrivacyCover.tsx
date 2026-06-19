import React from 'react'
import { Image, View } from 'react-native'
import { colors } from '../theme'

/**
 * Opaque, branded full-screen cover with no interactive controls.
 *
 * Rendered whenever AppState is not 'active' (inactive or background) so the OS
 * never captures session/partner content in the app-switcher / multitasking
 * snapshot. Always on, independent of the biometric lock setting.
 */
export const PrivacyCover: React.FC = () => (
  <View
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.warmSand,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      elevation: 9999,
    }}
  >
    <View
      style={{
        width: 120,
        height: 120,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#7C4A5A',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.32,
        shadowRadius: 36,
        elevation: 12,
      }}
    >
      <Image source={require('@/assets/icon.png')} style={{ width: 120, height: 120 }} />
    </View>
  </View>
)
