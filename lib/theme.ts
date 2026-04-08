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
  transparent: 'transparent',
} as const;

export const gradients = {
  primaryCta: [colors.terra, colors.fig] as [string, string],
  positive: ['#8BA888', '#5A8060'] as [string, string],
  negative: [colors.mauve, colors.fig] as [string, string],
  today: [colors.terra, colors.fig] as [string, string],
  highActivity: [colors.mauve, colors.fig] as [string, string],
} as const;

export const partnerGradients: [string, string][] = [
  [colors.terra, colors.fig],
  [colors.blush, colors.terra],
  [colors.mauve, colors.fig],
  ['#8BA888', '#5A8060'],
  [colors.gold, colors.terra],
  ['#B07080', '#C07858'],
  ['#7C4A5A', '#3D2B25'],
  ['#C4993A', '#7C4A5A'],
];

export const fonts = {
  playfair: {
    regular: 'PlayfairDisplay_400Regular',
    medium: 'PlayfairDisplay_500Medium',
    semiBold: 'PlayfairDisplay_600SemiBold',
    bold: 'PlayfairDisplay_700Bold',
    italic: 'PlayfairDisplay_400Regular_Italic',
    semiBoldItalic: 'PlayfairDisplay_600SemiBold_Italic',
  },
  dmSans: {
    light: 'DMSans_400Regular',
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
  },
} as const;

export const typography = {
  screenTitle: {
    fontFamily: fonts.playfair.bold,
    fontSize: 28,
    color: colors.ink,
  },
  sectionLabel: {
    fontFamily: fonts.dmSans.medium,
    fontSize: 9,
    textTransform: 'uppercase' as const,
    letterSpacing: 3.5,
    color: colors.stone,
  },
  cardTitle: {
    fontFamily: fonts.playfair.semiBold,
    fontSize: 18,
    color: colors.ink,
  },
  statNumber: {
    fontFamily: fonts.playfair.semiBold,
    fontSize: 36,
    color: colors.terra,
  },
  body: {
    fontFamily: fonts.dmSans.regular,
    fontSize: 12,
    color: colors.ink,
  },
  bodyLight: {
    fontFamily: fonts.dmSans.light,
    fontSize: 12,
    color: colors.ink,
  },
  hint: {
    fontFamily: fonts.dmSans.light,
    fontSize: 10,
    fontStyle: 'italic' as const,
    color: colors.muted,
  },
  tabLabel: {
    fontFamily: fonts.dmSans.medium,
    fontSize: 8.5,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 28,
  xxl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 16,
  pill: 20,
  full: 50,
} as const;

export const shadows = {
  card: {
    shadowColor: '#3D2B25',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: '#7C4A5A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 22,
    elevation: 6,
  },
  tagActive: {
    shadowColor: '#C07858',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;
