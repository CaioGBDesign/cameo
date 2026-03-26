import { NextResponse } from "next/server";

export function middleware(request) {
  const hostname = request.headers.get("host") || "";
  const isAdm = hostname.startsWith("adm.");

  if (isAdm) {
    const pathname = request.nextUrl.pathname;
    if (pathname.startsWith("/adm")) return NextResponse.next();
    return NextResponse.rewrite(new URL(`/adm${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
