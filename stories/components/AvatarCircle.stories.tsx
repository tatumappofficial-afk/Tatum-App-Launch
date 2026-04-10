import type { Meta, StoryObj } from '@storybook/react-vite'
import { AvatarCircle } from '../../lib/components/AvatarCircle'
import { colors } from '../../lib/theme'

const meta: Meta<typeof AvatarCircle> = {
  title: 'Components/AvatarCircle',
  component: AvatarCircle,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'warm-sand', values: [{ name: 'warm-sand', value: colors.warmSand }] },
  },
}

export default meta
type Story = StoryObj<typeof AvatarCircle>

export const Default: Story = {
  args: {
    initials: 'AL',
    gradient: `linear-gradient(135deg, ${colors.terra}, ${colors.fig})`,
    size: 52,
  },
}

export const Small: Story = {
  args: {
    initials: 'JO',
    gradient: `linear-gradient(135deg, ${colors.mauve}, ${colors.fig})`,
    size: 36,
    borderWidth: 2,
  },
}

export const Large: Story = {
  args: {
    initials: 'AL',
    gradient: `linear-gradient(135deg, ${colors.terra}, ${colors.fig})`,
    size: 72,
    borderWidth: 3,
  },
}

export const Solo: Story = {
  args: {
    initials: '\u2728',
    gradient: `linear-gradient(135deg, ${colors.stone}, #6A5848)`,
    size: 52,
  },
}

export const AvatarStack: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <AvatarCircle
        initials="AL"
        gradient={`linear-gradient(135deg, ${colors.terra}, ${colors.fig})`}
        size={52}
      />
      <div style={{ marginLeft: -14 }}>
        <AvatarCircle
          initials="JO"
          gradient={`linear-gradient(135deg, ${colors.mauve}, ${colors.fig})`}
          size={52}
        />
      </div>
    </div>
  ),
}
