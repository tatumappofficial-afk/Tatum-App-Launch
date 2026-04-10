import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoginIOSScreen } from '../lib/screens/LoginIOSScreen'

const meta = {
  title: 'Screens/LoginIOSScreen',
  component: LoginIOSScreen,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LoginIOSScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
