const expoConfig = require('eslint-config-expo/flat')

module.exports = [
  ...expoConfig,
  {
    ignores: [
      'node_modules/**',
      'ios/**',
      'android/**',
      '.expo/**',
      '.claude/**',
      'dist/**',
      'web-build/**',
      'docs/**',
      'plugins/**',
      'TATUM_AUDIT.md',
    ],
  },
  {
    rules: {
      // Prettier owns formatting; ESLint shouldn't fight it.
      'prettier/prettier': 'off',
      // Pre-launch app; console.error/warn are the load-bearing dev-time signal.
      'no-console': 'off',
      // English copy uses apostrophes naturally ("you've", "it's"). The rule
      // protects against HTML-parser ambiguity that doesn't apply in RN.
      'react/no-unescaped-entities': 'off',
      // React Compiler-era hooks rules are false-positive-heavy on Reanimated
      // shared values, Gesture Handler refs, and the optimistic-UI patterns we
      // use (settings write-through, sheet animation refs). Kept on as warnings
      // so real issues still surface; demoted from error so CI doesn't gate.
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/use-memo': 'warn',
    },
  },
]
