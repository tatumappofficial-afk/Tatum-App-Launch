import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActivityBarChart } from '../../lib/components/ActivityBarChart'

const meta: Meta<typeof ActivityBarChart> = {
  title: 'Components/ActivityBarChart',
  component: ActivityBarChart,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 340, padding: 20 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ActivityBarChart>

export const Default: Story = {
  args: {
    activities: [
      { emoji: '🍆', label: 'Penetration', count: 5, percent: 85 },
      { emoji: '💋', label: 'Oral', count: 4, percent: 60 },
      { emoji: '😘', label: 'Kiss', count: 3, percent: 42 },
      { emoji: '✋', label: 'Manual', count: 2, percent: 28 },
    ],
  },
}

export const Single: Story = {
  args: {
    activities: [
      { emoji: '🍆', label: 'Penetration', count: 8, percent: 100 },
    ],
  },
}

export const Empty: Story = {
  args: {
    activities: [],
  },
}
