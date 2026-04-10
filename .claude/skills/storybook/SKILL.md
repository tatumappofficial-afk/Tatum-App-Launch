---
name: storybook
description: Storybook 10 configuration, API patterns, and gotchas specific to Tatum's web component library
---

# Storybook

Tatum uses Storybook 10 with React + Vite for the web component library. This is the specification layer — no React Native code here.

## Stack

- `storybook@10.x` (core)
- `@storybook/react-vite` (framework)
- `@storybook/addon-a11y`, `@storybook/addon-docs` (addons)
- Vite as build tool (not Webpack)

## Configuration

### Preview (`.storybook/preview.ts`)

**Viewport**: Use Storybook's built-in viewport feature, not a wrapper div. Default to iPhone 14 (390x844).
```ts
import { INITIAL_VIEWPORTS } from 'storybook/viewport'

// in parameters:
viewport: { options: INITIAL_VIEWPORTS }

// in initialGlobals:
viewport: { value: 'iphone14', isRotated: false }
```

**Backgrounds**: Use `options` (a `Record<string, Background>` map), not `values` (array). Set the default via `initialGlobals`, not `parameters.backgrounds.default` (the latter doesn't work reliably in v10).
```ts
// in parameters:
backgrounds: {
  default: 'warm-sand',
  options: {
    'warm-sand': { name: 'Warm Sand', value: '#F5EFE8' },
    // ...
  },
}

// in initialGlobals:
backgrounds: { value: 'warm-sand' }
```

**Fonts**: Load Google Fonts via a decorator that injects a `<style>` tag with `@import url(...)`. This is the only thing the decorator should do — no wrapper divs.

**Layout**: Preview default is `layout: 'fullscreen'`. Screen stories inherit this. Component stories can override to `layout: 'centered'`.

### Stories directory

```
stories/
  *.stories.tsx            ← screen stories (layout: fullscreen)
  components/
    *.stories.tsx           ← component stories (layout: centered)
```

The `.storybook/main.ts` glob `../stories/**/*.stories.@(...)` covers both levels.

## Gotchas learned the hard way

### React version mismatch
`create-expo-app` may install `react` and `react-dom` at different patch versions. Storybook will show "out of sync" errors. Fix: `npm install react@<version matching react-dom>`.

### Peer dependency conflicts
Storybook 10 + React 19 + Expo SDK 55 have peer dep conflicts. Use `legacy-peer-deps=true` in `.npmrc`.

### No wrapper div for phone frame
Don't wrap stories in a `<div style={{ width: 390, height: 844, borderRadius: 20 }}>`. This constrains the content and adds fake rounded corners. Use Storybook's viewport feature instead — it renders the iframe at the correct size.

### Screen backgrounds
Don't hardcode `backgroundColor` on screen root containers. Let Storybook's background feature handle the canvas color. Exception: modal/overlay screens that need layered backgrounds for blur effects keep their own inner backgrounds.

### Modal screens need fixed height
Screens with absolute-positioned overlays (modals, bottom sheets) must use `height: '100vh'`, not `minHeight: '100vh'`. Without a fixed height parent, `position: absolute; bottom: 0` children won't position correctly.

### Import from storybook packages
In Storybook 10, imports come from the `storybook` package directly:
```ts
import { fn } from 'storybook/test'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'
import type { Meta, StoryObj } from '@storybook/react-vite'
```

### Storybook init with Expo
`npx storybook@latest init` may prompt for a builder choice interactively. Use `--builder vite --yes` flags. Also, `create-expo-app` won't scaffold if `.claude/` exists in the directory — temporarily move it out.

## Story patterns

### Screen story
```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { MyScreen } from '../lib/screens/MyScreen'

const meta = {
  title: 'Screens/MyScreen',
  component: MyScreen,
  parameters: { layout: 'fullscreen' },
  args: { onSomeAction: fn() },
} satisfies Meta<typeof MyScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { /* ... */ } }
export const Empty: Story = { args: { /* ... */ } }
```

### Component story
```tsx
const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof MyComponent>
```
