// lib/getResendClient.ts
import { Resend } from "resend";
import { getResendApiKey } from "./config";

export async function getResendClient() {
  const apiKey = await getResendApiKey();
  if (!apiKey) throw new Error("No Resend API key configured");
  return new Resend(apiKey);
}
