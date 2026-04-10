import type { Meta, StoryObj } from '@storybook/react-vite'
import { StepDots } from '../../lib/components/StepDots'

const meta: Meta<typeof StepDots> = {
  title: 'Components/StepDots',
  component: StepDots,
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
type Story = StoryObj<typeof StepDots>

export const Step1: Story = {
  args: {
    current: 0,
    total: 4,
  },
}

export const Step2: Story = {
  args: {
    current: 1,
    total: 4,
  },
}

export const Step3: Story = {
  args: {
    current: 2,
    total: 4,
  },
}

export const Step4: Story = {
  args: {
    current: 3,
    total: 4,
  },
}
