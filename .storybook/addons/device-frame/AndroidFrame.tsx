import React from 'react'
import type { DeviceSpec } from './devices'

const StatusBar: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 28,
      padding: '4px 16px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 9998,
      pointerEvents: 'none',
    }}
  >
    <span
      style={{
        fontFamily: "'Roboto', 'DM Sans', sans-serif",
        fontSize: 12,
        fontWeight: 500,
        color: '#1C1C1E',
      }}
    >
      9:41
    </span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      {/* WiFi */}
      <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
        <path
          d="M7 9.5a1 1 0 110 2 1 1 0 010-2zM4 7.2a4.5 4.5 0 016 0"
          stroke="#1C1C1E"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M1.5 4.6a8 8 0 0111 0"
          stroke="#1C1C1E"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
      {/* Signal — triangular Android style */}
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M0 12L12 0v12H0z" fill="#1C1C1E" opacity="0.85" />
      </svg>
      {/* Battery percentage */}
      <span
        style={{
          fontFamily: "'Roboto', 'DM Sans', sans-serif",
          fontSize: 10,
          fontWeight: 500,
          color: '#1C1C1E',
          marginRight: 2,
        }}
      >
        72%
      </span>
      {/* Battery icon */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: 22,
            height: 11,
            border: '1.3px solid #1C1C1E',
            borderRadius: 2,
            padding: 1.5,
          }}
        >
          <div
            style={{
              width: '72%',
              height: '100%',
              backgroundColor: '#1C1C1E',
              borderRadius: 0.5,
            }}
          />
        </div>
        <div
          style={{
            width: 2,
            height: 4,
            backgroundColor: '#1C1C1E',
            borderRadius: '0 1px 1px 0',
            marginLeft: 0.5,
          }}
        />
      </div>
    </div>
  </div>
)

const PunchHoleCamera: React.FC<{ diameter: number; top: number }> = ({
  diameter,
  top,
}) => (
  <div
    style={{
      position: 'fixed',
      top,
      left: '50%',
      transform: 'translateX(-50%)',
      width: diameter,
      height: diameter,
      backgroundColor: '#000000',
      borderRadius: '50%',
      zIndex: 9999,
      pointerEvents: 'none',
      boxShadow: '0 0 0 2px rgba(40,40,40,0.5)',
    }}
  />
)

const GestureBar: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      bottom: 6,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 100,
      height: 4,
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderRadius: 2,
      zIndex: 9999,
      pointerEvents: 'none',
    }}
  />
)

export const AndroidOverlay: React.FC<{ device: DeviceSpec }> = ({
  device,
}) => (
  <>
    <StatusBar />
    {device.punchHole && (
      <PunchHoleCamera
        diameter={device.punchHole.diameter}
        top={device.punchHole.top}
      />
    )}
    <GestureBar />
  </>
)
