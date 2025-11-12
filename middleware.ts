// middleware.ts
import { withAuth } from "next-auth/middleware";

// Directly export withAuth — no wrapper function needed
export default withAuth({
  pages: {
    signIn: "/signin",
  },
});

// Specify which routes to protect
export const config = {
  matcher: ["/dashboard/:path*", "/templates/:path*"],
};
