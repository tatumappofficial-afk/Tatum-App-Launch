import type { Meta, StoryObj } from '@storybook/react-vite'
import { PartnerCard } from '../../lib/components/PartnerCard'

const meta: Meta<typeof PartnerCard> = {
  title: 'Components/PartnerCard',
  component: PartnerCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 20 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PartnerCard>

export const WithData: Story = {
  args: {
    initials: 'AL',
    gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)',
    sessions: 12,
    avgSatisfaction: 8.2,
    topActivityEmoji: '🍆',
  },
}

export const Empty: Story = {
  args: {
    initials: 'JR',
    gradient: 'linear-gradient(135deg, #8BA888, #5A8060)',
    name: 'Jordan',
    emptyText: 'No sessions yet',
  },
}

export const AddPartner: Story = {
  render: () => (
    <div style={{
      flexShrink: 0,
      width: 110,
      background: 'transparent',
      border: '1.5px dashed rgba(192,120,88,0.3)',
      borderRadius: 16,
      padding: '14px 10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      cursor: 'pointer',
    }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'rgba(192,120,88,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C07858" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity={0.7}>
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      </div>
      <div style={{
        fontSize: 11,
        fontWeight: 400,
        color: '#C07858',
        fontFamily: "'DM Sans', sans-serif",
      }}>Add partner</div>
    </div>
  ),
}
