import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotesCard } from '../../lib/components/NotesCard'

const meta: Meta<typeof NotesCard> = {
  title: 'Components/NotesCard',
  component: NotesCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 340, padding: 20 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof NotesCard>

export const WithNote: Story = {
  args: {
    note: 'Felt really connected tonight. We tried something new and it was wonderful. The conversation afterward was just as intimate.',
    showStackedShadow: true,
  },
}

export const Empty: Story = {
  args: {
    note: undefined,
    showStackedShadow: false,
  },
}

export const WithStackedShadow: Story = {
  args: {
    note: 'A short reflection on the evening.',
    showStackedShadow: true,
  },
}
