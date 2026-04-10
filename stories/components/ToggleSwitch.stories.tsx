import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToggleSwitch } from '../../lib/components/ToggleSwitch'
import { colors } from '../../lib/theme'

const meta: Meta<typeof ToggleSwitch> = {
  title: 'Components/ToggleSwitch',
  component: ToggleSwitch,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'warm-sand', values: [{ name: 'warm-sand', value: colors.warmSand }] },
  },
}

export default meta
type Story = StoryObj<typeof ToggleSwitch>

export const On: Story = {
  args: {
    enabled: true,
  },
}

export const Off: Story = {
  args: {
    enabled: false,
  },
}
