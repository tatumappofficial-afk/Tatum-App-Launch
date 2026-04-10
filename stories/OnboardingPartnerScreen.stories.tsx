import type { Meta, StoryObj } from '@storybook/react-vite'
import { OnboardingPartnerScreen } from '../lib/screens/OnboardingPartnerScreen'

const meta = {
  title: 'Screens/OnboardingPartnerScreen',
  component: OnboardingPartnerScreen,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof OnboardingPartnerScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
