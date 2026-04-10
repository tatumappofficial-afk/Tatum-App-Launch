import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { CalendarGrid } from '../../lib/components/CalendarGrid'
import { colors } from '../../lib/theme'

const meta: Meta<typeof CalendarGrid> = {
  title: 'Components/CalendarGrid',
  component: CalendarGrid,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'warm-sand', values: [{ name: 'warm-sand', value: colors.warmSand }] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 340, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onDayPress: fn(),
  },
}

export default meta
type Story = StoryObj<typeof CalendarGrid>

const sampleLoggedDays = [
  { day: 3, emoji: '\uD83C\uDF46', hasMultiple: false },
  { day: 7, emoji: '\uD83D\uDC8B', hasMultiple: false },
  { day: 10, emoji: '\uD83C\uDF46', hasMultiple: true },
  { day: 14, emoji: '\u270B', hasMultiple: false },
  { day: 19, emoji: '\uD83C\uDF46', hasMultiple: false },
  { day: 22, emoji: '\uD83D\uDC8B', hasMultiple: true },
]

export const Default: Story = {
  args: {
    month: 2, // March (0-indexed)
    year: 2026,
    today: 25,
    loggedDays: sampleLoggedDays,
  },
}

export const WithSelection: Story = {
  args: {
    month: 2,
    year: 2026,
    today: 25,
    selectedDay: 19,
    loggedDays: sampleLoggedDays,
  },
}

export const Compact: Story = {
  args: {
    month: 2,
    year: 2026,
    today: 25,
    loggedDays: sampleLoggedDays,
    compact: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280, padding: 12 }}>
        <Story />
      </div>
    ),
  ],
}
