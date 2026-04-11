import type { Decorator } from '@storybook/react-vite'

// All device frame UI (bezel, status bar, dynamic island, home indicator)
// is rendered in the manager DOM via manager.ts.
// The decorator is a passthrough — no phone UI inside the iframe.
export const withDeviceFrame: Decorator = (Story) => <Story />
