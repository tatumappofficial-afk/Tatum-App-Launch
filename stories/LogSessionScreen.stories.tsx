import type { Meta, StoryObj } from '@storybook/react'
import { LogSessionScreen } from '../lib/screens/LogSessionScreen'

const meta: Meta<typeof LogSessionScreen> = {
  title: 'Screens/LogSessionScreen',
  component: LogSessionScreen,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof LogSessionScreen>

export const Default: Story = {
  args: {
    date: 'Tue, Mar 25',
    selectedPartnerIds: ['alex'],
    selectedActivityIds: ['penetration', 'manual'],
    rating: 8.5,
    notes: '',
  },
}

export const PartnerSelected: Story = {
  args: {
    date: 'Wed, Mar 26',
    selectedPartnerIds: ['jordan'],
    selectedActivityIds: ['oral', 'kissing'],
    rating: 7,
    notes: 'Really lovely evening together.',
  },
}

export const NoPartner: Story = {
  args: {
    date: 'Thu, Mar 27',
    selectedPartnerIds: [],
    selectedActivityIds: ['solo'],
    rating: 6,
    notes: '',
  },
}
