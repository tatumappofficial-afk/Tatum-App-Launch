import React from 'react'
import { colors, webFonts } from '../theme'
import { StatusBar } from './shared/StatusBar'
import { DynamicIsland } from './shared/DynamicIsland'
import { BottomNav } from './shared/BottomNav'
import { DecorativeGlow } from './shared/DecorativeGlow'
import { AvatarCircle } from '../components/AvatarCircle'
import { StarRating } from '../components/StarRating'
// ── Inline section label (no horizontal margin — parent provides padding) ──

const InlineSectionLabel: React.FC<{ label: string; showChevron?: boolean }> = ({ label, showChevron = false }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  }}>
    <span style={{
      fontFamily: webFonts.dmSans,
      fontSize: 8.5,
      fontWeight: 500,
      letterSpacing: 3.5,
      textTransform: 'uppercase',
      color: colors.terra,
      whiteSpace: 'nowrap',
    }}>{label}</span>
    <div style={{
      flex: 1,
      height: 1,
      backgroundColor: 'rgba(160,100,80,0.18)',
    }} />
    {showChevron && (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    )}
  </div>
)

// ── Types ──

export interface Activity {
  emoji: string
  label: string
  count: number
  /** 0–100 bar fill percentage */
  percent: number
}

export interface Partner {
  initials: string
  gradient: string
  sessions: number
  avgSatisfaction: number
  topActivityEmoji: string
}

export interface Session {
  partnerInitials: string
  partnerGradient: string
  date: string
  /** 0–100 star fill percentage */
  ratingPercent: number
  activityEmojis: string[]
  note: string
}

export interface EmptyPartner {
  initials: string
  name: string
  gradient: string
}

export interface HomeScreenProps {
  /** Active period tab index (0=Week, 1=Month, 2=Year, 3=All Time) */
  activePeriod?: number
  /** Date range label shown on the active tab, e.g. "Mar 12-18" */
  periodDateLabel?: string
  sessionsCount?: number
  avgSatisfaction?: number
  avgRating?: number
  topActivities?: Activity[]
  partners?: Partner[]
  recentSessions?: Session[]
  /** Empty state fields */
  isEmpty?: boolean
  userName?: string
  emptyPartners?: EmptyPartner[]
}

// ── Sub-components ──

const Wordmark: React.FC = () => (
  <div style={{
    padding: '8px 24px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
  }}>
    <div style={{
      fontFamily: webFonts.playfair,
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: 6,
      color: colors.terra,
    }}>TATUM</div>
  </div>
)

interface PeriodTabsProps {
  activeIndex?: number
  dateLabel?: string
  isEmpty?: boolean
}

const periodNames = ['Week', 'Month', 'Year', 'All Time']

const PeriodTabs: React.FC<PeriodTabsProps> = ({ activeIndex, dateLabel, isEmpty }) => (
  <div style={{
    padding: '10px 24px 0',
    display: 'flex',
    gap: 6,
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
  }}>
    {periodNames.map((name, i) => {
      const isActive = !isEmpty && activeIndex === i
      return (
        <button key={name} style={{
          flex: 1,
          borderRadius: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: isActive
            ? 'linear-gradient(135deg, #C07858, #7C4A5A)'
            : colors.surface2,
          color: isActive ? colors.white : colors.stone,
          border: 'none',
          cursor: 'pointer',
          padding: '5px 0',
          boxShadow: isActive ? '0 3px 10px rgba(124,74,90,0.25)' : 'none',
          fontFamily: webFonts.dmSans,
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 0.5,
            lineHeight: 1.2,
          }}>{name}</span>
          {isActive && dateLabel && (
            <span style={{
              fontSize: 8,
              fontWeight: 300,
              opacity: 0.8,
              lineHeight: 1.2,
            }}>{dateLabel}</span>
          )}
        </button>
      )
    })}
  </div>
)

const OverviewCard: React.FC<{
  sessionsCount: number
  avgSatisfaction: number
  avgRating: number
}> = ({ sessionsCount, avgSatisfaction, avgRating }) => {
  const stats = [
    { label: 'Sessions', value: String(sessionsCount) },
    { label: 'Avg Sat.', value: avgSatisfaction.toFixed(1) },
    { label: 'Avg Rating', value: avgRating.toFixed(1) },
  ]
  return (
    <div style={{
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 16,
      padding: '14px 16px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      flexShrink: 0,
    }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0 10px',
          borderRight: i < 2 ? '1px solid rgba(160,100,80,0.12)' : 'none',
          ...(i === 0 ? { paddingLeft: 0 } : {}),
        }}>
          <div style={{
            fontSize: 7.5,
            fontWeight: 500,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: colors.stone,
            marginBottom: 3,
            fontFamily: webFonts.dmSans,
          }}>{s.label}</div>
          <div style={{
            fontFamily: webFonts.playfair,
            fontSize: 28,
            fontWeight: 600,
            color: colors.terra,
            lineHeight: 1,
            marginBottom: 2,
          }}>{s.value}</div>
        </div>
      ))}
    </div>
  )
}

const ActivityBar: React.FC<{ activities: Activity[] }> = ({ activities }) => (
  <div style={{
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: 14,
    padding: '12px 14px',
    flexShrink: 0,
  }}>
    {activities.map((a, i) => (
      <div key={a.label} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        marginBottom: i < activities.length - 1 ? 7 : 0,
      }}>
        <div style={{ fontSize: 13, width: 18, textAlign: 'center', flexShrink: 0 }}>{a.emoji}</div>
        <div style={{
          fontSize: 10,
          color: colors.stone,
          width: 62,
          flexShrink: 0,
          fontFamily: webFonts.dmSans,
        }}>{a.label}</div>
        <div style={{
          flex: 1,
          height: 5,
          background: colors.surface2,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(to right, #C07858, #B07080)',
            borderRadius: 3,
            width: `${a.percent}%`,
          }} />
        </div>
        <div style={{
          fontSize: 10,
          fontWeight: 500,
          color: colors.mauve,
          width: 12,
          textAlign: 'right',
          flexShrink: 0,
          fontFamily: webFonts.dmSans,
        }}>{a.count}</div>
      </div>
    ))}
  </div>
)

const PartnerCard: React.FC<{ partner: Partner }> = ({ partner }) => (
  <div style={{
    flexShrink: 0,
    width: 126,
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: 16,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
  }}>
    <AvatarCircle
      initials={partner.initials}
      gradient={partner.gradient}
      size={52}
      borderWidth={2.5}
    />
    <div style={{ display: 'flex', gap: 8, width: '100%' }}>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{
          fontFamily: webFonts.playfair,
          fontSize: 17,
          fontWeight: 600,
          color: colors.terra,
          lineHeight: 1,
        }}>{partner.sessions}</div>
        <div style={{
          fontSize: 7,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          color: colors.stone,
          marginTop: 2,
          fontFamily: webFonts.dmSans,
        }}>Sessions</div>
      </div>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{
          fontFamily: webFonts.playfair,
          fontSize: 17,
          fontWeight: 600,
          color: colors.terra,
          lineHeight: 1,
        }}>{partner.avgSatisfaction.toFixed(1)}</div>
        <div style={{
          fontSize: 7,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          color: colors.stone,
          marginTop: 2,
          fontFamily: webFonts.dmSans,
        }}>Avg Sat.</div>
      </div>
    </div>
    <div style={{
      fontSize: 10,
      color: colors.muted,
      fontWeight: 300,
      fontFamily: webFonts.dmSans,
    }}>{partner.topActivityEmoji} Most common</div>
  </div>
)

const SessionCard: React.FC<{ session: Session }> = ({ session }) => (
  <div style={{
    flexShrink: 0,
    width: 158,
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: 16,
    padding: '16px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    cursor: 'pointer',
    height: '100%',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <AvatarCircle
        initials={session.partnerInitials}
        gradient={session.partnerGradient}
        size={36}
        borderWidth={2}
      />
      <div style={{
        fontSize: 9,
        color: colors.stone,
        fontWeight: 300,
        fontFamily: webFonts.dmSans,
      }}>{session.date}</div>
    </div>
    <StarRating percent={session.ratingPercent} size={13} />
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
      {session.activityEmojis.map((e, i) => (
        <span key={i} style={{
          fontSize: 13,
          background: colors.surface2,
          borderRadius: 6,
          padding: '3px 6px',
        }}>{e}</span>
      ))}
    </div>
    <div style={{
      fontSize: 10,
      fontWeight: 300,
      color: colors.stone,
      fontStyle: 'italic',
      lineHeight: 1.45,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      borderTop: '1px solid rgba(160,100,80,0.1)',
      paddingTop: 6,
      marginTop: 2,
      fontFamily: webFonts.dmSans,
    }}>{session.note}</div>
  </div>
)

const ViewAllCard: React.FC = () => (
  <div style={{
    flexShrink: 0,
    width: 72,
    background: 'transparent',
    border: '1.5px dashed rgba(160,100,80,0.28)',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    cursor: 'pointer',
    marginRight: 24,
    height: '100%',
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
    <div style={{
      fontSize: 8,
      fontWeight: 500,
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colors.terra,
      textAlign: 'center',
      lineHeight: 1.3,
      fontFamily: webFonts.dmSans,
    }}>View All</div>
  </div>
)

// ── Empty State Sub-components ──

const HeroEmpty: React.FC<{ userName: string }> = ({ userName }) => (
  <div style={{
    marginTop: 10,
    background: colors.surface,
    border: '1px solid rgba(160,100,80,0.13)',
    borderRadius: 20,
    padding: '28px 24px',
    textAlign: 'center',
  }}>
    <span style={{ fontSize: 44, marginBottom: 14, display: 'block' }}>{'🌙'}</span>
    <div style={{
      fontFamily: webFonts.playfair,
      fontSize: 22,
      fontWeight: 700,
      color: colors.ink,
      marginBottom: 8,
      lineHeight: 1.3,
    }}>Welcome to Tatum, {userName}.</div>
    <div style={{
      fontSize: 13,
      fontWeight: 300,
      color: colors.stone,
      lineHeight: 1.7,
      marginBottom: 20,
      fontFamily: webFonts.dmSans,
    }}>
      This is your private space. As you start logging, your stats, patterns, and sessions will show up here — all yours, all on your device.
    </div>
    <button style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      background: 'linear-gradient(135deg, #C07858, #7C4A5A)',
      border: 'none',
      borderRadius: 9999,
      padding: '13px 28px',
      fontFamily: webFonts.dmSans,
      fontSize: 13,
      fontWeight: 500,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: colors.white,
      cursor: 'pointer',
      boxShadow: '0 6px 20px rgba(124,74,90,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Log your first session
    </button>
  </div>
)

const EmptyStatsStrip: React.FC = () => {
  const labels = ['Sessions', 'Avg Sat.', 'Avg Rating']
  return (
    <div style={{
      background: colors.surface,
      border: '1px solid rgba(160,100,80,0.13)',
      borderRadius: 16,
      padding: '14px 0',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
    }}>
      {labels.map((label, i) => (
        <div key={label} style={{
          textAlign: 'center',
          borderRight: i < 2 ? '1px solid rgba(160,100,80,0.1)' : 'none',
          padding: '0 4px',
        }}>
          <div style={{
            width: 36,
            height: 20,
            background: colors.surface2,
            borderRadius: 6,
            margin: '0 auto 5px',
          }} />
          <div style={{
            fontSize: 7.5,
            fontWeight: 500,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: '#C4B0A0',
            fontFamily: webFonts.dmSans,
          }}>{label}</div>
        </div>
      ))}
    </div>
  )
}

const EmptyPartnerCard: React.FC<{ partner: EmptyPartner }> = ({ partner }) => (
  <div style={{
    flexShrink: 0,
    width: 110,
    background: colors.surface,
    border: '1px solid rgba(160,100,80,0.13)',
    borderRadius: 16,
    padding: '14px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  }}>
    <AvatarCircle
      initials={partner.initials}
      gradient={partner.gradient}
      size={44}
      borderWidth={2}
    />
    <div style={{
      fontSize: 12,
      fontWeight: 500,
      color: colors.ink,
      fontFamily: webFonts.dmSans,
    }}>{partner.name}</div>
    <div style={{
      fontSize: 10,
      fontWeight: 300,
      color: '#C4B0A0',
      fontStyle: 'italic',
      fontFamily: webFonts.dmSans,
    }}>No sessions yet</div>
  </div>
)

const AddPartnerChip: React.FC = () => (
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.terra} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity={0.7}>
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    </div>
    <div style={{
      fontSize: 11,
      fontWeight: 400,
      color: colors.terra,
      fontFamily: webFonts.dmSans,
    }}>Add partner</div>
  </div>
)

const EmptySessionsPlaceholder: React.FC = () => (
  <div style={{
    background: colors.surface,
    border: '1px solid rgba(160,100,80,0.13)',
    borderRadius: 16,
    padding: '22px 20px',
    textAlign: 'center',
  }}>
    <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.5 }}>{'📖'}</div>
    <div style={{
      fontSize: 12,
      fontWeight: 300,
      color: colors.stone,
      lineHeight: 1.65,
      fontFamily: webFonts.dmSans,
    }}>
      Once you start logging, your sessions will show up here. Every entry is a part of your story.
    </div>
  </div>
)

// ── Main Component ──

export const HomeScreen: React.FC<HomeScreenProps> = ({
  activePeriod = 0,
  periodDateLabel,
  sessionsCount = 0,
  avgSatisfaction = 0,
  avgRating = 0,
  topActivities = [],
  partners = [],
  recentSessions = [],
  isEmpty = false,
  userName = 'Alanna',
  emptyPartners = [],
}) => {
  if (isEmpty) {
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
        <DecorativeGlow position="center" size={320} />
        <DynamicIsland />
        <StatusBar />
        <Wordmark />
        <PeriodTabs isEmpty />

        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '0 24px',
          position: 'relative',
          zIndex: 1,
        }}>
          <HeroEmpty userName={userName} />

          <div style={{ marginTop: 16, marginBottom: 10 }}>
            <InlineSectionLabel label="Overview" />
          </div>
          <EmptyStatsStrip />

          <div style={{ marginTop: 16, marginBottom: 10 }}>
            <InlineSectionLabel label="Partners" />
          </div>
          <div style={{ overflow: 'hidden', marginRight: -24 }}>
            <div style={{ display: 'flex', gap: 8, overflow: 'hidden', paddingRight: 40 }}>
              {emptyPartners.map((p, i) => (
                <EmptyPartnerCard key={i} partner={p} />
              ))}
              <AddPartnerChip />
            </div>
          </div>

          <div style={{ marginTop: 16, marginBottom: 10 }}>
            <InlineSectionLabel label="Recent Sessions" />
          </div>
          <EmptySessionsPlaceholder />

          <div style={{ height: 72, flexShrink: 0 }} />
        </div>

        <BottomNav activeTab="home" />
      </div>
    )
  }

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
      <DecorativeGlow position="top-right" size={240} />
      <DynamicIsland />
      <StatusBar />
      <Wordmark />
      <PeriodTabs activeIndex={activePeriod} dateLabel={periodDateLabel} />

      {/* Main content */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        padding: '10px 24px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        position: 'relative',
        zIndex: 1,
      }}>
        <OverviewCard
          sessionsCount={sessionsCount}
          avgSatisfaction={avgSatisfaction}
          avgRating={avgRating}
        />

        <InlineSectionLabel label="Top Activities" />
        <ActivityBar activities={topActivities} />

        {/* Partners - clickable section label with chevron */}
        <InlineSectionLabel label="Partners" showChevron />

        <div style={{ flexShrink: 0, marginRight: -24 }}>
          <div style={{
            display: 'flex',
            gap: 8,
            overflow: 'hidden',
            paddingRight: 40,
          }}>
            {partners.map((p, i) => (
              <PartnerCard key={i} partner={p} />
            ))}
          </div>
        </div>

        <InlineSectionLabel label="Sessions" />

        <div style={{ flex: 1, marginRight: -24, minHeight: 0 }}>
          <div style={{
            display: 'flex',
            gap: 8,
            overflow: 'hidden',
            paddingRight: 40,
            height: '100%',
          }}>
            {recentSessions.map((s, i) => (
              <SessionCard key={i} session={s} />
            ))}
            <ViewAllCard />
          </div>
        </div>
      </div>

      <div style={{ height: 72, flexShrink: 0 }} />
      <BottomNav activeTab="home" />
    </div>
  )
}
