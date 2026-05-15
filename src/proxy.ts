import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

const AUTH_ROUTES = ["/login", "/signup"];

const PROTECTED_ROUTES = ["/dashboard", "/notes"];

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const pathname = req.nextUrl.pathname;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  let isAuthenticated = false;

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);

      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*", "/notes/:path*"],
};
