// app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import { SessionWrapper } from "@/components/providers/session-wrapper";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "@/lib/i18n/i18n-provider";
import { I18nProvider } from "@/lib/i18n/i18n-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import HomeHeader from "@/components/home/layout/home-header";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import HomeFooter from "@/components/home/layout/home-footer";

export const metadata: Metadata = {
  title: "CS2 Bits - Challenge. Predict. Engage.",
  description:
    "Uma nova forma de viver o CS2. Aposte, desafie e interaja enquanto assiste seu streamer favorito.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value ?? "pt";
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen flex flex-col items-center`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionWrapper>
            <I18nProvider locale={locale}>
              <QueryProvider>
                <HomeHeader />
                {children}
                <Toaster />
                <HomeFooter />
              </QueryProvider>
            </I18nProvider>
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
