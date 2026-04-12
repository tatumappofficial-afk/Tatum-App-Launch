import type { Meta, StoryObj } from '@storybook/react-vite'
import { StarRating } from '../../lib/components/StarRating'
import { colors } from '../../lib/theme'

const meta: Meta<typeof StarRating> = {
  title: 'Components/StarRating',
  component: StarRating,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'warm-sand', values: [{ name: 'warm-sand', value: colors.warmSand }] },
  },
}

export default meta
type Story = StoryObj<typeof StarRating>

export const Full: Story = {
  args: {
    rating: 100,
    size: 11,
  },
}

export const Partial: Story = {
  args: {
    rating: 70,
    size: 11,
  },
}

export const Low: Story = {
  args: {
    rating: 30,
    size: 11,
  },
}

export const Empty: Story = {
  args: {
    rating: 0,
    size: 11,
  },
}
