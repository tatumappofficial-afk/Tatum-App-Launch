#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()

function loadEnvFile(filename) {
  const file = path.join(ROOT, filename)
  if (!fs.existsSync(file)) return
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    if (process.env[key]) continue
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '')
  }
}

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (!arg.startsWith('--')) continue
    const key = arg.slice(2)
    const next = argv[i + 1]
    if (!next || next.startsWith('--')) {
      args[key] = true
    } else {
      args[key] = next
      i++
    }
  }
  return args
}

function usage() {
  console.log(`Usage:
  npm run test:signup-webhook -- --email you@example.com [--name "Codex Test"] [--platform ios]

Required:
  EXPO_PUBLIC_SIGNUP_WEBHOOK_URL and EXPO_PUBLIC_SIGNUP_TOKEN in .env.local,
  or pass --url and --token explicitly.

This sends one signup-shaped POST to the configured webhook. It proves the
webhook accepts the app payload; confirm the actual email in the recipient inbox.`)
}

loadEnvFile('.env.local')
loadEnvFile('.env')

const args = parseArgs(process.argv.slice(2))
if (args.help) {
  usage()
  process.exit(0)
}

const url = args.url || process.env.EXPO_PUBLIC_SIGNUP_WEBHOOK_URL
const token = args.token || process.env.EXPO_PUBLIC_SIGNUP_TOKEN
const email = args.email
const name = args.name || 'Codex Signup Test'
const platform = args.platform || 'ios'

if (!url || !token) {
  console.error('Missing signup webhook configuration.')
  usage()
  process.exit(1)
}

if (!email || typeof email !== 'string' || !email.includes('@')) {
  console.error('Pass a real test recipient with --email.')
  usage()
  process.exit(1)
}

const payload = {
  token,
  name,
  email,
  attested18: true,
  ageVerdict: 'unavailable',
  provider: 'test',
  providerUserId: `test-${email.toLowerCase()}`,
  platform,
}

const safeUrl = new URL(url)
console.log(`Posting signup test to ${safeUrl.origin}${safeUrl.pathname} for ${email}...`)

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = await response.text()
  console.log(`Status: ${response.status} ${response.statusText}`)
  if (body) console.log(body.slice(0, 1000))
  if (!response.ok) process.exit(1)
} catch (err) {
  console.error('Signup webhook request failed:')
  console.error(err)
  process.exit(1)
}
