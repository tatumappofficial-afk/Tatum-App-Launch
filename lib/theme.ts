import type { TextStyle, ViewStyle } from 'react-native'

export const colors = {
  warmSand: '#F5EFE8',
  surface: '#FBF7F2',
  surface2: '#EDE3D8',
  border: 'rgba(160,100,80,0.18)',
  terra: '#C07858',
  fig: '#7C4A5A',
  mauve: '#B07080',
  gold: '#C4993A',
  blush: '#E8C4B0',
  sage: '#8BA888',
  stone: '#9A8878',
  ink: '#3D2B25',
  muted: '#A08878',
  white: '#FFFFFF',
} as const

// Gradient color tuples — pass directly to <LinearGradient colors={...}>.
export const gradients = {
  primaryCta: ['#C07858', '#7C4A5A'] as const, // Terra → Fig
  positive: ['#8BA888', '#5A8060'] as const,
  negative: ['#B07080', '#7C4A5A'] as const,
  activityBar: ['#C07858', '#B07080'] as const,
} as const

// Partner avatar gradients — single source of truth for the swatch palette.
// `gradient` (CSS string) is the value persisted on partner.avatarGradient — keep stable.
// `colors` is the LinearGradient-ready tuple; consumers should prefer this.
export const partnerGradients = [
  { key: 'terra', gradient: 'linear-gradient(135deg, #C07858, #7C4A5A)', colors: ['#C07858', '#7C4A5A'] as const },
  { key: 'mauve', gradient: 'linear-gradient(135deg, #B07080, #7C4A5A)', colors: ['#B07080', '#7C4A5A'] as const },
  { key: 'sage', gradient: 'linear-gradient(135deg, #8BA888, #5A8060)', colors: ['#8BA888', '#5A8060'] as const },
  { key: 'gold', gradient: 'linear-gradient(135deg, #C4993A, #8A6A20)', colors: ['#C4993A', '#8A6A20'] as const },
  { key: 'fig', gradient: 'linear-gradient(135deg, #7C4A5A, #3D2B25)', colors: ['#7C4A5A', '#3D2B25'] as const },
  { key: 'blush', gradient: 'linear-gradient(135deg, #E8C4B0, #C07858)', colors: ['#E8C4B0', '#C07858'] as const },
  { key: 'stone', gradient: 'linear-gradient(135deg, #9A8878, #6A5A4A)', colors: ['#9A8878', '#6A5A4A'] as const },
  { key: 'rust', gradient: 'linear-gradient(135deg, #A85230, #6E2E18)', colors: ['#A85230', '#6E2E18'] as const },
  { key: 'blue', gradient: 'linear-gradient(135deg, #5A7A98, #3D5470)', colors: ['#5A7A98', '#3D5470'] as const },
  { key: 'ink', gradient: 'linear-gradient(135deg, #3D2B25, #6A4A40)', colors: ['#3D2B25', '#6A4A40'] as const },
] as const

export type PartnerGradientKey = (typeof partnerGradients)[number]['key']

// Parse a persisted CSS gradient string back into a LinearGradient-ready colors tuple.
// Used at render boundaries (mostly when `partner.avatarGradient` came from the DB).
export function parseGradientColors(g: string): readonly [string, string, ...string[]] {
  const inner = g.match(/\(([^)]+)\)/)?.[1] ?? ''
  const parts = inner.split(',').map((s) => s.trim())
  // Drop leading direction token like "135deg" or "to right"
  const stops = parts[0].includes('deg') || parts[0].startsWith('to ') ? parts.slice(1) : parts
  const cols = stops.map((s) => s.split(/\s+/)[0])
  return (cols.length >= 2 ? cols : [cols[0] ?? '#000', cols[0] ?? '#000']) as unknown as readonly [
    string,
    string,
    ...string[],
  ]
}

// Start/end point presets for <LinearGradient>. Numbers are CSS-angle equivalents.
export const gradientPoints = {
  diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // ~135deg
  steepDiagonal: { start: { x: 0.18, y: 0 }, end: { x: 0.82, y: 1 } }, // ~145deg
  vertical: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }, // 180deg
  almostVertical: { start: { x: 0.13, y: 0 }, end: { x: 0.87, y: 1 } }, // ~165deg
  horizontal: { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } }, // 90deg / "to right"
} as const

// ── Fonts ──
// Each weight is a separately registered font name (no CSS fontWeight on native).

export const fonts = {
  playfair: {
    regular: 'PlayfairDisplay_400Regular',
    italic: 'PlayfairDisplay_400Regular_Italic',
    semiBold: 'PlayfairDisplay_600SemiBold',
    bold: 'PlayfairDisplay_700Bold',
  },
  dmSans: {
    light: 'DMSans_300Light',
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
  },
} as const

export const fontFamily = {
  playfair: fonts.playfair.regular,
  dmSans: fonts.dmSans.regular,
} as const

const playfairMap: Record<string, string> = {
  '400': fonts.playfair.regular,
  '600': fonts.playfair.semiBold,
  '700': fonts.playfair.bold,
}
const dmSansMap: Record<string, string> = {
  '300': fonts.dmSans.light,
  '400': fonts.dmSans.regular,
  '500': fonts.dmSans.medium,
}

export function font(family: 'playfair' | 'dmSans', weight: string = '400'): string {
  const map = family === 'playfair' ? playfairMap : dmSansMap
  return map[weight] ?? (family === 'playfair' ? fonts.playfair.regular : fonts.dmSans.regular)
}

// ── Typography presets ──
// Sizes target HIG body floor (16) and Material body minimum (14sp). See
// "Tori's Vault/Expo Best Practices/Typography.md" for the full rationale.
export const typography = {
  screenTitle: {
    fontFamily: fonts.playfair.bold,
    fontSize: 22,
    color: colors.ink,
  } satisfies TextStyle,
  sectionLabel: {
    fontFamily: fonts.dmSans.medium,
    fontWeight: '500' as const,
    fontSize: 14,
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
    color: colors.stone,
  } satisfies TextStyle,
  sectionLabelTerra: {
    fontFamily: fonts.dmSans.medium,
    fontWeight: '500' as const,
    fontSize: 14,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.8,
    color: colors.terra,
  } satisfies TextStyle,
  cardTitle: {
    fontFamily: fonts.playfair.semiBold,
    fontWeight: '600' as const,
    fontSize: 20,
    color: colors.ink,
  } satisfies TextStyle,
  statNumber: {
    fontFamily: fonts.playfair.semiBold,
    fontWeight: '600' as const,
    fontSize: 36,
    color: colors.terra,
  } satisfies TextStyle,
  body: {
    fontFamily: fonts.dmSans.light,
    fontWeight: '300' as const,
    fontSize: 16,
    color: colors.ink,
  } satisfies TextStyle,
  bodyRegular: {
    fontFamily: fonts.dmSans.regular,
    fontWeight: '400' as const,
    fontSize: 16,
    color: colors.ink,
  } satisfies TextStyle,
  hint: {
    fontFamily: fonts.dmSans.light,
    fontWeight: '300' as const,
    fontSize: 14,
    fontStyle: 'italic' as const,
    color: colors.muted,
  } satisfies TextStyle,
  tagLabel: {
    fontFamily: fonts.dmSans.medium,
    fontWeight: '500' as const,
    fontSize: 14,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
  } satisfies TextStyle,
  navLabel: {
    fontFamily: fonts.dmSans.medium,
    fontWeight: '500' as const,
    fontSize: 14,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
  } satisfies TextStyle,
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 28,
  xxl: 32,
} as const

export const layout = {
  maxWidth: 390,
  horizontalPadding: 28,
  sectionSpacing: 24,
  cardGap: 10,
} as const

export const radii = {
  card: 15,
  button: 50,
  tag: 20,
  emoji: 10,
  avatar: 27,
} as const

// ── Shadow tokens ──
// Native shadow props (iOS) + elevation (Android). Spread into a style object.
export const shadows = {
  card: {
    shadowColor: '#3D2B25',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  } satisfies ViewStyle,
  cardSubtle: {
    shadowColor: '#3D2B25',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 1,
  } satisfies ViewStyle,
  primaryButton: {
    shadowColor: '#7C4A5A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  } satisfies ViewStyle,
  primaryButtonStrong: {
    shadowColor: '#7C4A5A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 20,
    elevation: 7,
  } satisfies ViewStyle,
  activeTag: {
    shadowColor: '#C07858',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  } satisfies ViewStyle,
  fab: {
    shadowColor: '#7C4A5A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  } satisfies ViewStyle,
  pillSoft: {
    shadowColor: '#7C4A5A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  } satisfies ViewStyle,
  pillFlat: {
    shadowColor: '#3D2B25',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  } satisfies ViewStyle,
} as const
