import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { EmojiChip } from '../../lib/components/EmojiChip'
import { colors } from '../../lib/theme'

const meta: Meta<typeof EmojiChip> = {
  title: 'Components/EmojiChip',
  component: EmojiChip,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'warm-sand', values: [{ name: 'warm-sand', value: colors.warmSand }] },
  },
  args: {
    onPress: fn(),
  },
}

export default meta
type Story = StoryObj<typeof EmojiChip>

export const Default: Story = {
  args: {
    emoji: '\uD83C\uDF46',
  },
}

export const Selected: Story = {
  args: {
    emoji: '\uD83D\uDC8B',
    selected: true,
  },
}

export const Disabled: Story = {
  args: {
    emoji: '\u270B',
    disabled: true,
  },
}

const gridEmojis = [
  '\uD83C\uDF46', '\uD83D\uDC8B', '\u270B', '\uD83D\uDC49', '\uD83C\uDF2C\uFE0F', '\uD83C\uDF51', '\uD83E\uDE84',
  '\uD83D\uDD25', '\uD83D\uDCAB', '\uD83E\uDD70', '\uD83D\uDE0F', '\uD83C\uDF19', '\u2728', '\uD83D\uDCA6',
  '\uD83E\uDE77', '\u2764\uFE0F', '\uD83E\uDEF6', '\uD83D\uDE18', '\uD83E\uDD42', '\uD83C\uDF89', '\uD83E\uDE78',
]

const usedEmojis = ['\uD83C\uDF46', '\uD83D\uDC8B', '\u270B', '\u2728', '\uD83D\uDE18', '\uD83C\uDF19']

export const Grid: Story = {
  render: () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 4,
      width: 340,
    }}>
      {gridEmojis.map((emoji, i) => {
        const isUsed = usedEmojis.includes(emoji)
        const isSelected = emoji === '\uD83E\uDD70'
        return (
          <EmojiChip
            key={i}
            emoji={emoji}
            size={44}
            borderRadius={10}
            selected={isSelected}
            disabled={isUsed}
          />
        )
      })}
    </div>
  ),
}
