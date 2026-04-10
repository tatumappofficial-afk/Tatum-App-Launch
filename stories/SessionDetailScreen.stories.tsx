import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SessionDetailScreen } from '../lib/screens/SessionDetailScreen'

const meta = {
  title: 'Screens/SessionDetailScreen',
  component: SessionDetailScreen,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SessionDetailScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    partners: [
      {
        initials: 'AL',
        name: 'Alex',
        gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)',
        sessionCount: 28,
        avgSatisfaction: 8.6,
      },
      {
        initials: 'JO',
        name: 'Jordan',
        gradient: 'linear-gradient(135deg, #B07080, #7C4A5A)',
        sessionCount: 12,
        avgSatisfaction: 7.8,
      },
    ],
    partnerNames: 'Alex + Jordan',
    date: 'Saturday, March 14, 2026',
    rating: 9,
    ratingMax: 10,
    dayOfWeek: 'Sat',
    activities: [
      { emoji: '🍆', label: 'Penetration' },
      { emoji: '✋', label: 'Manual' },
      { emoji: '😘', label: 'Kissing' },
    ],
    note: 'one of our best nights. felt so present the whole time. didn\u2019t want it to end.',
    onBack: fn(),
    onEdit: fn(),
    onEditNote: fn(),
    onPartnerPress: fn(),
  },
}
