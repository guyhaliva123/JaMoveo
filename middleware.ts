import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define authentication paths
const authPaths = ["/login", "/sign-up"];
const authApiPaths = ["/api/auth"];
const publicPaths = ["/favicon.ico", "/_next", "/images", "/api/auth"];

// Define role-based paths
const adminPaths = ["/admin"];
const playerPaths = ["/player"];

// Temporarily disable middleware for debugging
const DISABLE_MIDDLEWARE = process.env.DISABLE_MIDDLEWARE === "true";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For debugging - log request info
  console.log(`[Middleware] Processing ${pathname}`);

  // Skip middleware if disabled
  if (DISABLE_MIDDLEWARE) {
    console.log("[Middleware] Middleware is disabled, allowing all requests");
    return NextResponse.next();
  }

  // Check if the path should be public
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublicPath) {
    console.log(`[Middleware] Public path ${pathname}, skipping auth check`);
    return NextResponse.next();
  }

  // Skip middleware for Auth.js API routes (redundant check but kept for clarity)
  if (pathname.startsWith("/api/auth")) {
    console.log("[Middleware] Auth API path, skipping auth check");
    return NextResponse.next();
  }

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: pathname.includes("jamoveo-production")
        ? "__Secure-next-auth.session-token"
        : process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
    });

    console.log(`[Middleware] Token: ${token ? "Found" : "Not found"}`);
    if (token) {
      console.log(`[Middleware] User role: ${token.role}`);
    }

    // If user is logged in and tries to access auth paths, redirect based on role
    if (token && authPaths.some((path) => pathname.startsWith(path))) {
      console.log(`[Middleware] Redirecting authenticated user from auth path`);
      return NextResponse.redirect(
        new URL(token.role === "ADMIN" ? "/admin" : "/player", request.url)
      );
    }

    // If user is not logged in and tries to access protected paths
    if (
      !token &&
      !authPaths.some((path) => pathname.startsWith(path)) &&
      !authApiPaths.some((path) => pathname.startsWith(path))
    ) {
      console.log(
        `[Middleware] Unauthenticated user tried to access protected path, redirecting to login`
      );
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
        console.log(
          `[Middleware] Admin tried to access non-admin path, redirecting to admin`
        );
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      // Redirect player trying to access admin paths
      if (
        token.role === "REGULAR" &&
        !playerPaths.some((path) => pathname.startsWith(path))
      ) {
        console.log(
          `[Middleware] Regular user tried to access non-player path, redirecting to player`
        );
        return NextResponse.redirect(new URL("/player", request.url));
      }
    }

    console.log(`[Middleware] Request allowed to proceed`);
    return NextResponse.next();
  } catch (error) {
    console.error(`[Middleware] Error in middleware:`, error);
    // If there's an error, allow the request to proceed to avoid blocking users
    return NextResponse.next();
  }
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
