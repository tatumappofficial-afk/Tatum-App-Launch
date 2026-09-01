import * as Crypto from 'expo-crypto'
import { File } from 'expo-file-system'
import * as SecureStore from 'expo-secure-store'
import * as SQLite from 'expo-sqlite'

/**
 * At-rest encryption for tatum.db.
 *
 * The database is SQLCipher-encrypted (see the expo-sqlite `useSQLCipher`
 * plugin flag) with a random 256-bit key that lives in the platform keychain
 * via expo-secure-store, created on first launch. Without it the database
 * file is unreadable, so the intimate data no longer depends on the OS
 * sandbox alone: forensic extraction of a lost phone and rooted/jailbroken
 * filesystem access see ciphertext. On iOS the keychain entry rides along in
 * encrypted device backups (deliberately: that is what keeps the data
 * readable after a phone-to-phone migration), so a fully-trusted encrypted
 * backup can still recover the pair. Android Auto Backup is disabled in
 * app.json: Keystore keys never transfer between Android devices, so a
 * restored database would be permanently unreadable ciphertext.
 *
 * Existing installs have a plaintext tatum.db. `openEncryptedDatabase`
 * detects that (keying a plaintext file makes the first read fail), then
 * encrypts it in place using SQLCipher's sqlcipher_export():
 *
 *   1. export plaintext tatum.db into a new encrypted tatum.db.encrypting
 *      (the original is never modified),
 *   2. verify the encrypted copy opens with the key and kept user_version,
 *   3. delete the original, rename the copy over it.
 *
 * A crash between 3's delete and rename leaves the data only in
 * tatum.db.encrypting; `recoverInterruptedSwap` (run before every open)
 * finishes the rename on the next launch. A crash any earlier leaves the
 * original intact plus at most a stale .encrypting file, which the next
 * migration attempt deletes and rebuilds. At every point in time at least one
 * complete copy of the data exists on disk.
 */

const DB_KEY_STORE_KEY = 'tatum.db.cipher-key.v1'

// AFTER_FIRST_UNLOCK instead of the WHEN_UNLOCKED default: notification
// handling can touch the database from a background wake, and WHEN_UNLOCKED
// would make the key unreadable while the device is locked.
const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
}

/**
 * Returns the database cipher key as hex, creating and persisting one on
 * first use. Returns null only in the jest shim (tests/shims/db-encryption.ts),
 * where the node:sqlite stand-in has no SQLCipher; on-device this always
 * resolves to a key or throws.
 */
export async function getOrCreateDbKey(): Promise<string | null> {
  const existing = await SecureStore.getItemAsync(DB_KEY_STORE_KEY, SECURE_STORE_OPTIONS)
  if (existing) return existing

  const keyBytes = Crypto.getRandomBytes(32)
  const keyHex = Array.from(keyBytes, (b) => b.toString(16).padStart(2, '0')).join('')
  await SecureStore.setItemAsync(DB_KEY_STORE_KEY, keyHex, SECURE_STORE_OPTIONS)
  return keyHex
}

/**
 * Opens `dbName` keyed with `keyHex`, encrypting a legacy plaintext file
 * first if that's what is on disk. Returns a handle that has already been
 * keyed; callers must not run statements on the database before this
 * resolves.
 */
export async function openEncryptedDatabase(dbName: string, keyHex: string): Promise<SQLite.SQLiteDatabase> {
  recoverInterruptedSwap(dbName)

  const db = await SQLite.openDatabaseAsync(dbName)
  // PRAGMA key must be the first statement on the connection.
  await db.execAsync(keyPragma(keyHex))
  await assertSqlCipherPresent(db)
  if (await isReadable(db)) return db

  // The file predates encryption (or is empty-with-WAL from a plaintext run):
  // a keyed connection can't read it. Close and take the migration path.
  await db.closeAsync()
  return encryptLegacyDatabase(dbName, keyHex)
}

/**
 * On a stock SQLite build, PRAGMA key is an unknown pragma and is silently
 * ignored: every open would "succeed" and the database would be written in
 * plaintext while the code believes it is encrypted. cipher_version returns a
 * row only under SQLCipher, so failing hard here turns that silent downgrade
 * (wrong binary, OTA update reaching a pre-SQLCipher build) into a loud error.
 */
async function assertSqlCipherPresent(db: SQLite.SQLiteDatabase): Promise<void> {
  const rows = await db.getAllAsync<{ cipher_version: string }>('PRAGMA cipher_version')
  if (!rows.length || !rows[0]?.cipher_version) {
    throw new Error('[db] SQLCipher is not present in this binary; refusing to open unencrypted')
  }
}

/**
 * Finishes a file swap that a crash interrupted. Must run before the database
 * is opened: opening creates an empty file, which would make the "main file
 * missing" signal unreadable.
 */
function recoverInterruptedSwap(dbName: string): void {
  const staging = dbFile(stagingName(dbName))
  if (!staging.exists) return

  const main = dbFile(dbName)
  if (main.exists) {
    // The original was never deleted, so the staging file is a leftover from
    // a run that crashed mid-export. It may be incomplete; rebuild from the
    // intact original instead of trusting it.
    deleteStagingArtifacts(dbName)
    return
  }
  // Crash landed between "delete original" and "rename copy": the staging
  // file is the (verified) encrypted database. The original's plaintext
  // -wal/-shm may have survived the crash (only the main file was deleted);
  // remove them so no plaintext journal pages sit next to the encrypted
  // database, then complete the rename. moveSync, not move: the async
  // variant would let openDatabaseAsync run before the rename lands and
  // create an empty main file, which a later launch would then protect over
  // the real data.
  deleteWalSiblings(dbName)
  staging.moveSync(main)
}

async function encryptLegacyDatabase(dbName: string, keyHex: string): Promise<SQLite.SQLiteDatabase> {
  const stagingDbName = stagingName(dbName)

  // Open the plaintext original without a key. If the file is actually
  // encrypted with a key we no longer have, this first read throws and the
  // app fails loudly instead of wiping data.
  const plain = await SQLite.openDatabaseAsync(dbName)
  let userVersion: number
  try {
    const versionRows = await plain.getAllAsync<{ user_version: number }>('PRAGMA user_version')
    userVersion = versionRows[0]?.user_version ?? 0
  } catch (err) {
    await plain.closeAsync()
    // Neither the stored key nor a plaintext open can read this file. Most
    // likely the keychain entry was lost (OS restore, Keystore invalidation)
    // while the encrypted database survived. Nothing is deleted; without the
    // key the data is not recoverable, and a clear error beats a wipe.
    throw new Error(
      `[db] database exists but is unreadable with the stored key and is not plaintext; ` +
        `the encryption key may have been lost (${err instanceof Error ? err.message : String(err)})`,
    )
  }

  // A crashed earlier attempt can leave a stale staging file plus a hot
  // -journal beside it; SQLite would replay that stale journal into the
  // recreated target and corrupt the export. Clear all of it first.
  deleteStagingArtifacts(dbName)

  // sqlcipher_export copies the full logical database (schema + rows, WAL
  // included) into the attached encrypted target. user_version is file-header
  // state that export does not carry over, so set it explicitly: it is the
  // migration runner's cursor, and losing it would re-run every migration.
  await plain.execAsync(`ATTACH DATABASE '${sqlitePath(stagingDbName)}' AS encrypted KEY "x'${keyHex}'"`)
  await plain.execAsync(`SELECT sqlcipher_export('encrypted')`)
  await plain.execAsync(`PRAGMA encrypted.user_version = ${userVersion}`)
  await plain.execAsync('DETACH DATABASE encrypted')
  await plain.closeAsync()

  // Verify the copy before the irreversible delete below: it must open with
  // the key, carry the right user_version, and pass a full integrity check
  // (the databases are small, so this is cheap). Until all three hold, the
  // plaintext original is untouched.
  const check = await SQLite.openDatabaseAsync(stagingDbName)
  await check.execAsync(keyPragma(keyHex))
  const checkReadable = await isReadable(check)
  const checkVersionRows = checkReadable ? await check.getAllAsync<{ user_version: number }>('PRAGMA user_version') : []
  const integrityRows = checkReadable
    ? await check.getAllAsync<{ integrity_check: string }>('PRAGMA integrity_check')
    : []
  await check.closeAsync()
  const versionOk = (checkVersionRows[0]?.user_version ?? -1) === userVersion
  const integrityOk = integrityRows.length === 1 && integrityRows[0]?.integrity_check === 'ok'
  if (!checkReadable || !versionOk || !integrityOk) {
    throw new Error('[db] encrypted copy failed verification; keeping plaintext original')
  }

  // Swap. deleteDatabaseAsync removes only the main file, and SQLite only
  // cleans -wal/-shm on a clean close, so delete the plaintext journal
  // siblings explicitly: leaving them behind would park plaintext copies of
  // recent rows next to the encrypted database. If we crash between the
  // delete and the move, recoverInterruptedSwap finishes the rename on the
  // next launch.
  await SQLite.deleteDatabaseAsync(dbName)
  deleteWalSiblings(dbName)
  dbFile(stagingDbName).moveSync(dbFile(dbName))

  const db = await SQLite.openDatabaseAsync(dbName)
  await db.execAsync(keyPragma(keyHex))
  if (!(await isReadable(db))) {
    throw new Error('[db] encrypted database unreadable after swap')
  }
  console.log('[db] migrated plaintext database to SQLCipher')
  return db
}

function keyPragma(keyHex: string): string {
  // Raw-key form (x'..') skips SQLCipher's passphrase KDF: the key is already
  // random, and skipping PBKDF2 keeps opens fast.
  return `PRAGMA key = "x'${keyHex}'"`
}

async function isReadable(db: SQLite.SQLiteDatabase): Promise<boolean> {
  try {
    await db.getAllAsync('SELECT count(*) FROM sqlite_master')
    return true
  } catch {
    return false
  }
}

function stagingName(dbName: string): string {
  return `${dbName}.encrypting`
}

/** Removes a database's -wal and -shm sidecar files if present. */
function deleteWalSiblings(dbName: string): void {
  for (const suffix of ['-wal', '-shm']) {
    const sidecar = dbFile(`${dbName}${suffix}`)
    if (sidecar.exists) sidecar.delete()
  }
}

/**
 * Removes the staging database plus any journal sidecars a crashed export
 * left behind (the ATTACHed target runs in rollback-journal mode, so its hot
 * journal is `-journal`; -wal/-shm covered for completeness).
 */
function deleteStagingArtifacts(dbName: string): void {
  const staging = stagingName(dbName)
  for (const name of [staging, `${staging}-journal`, `${staging}-wal`, `${staging}-shm`]) {
    const artifact = dbFile(name)
    if (artifact.exists) artifact.delete()
  }
}

/** Absolute filesystem path (no scheme) for ATTACH DATABASE. */
function sqlitePath(dbName: string): string {
  const dir = String(SQLite.defaultDatabaseDirectory).replace(/\/*$/, '')
  const path = `${dir}/${dbName}`
  return path.startsWith('file://') ? path.slice('file://'.length) : path
}

/** expo-file-system handle for a database file (URIs need the file:// scheme). */
function dbFile(dbName: string): File {
  const path = `${String(SQLite.defaultDatabaseDirectory).replace(/\/*$/, '')}/${dbName}`
  return new File(path.startsWith('file://') ? path : `file://${path}`)
}
