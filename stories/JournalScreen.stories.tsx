import type { Meta, StoryObj } from '@storybook/react-vite'
import { JournalScreen } from '../lib/screens/JournalScreen'
import type { JournalEntry, CalendarDay } from '../lib/screens/JournalScreen'

const meta = {
  title: 'Screens/JournalScreen',
  component: JournalScreen,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof JournalScreen>

export default meta
type Story = StoryObj<typeof meta>

/* ── Sample data matching HTML mockup ── */

const sampleEntries: JournalEntry[] = [
  {
    id: '1',
    partners: [{ initials: 'AL', gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)' }],
    partnerName: 'Alex',
    date: 'Tuesday, March 18 \u00b7 Today',
    score: 8,
    tags: ['\u{1F346}', '\u{1F48B}', '\u{1F618}'],
    mood: { emoji: '\u{1F525}', label: 'fired up' },
    note: 'had such a good night. so unexpected \u2014 felt really connected and present the whole time. didn\u2019t want it to end.',
  },
  {
    id: '2',
    partners: [
      { initials: 'AL', gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)' },
      { initials: 'JO', gradient: 'linear-gradient(135deg, #B07080, #7C4A5A)' },
    ],
    partnerName: 'Alex + Jordan',
    date: 'Saturday, March 14',
    score: 9,
    tags: ['\u{1F346}', '\u270B'],
    mood: { emoji: '\u{1F970}', label: 'loving' },
    note: 'one of our best nights. felt so present. didn\u2019t want it to end.',
  },
  {
    id: '3',
    partners: [{ initials: 'JO', gradient: 'linear-gradient(135deg, #B07080, #7C4A5A)' }],
    partnerName: 'Jordan',
    date: 'Wednesday, March 11',
    score: 7,
    tags: ['\u{1F48B}', '\u{1F618}'],
    mood: { emoji: '\u{1F60F}', label: 'playful' },
    // no note -> compact card
  },
  {
    id: '4',
    partners: [{ initials: 'SO', gradient: 'linear-gradient(135deg, #9A8878, #6A5848)' }],
    partnerName: 'Solo',
    date: 'Friday, February 28',
    score: 9,
    tags: ['\u2728'],
    mood: { emoji: '\u{1F319}', label: 'calm' },
    note: 'just needed to feel close to myself tonight. peaceful and good.',
    monthSeparator: 'February 2026',
  },
]

/* ── Calendar days for March 2026 (starts on Sunday) ── */

const marchDays: CalendarDay[] = [
  // 6 empty cells (March 1 is Sunday, so 0 empties before day 1... actually March 2026 starts on Sunday)
  // Looking at the HTML: 6 empty cells before day 1 which lands on Saturday position
  // Actually the HTML shows 6 empties then day 1 — March 1 2026 is a Sunday, wait let me re-check
  // The HTML grid has 6 empty + day 1 on col 7 (Saturday). But March 1, 2026 is actually a Sunday.
  // Following the HTML exactly:
  { day: null }, { day: null }, { day: null }, { day: null }, { day: null }, { day: null },
  { day: 1, logged: true, emoji: '\u{1F346}' },
  { day: 2 },
  { day: 3, logged: true, emoji: '\u{1F48B}' },
  { day: 4 }, { day: 5 }, { day: 6 },
  { day: 7, logged: true, emoji: '\u{1F346}', hasPlus: true },
  { day: 8 }, { day: 9 },
  { day: 10, logged: true, emoji: '\u270B' },
  { day: 11 }, { day: 12 },
  { day: 13, logged: true, emoji: '\u{1F618}' },
  { day: 14 }, { day: 15 }, { day: 16 },
  { day: 17, logged: true, emoji: '\u{1F351}', hasPlus: true },
  { day: 18, isToday: true },
  { day: 19 },
  { day: 20, logged: true, emoji: '\u{1F449}' },
  { day: 21 }, { day: 22 }, { day: 23 },
  { day: 24, logged: true, emoji: '\u270B' },
  { day: 25 }, { day: 26 }, { day: 27 },
  { day: 28 }, { day: 29 }, { day: 30 }, { day: 31 },
]

/* ── Stories ── */

export const Default: Story = {
  args: {
    entries: sampleEntries,
    currentMonth: 'March 2026',
    entryCount: 8,
    calendarDays: marchDays,
  },
}

export const Empty: Story = {
  args: {
    entries: [],
  },
}
