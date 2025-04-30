"use client";
import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/30">
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">{t("legalLayout.back")}</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {t("legalLayout.headerTitle")}
              </h1>
              <p className="text-sm text-foreground/60">
                {t("legalLayout.headerSubtitle")}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      {children}

      {/* Footer */}
      <footer className="border-t border-border/30 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-foreground/60">
              {t("legalLayout.footerCopyright")}
            </div>
            <div className="flex gap-6">
              <Link
                href="/"
                className="text-sm text-foreground/60 hover:text-foreground"
              >
                {t("legalLayout.footerBack")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
