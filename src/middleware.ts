export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/approvals/:path*",
    "/documents/:path*",
    "/schedule/:path*",
    "/admin/:path*",
  ],
};
