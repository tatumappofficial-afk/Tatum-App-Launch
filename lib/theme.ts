// Design tokens extracted from design-system skill
// Every component references tokens only — no raw hex values.

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

// Web font families for Storybook (CSS)
export const webFonts = {
  playfair: "'Playfair Display', serif",
  dmSans: "'DM Sans', sans-serif",
} as const

export const typography = {
  screenTitle: {
    fontFamily: webFonts.playfair,
    fontWeight: 700,
    fontSize: 28,
    color: colors.ink,
  },
  sectionLabel: {
    fontFamily: webFonts.dmSans,
    fontWeight: 500,
    fontSize: 9,
    textTransform: 'uppercase' as const,
    letterSpacing: 3,
    color: colors.stone,
  },
  sectionLabelTerra: {
    fontFamily: webFonts.dmSans,
    fontWeight: 500,
    fontSize: 9,
    textTransform: 'uppercase' as const,
    letterSpacing: 4,
    color: colors.terra,
  },
  cardTitle: {
    fontFamily: webFonts.playfair,
    fontWeight: 600,
    fontSize: 18,
    color: colors.ink,
  },
  statNumber: {
    fontFamily: webFonts.playfair,
    fontWeight: 600,
    fontSize: 36,
    color: colors.terra,
  },
  body: {
    fontFamily: webFonts.dmSans,
    fontWeight: 300,
    fontSize: 12,
    color: colors.ink,
  },
  bodyRegular: {
    fontFamily: webFonts.dmSans,
    fontWeight: 400,
    fontSize: 12,
    color: colors.ink,
  },
  hint: {
    fontFamily: webFonts.dmSans,
    fontWeight: 300,
    fontSize: 10,
    fontStyle: 'italic' as const,
    color: colors.muted,
  },
  tagLabel: {
    fontFamily: webFonts.dmSans,
    fontWeight: 500,
    fontSize: 9,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  },
  navLabel: {
    fontFamily: webFonts.dmSans,
    fontWeight: 500,
    fontSize: 8.5,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  },
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
