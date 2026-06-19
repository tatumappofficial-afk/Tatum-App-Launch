import { File, Paths } from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { getDatabase, parseJsonColumn } from '@/src/db/sqlite'

/**
 * Read everything in SQLite, shape it into clean JSON, write to a temp file,
 * and open the OS share sheet so the user can send it wherever they want
 * (Mail, iCloud Drive, Google Drive, Files, AirDrop, …).
 *
 * Privacy stance: this is the ONLY place the app produces a copy of user data
 * outside the SQLite file. The app never uploads anything — once the share
 * sheet opens, the destination is the user's choice.
 *
 * Re-importable: schemaVersion + appName at the top let a future "Import"
 * feature verify the file came from a compatible Tatum.
 */

const EXPORT_SCHEMA_VERSION = 1

interface ExportPayload {
  appName: 'Tatum'
  schemaVersion: number
  exportedAt: string
  data: {
    partners: Record<string, unknown>[]
    encounters: Record<string, unknown>[]
    activityTags: Record<string, unknown>[]
    desireEntries: Record<string, unknown>[]
    whisperMessages: Record<string, unknown>[]
    affirmations: Record<string, unknown>[]
    userProfile: Record<string, unknown> | null
    userSettings: Record<string, unknown> | null
  }
}

// SQLite stores booleans as 0/1. Convert specific columns back to true/false
// for human-readable JSON.
function decodeBools<T extends Record<string, unknown>>(row: T, fields: string[]): T {
  const out = { ...row } as Record<string, unknown>
  for (const f of fields) {
    if (f in out) out[f] = out[f] === 1
  }
  return out as T
}

function decodeJson<T extends Record<string, unknown>>(row: T, fields: { field: string; fallback: unknown }[]): T {
  const out = { ...row } as Record<string, unknown>
  for (const { field, fallback } of fields) {
    if (field in out) {
      out[field] = parseJsonColumn(out[field] as string | null, fallback)
    }
  }
  return out as T
}

export async function buildExportPayload(): Promise<ExportPayload> {
  const db = await getDatabase()

  const partners = (await db.getAllAsync<Record<string, unknown>>('SELECT * FROM partners')).map((r) =>
    decodeBools(r, ['isActive', 'isMain']),
  )

  const encounters = (await db.getAllAsync<Record<string, unknown>>('SELECT * FROM encounters')).map((r) =>
    decodeJson(r, [
      { field: 'activities', fallback: [] },
      { field: 'partnerIds', fallback: [] },
    ]),
  )

  const activityTags = (await db.getAllAsync<Record<string, unknown>>('SELECT * FROM activity_tags')).map((r) =>
    decodeBools(r, ['isDefault', 'isActive']),
  )

  const desireEntries = (await db.getAllAsync<Record<string, unknown>>('SELECT * FROM desire_entries')).map((r) =>
    decodeBools(r, ['actedOn']),
  )

  const whisperMessages = await db.getAllAsync<Record<string, unknown>>('SELECT * FROM whisper_messages')

  const affirmations = (await db.getAllAsync<Record<string, unknown>>('SELECT * FROM affirmations')).map((r) =>
    decodeBools(r, ['isFavorite', 'isActive']),
  )

  const userProfileRows = await db.getAllAsync<Record<string, unknown>>('SELECT * FROM user_profile LIMIT 1')
  const userProfile = userProfileRows[0] ?? null

  const userSettingsRows = await db.getAllAsync<Record<string, unknown>>('SELECT * FROM user_settings WHERE id = ?', [
    'singleton',
  ])
  const userSettings = userSettingsRows[0]
    ? decodeBools(userSettingsRows[0], ['notifications', 'biometricLock', 'hasOnboarded'])
    : null

  return {
    appName: 'Tatum',
    schemaVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      partners,
      encounters,
      activityTags,
      desireEntries,
      whisperMessages,
      affirmations,
      userProfile,
      userSettings,
    },
  }
}

/**
 * Generates the JSON export, writes it to a temp file, and opens the OS share
 * sheet. Resolves once the share sheet has been dismissed (success or cancel).
 *
 * Throws if sharing isn't available on the device (e.g. running on web in dev)
 * or if SQLite or the file write fails.
 */
export async function exportData(): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this device.')
  }

  const payload = await buildExportPayload()
  const json = JSON.stringify(payload, null, 2)

  // YYYY-MM-DD filename so multiple exports the same day overwrite (no clutter).
  // If a user wants several snapshots per day, they save them out via the
  // share sheet before re-exporting.
  const dateSlug = new Date().toISOString().slice(0, 10)
  const fileName = `tatum-backup-${dateSlug}.json`

  // Write to the cache dir, not Documents: this plaintext copy of all user data
  // is short-lived scratch. Cache isn't backed up to iCloud/Google and the OS can
  // reclaim it, so a stray export can't linger or ride device backups. We also
  // delete it ourselves in the finally below once the share sheet closes.
  // expo-file-system v56 class-based API. `write()` is synchronous (JSI-backed).
  const file = new File(Paths.cache, fileName)
  if (file.exists) file.delete()
  file.create()
  file.write(json)

  try {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      UTI: 'public.json',
      dialogTitle: 'Export Tatum data',
    })
  } finally {
    // Remove the temp file once the share sheet resolves (saved/sent) or is
    // dismissed. By this point the OS has handed the data to the chosen
    // destination, so nothing depends on this scratch copy anymore.
    if (file.exists) file.delete()
  }
}
