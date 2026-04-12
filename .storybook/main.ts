import type { StorybookConfig } from '@storybook/react-vite';
import type { UserConfig } from 'vite';

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/react-vite",
  async viteFinal(config: UserConfig) {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias as Record<string, string>,
      'react-native': 'react-native-web',
      'react-native/Libraries/Image/AssetRegistry': 'react-native-web/dist/modules/AssetRegistry',
    }
    config.resolve.extensions = [
      '.web.tsx', '.web.ts', '.web.js',
      '.tsx', '.ts', '.js', '.json',
    ]
    // Define __DEV__ for react-native-web
    config.define = {
      ...config.define,
      __DEV__: JSON.stringify(true),
      'process.env.EXPO_OS': JSON.stringify('web'),
    }
    return config
  },
};
export default config;
