import type { Meta, StoryObj } from '@storybook/react-vite'
import { OnboardingSecurityScreen } from '../lib/screens/OnboardingSecurityScreen'

const meta = {
  title: 'Screens/OnboardingSecurityScreen',
  component: OnboardingSecurityScreen,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof OnboardingSecurityScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
