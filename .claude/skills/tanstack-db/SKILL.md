---
name: tanstack-db
description: TanStack DB persistence patterns — expo-sqlite adapter, reactive queries, collection mutations
---

# TanStack DB Persistence

## Architecture

TanStack DB sits between the UI and expo-sqlite, providing reactive queries. The stack:

```
React components (useLiveQuery)
        |
TanStack DB collections (in-memory reactive state)
        |
Custom SQLite adapter (sync/onInsert/onUpdate/onDelete)
        |
expo-sqlite (tatum.db)
```

## Key Files

- `src/db/sqlite.ts` — Database initialization, table creation, JSON helpers
- `src/db/collections.ts` — TanStack DB collection factory with SQLite sync
- `src/db/schema.ts` — Zod schemas for all entities
- `src/db/index.ts` — Exports, init, settings helpers, resetAllData
- `src/db/seed.ts` — Development seed data
- `src/utils/crypto-polyfill.ts` — Required polyfill for crypto.randomUUID

## Critical Rules

### 1. Always use query function form for useLiveQuery

```tsx
// Reactive — updates when data changes
const { data } = useLiveQuery((q) =>
  q.from({ partners }).select(({ partners }) => ({ ...partners }))
)

// NOT reactive — stale data
const { data } = useLiveQuery(partners)
```

### 2. Always use collection methods for mutations

```tsx
// UI updates reactively
partners.insert({ id: generateId(), displayName: 'Sam', ... })
partners.update(id, (draft) => { draft.displayName = 'New Name' })

// UI does NOT update (bypasses reactive layer)
await db.runAsync('INSERT INTO partners ...')
```

### 3. crypto.randomUUID polyfill is required

TanStack DB uses `crypto.randomUUID()` internally. Hermes doesn't have it. Import the polyfill at the top of `app/_layout.tsx`:

```tsx
import '@/src/utils/crypto-polyfill'
```

### 4. Dev Tools screen for data management

The app has a Dev Tools screen (`app/(modals)/dev-tools.tsx`) accessible from the Profile page. It provides:
- **Seed Test Data** — populates partners, encounters, notes
- **Reset All Data** — clears all tables, re-creates defaults
- **Clear & Reseed** — reset + seed in one action

Maestro tests use this to set up known state before each test run.

## Collection Factory Pattern

```tsx
function createSqliteCollection<T extends { id: string }>(config: {
  id: string
  table: string
  db: () => SQLiteDatabase
  jsonColumns?: string[]  // auto JSON.parse/stringify
  boolColumns?: string[]  // auto 0/1 conversion
})
```

Each collection syncs from SQLite on init, and persists mutations back via `onInsert`/`onUpdate`/`onDelete` handlers.
