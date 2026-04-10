import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { BackButton } from '../../lib/components/BackButton'
import { colors } from '../../lib/theme'

const meta: Meta<typeof BackButton> = {
  title: 'Components/BackButton',
  component: BackButton,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'warm-sand', values: [{ name: 'warm-sand', value: colors.warmSand }] },
  },
  args: {
    onPress: fn(),
  },
}

export default meta
type Story = StoryObj<typeof BackButton>

export const Default: Story = {}
