import type { Meta, StoryObj } from '@storybook/react-vite'
import { CalendarScreen, type LoggedDay } from '../lib/screens/CalendarScreen'

const meta = {
  title: 'Screens/CalendarScreen',
  component: CalendarScreen,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CalendarScreen>

export default meta
type Story = StoryObj<typeof meta>

/* ── March 2026 logged-day data matching the HTML mockup ── */

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

/* ── Default: matches the HTML mockup exactly ── */

export const Default: Story = {
  args: {
    month: 3,
    year: 2026,
    today: 18,
    loggedDays: marchLoggedDays,
  },
}

/* ── DaySelected: a day is tapped / highlighted ── */

export const DaySelected: Story = {
  args: {
    month: 3,
    year: 2026,
    today: 18,
    loggedDays: marchLoggedDays,
    selectedDay: 7,
  },
}
