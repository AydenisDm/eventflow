import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isPublic = publicRoutes.includes(req.nextUrl.pathname);

  if (!isLoggedIn && !isPublic) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
