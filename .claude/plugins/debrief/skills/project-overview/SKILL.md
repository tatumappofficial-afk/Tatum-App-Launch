---
name: project-overview
description: "What Tatum is, who it's for, and why it exists. Load this when you need to understand the product at a high level."
---

## Intent

Tatum ("Track Authentic Truths Unapologetically Mine") is a women's sexual wellness companion app. It exists because there is no tool for women to track, celebrate, and communicate their intimate lives. The closest competitor (Rosy) shut down in November 2025. Target audience: women 25–45 in relationships.

This is an Expo/React Native app built for a client called "Build with Tori" by Skylight Social.

## Decisions

- **Three pillars:** (1) The Tracker — emoji calendar, partner profiles, stats, private notes. (2) The Safe Space — real-time desire logging with pattern recognition. (3) Tatum Whisper — sends warm messages to partners on her behalf.
- **Local-first:** All data on-device, no server in v1. Privacy is foundational.
- **Freemium:** Free tier is generous (unlimited logging, 3 partners, basic whisper, daily/weekly stats). Premium at $4.99/mo or $39.99/yr adds depth (yearly stats, pattern recognition, unlimited partners, custom whispers, Annual Recap).
- **No AI-generated messages in v1:** All Whisper templates are human-written and curated for tone.
- **The One Rule:** Every word in this app should make her feel more confident than she did before she read it.

## Constraints

- Brand voice is warm, trusted, unapologetic best friend. Never clinical, never uses "should," never compares her to anyone.
- Tatum NEVER sends messages without user's final confirmation (native SMS composer or clipboard).
- No ads, ever. Revenue is subscriptions only.
- No cloud sync in v1. Data export is a premium feature.
- Private notes are encrypted at rest.

## Reference

Full conversation: `../../references/transcripts/2026-04-05-tatum-project-kickoff.jsonl`
