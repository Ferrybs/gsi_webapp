// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LOCALES = ["en", "pt"];
const DEFAULT_LOCALE = "pt";

function detectLocale(request: NextRequest): string {
  const accept = request.headers.get("accept-language") ?? "";
  const lang = accept.split(",")[0].split("-")[0];
  return SUPPORTED_LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api") &&
    !PUBLIC_FILE.test(pathname)
  ) {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    const locale = cookieLocale ?? detectLocale(request);

    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|robots.txt|.*\\..*).*)"],
};
