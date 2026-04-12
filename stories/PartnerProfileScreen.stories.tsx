import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { PartnerProfileScreen } from '../lib/screens/PartnerProfileScreen'

const meta = {
  title: 'Screens/PartnerProfileScreen',
  component: PartnerProfileScreen,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onBack: fn(),
    onEdit: fn(),
  },
} satisfies Meta<typeof PartnerProfileScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    initials: 'AL',
    name: 'Alex',
    since: 'Logging since February 2026',
    sessions: 28,
    avgRating: '8.6',
    topDay: 'Fri',
    activities: [
      { emoji: '\u{1F346}', label: 'Penetration', count: 14, percent: 88 },
      { emoji: '\u{1F48B}', label: 'Oral', count: 9, percent: 55 },
      { emoji: '\u{1F618}', label: 'Kiss', count: 6, percent: 36 },
      { emoji: '\u{270B}', label: 'Manual', count: 4, percent: 22 },
    ],
    recentSessions: [
      {
        date: 'Mar 18, 2026',
        rating: 80,
        tags: ['\u{1F346}', '\u{1F48B}', '\u{1F618}'],
        note: '\u201Chad such a good night. so unexpected...\u201D',
      },
      {
        date: 'Mar 14, 2026',
        rating: 90,
        tags: ['\u{1F346}', '\u{270B}'],
        note: '\u201Cone of our best nights. felt so present.\u201D',
      },
      {
        date: 'Mar 10, 2026',
        rating: 70,
        tags: ['\u{1F618}', '\u{1F319}'],
        note: '\u201Cjust needed to feel close. short but sweet.\u201D',
      },
    ],
  },
}
