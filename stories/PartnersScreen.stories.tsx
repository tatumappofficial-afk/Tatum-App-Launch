import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { PartnersScreen } from '../lib/screens/PartnersScreen'

const meta = {
  title: 'Screens/PartnersScreen',
  component: PartnersScreen,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onBack: fn(),
    onPartnerTap: fn(),
    onAddPartner: fn(),
  },
} satisfies Meta<typeof PartnersScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    partners: [
      {
        name: 'Alex',
        initials: 'AL',
        gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)',
        since: 'Logging since Feb 2026',
        sessions: 28,
        avgSat: 8.6,
        tags: ['\u{1F346}', '\u{1F48B}', '\u{1F618}', '\u{270B}'],
      },
      {
        name: 'Jordan',
        initials: 'JO',
        gradient: 'linear-gradient(135deg, #B07080, #7C4A5A)',
        since: 'Logging since Jan 2026',
        sessions: 12,
        avgSat: 7.8,
        tags: ['\u{1F48B}', '\u{270B}', '\u{1F618}'],
      },
      {
        name: 'Marcus',
        initials: 'MA',
        gradient: 'linear-gradient(135deg, #8BA888, #5A8060)',
        since: 'Logging since Mar 2026',
        sessions: 4,
        avgSat: 8.0,
        tags: ['\u{1F346}', '\u{1F319}'],
      },
      {
        name: 'Solo',
        initials: '\u{2728}',
        gradient: 'linear-gradient(135deg, #9A8878, #6A5848)',
        since: 'Logging since Feb 2026',
        sessions: 9,
        avgSat: 9.1,
        tags: ['\u{2728}', '\u{1F319}'],
        isSolo: true,
      },
    ],
  },
}

export const Empty: Story = {
  args: {
    partners: [],
  },
}
