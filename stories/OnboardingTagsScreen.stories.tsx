import type { Meta, StoryObj } from '@storybook/react-vite'
import { OnboardingTagsScreen } from '../lib/screens/OnboardingTagsScreen'

const meta = {
  title: 'Screens/OnboardingTagsScreen',
  component: OnboardingTagsScreen,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof OnboardingTagsScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
