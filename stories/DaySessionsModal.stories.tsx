import type { Meta, StoryObj } from '@storybook/react-vite'
import { DaySessionsModal, type LoggedDay, type SessionCardData } from '../lib/screens/DaySessionsModal'

const meta = {
  title: 'Screens/DaySessionsModal',
  component: DaySessionsModal,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DaySessionsModal>

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

const sessionsData: SessionCardData[] = [
  {
    id: '1',
    partners: [{ initials: 'AL', gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)' }],
    partnerName: 'Alex',
    time: 'Evening \u00b7 9:30 pm',
    score: 8,
    tags: ['🍆', '💋', '😘'],
    noteSnippet: 'had such a good night. so unexpected \u2014 felt really connected and present the whole time.',
  },
  {
    id: '2',
    partners: [
      { initials: 'AL', gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)' },
      { initials: 'JO', gradient: 'linear-gradient(135deg, #B07080, #7C4A5A)' },
    ],
    partnerName: 'Alex + Jordan',
    time: 'Afternoon \u00b7 2:15 pm',
    score: 9,
    tags: ['🍆', '✋'],
  },
]

export const Default: Story = {
  args: {
    month: 3,
    year: 2026,
    today: 18,
    loggedDays: marchLoggedDays,
    selectedDay: 7,
    dayLabel: 'Saturday, March 7',
    sessionCount: 2,
    sessions: sessionsData,
  },
}
