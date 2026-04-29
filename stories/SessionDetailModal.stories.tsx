import type { Meta, StoryObj } from '@storybook/react-vite'
import { SessionDetailModal, type LoggedDay } from '../lib/screens/SessionDetailModal'

const meta = {
  title: 'Screens/SessionDetailModal',
  component: SessionDetailModal,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SessionDetailModal>

export default meta
type Story = StoryObj<typeof meta>

const marchLoggedDays: LoggedDay[] = [
  { day: 1,  emoji: '🍆' },
  { day: 3,  emoji: '💋' },
  { day: 7,  emoji: '🍆', hasMultiple: true },
  { day: 10, emoji: '✋' },
  { day: 13, emoji: '😘' },
  { day: 17, emoji: '🍑', hasMultiple: true },
  { day: 20, emoji: '👉' },
  { day: 24, emoji: '✋' },
]

export const Default: Story = {
  args: {
    month: 3,
    year: 2026,
    today: 18,
    loggedDays: marchLoggedDays,
    selectedDay: 7,
    backLabel: 'March 7',
    partnerName: 'Alex',
    partners: [{ initials: 'AL', gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)', name: 'Alex' }],
    dateLabel: 'Saturday, March 7, 2026 \u00b7 Evening',
    rating: 8,
    dayOfWeek: 'Sat',
    tags: [
      { emoji: '🍆', label: 'Penetration' },
      { emoji: '💋', label: 'Oral' },
      { emoji: '😘', label: 'Kissing' },
    ],
    noteText: 'had such a good night. so unexpected \u2014 felt really connected and present the whole time. didn\u2019t want it to end.',
  },
}
