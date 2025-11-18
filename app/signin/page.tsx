import { redirect } from "next/navigation";
import { readConfig } from "@/lib/config";
import SignInForm from "./SignInForm";

export default async function SignInPage() {
  const config = await readConfig();

  // First-time setup check
  if (!config?.setupComplete) redirect("/setup");

  return <SignInForm />;
}
