import React from 'react'
import { Image, View, Text, Pressable } from 'react-native'
import { colors, font } from '../theme'

export interface LockOverlayProps {
  showRetry?: boolean
  onUnlock?: () => void
}

export const LockOverlay: React.FC<LockOverlayProps> = ({ showRetry, onUnlock }) => (
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
    {showRetry && onUnlock && (
      <Pressable
        onPress={onUnlock}
        accessibilityRole="button"
        accessibilityLabel="Unlock Tatum"
        style={({ pressed }) => ({
          marginTop: 36,
          paddingHorizontal: 28,
          paddingVertical: 14,
          borderRadius: 9999,
          backgroundColor: colors.terra,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Text
          style={{
            color: colors.white,
            fontFamily: font('dmSans', '500'),
            fontSize: 14,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          Unlock
        </Text>
      </Pressable>
    )}
  </View>
)
