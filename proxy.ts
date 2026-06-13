import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const protectedRoutes = ["/account", "/checkout", "/orders", "/admin"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !req.auth) {
    const signInUrl = new URL("/sign-in", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};