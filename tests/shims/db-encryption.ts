/**
 * Test stand-in for src/db/encryption.ts (mapped in jest.config.js).
 *
 * The real module touches expo-secure-store, expo-crypto, expo-file-system,
 * and SQLCipher, none of which exist in plain Node, and the node:sqlite shim
 * behind tests/shims/expo-sqlite.ts has no SQLCipher build anyway. Returning
 * a null key makes getDatabase() take its unencrypted branch, which is the
 * same logical database the suite has always tested.
 */

export async function getOrCreateDbKey(): Promise<string | null> {
  return null
}

export async function openEncryptedDatabase(): Promise<never> {
  throw new Error('openEncryptedDatabase is not available in tests (null key skips it)')
}
