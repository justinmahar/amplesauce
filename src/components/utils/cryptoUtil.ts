// Web Crypto helpers: PBKDF2(SHA-256) + AES-GCM with per-message random IV

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// Helpers
export const arrayBufferToBase64 = (buf: ArrayBuffer): string => {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const base64ToArrayBuffer = (b64: string): ArrayBuffer => {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

// Deterministic salt from workspace uid: salt = SHA-256("ws:" + workspaceUid)
export const deriveSaltFromWorkspaceUidAsync = async (workspaceUid: string): Promise<ArrayBuffer> => {
  const data = textEncoder.encode(`ws:${workspaceUid}`);
  return crypto.subtle.digest('SHA-256', data);
};

const importKeyMaterial = async (password: string): Promise<CryptoKey> => {
  return crypto.subtle.importKey('raw', textEncoder.encode(password), 'PBKDF2', false, ['deriveKey']);
};

const deriveAesGcmKeyAsync = async (
  password: string,
  salt: ArrayBuffer,
  iterations = 100_000,
  extractable = false,
): Promise<CryptoKey> => {
  const keyMaterial = await importKeyMaterial(password);
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    extractable,
    ['encrypt', 'decrypt'],
  );
};

export const deriveSessionKeyAsync = async (
  password: string,
  workspaceUid: string,
  iterations = 100_000,
): Promise<CryptoKey> => {
  const salt = await deriveSaltFromWorkspaceUidAsync(workspaceUid);
  return deriveAesGcmKeyAsync(password, salt, iterations, true);
};

export const exportKeyRawBase64Async = async (key: CryptoKey): Promise<string> => {
  const raw = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(raw);
};

export type EncryptResult = { ciphertextBase64: string; ivBase64: string };

export const encryptStringAsync = async (
  plaintext: string,
  password: string,
  workspaceUid: string,
  iterations = 100_000,
): Promise<EncryptResult> => {
  const salt = await deriveSaltFromWorkspaceUidAsync(workspaceUid);
  const key = await deriveAesGcmKeyAsync(password, salt, iterations, false);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = textEncoder.encode(plaintext);
  const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return { ciphertextBase64: arrayBufferToBase64(cipherBuf), ivBase64: arrayBufferToBase64(iv.buffer) };
};

export const decryptStringAsync = async (
  ciphertextBase64: string,
  ivBase64: string,
  password: string,
  workspaceUid: string,
  iterations = 100_000,
): Promise<string> => {
  const salt = await deriveSaltFromWorkspaceUidAsync(workspaceUid);
  const key = await deriveAesGcmKeyAsync(password, salt, iterations, false);
  const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));
  const cipherBuf = base64ToArrayBuffer(ciphertextBase64);
  const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipherBuf);
  return textDecoder.decode(plainBuf);
};

export const encryptWithKeyAsync = async (key: CryptoKey, plaintext: string): Promise<EncryptResult> => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = textEncoder.encode(plaintext);
  const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return { ciphertextBase64: arrayBufferToBase64(cipherBuf), ivBase64: arrayBufferToBase64(iv.buffer) };
};

export const decryptWithKeyAsync = async (
  key: CryptoKey,
  ciphertextBase64: string,
  ivBase64: string,
): Promise<string> => {
  const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));
  const cipherBuf = base64ToArrayBuffer(ciphertextBase64);
  const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipherBuf);
  return textDecoder.decode(plainBuf);
};
