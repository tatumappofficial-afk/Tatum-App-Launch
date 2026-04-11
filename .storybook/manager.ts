import React, { useEffect } from 'react'
import { addons, types, useGlobals } from 'storybook/manager-api'
import { devices } from './addons/device-frame/devices'
import type { DeviceSpec } from './addons/device-frame/devices'

const BEZEL_ID = 'device-frame-bezel'
const SCREEN_ID = 'device-frame-screen'
const STYLE_ID = 'device-frame-styles'
const WRAPPER_ID = 'storybook-preview-wrapper'

// ── iOS system UI ─────────────────────────────────────────────────────

function iosSystemUI(device: DeviceSpec): string {
  const di = device.dynamicIsland
  const diHTML = di
    ? `<div style="
        position:absolute; top:${di.top}px; left:50%; transform:translateX(-50%);
        width:${di.width}px; height:${di.height}px;
        background:#000; border-radius:${di.height / 2}px;
        z-index:20; pointer-events:none;
      "></div>`
    : ''

  return `
    ${diHTML}
    <div style="
      position:absolute; top:0; left:0; right:0; height:54px;
      padding:14px 24px 0; display:flex; justify-content:space-between; align-items:center;
      z-index:10; pointer-events:none;
    ">
      <span style="font-family:'SF Pro Text','DM Sans',-apple-system,sans-serif;
        font-size:15px; font-weight:600; color:#1C1C1E;">9:41</span>
      <div style="display:flex; align-items:center; gap:6px;">
        <div style="display:flex; align-items:flex-end; gap:1.5px;">
          <div style="width:3px;height:4px;border-radius:1px;background:#1C1C1E;"></div>
          <div style="width:3px;height:6px;border-radius:1px;background:#1C1C1E;"></div>
          <div style="width:3px;height:9px;border-radius:1px;background:#1C1C1E;"></div>
          <div style="width:3px;height:12px;border-radius:1px;background:#1C1C1E;"></div>
        </div>
        <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
          <path d="M7.5 10.5a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zM3.75 8.1a5.25 5.25 0 017.5 0"
            stroke="#1C1C1E" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M1.5 5.4a9 9 0 0112 0"
            stroke="#1C1C1E" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <div style="display:flex; align-items:center;">
          <div style="width:25px;height:12px;border:1.5px solid #1C1C1E;border-radius:3px;padding:1.5px;position:relative;">
            <div style="width:72%;height:100%;background:#1C1C1E;border-radius:1px;"></div>
          </div>
          <div style="width:2px;height:5px;background:#1C1C1E;border-radius:0 1px 1px 0;margin-left:0.5px;"></div>
        </div>
      </div>
    </div>
    <div style="
      position:absolute; bottom:8px; left:50%; transform:translateX(-50%);
      width:134px; height:5px; background:rgba(0,0,0,0.2); border-radius:3px;
      z-index:10; pointer-events:none;
    "></div>
  `
}

// ── Android system UI ─────────────────────────────────────────────────

function androidSystemUI(device: DeviceSpec): string {
  const ph = device.punchHole
  const phHTML = ph
    ? `<div style="
        position:absolute; top:${ph.top}px; left:50%; transform:translateX(-50%);
        width:${ph.diameter}px; height:${ph.diameter}px;
        background:#000; border-radius:50%;
        z-index:20; pointer-events:none;
        box-shadow:0 0 0 2px rgba(40,40,40,0.5);
      "></div>`
    : ''

  return `
    ${phHTML}
    <div style="
      position:absolute; top:0; left:0; right:0; height:28px;
      padding:4px 16px 0; display:flex; justify-content:space-between; align-items:center;
      z-index:10; pointer-events:none;
    ">
      <span style="font-family:'Roboto','DM Sans',sans-serif;
        font-size:12px; font-weight:500; color:#1C1C1E;">9:41</span>
      <div style="display:flex; align-items:center; gap:5px;">
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
          <path d="M7 9.5a1 1 0 110 2 1 1 0 010-2zM4 7.2a4.5 4.5 0 016 0"
            stroke="#1C1C1E" stroke-width="1.3" stroke-linecap="round"/>
          <path d="M1.5 4.6a8 8 0 0111 0"
            stroke="#1C1C1E" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M0 12L12 0v12H0z" fill="#1C1C1E" opacity="0.85"/>
        </svg>
        <span style="font-family:'Roboto','DM Sans',sans-serif;
          font-size:10px; font-weight:500; color:#1C1C1E; margin-right:2px;">72%</span>
        <div style="display:flex; align-items:center;">
          <div style="width:22px;height:11px;border:1.3px solid #1C1C1E;border-radius:2px;padding:1.5px;">
            <div style="width:72%;height:100%;background:#1C1C1E;border-radius:0.5px;"></div>
          </div>
          <div style="width:2px;height:4px;background:#1C1C1E;border-radius:0 1px 1px 0;margin-left:0.5px;"></div>
        </div>
      </div>
    </div>
    <div style="
      position:absolute; bottom:6px; left:50%; transform:translateX(-50%);
      width:100px; height:4px; background:rgba(0,0,0,0.2); border-radius:2px;
      z-index:10; pointer-events:none;
    "></div>
  `
}

// ── DOM manipulation ──────────────────────────────────────────────────

function getOrCreateStyle(): HTMLStyleElement {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = STYLE_ID
    document.head.appendChild(el)
  }
  return el
}

function applyFrame(device: DeviceSpec): boolean {
  const wrapper = document.getElementById(WRAPPER_ID)
  if (!wrapper) return false

  const wrapperParent = wrapper.parentElement
  if (!wrapperParent) return false

  // Tag the wrapper's parent as our layout container
  wrapperParent.setAttribute('data-device-frame-container', 'true')

  const style = getOrCreateStyle()
  style.textContent = `
    /* The wrapper's parent becomes the phone-centering area */
    [data-device-frame-container] {
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      overflow: auto !important;
      padding: 40px !important;
    }

    /* The preview wrapper is now inside the phone screen — fill it */
    #${WRAPPER_ID} {
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
    }

    /* The iframe fills the screen area */
    #storybook-preview-iframe {
      width: ${device.screenWidth}px !important;
      height: ${device.screenHeight}px !important;
      max-width: none !important;
      max-height: none !important;
      border: none !important;
      border-radius: 0 !important;
      display: block !important;
    }

    #${BEZEL_ID} {
      position: relative;
      display: inline-flex;
      flex-shrink: 0;
      background: ${device.bodyColor};
      border-radius: 50px;
      padding: ${device.bezelWidth}px;
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.08) inset,
        0 20px 60px rgba(0,0,0,0.3),
        0 0 40px rgba(0,0,0,0.08);
    }

    #${SCREEN_ID} {
      position: relative;
      width: ${device.screenWidth}px;
      height: ${device.screenHeight}px;
      border-radius: ${device.screenCornerRadius}px;
      overflow: hidden;
      background: #000;
    }
  `

  // Build: wrapperParent → bezel → screen → [wrapper (moved), system UI]
  let bezel = document.getElementById(BEZEL_ID)
  let screen = document.getElementById(SCREEN_ID)

  if (!bezel) {
    bezel = document.createElement('div')
    bezel.id = BEZEL_ID

    screen = document.createElement('div')
    screen.id = SCREEN_ID

    // Insert bezel where wrapper currently is, then move wrapper inside screen
    wrapperParent.insertBefore(bezel, wrapper)
    screen.appendChild(wrapper)
    bezel.appendChild(screen)
  }

  if (!screen) screen = document.getElementById(SCREEN_ID)
  if (!screen) return false

  // Render system UI overlays on top of everything, in the manager DOM
  screen.querySelectorAll('.device-system-ui').forEach((el) => el.remove())

  const overlay = document.createElement('div')
  overlay.className = 'device-system-ui'
  Object.assign(overlay.style, {
    position: 'absolute',
    inset: '0',
    pointerEvents: 'none',
    zIndex: '10',
  })
  overlay.innerHTML =
    device.platform === 'ios'
      ? iosSystemUI(device)
      : androidSystemUI(device)
  screen.appendChild(overlay)

  // Side buttons on the bezel
  bezel.querySelectorAll('.device-frame-btn').forEach((el) => el.remove())

  const addButton = (side: 'left' | 'right', top: number, height: number) => {
    const btn = document.createElement('div')
    btn.className = 'device-frame-btn'
    const isLeft = side === 'left'
    Object.assign(btn.style, {
      position: 'absolute',
      [isLeft ? 'left' : 'right']: '-2px',
      top: `${top}px`,
      width: '3px',
      height: `${height}px`,
      background: '#2C2C2E',
      borderRadius: isLeft ? '2px 0 0 2px' : '0 2px 2px 0',
    })
    bezel!.appendChild(btn)
  }

  device.buttonsLeft.forEach((b) => addButton('left', b.top, b.height))
  device.buttonsRight.forEach((b) => addButton('right', b.top, b.height))

  return true
}

function removeFrame() {
  document.getElementById(STYLE_ID)?.remove()

  const screen = document.getElementById(SCREEN_ID)
  const bezel = document.getElementById(BEZEL_ID)
  const wrapper = document.getElementById(WRAPPER_ID)

  if (screen && bezel && wrapper && screen.contains(wrapper)) {
    // Move wrapper back to its original parent (bezel's current parent)
    bezel.parentNode!.insertBefore(wrapper, bezel)
    bezel.remove() // takes screen with it
  }

  document
    .querySelectorAll('[data-device-frame-container]')
    .forEach((el) => el.removeAttribute('data-device-frame-container'))
}

// ── React effect ──────────────────────────────────────────────────────

const DeviceFrameEffect: React.FC = () => {
  const [globals] = useGlobals()
  const deviceId = (globals.device as string) || 'iphone-17-pro'
  const device = deviceId !== 'none' ? devices[deviceId] : undefined

  useEffect(() => {
    if (!device) {
      removeFrame()
      return
    }

    let cancelled = false
    const tryApply = () => {
      if (cancelled) return
      if (!applyFrame(device)) {
        requestAnimationFrame(tryApply)
      }
    }
    tryApply()

    return () => {
      cancelled = true
      removeFrame()
    }
  }, [deviceId])

  return null
}

addons.register('device-frame', () => {
  addons.add('device-frame/effect', {
    type: types.TOOL,
    title: 'Device Frame',
    render: () => React.createElement(DeviceFrameEffect),
  })
})
