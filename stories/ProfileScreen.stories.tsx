import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ProfileScreen } from '../lib/screens/ProfileScreen'

const meta = {
  title: 'Screens/ProfileScreen',
  component: ProfileScreen,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onEdit: fn(),
    onSettings: fn(),
    onAddPartner: fn(),
    onAddTag: fn(),
    onPartnersSection: fn(),
  },
} satisfies Meta<typeof ProfileScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    userName: 'Alanna',
    userInitial: 'A',
    sinceDate: 'Logging since February 2026',
    stats: {
      sessions: 42,
      avgSat: 8.4,
      partners: 3,
    },
    partners: [
      {
        initials: 'AL',
        gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)',
        since: 'since Feb 2026',
      },
      {
        initials: 'JO',
        gradient: 'linear-gradient(135deg, #B07080, #7C4A5A)',
        since: 'since Jan 2026',
      },
      {
        initials: 'SO',
        gradient: 'linear-gradient(135deg, #9A8878, #6A5848)',
        since: 'since Mar 2026',
      },
    ],
    activityTags: [
      { emoji: '🍆', label: 'Penetration' },
      { emoji: '✋', label: 'Manual' },
      { emoji: '💋', label: 'Oral' },
      { emoji: '😘', label: 'Kiss' },
      { emoji: '🍑', label: 'Other' },
      { emoji: '✨', label: 'Solo' },
      { emoji: '🌙', label: 'Cuddle' },
      { emoji: '🩷', label: 'Milestone' },
      { emoji: '🩸', label: 'Period' },
    ],
    recentSessions: [
      {
        partnerInitials: 'AL',
        partnerGradient: 'linear-gradient(135deg, #C07858, #7C4A5A)',
        date: 'Mar 18',
        ratingPercent: 80,
        tags: ['🍆', '💋'],
        note: '"had such a good night last night. so unexpected..."',
      },
      {
        partnerInitials: 'JO',
        partnerGradient: 'linear-gradient(135deg, #B07080, #7C4A5A)',
        date: 'Mar 17',
        ratingPercent: 70,
        tags: ['💋', '✋'],
        note: '"felt really connected tonight. needed that."',
      },
      {
        partnerInitials: 'SO',
        partnerGradient: 'linear-gradient(135deg, #9A8878, #6A5848)',
        date: 'Mar 15',
        ratingPercent: 90,
        tags: ['✨'],
        note: '"needed some me time and I gave it to myself 🌙"',
      },
    ],
  },
}
