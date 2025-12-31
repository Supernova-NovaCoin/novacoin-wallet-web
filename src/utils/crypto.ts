/**
 * Crypto utilities for wallet encryption/decryption
 * Uses Web Crypto API with AES-GCM for secure key storage
 */

const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const KEY_LENGTH = 256;

/**
 * Derive encryption key from password using PBKDF2
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Convert ArrayBuffer to hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string to Uint8Array
 */
function hexToBuffer(hex: string): Uint8Array {
  const matches = hex.match(/.{1,2}/g);
  if (!matches) return new Uint8Array(0);
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
}

/**
 * Encrypt private key with password
 * Returns hex-encoded string: salt (16 bytes) + iv (12 bytes) + ciphertext
 */
export async function encryptPrivateKey(privateKey: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const key = await deriveKey(password, salt);

  // Remove 0x prefix if present
  const keyData = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
  const plaintext = encoder.encode(keyData);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintext
  );

  // Combine salt + iv + ciphertext
  const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

  return bufferToHex(combined.buffer);
}

/**
 * Decrypt private key with password
 * Expects hex-encoded string: salt (16 bytes) + iv (12 bytes) + ciphertext
 */
export async function decryptPrivateKey(encryptedData: string, password: string): Promise<string> {
  const decoder = new TextDecoder();
  const combined = hexToBuffer(encryptedData);

  if (combined.length < SALT_LENGTH + IV_LENGTH + 1) {
    throw new Error('Invalid encrypted data');
  }

  const salt = combined.slice(0, SALT_LENGTH);
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH);

  const key = await deriveKey(password, salt);

  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const privateKeyHex = decoder.decode(plaintext);
    return `0x${privateKeyHex}`;
  } catch {
    throw new Error('Decryption failed - invalid password');
  }
}

/**
 * Generate a random private key (32 bytes)
 */
export function generatePrivateKey(): string {
  const privateKeyBytes = crypto.getRandomValues(new Uint8Array(32));
  return `0x${bufferToHex(privateKeyBytes.buffer)}`;
}

/**
 * Validate private key format
 */
export function isValidPrivateKey(key: string): boolean {
  if (!key.startsWith('0x')) return false;
  const hex = key.slice(2);
  if (hex.length !== 64) return false;
  return /^[0-9a-fA-F]+$/.test(hex);
}

/**
 * Hash data using SHA-256
 */
export async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  return bufferToHex(hashBuffer);
}

/**
 * Generate a secure random hex string
 */
export function randomHex(bytes: number): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(bytes));
  return bufferToHex(randomBytes.buffer);
}
