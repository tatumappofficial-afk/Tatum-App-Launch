import React from 'react'
import { colors } from '../theme'

export const LaunchScreen: React.FC = () => (
  <div style={{
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Ambient glow behind icon */}
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -58%)',
      width: 280,
      height: 280,
      background: 'radial-gradient(circle, rgba(192,120,88,0.12) 0%, transparent 65%)',
      pointerEvents: 'none',
    }} />

    {/* App icon */}
    <div style={{
      width: 100,
      height: 100,
      borderRadius: 24,
      background: 'linear-gradient(135deg, #C07858, #7C4A5A)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 1,
      boxShadow: '0 12px 36px rgba(124,74,90,0.3), 0 4px 12px rgba(61,43,37,0.15)',
    }}>
      <span style={{
        fontSize: 24,
        color: colors.white,
        lineHeight: 1,
        position: 'relative',
        zIndex: 1,
      }}>&#10022;</span>
    </div>
  </div>
)
