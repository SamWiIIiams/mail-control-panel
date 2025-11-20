// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { isSetupComplete } from "@/lib/sqlite";

const LOG = (...args: any[]) => console.log("[proxy]", ...args);

// Routes that never require login
const alwaysPublic = ["/api/auth", "/api/setup", "/_next/"];

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/api"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Always-public routes
  if (alwaysPublic.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const setupComplete = isSetupComplete();

  // 2. Before setup complete, allow ONLY `/setup`
  if (!setupComplete) {
    if (!pathname.startsWith("/setup")) {
      LOG("redirect → /setup (setup incomplete)");
      const url = req.nextUrl.clone();
      url.pathname = "/setup";
      return NextResponse.redirect(url);
    }

    // Allow setup page
    LOG("allow: setup page");
    return NextResponse.next();
  }

  // 3. Setup is complete. Block access to setup page entirely.
  if (pathname.startsWith("/setup")) {
    LOG("redirect → /signin (setup already complete)");
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // 4. Signin page: allow it through without requiring token
  if (pathname.startsWith("/signin")) {
    LOG("allow: signin page");
    return NextResponse.next();
  }

  // 5. Protected routes
  if (protectedRoutes.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get("next-auth.session-token")?.value;
    LOG("Session token:", token ? "[present]" : "[missing]");

    if (!token) {
      LOG("redirect → /signin (missing token)");
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }

    LOG("allow: protected route");
    return NextResponse.next();
  }

  // 6. Everything else is public
  LOG("allow: default public route");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:path*"
  ],
};
