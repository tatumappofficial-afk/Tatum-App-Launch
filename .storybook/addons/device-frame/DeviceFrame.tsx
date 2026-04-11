import React from 'react'
import { devices } from './devices'
import { IOSOverlay } from './IOSFrame'
import { AndroidOverlay } from './AndroidFrame'

export const DeviceOverlay: React.FC<{ deviceId: string }> = ({ deviceId }) => {
  const device = devices[deviceId]
  if (!device) return null

  return device.platform === 'ios' ? (
    <IOSOverlay device={device} />
  ) : (
    <AndroidOverlay device={device} />
  )
}
