// Design tokens extracted from design-system skill
// Every component references tokens only — no raw hex values.
import { Platform, type TextStyle, type ViewStyle } from 'react-native'

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

export const gradients = {
  primaryCta: ['#C07858', '#7C4A5A'] as const, // Terra → Fig, 135deg
  positive: ['#8BA888', '#5A8060'] as const,
  negative: ['#B07080', '#7C4A5A'] as const,
} as const

// ── Font helpers ──
// On web (Storybook), CSS font-family names work via Google Fonts @import.
// On native, each weight is a separate registered font name.

const isWeb = Platform.OS === 'web'

// Individual font names — use these when you need a specific weight on native.
// On web, fontFamily + fontWeight CSS works naturally.
export const fonts = {
  playfair: {
    regular: isWeb ? "'Playfair Display', serif" : 'PlayfairDisplay_400Regular',
    italic: isWeb ? "'Playfair Display', serif" : 'PlayfairDisplay_400Regular_Italic',
    semiBold: isWeb ? "'Playfair Display', serif" : 'PlayfairDisplay_600SemiBold',
    bold: isWeb ? "'Playfair Display', serif" : 'PlayfairDisplay_700Bold',
  },
  dmSans: {
    light: isWeb ? "'DM Sans', sans-serif" : 'DMSans_300Light',
    regular: isWeb ? "'DM Sans', sans-serif" : 'DMSans_400Regular',
    medium: isWeb ? "'DM Sans', sans-serif" : 'DMSans_500Medium',
  },
} as const

// Shorthand — maps to the regular weight for backward compat.
// Components that use fontFamily.xxx + fontWeight should call font() instead.
export const fontFamily = {
  playfair: fonts.playfair.regular,
  dmSans: fonts.dmSans.regular,
} as const

// Kept for backward compat — same as fontFamily
export const webFonts = fontFamily

// ── Font resolver ──
// Returns the correct fontFamily string for a given family + weight.
// On web, fontWeight CSS handles this. On native, each weight is a different font.
type PlayfairWeight = '400' | '600' | '700'
type DmSansWeight = '300' | '400' | '500'

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
  if (isWeb) {
    return family === 'playfair' ? "'Playfair Display', serif" : "'DM Sans', sans-serif"
  }
  const map = family === 'playfair' ? playfairMap : dmSansMap
  return map[weight] || (family === 'playfair' ? fonts.playfair.regular : fonts.dmSans.regular)
}

// ── Gradient helper ──
// On native (New Arch): uses experimental_backgroundImage
// On web: uses CSS background property
export function gradientStyle(gradient: string): ViewStyle {
  if (isWeb) {
    return { background: gradient } as unknown as ViewStyle
  }
  return { experimental_backgroundImage: gradient } as ViewStyle
}

// ── Typography presets ──
export const typography = {
  screenTitle: {
    fontFamily: fonts.playfair.bold,
    fontWeight: '700' as const,
    fontSize: 28,
    color: colors.ink,
  } satisfies TextStyle,
  sectionLabel: {
    fontFamily: fonts.dmSans.medium,
    fontWeight: '500' as const,
    fontSize: 9,
    textTransform: 'uppercase' as const,
    letterSpacing: 3,
    color: colors.stone,
  } satisfies TextStyle,
  sectionLabelTerra: {
    fontFamily: fonts.dmSans.medium,
    fontWeight: '500' as const,
    fontSize: 9,
    textTransform: 'uppercase' as const,
    letterSpacing: 4,
    color: colors.terra,
  } satisfies TextStyle,
  cardTitle: {
    fontFamily: fonts.playfair.semiBold,
    fontWeight: '600' as const,
    fontSize: 18,
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
    fontSize: 12,
    color: colors.ink,
  } satisfies TextStyle,
  bodyRegular: {
    fontFamily: fonts.dmSans.regular,
    fontWeight: '400' as const,
    fontSize: 12,
    color: colors.ink,
  } satisfies TextStyle,
  hint: {
    fontFamily: fonts.dmSans.light,
    fontWeight: '300' as const,
    fontSize: 10,
    fontStyle: 'italic' as const,
    color: colors.muted,
  } satisfies TextStyle,
  tagLabel: {
    fontFamily: fonts.dmSans.medium,
    fontWeight: '500' as const,
    fontSize: 9,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  } satisfies TextStyle,
  navLabel: {
    fontFamily: fonts.dmSans.medium,
    fontWeight: '500' as const,
    fontSize: 8.5,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
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
  avatar: 27, // half of 54
} as const

export const shadows = {
  card: '0 2px 8px rgba(61,43,37,0.1)',
  primaryButton: '0 8px 22px rgba(124,74,90,0.3)',
  activeTag: '0 2px 8px rgba(192,120,88,0.3)',
} as const
