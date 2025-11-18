// lib/config.ts
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { encryptString, decryptString } from "./crypto";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const DATA_DIR = process.env.CONFIG_DIR || path.join(process.cwd(), "data");
const CONFIG_PATH = path.join(DATA_DIR, "config.json");

export type StoredConfig = {
  setupComplete?: boolean;
  admin?: { username: string; passwordHash: string };
  resend?: {
    apiKeyEncrypted?: string;
    fromEmail?: string;
    replyTo?: string | string[];
  };
};

async function ensureDir() {
  console.log("ensureDir: " + DATA_DIR, fs.existsSync(DATA_DIR));
  if (!fs.existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

export async function readConfig(): Promise<StoredConfig | null> {
  try {
    console.log("Reading config");
    if (!fs.existsSync(CONFIG_PATH)) return null;
    const raw = await readFile(CONFIG_PATH, "utf8");
    return JSON.parse(raw) as StoredConfig;
  } catch (err) {
    console.error("readConfig error", err);
    return null;
  }
}

export async function writeConfig(cfg: StoredConfig) {
  console.log("Writing config");
  await ensureDir();
  await writeFile(CONFIG_PATH, JSON.stringify(cfg, null, 2), { mode: 0o600 });
}

export async function saveResendApiKey(apiKey: string) {
  console.log("Saving resend api key");
  const cfg = (await readConfig()) || {};
  const encrypted = await encryptString(apiKey);
  cfg.resend = cfg.resend || {};
  cfg.resend.apiKeyEncrypted = encrypted;
  await writeConfig(cfg);
}

export async function getResendApiKey(): Promise<string | null> {
  const cfg = await readConfig();
  if (!cfg?.resend?.apiKeyEncrypted) return null;
  try {
    return await decryptString(cfg.resend.apiKeyEncrypted);
  } catch (err) {
    console.error("decrypt error", err);
    return null;
  }
}
