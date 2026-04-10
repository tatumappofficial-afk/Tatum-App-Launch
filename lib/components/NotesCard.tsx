import React from 'react'
import { colors, webFonts } from '../theme'

export interface NotesCardProps {
  note?: string
  onEditNote?: () => void
  showStackedShadow?: boolean
}

const PencilIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
)

export const NotesCard: React.FC<NotesCardProps> = ({ note, onEditNote, showStackedShadow = false }) => (
  <div style={{
    position: 'relative',
    flexShrink: 0,
  }}>
    {/* Stacked paper shadow */}
    {showStackedShadow && (
      <div style={{
        position: 'absolute',
        bottom: -4,
        left: 6,
        right: -6,
        top: 4,
        background: colors.surface2,
        borderRadius: 16,
        zIndex: 0,
      }} />
    )}
    {/* Main card */}
    <div style={{
      position: 'relative',
      zIndex: 1,
      background: colors.surface,
      border: '1px solid rgba(160,100,80,0.14)',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(61,43,37,0.06)',
    }}>
      {/* Ruled lines */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(160,100,80,0.08) 27px, rgba(160,100,80,0.08) 28px)',
        backgroundPosition: '0 14px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      {/* Margin line */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 46,
        width: 1,
        background: 'rgba(192,120,88,0.12)',
        zIndex: 0,
      }} />
      {/* Text content */}
      {note ? (
        <div style={{
          position: 'relative',
          zIndex: 1,
          fontFamily: webFonts.playfair,
          fontSize: 13,
          fontWeight: 400,
          fontStyle: 'italic',
          color: '#5A3E36',
          lineHeight: '27px',
          padding: '12px 16px 16px',
        }}>
          {note}
        </div>
      ) : (
        <div style={{
          position: 'relative',
          zIndex: 1,
          padding: '14px 16px',
          fontSize: 12,
          fontWeight: 300,
          fontFamily: webFonts.dmSans,
          color: '#C4B0A0',
          fontStyle: 'italic',
          lineHeight: '27px',
        }}>
          No notes yet...
        </div>
      )}
      {/* Edit note row */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px 12px',
        borderTop: '1px solid rgba(160,100,80,0.1)',
      }}>
        <button
          onClick={onEditNote}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 400,
            fontFamily: webFonts.dmSans,
            color: colors.terra,
            padding: 0,
          }}
        >
          <PencilIcon />
          {note ? 'Edit note' : 'Add note'}
        </button>
      </div>
    </div>
  </div>
)
