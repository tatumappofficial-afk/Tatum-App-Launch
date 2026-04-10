import type { Meta, StoryObj } from '@storybook/react-vite'
import { OnboardingReadyScreen } from '../lib/screens/OnboardingReadyScreen'

const meta = {
  title: 'Screens/OnboardingReadyScreen',
  component: OnboardingReadyScreen,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof OnboardingReadyScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
