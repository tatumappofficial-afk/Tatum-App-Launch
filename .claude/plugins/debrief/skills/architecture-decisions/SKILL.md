---
name: architecture-decisions
description: "How the codebase is structured and why. Load this when making decisions about where code belongs or how to organize changes."
---

## Intent

Tatum uses a regenerative Expo architecture based on Phoenix Architecture principles: the spec is the identity that survives, source code is ephemeral. This was chosen so that when implementation accumulates too much debt, `src/` can be wiped and regenerated from the durable layers without losing product intent.

## Decisions

- **Six layers with different relationships to change:**
  1. `modules/` — Native code, Expo config plugins. Never regenerate.
  2. `app/` + `client/` — Expo Router routes (thin) + Zod schemas. Stable foundation.
  3. `.claude/plugins/debrief/skills/` — Product intent, design decisions, constraints. The true source of truth.
  4. `lib/` — UI components + co-located Storybook stories. Human-collaborative, not auto-regenerated.
  5. `maestro/` — E2E behavioral specs. Written before/alongside implementation.
  6. `src/` — State, features, screens. Fully ephemeral. Regenerable from layers 1–5.

- **Route files are thin:** `app/` route files import from `src/` and define no logic. The routing shape survives even when screen implementations are replaced.

- **Stories and Maestro flows are specs, not documentation:** Written before or alongside implementation. They define correctness — a regenerated `src/` is correct when it satisfies the stories and passes the Maestro flows.

- **Skills over CLAUDE.md:** Product context lives in plugin skills rather than CLAUDE.md because CLAUDE.md influences every Claude response regardless of relevance. Skills are scoped and activate when relevant.

- **Storage:** MMKV for small key-value state (UserProfile, settings, milestone tracking). SQLite for relational data (encounters, partners, notes, desire entries, whisper messages). Zod schemas in `client/schemas/` serve as both validation and TypeScript types.

## Constraints

- When QA reveals intent that wasn't captured, update the skill first, then fix the code. The skill is the source of truth.
- Before any significant rewrite, ask: if I deleted `src/` right now, could Claude Code regenerate something correct from what remains? If no, the missing piece belongs in a skill, schema, story, or Maestro flow.
- `lib/` components are not regenerated without design involvement — only a human knows what feels right.

## Reference

Full conversation: `../../references/transcripts/2026-04-05-tatum-project-kickoff.jsonl`
