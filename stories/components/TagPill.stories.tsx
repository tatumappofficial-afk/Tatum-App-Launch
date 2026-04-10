import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { TagPill } from '../../lib/components/TagPill'
import { colors } from '../../lib/theme'

const meta: Meta<typeof TagPill> = {
  title: 'Components/TagPill',
  component: TagPill,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'warm-sand', values: [{ name: 'warm-sand', value: colors.warmSand }] },
  },
}

export default meta
type Story = StoryObj<typeof TagPill>

export const Display: Story = {
  args: {
    emoji: '\uD83C\uDF46',
    label: 'Penetration',
    variant: 'display',
  },
}

export const Selected: Story = {
  args: {
    emoji: '\uD83D\uDC8B',
    label: 'Oral',
    variant: 'selectable',
    selected: true,
  },
}

export const Unselected: Story = {
  args: {
    emoji: '\u270B',
    label: 'Manual',
    variant: 'selectable',
    selected: false,
  },
}

export const Row: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
      <TagPill emoji="\uD83C\uDF46" label="Penetration" variant="selectable" selected />
      <TagPill emoji="\uD83D\uDC8B" label="Oral" variant="selectable" selected />
      <TagPill emoji="\u270B" label="Manual" variant="selectable" selected={false} />
      <TagPill emoji="\u2728" label="Solo" variant="selectable" selected={false} />
      <TagPill emoji="\uD83D\uDE18" label="Kissing" variant="display" />
    </div>
  ),
}
