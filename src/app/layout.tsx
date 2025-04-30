// app/layout.tsx

import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { SessionWrapper } from "@/components/providers/session-wrapper";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "@/lib/i18n/i18n-provider";
import { I18nProvider } from "@/lib/i18n/i18n-provider";
import { QueryProvider } from "@/components/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CS2 Bits - Challenge. Predict. Engage.",
  description:
    "Uma nova forma de viver o CS2. Aposte, desafie e interaja enquanto assiste seu streamer favorito.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionWrapper>
            <I18nProvider>
              <QueryProvider>{children}</QueryProvider>
            </I18nProvider>
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
