const { withAndroidStyles } = require('@expo/config-plugins')

// Sets android:windowBackground on AppTheme so the post-splash activity
// background matches the splash color, eliminating a black flash between
// the system splash hiding and the React tree painting its first frame.
module.exports = function withAndroidWindowBackground(
  config,
  { color = '@color/splashscreen_background' } = {},
) {
  return withAndroidStyles(config, (cfg) => {
    const appTheme = cfg.modResults.resources.style?.find(
      (s) => s.$.name === 'AppTheme',
    )
    if (!appTheme) return cfg
    appTheme.item = appTheme.item || []
    const existing = appTheme.item.find(
      (i) => i.$.name === 'android:windowBackground',
    )
    if (existing) {
      existing._ = color
    } else {
      appTheme.item.push({ $: { name: 'android:windowBackground' }, _: color })
    }
    return cfg
  })
}
