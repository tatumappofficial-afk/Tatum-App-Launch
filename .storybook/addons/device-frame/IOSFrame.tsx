import React from 'react'
import type { DeviceSpec } from './devices'

const StatusBar: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 54,
      padding: '14px 24px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 9998,
      pointerEvents: 'none',
    }}
  >
    <span
      style={{
        fontFamily: "'SF Pro Text', 'DM Sans', -apple-system, sans-serif",
        fontSize: 15,
        fontWeight: 600,
        color: '#1C1C1E',
      }}
    >
      9:41
    </span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {/* Signal bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
        {[4, 6, 9, 12].map((h, i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: h,
              borderRadius: 1,
              backgroundColor: '#1C1C1E',
            }}
          />
        ))}
      </div>
      {/* WiFi */}
      <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
        <path
          d="M7.5 10.5a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zM3.75 8.1a5.25 5.25 0 017.5 0"
          stroke="#1C1C1E"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M1.5 5.4a9 9 0 0112 0"
          stroke="#1C1C1E"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {/* Battery */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: 25,
            height: 12,
            border: '1.5px solid #1C1C1E',
            borderRadius: 3,
            padding: 1.5,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '72%',
              height: '100%',
              backgroundColor: '#1C1C1E',
              borderRadius: 1,
            }}
          />
        </div>
        <div
          style={{
            width: 2,
            height: 5,
            backgroundColor: '#1C1C1E',
            borderRadius: '0 1px 1px 0',
            marginLeft: 0.5,
          }}
        />
      </div>
    </div>
  </div>
)

const DynamicIsland: React.FC<{
  width: number
  height: number
  top: number
}> = ({ width, height, top }) => (
  <div
    style={{
      position: 'fixed',
      top,
      left: '50%',
      transform: 'translateX(-50%)',
      width,
      height,
      backgroundColor: '#000000',
      borderRadius: height / 2,
      zIndex: 9999,
      pointerEvents: 'none',
    }}
  />
)

const HomeIndicator: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      bottom: 8,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 134,
      height: 5,
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderRadius: 3,
      zIndex: 9999,
      pointerEvents: 'none',
    }}
  />
)

export const IOSOverlay: React.FC<{ device: DeviceSpec }> = ({ device }) => (
  <>
    <StatusBar />
    {device.dynamicIsland && (
      <DynamicIsland
        width={device.dynamicIsland.width}
        height={device.dynamicIsland.height}
        top={device.dynamicIsland.top}
      />
    )}
    <HomeIndicator />
  </>
)
