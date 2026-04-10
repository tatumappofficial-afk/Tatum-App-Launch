import React from 'react'
import { colors, webFonts } from '../theme'
import { StatusBar } from './shared/StatusBar'
import { DynamicIsland } from './shared/DynamicIsland'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { HomeIndicator } from './shared/HomeIndicator'
import { AvatarCircle } from '../components/AvatarCircle'

/* ── Types ── */

export interface PartnerData {
  name: string
  initials: string
  gradient: string
  since: string
  sessions: number
  avgSat: number | string
  tags: string[]
  /** If true, renders emoji-style avatar instead of initials */
  isSolo?: boolean
}

export interface PartnersScreenProps {
  partners: PartnerData[]
  onBack?: () => void
  onPartnerTap?: (index: number) => void
  onAddPartner?: () => void
}

/* ── Inline icon helpers ── */

const ChevronForwardIcon: React.FC<{ color?: string; opacity?: number }> = ({ color = colors.terra, opacity = 0.35 }) => (
  <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const PersonAddIcon: React.FC = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.7}>
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="17" y1="11" x2="23" y2="11" />
  </svg>
)

/* ── Main component ── */

export const PartnersScreen: React.FC<PartnersScreenProps> = ({
  partners,
  onBack,
  onPartnerTap,
  onAddPartner,
}) => {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: webFonts.dmSans,
      color: colors.ink,
    }}>
      <DecorativeGlow position="top-right" size={240} opacity={0.09} />
      <DynamicIsland />
      <StatusBar />

      {/* ── Screen Header ── */}
      <div style={{
        padding: '4px 20px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
      }}>
        <button
          onClick={onBack}
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            backgroundColor: colors.surface2,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.stone} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div style={{
          fontFamily: webFonts.playfair,
          fontSize: 20,
          fontWeight: 700,
          color: colors.ink,
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}>Partners</div>
        <div style={{ width: 34 }} />
      </div>

      {/* ── Scrollable body ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '14px 20px 0',
        scrollbarWidth: 'none',
      }}>
        {partners.map((partner, i) => (
          <div
            key={i}
            onClick={() => onPartnerTap?.(i)}
            style={{
              background: colors.surface,
              border: partner.isSolo
                ? '1px solid rgba(160,100,80,0.1)'
                : '1px solid rgba(160,100,80,0.14)',
              borderRadius: 20,
              padding: '16px 18px',
              marginBottom: 10,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(61,43,37,0.06)',
            }}
          >
            {/* Card top row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              {/* Avatar */}
              <AvatarCircle
                initials={partner.initials}
                gradient={partner.gradient}
                size={52}
                borderWidth={2.5}
              />

              {/* Name + since */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: webFonts.playfair,
                  fontSize: 17,
                  fontWeight: 700,
                  color: colors.ink,
                  marginBottom: 2,
                }}>{partner.name}</div>
                <div style={{
                  fontSize: 10,
                  fontWeight: 300,
                  color: colors.stone,
                }}>{partner.since}</div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '0 10px',
                  borderRight: '1px solid rgba(160,100,80,0.12)',
                }}>
                  <div style={{
                    fontFamily: webFonts.playfair,
                    fontSize: 17,
                    fontWeight: 600,
                    color: colors.terra,
                    lineHeight: 1,
                  }}>{partner.sessions}</div>
                  <div style={{
                    fontSize: 7,
                    fontWeight: 500,
                    letterSpacing: 0.8,
                    textTransform: 'uppercase',
                    color: colors.stone,
                    marginTop: 2,
                  }}>Sessions</div>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '0 10px',
                }}>
                  <div style={{
                    fontFamily: webFonts.playfair,
                    fontSize: 17,
                    fontWeight: 600,
                    color: colors.terra,
                    lineHeight: 1,
                  }}>{partner.avgSat}</div>
                  <div style={{
                    fontSize: 7,
                    fontWeight: 500,
                    letterSpacing: 0.8,
                    textTransform: 'uppercase',
                    color: colors.stone,
                    marginTop: 2,
                  }}>Avg Sat</div>
                </div>
              </div>

              {/* Chevron */}
              <div style={{ marginLeft: 6 }}>
                <ChevronForwardIcon />
              </div>
            </div>

            {/* Tags row */}
            {partner.tags.length > 0 && (
              <div style={{
                display: 'flex',
                gap: 5,
                flexWrap: 'wrap',
                marginTop: 10,
                paddingTop: 10,
                borderTop: '1px solid rgba(160,100,80,0.08)',
                alignItems: 'center',
              }}>
                {partner.tags.map((tag, j) => (
                  <span key={j} style={{
                    fontSize: 13,
                    background: colors.surface2,
                    borderRadius: 6,
                    padding: '2px 6px',
                  }}>{tag}</span>
                ))}
                <span style={{
                  fontSize: 10,
                  fontWeight: 300,
                  color: colors.stone,
                  padding: '2px 0',
                }}>Most common</span>
              </div>
            )}
          </div>
        ))}

        {/* ── Add partner card ── */}
        <div
          onClick={onAddPartner}
          style={{
            background: 'transparent',
            border: '1.5px dashed rgba(192,120,88,0.3)',
            borderRadius: 20,
            padding: 18,
            marginBottom: 10,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            backgroundColor: 'rgba(192,120,88,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <PersonAddIcon />
          </div>
          <div>
            <div style={{
              fontSize: 14,
              fontWeight: 400,
              color: colors.terra,
            }}>Add a partner</div>
            <div style={{
              fontSize: 11,
              fontWeight: 300,
              color: colors.muted,
              marginTop: 1,
            }}>Give them a name and a color</div>
          </div>
        </div>

        <div style={{ height: 12, flexShrink: 0 }} />
      </div>

      <HomeIndicator />
    </div>
  )
}
