import React from 'react'
import { colors, webFonts } from '../../theme'

export const StatusBar: React.FC = () => (
  <div style={{
    height: 50,
    padding: '14px 24px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 11,
  }}>
    <span style={{
      fontFamily: webFonts.dmSans,
      fontSize: 15,
      fontWeight: 600,
      color: colors.stone,
    }}>9:41</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {/* Signal bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
        {[4, 6, 9, 12].map((h, i) => (
          <div key={i} style={{
            width: 3,
            height: h,
            borderRadius: 1,
            backgroundColor: colors.stone,
          }} />
        ))}
      </div>
      {/* WiFi */}
      <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
        <path d="M7.5 10.5a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zM3.75 8.1a5.25 5.25 0 017.5 0" stroke={colors.stone} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M1.5 5.4a9 9 0 0112 0" stroke={colors.stone} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      {/* Battery */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          width: 25,
          height: 12,
          border: `1.5px solid ${colors.stone}`,
          borderRadius: 3,
          padding: 1.5,
          position: 'relative',
        }}>
          <div style={{
            width: '72%',
            height: '100%',
            backgroundColor: colors.stone,
            borderRadius: 1,
          }} />
        </div>
        <div style={{
          width: 2,
          height: 5,
          backgroundColor: colors.stone,
          borderRadius: '0 1px 1px 0',
          marginLeft: 0.5,
        }} />
      </div>
    </div>
  </div>
)
