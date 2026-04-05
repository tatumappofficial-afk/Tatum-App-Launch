---
name: plugin-strategy
description: "How the .claude directory should be organized into plugins. Load this when setting up or modifying the plugin structure."
---

## Intent

Reed prefers plugins over loose skills because plugins offer better portability and scoping. The `.claude` folder should have a small number of well-scoped plugins rather than many loose skills or a heavy CLAUDE.md.

## Decisions

- **Three plugins planned:**
  1. `debrief` — All product context from conversations. The skills in this plugin (data-model, design-system, emoji-calendar, partner-profiles, etc.) capture what emerged from design conversations. Transcript history lives here too. This plugin is Tatum-specific.
  2. `regenerative-expo` — The regenerative/Phoenix architecture pattern. Portable across any Expo project built this way. Defines the 6-layer structure, regeneration rules, what survives and what's ephemeral.
  3. `expo` — Programming-level guidance for Expo/React Native. Library choices, patterns, best practices. Also portable across projects.

- **CLAUDE.md stays minimal (or absent):** Only put things in CLAUDE.md that should influence every single Claude response. Most context belongs in skills so it activates only when relevant.

- **Debrief plugin is installed first** because it captures the "why" — the conversation history that explains product decisions. The other two plugins (regenerative-expo, expo) will be set up in Claude Code once Reed starts implementation.

## Constraints

- Don't duplicate content between plugins. The debrief plugin captures product decisions; the regenerative-expo plugin captures architecture patterns; the expo plugin captures programming guidance.
- Skills inside the debrief plugin should reference the transcript they came from so future sessions can trace decisions back to the original conversation.

## Reference

Full conversation: `../../references/transcripts/2026-04-05-tatum-project-kickoff.jsonl`
