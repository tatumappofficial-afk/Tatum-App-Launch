import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatStrip } from '../../lib/components/StatStrip'
import { colors } from '../../lib/theme'

const meta: Meta<typeof StatStrip> = {
  title: 'Components/StatStrip',
  component: StatStrip,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'warm-sand', values: [{ name: 'warm-sand', value: colors.warmSand }] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 342 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof StatStrip>

export const ThreeColumn: Story = {
  args: {
    stats: [
      { value: 24, label: 'Sessions' },
      { value: '8.2', label: 'Avg Sat.' },
      { value: 3, label: 'Partners' },
    ],
  },
}

export const TwoColumn: Story = {
  args: {
    stats: [
      { value: 8.5, unit: ' /10', label: 'Rating' },
      { value: 'Sat', label: 'Day' },
    ],
  },
}
