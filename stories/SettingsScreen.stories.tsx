import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SettingsScreen } from '../lib/screens/SettingsScreen'

const meta = {
  title: 'Screens/SettingsScreen',
  component: SettingsScreen,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onBack: fn(),
    onProTap: fn(),
    onChangePasscode: fn(),
    onToggleBiometrics: fn(),
    onSubmitFeedback: fn(),
    onPrivacyInfo: fn(),
    onEraseEverything: fn(),
  },
} satisfies Meta<typeof SettingsScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    biometricsEnabled: true,
  },
}
