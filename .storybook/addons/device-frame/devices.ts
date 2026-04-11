export interface SideButton {
  top: number
  height: number
}

export interface DeviceSpec {
  id: string
  name: string
  platform: 'ios' | 'android'
  screenWidth: number
  screenHeight: number
  bezelWidth: number
  deviceCornerRadius: number
  screenCornerRadius: number
  safeAreaTop: number
  safeAreaBottom: number
  dynamicIsland?: { width: number; height: number; top: number }
  punchHole?: { diameter: number; top: number }
  bodyColor: string
  buttonsRight: SideButton[]
  buttonsLeft: SideButton[]
}

export const devices: Record<string, DeviceSpec> = {
  'iphone-17-pro': {
    id: 'iphone-17-pro',
    name: 'iPhone 17 Pro',
    platform: 'ios',
    screenWidth: 393,
    screenHeight: 852,
    bezelWidth: 4,
    deviceCornerRadius: 55,
    screenCornerRadius: 47,
    safeAreaTop: 59,
    safeAreaBottom: 34,
    dynamicIsland: { width: 126, height: 37, top: 11 },
    bodyColor: '#1C1C1E',
    buttonsRight: [{ top: 180, height: 65 }],
    buttonsLeft: [
      { top: 140, height: 24 },
      { top: 185, height: 38 },
      { top: 228, height: 38 },
    ],
  },
  'galaxy-s26-ultra': {
    id: 'galaxy-s26-ultra',
    name: 'Galaxy S26 Ultra',
    platform: 'android',
    screenWidth: 412,
    screenHeight: 915,
    bezelWidth: 3,
    deviceCornerRadius: 20,
    screenCornerRadius: 16,
    safeAreaTop: 28,
    safeAreaBottom: 16,
    punchHole: { diameter: 14, top: 8 },
    bodyColor: '#1A1A1C',
    buttonsRight: [{ top: 200, height: 60 }],
    buttonsLeft: [{ top: 180, height: 70 }],
  },
}

export const deviceList = Object.values(devices)
