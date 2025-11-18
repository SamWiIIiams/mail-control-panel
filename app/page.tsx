// app/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readConfig } from "@/lib/config";

export default async function HomePage() {
  const config = await readConfig();

  if (!config?.setupComplete) {
    redirect("/setup");
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  redirect("/dashboard");
}
