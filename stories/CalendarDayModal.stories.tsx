import type { Meta, StoryObj } from '@storybook/react-vite'
import { CalendarDayModal, type LoggedDay, type SessionRow } from '../lib/screens/CalendarDayModal'

const meta = {
  title: 'Screens/CalendarDayModal',
  component: CalendarDayModal,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CalendarDayModal>

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

/* ── Empty: day 19 selected, no sessions ── */

export const Empty: Story = {
  args: {
    month: 3,
    year: 2026,
    today: 18,
    loggedDays: marchLoggedDays,
    selectedDay: 19,
    dayLabel: 'Thursday, March 19',
    sessions: [],
  },
}

/* ── WithSessions: day 7 selected, 2 sessions ── */

const sessionsData: SessionRow[] = [
  {
    id: '1',
    initials: 'AL',
    gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)',
    partnerName: 'Alex',
    tags: ['🍆', '💋', '😘'],
    rating: 4,
    noteSnippet: 'had such a good night...',
  },
  {
    id: '2',
    initials: 'JO',
    gradient: 'linear-gradient(135deg, #B07080, #7C4A5A)',
    partnerName: 'Jordan',
    tags: ['✋', '😘'],
    rating: 3.5,
  },
]

export const WithSessions: Story = {
  args: {
    month: 3,
    year: 2026,
    today: 18,
    loggedDays: marchLoggedDays,
    selectedDay: 7,
    dayLabel: 'Saturday, March 7',
    sessions: sessionsData,
  },
}
