import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoginAndroidScreen } from '../lib/screens/LoginAndroidScreen'

const meta = {
  title: 'Screens/LoginAndroidScreen',
  component: LoginAndroidScreen,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LoginAndroidScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
