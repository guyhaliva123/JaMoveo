import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define authentication paths
const authPaths = ["/login", "/sign-up", "/api/auth"];

// Define role-based paths
const adminPaths = ["/admin"];
const playerPaths = ["/player"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  // If user is logged in and tries to access auth paths, redirect based on role
  if (token && authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(
      new URL(token.role === "ADMIN" ? "/admin" : "/player", request.url)
    );
  }

  // If user is not logged in and tries to access protected paths
  if (!token && !authPaths.some((path) => pathname.startsWith(path))) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // Role-based access control
  if (token) {
    // Redirect admin trying to access player paths
    if (
      token.role === "ADMIN" &&
      !adminPaths.some((path) => pathname.startsWith(path))
    ) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Redirect player trying to access admin paths
    if (
      token.role === "REGULAR" &&
      !playerPaths.some((path) => pathname.startsWith(path))
    ) {
      return NextResponse.redirect(new URL("/player", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
