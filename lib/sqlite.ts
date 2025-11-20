// lib/sqlite.ts
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { encryptString, decryptString, getOrCreateMasterKey } from "./crypto";

const LOG = (msg: string) => console.log("[db-service]", msg);

const DATA_DIR = process.env.CONFIG_DIR || path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "app.db");

// Ensure folder exists
if (!fs.existsSync(DATA_DIR)) {
  LOG(`DATA_DIR missing; creating directory`);
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize master key once
(async () => {
  LOG("Ensuring encryption master key exists");
  await getOrCreateMasterKey();
})();

// Open db
LOG(`Opening SQLite database`);
const db = new Database(DB_PATH);

// Initialize schema
LOG("Ensuring settings table exists");
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    username TEXT,
    password_hash TEXT,
    resend_api_key TEXT,
    setup_complete INTEGER NOT NULL DEFAULT 0
  )
`
).run();

// --- Helper interfaces ---
export interface SettingsRow {
  id: number;
  username: string | null;
  password_hash: string | null;
  resend_api_key: string | null;
  setup_complete: boolean;
}

// --- Helper functions ---

export function readSettings(): SettingsRow | null {
  const row = db.prepare("SELECT * FROM settings WHERE id = 1").get();

  if (!row) {
    LOG(`no settings row found at ${DATA_DIR}`);
    return null;
  }

  return row as SettingsRow;
}

export async function writeSettings(data: {
  username?: string;
  password_hash?: string;
  resend_api_key?: string;
  setup_complete?: number;
}) {
  LOG("checking for existing row");
  const existing = readSettings();

  if (!existing) {
    LOG("inserting new row");
    db.prepare(
      `
      INSERT INTO settings (id, username, password_hash, resend_api_key, setup_complete)
      VALUES (1, @username, @password_hash, @resend_api_key, @setup_complete)
    `
    ).run({
      username: data.username ?? null,
      password_hash: data.password_hash ?? null,
      resend_api_key: data.resend_api_key ?? null,
      setup_complete: data.setup_complete ?? 0,
    });
    LOG("insert completed");
    return;
  }

  LOG("updating row");
  db.prepare(
    `
    UPDATE settings
    SET
      username = COALESCE(@username, username),
      password_hash = COALESCE(@password_hash, password_hash),
      resend_api_key = COALESCE(@resend_api_key, resend_api_key),
      setup_complete = COALESCE(@setup_complete, setup_complete)
    WHERE id = 1
  `
  ).run({
    username: data.username,
    password_hash: data.password_hash,
    resend_api_key: data.resend_api_key,
    setup_complete: data.setup_complete,
  });

  LOG("update completed");
}

export async function saveResendApiKey(apiKey: string) {
  LOG("encrypting and storing Resend API key");
  const encrypted = await encryptString(apiKey);
  return writeSettings({ resend_api_key: encrypted });
}

export async function getResendApiKey(): Promise<string | null> {
  LOG("loading encrypted Resend API key");
  const row = readSettings();
  if (!row?.resend_api_key) {
    LOG("no key stored");
    return null;
  }

  LOG("decrypting key");
  try {
    return await decryptString(row.resend_api_key);
  } catch (err) {
    console.error("[db-service] decrypt error: ", err);
    return null;
  }
}

export function isSetupComplete(): boolean {
  const row = readSettings();
  const complete = !!row?.setup_complete;
  return complete;
}
