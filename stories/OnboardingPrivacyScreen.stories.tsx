import type { Meta, StoryObj } from '@storybook/react-vite'
import { OnboardingPrivacyScreen } from '../lib/screens/OnboardingPrivacyScreen'

const meta = {
  title: 'Screens/OnboardingPrivacyScreen',
  component: OnboardingPrivacyScreen,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof OnboardingPrivacyScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
