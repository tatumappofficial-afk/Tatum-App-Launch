import type { Meta, StoryObj } from '@storybook/react-vite'
import { HomeScreen } from '../lib/screens/HomeScreen'
import type { HomeScreenProps } from '../lib/screens/HomeScreen'

const meta: Meta<typeof HomeScreen> = {
  title: 'Screens/HomeScreen',
  component: HomeScreen,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof HomeScreen>

export const Default: Story = {
  args: {
    activePeriod: 0,
    periodDateLabel: 'Mar 12\u201318',
    sessionsCount: 12,
    avgRating: 8.2,
    topActivities: [
      { emoji: '\uD83C\uDF46', label: 'Penetration', count: 5, percent: 85 },
      { emoji: '\uD83D\uDC8B', label: 'Oral', count: 4, percent: 60 },
      { emoji: '\uD83D\uDE18', label: 'Kiss', count: 3, percent: 42 },
      { emoji: '\u270B', label: 'Manual', count: 2, percent: 28 },
    ],
    partners: [
      {
        initials: 'AL',
        gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)',
        sessions: 8,
        avgSatisfaction: 8.4,
        topActivityEmoji: '\uD83C\uDF46',
      },
      {
        initials: 'JO',
        gradient: 'linear-gradient(135deg, #B07080, #7C4A5A)',
        sessions: 4,
        avgSatisfaction: 7.8,
        topActivityEmoji: '\uD83D\uDC8B',
      },
      {
        initials: 'SO',
        gradient: 'linear-gradient(135deg, #9A8878, #6A5848)',
        sessions: 2,
        avgSatisfaction: 9.0,
        topActivityEmoji: '\u2728',
      },
    ],
    recentSessions: [
      {
        partners: [{ initials: 'AL', gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)' }],
        date: 'Mar 18',
        rating: 80,
        activityEmojis: ['\uD83C\uDF46', '\uD83D\uDC8B', '\uD83D\uDE18'],
        note: '\u201Chad such a good night. so unexpected \u2014 felt really connected...\u201D',
      },
      {
        partners: [{ initials: 'JO', gradient: 'linear-gradient(135deg, #B07080, #7C4A5A)' }],
        date: 'Mar 17',
        rating: 70,
        activityEmojis: ['\uD83D\uDC8B', '\u270B'],
        note: '\u201Cfelt really connected tonight. needed that.\u201D',
      },
      {
        partners: [{ initials: 'SO', gradient: 'linear-gradient(135deg, #9A8878, #6A5848)' }],
        date: 'Mar 15',
        rating: 90,
        activityEmojis: ['\u2728'],
        note: '\u201Cneeded some me time and I gave it to myself \uD83C\uDF19\u201D',
      },
    ],
  } satisfies HomeScreenProps,
}

export const Empty: Story = {
  args: {
    isEmpty: true,
    userName: 'Alanna',
    emptyPartners: [
      {
        initials: 'AL',
        gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)',
      },
      {
        initials: '\u2728',
        gradient: 'linear-gradient(135deg, #9A8878, #6A5848)',
      },
    ],
  } satisfies HomeScreenProps,
}
