import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { GradientButton } from '../../lib/components/GradientButton'
import { colors } from '../../lib/theme'

const meta: Meta<typeof GradientButton> = {
  title: 'Components/GradientButton',
  component: GradientButton,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'warm-sand', values: [{ name: 'warm-sand', value: colors.warmSand }] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 334 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof GradientButton>

export const Primary: Story = {
  args: {
    label: 'Save Session',
    variant: 'primary',
  },
}

export const Outline: Story = {
  args: {
    label: 'Log Another Session',
    variant: 'outline',
    fontSize: 12,
    letterSpacing: 1.5,
    height: 46,
  },
}

export const WithIcon: Story = {
  args: {
    label: 'Log your first session',
    variant: 'primary',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
}

export const Large: Story = {
  args: {
    label: 'Start Logging',
    variant: 'primary',
    height: 56,
    fontSize: 14,
  },
}
