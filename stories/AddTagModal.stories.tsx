import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AddTagModal } from '../lib/screens/AddTagModal'

const meta = {
  title: 'Screens/AddTagModal',
  component: AddTagModal,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onClose: fn(),
    onCancel: fn(),
    onAddTag: fn(),
    onEmojiSelect: fn(),
    onTagNameChange: fn(),
  },
} satisfies Meta<typeof AddTagModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    existingTags: [
      { emoji: '\u{1F346}', name: 'Penetration' },
      { emoji: '\u{1F48B}', name: 'Oral' },
      { emoji: '\u{270B}', name: 'Manual' },
      { emoji: '\u{2728}', name: 'Solo' },
      { emoji: '\u{1F618}', name: 'Kissing' },
      { emoji: '\u{1F319}', name: 'Cuddle' },
      { emoji: '\u{1FA84}', name: 'Toys' },
      { emoji: '\u{1FA78}', name: 'Period' },
    ],
    usedEmojis: [
      '\u{1F346}', '\u{1F48B}', '\u{270B}', '\u{1FA84}',
      '\u{1F319}', '\u{2728}', '\u{1F618}', '\u{1FA78}',
    ],
    selectedEmoji: '\u{1F525}',
    tagName: 'Passionate',
  },
}
