import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LOCALES = ["en", "pt"];
const DEFAULT_LOCALE = "pt";

function getLocale(request: NextRequest): string {
  const acceptLang = request.headers.get("accept-language");
  if (!acceptLang) return DEFAULT_LOCALE;
  const preferred = acceptLang.split(",")[0].split("-")[0];
  return SUPPORTED_LOCALES.includes(preferred) ? preferred : DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const pathnameIsMissingLocale = SUPPORTED_LOCALES.every(
    (locale) => !pathname.startsWith(`/${locale}`),
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Apply middleware to all routes except:
     * - static files
     * - API routes
     */
    "/((?!_next|api|favicon.ico|robots.txt|.*\\..*).*)",
  ],
};
