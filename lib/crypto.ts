// lib/crypto.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const DATA_DIR = process.env.CONFIG_DIR || path.join(process.cwd(), "data");
const KEY_PATH = path.join(DATA_DIR, "secret.key");

// AES-256-GCM
const ALGO = "aes-256-gcm";

async function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

export async function getOrCreateMasterKey(): Promise<Buffer> {
  await ensureDataDir();
  if (fs.existsSync(KEY_PATH)) {
    return readFile(KEY_PATH);
  }
  const key = crypto.randomBytes(32); // 256-bit
  await writeFile(KEY_PATH, key, { mode: 0o600 });
  return key;
}

export async function encryptString(plaintext: string): Promise<string> {
  const key = await getOrCreateMasterKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv, { authTagLength: 16 });
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // return base64 of iv + tag + ciphertext
  return Buffer.concat([iv, tag, ciphertext]).toString("base64");
}

export async function decryptString(ciphertextB64: string): Promise<string> {
  const key = await getOrCreateMasterKey();
  const buf = Buffer.from(ciphertextB64, "base64");
  const iv = buf.slice(0, 12);
  const tag = buf.slice(12, 28);
  const ciphertext = buf.slice(28);
  const decipher = crypto.createDecipheriv(ALGO, key, iv, { authTagLength: 16 });
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plain.toString("utf8");
}
