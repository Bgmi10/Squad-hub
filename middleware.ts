import { NextRequest, NextResponse } from "next/server";

// Shared-password HTTP Basic auth for the whole app (cron route uses its own bearer secret).
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/cron")) return NextResponse.next();
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const pass = atob(auth.slice(6)).split(":").slice(1).join(":");
    if (pass && pass === process.env.TEAM_PASSWORD) return NextResponse.next();
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Squad Hub"' },
  });
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
