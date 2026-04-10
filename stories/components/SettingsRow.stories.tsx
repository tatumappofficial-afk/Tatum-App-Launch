import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsRow } from '../../lib/components/SettingsRow'
import { ToggleSwitch } from '../../lib/components/ToggleSwitch'
import { colors } from '../../lib/theme'

const ChevronForwardIcon: React.FC<{ color?: string }> = ({ color = '#C4B0A0' }) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const LockIcon: React.FC = () => (
  <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)

const TrashIcon: React.FC = () => (
  <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={colors.mauve} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
)

const meta: Meta<typeof SettingsRow> = {
  title: 'Components/SettingsRow',
  component: SettingsRow,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'warm-sand', values: [{ name: 'warm-sand', value: colors.warmSand }] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 350, background: colors.surface, borderRadius: 16, overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SettingsRow>

export const Default: Story = {
  args: {
    icon: <LockIcon />,
    iconBg: 'rgba(192,120,88,0.1)',
    title: 'Change Passcode',
    subtitle: 'Confirm current, then set a new one',
    trailing: <ChevronForwardIcon />,
  },
}

export const WithToggle: Story = {
  args: {
    icon: (
      <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={colors.sage} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10" />
        <path d="M5 12a7 7 0 0114 0" />
        <path d="M8 12a4 4 0 018 0" />
        <path d="M12 12v8" />
      </svg>
    ),
    iconBg: 'rgba(139,168,136,0.12)',
    title: 'Face ID / Touch ID',
    subtitle: 'Unlock Tatum with biometrics',
    trailing: <ToggleSwitch enabled={true} />,
    showBorder: false,
  },
}

export const Destructive: Story = {
  args: {
    icon: <TrashIcon />,
    iconBg: 'rgba(176,112,128,0.1)',
    title: 'Erase Everything',
    subtitle: 'Permanently delete all data \u00B7 Cannot be undone',
    destructive: true,
    trailing: <ChevronForwardIcon color={colors.mauve} />,
    showBorder: false,
  },
}
