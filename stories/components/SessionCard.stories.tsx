import type { Meta, StoryObj } from '@storybook/react-vite'
import { SessionCard } from '../../lib/components/SessionCard'

const meta: Meta<typeof SessionCard> = {
  title: 'Components/SessionCard',
  component: SessionCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 20 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SessionCard>

export const Default: Story = {
  args: {
    partnerInitials: 'AL',
    partnerGradient: 'linear-gradient(135deg, #C07858, #7C4A5A)',
    date: 'Mar 14 · Evening',
    rating: 80,
    activityEmojis: ['🍆', '💋', '💦'],
    note: 'Felt really connected tonight. We tried something new.',
  },
}

export const NoNote: Story = {
  args: {
    partnerInitials: 'JR',
    partnerGradient: 'linear-gradient(135deg, #8BA888, #5A8060)',
    date: 'Mar 12 · Morning',
    rating: 60,
    activityEmojis: ['💋', '✋'],
  },
}

export const Compact: Story = {
  args: {
    partnerInitials: 'AL',
    partnerGradient: 'linear-gradient(135deg, #C07858, #7C4A5A)',
    date: 'Mar 10',
    rating: 100,
    activityEmojis: ['🍆'],
    note: 'Quick but great.',
    width: 130,
  },
}
