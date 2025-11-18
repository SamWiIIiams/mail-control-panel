// proxy.ts (root of project)
import { NextRequest, NextResponse } from "next/server";
import { readConfig } from "@/lib/config";

// Routes that normally require auth
const protectedPaths = ["/dashboard", "/api"];
// Routes to skip protection
const unprotectedPaths = ["/api/auth", "/api/setup"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip unprotected routes
  if (unprotectedPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Only protect specified paths
  if (!protectedPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check if setup is complete
  let setupComplete = false;
  try {
    const cfg = await readConfig();
    setupComplete = cfg?.setupComplete ?? false;
  } catch (err) {
    console.error("Failed to read config in proxy", err);
  }

  // If setup not done, redirect all protected routes to /setup
  if (!setupComplete) {
    const url = req.nextUrl.clone();
    url.pathname = "/setup";
    return NextResponse.redirect(url);
  }

  // Setup done → check authentication
  const token = req.cookies.get("next-auth.session-token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
