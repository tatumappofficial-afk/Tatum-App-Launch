import * as ExpoCrypto from 'expo-crypto';

// TanStack DB uses crypto.randomUUID() internally.
// React Native doesn't provide a global crypto object, so we polyfill it.
if (typeof globalThis.crypto === 'undefined') {
  (globalThis as any).crypto = {} as Crypto;
}

if (typeof globalThis.crypto.randomUUID === 'undefined') {
  (globalThis.crypto as any).randomUUID = () => ExpoCrypto.randomUUID();
}

if (typeof globalThis.crypto.getRandomValues === 'undefined') {
  (globalThis.crypto as any).getRandomValues = (array: Uint8Array) => {
    const bytes = ExpoCrypto.getRandomBytes(array.length);
    array.set(bytes);
    return array;
  };
}
