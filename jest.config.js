/**
 * Jest runs in plain Node (no jest-expo, no react renderer): the suite covers
 * pure domain logic and the SQLite/collection layer, never components. Babel
 * options are inline — a root babel.config.js would also be picked up by
 * Metro and change the app bundle.
 */

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.[mc]?[tj]sx?$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
        ],
      },
    ],
  },
  // fractional-indexing (a @tanstack/db-ivm dependency) ships ESM-only and
  // must go through babel like our own sources.
  transformIgnorePatterns: ['node_modules/(?!fractional-indexing)'],
  moduleNameMapper: {
    // In-memory node:sqlite stand-in for the native driver.
    '^expo-sqlite$': '<rootDir>/tests/shims/expo-sqlite.ts',
    // Null-key stand-in for the SQLCipher/keychain layer: the encryption
    // module is the only other native surface the db layer touches, and the
    // node:sqlite shim has no SQLCipher, so tests run the unencrypted branch.
    '^@/src/db/encryption$': '<rootDir>/tests/shims/db-encryption.ts',
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFiles: ['<rootDir>/tests/support/jestSetup.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/android/', '<rootDir>/ios/', '<rootDir>/functions/'],
  clearMocks: true,
}
