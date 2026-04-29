import type { Meta, StoryObj } from '@storybook/react-vite'
import { JournalScreen } from '../lib/screens/JournalScreen'
import type { JournalEntry } from '../lib/screens/JournalScreen'

const meta = {
  title: 'Screens/JournalScreen',
  component: JournalScreen,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof JournalScreen>

export default meta
type Story = StoryObj<typeof meta>

/* ── Sample data ── */

const sampleEntries: JournalEntry[] = [
  {
    id: '1',
    partners: [{ initials: 'AL', gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)' }],
    partnerName: 'Alex',
    date: 'Tuesday, March 18 · Today',
    isoDate: '2026-03-18',
    score: 8,
    tags: ['\u{1F346}', '\u{1F48B}', '\u{1F618}'],
    mood: { emoji: '\u{1F525}', label: 'fired up' },
    note: 'had such a good night. so unexpected — felt really connected and present the whole time. didn’t want it to end.',
  },
  {
    id: '2',
    partners: [
      { initials: 'AL', gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)' },
      { initials: 'JO', gradient: 'linear-gradient(135deg, #B07080, #7C4A5A)' },
    ],
    partnerName: 'Alex + Jordan',
    date: 'Saturday, March 14',
    isoDate: '2026-03-14',
    score: 9,
    tags: ['\u{1F346}', '✋'],
    mood: { emoji: '\u{1F970}', label: 'loving' },
    note: 'one of our best nights. felt so present. didn’t want it to end.',
  },
  {
    id: '3',
    partners: [{ initials: 'JO', gradient: 'linear-gradient(135deg, #B07080, #7C4A5A)' }],
    partnerName: 'Jordan',
    date: 'Wednesday, March 11',
    isoDate: '2026-03-11',
    score: 7,
    tags: ['\u{1F48B}', '\u{1F618}'],
    mood: { emoji: '\u{1F60F}', label: 'playful' },
  },
  {
    id: '4',
    partners: [{ initials: 'SO', gradient: 'linear-gradient(135deg, #9A8878, #6A5848)' }],
    partnerName: 'Solo',
    date: 'Friday, February 28',
    isoDate: '2026-02-28',
    score: 9,
    tags: ['✨'],
    mood: { emoji: '\u{1F319}', label: 'calm' },
    note: 'just needed to feel close to myself tonight. peaceful and good.',
    monthSeparator: 'February 2026',
  },
]

export const Default: Story = {
  args: {
    entries: sampleEntries,
    initialVisibleIsoDate: '2026-03-18',
  },
}

export const Empty: Story = {
  args: {
    entries: [],
  },
}
