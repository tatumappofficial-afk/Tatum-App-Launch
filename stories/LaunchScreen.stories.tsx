import type { Meta, StoryObj } from '@storybook/react-vite'
import { LaunchScreen } from '../lib/screens/LaunchScreen'

const meta = {
  title: 'Screens/LaunchScreen',
  component: LaunchScreen,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LaunchScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
