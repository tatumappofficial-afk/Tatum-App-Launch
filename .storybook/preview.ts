import type { Preview } from '@storybook/react-vite'
import React from 'react'
import { withDeviceFrame } from './addons/device-frame/decorator'
import { deviceList } from './addons/device-frame/devices'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    layout: 'fullscreen',
    viewport: { disable: true },
    backgrounds: {
      options: {
        'warm-sand': { name: 'Warm Sand', value: '#F5EFE8' },
        'surface': { name: 'Surface', value: '#FBF7F2' },
        'white': { name: 'White', value: '#FFFFFF' },
        'dark': { name: 'Dark', value: '#1C1C1E' },
      },
    },
  },
  globalTypes: {
    device: {
      description: 'Device frame surrounding the story',
      toolbar: {
        title: 'Device',
        icon: 'mobile',
        items: [
          ...deviceList.map((d) => ({ value: d.id, title: d.name })),
          { value: 'none', title: 'No Frame' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    device: 'iphone-17-pro',
    backgrounds: { value: 'warm-sand' },
  },
  decorators: [
    (Story) => {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement('style', {
          dangerouslySetInnerHTML: {
            __html: `
              @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
              * { box-sizing: border-box; margin: 0; padding: 0; }
            `,
          },
        }),
        React.createElement(Story)
      )
    },
    withDeviceFrame,
  ],
}

export default preview
