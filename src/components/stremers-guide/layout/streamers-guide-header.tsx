"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

function StreamersGuideHeader() {
  const { t } = useTranslation();
  return (
    <header className="border-b border-border/30">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="text-primary hover:text-primary/90 flex items-center gap-1 text-sm mb-2"
          >
            <ChevronRight className="h-3 w-3 rotate-180" />
            <span> {t("header.back_home")}</span>
          </Link>
          <h1 className="text-4xl font-bold">{t("header.streamer_guide")}</h1>
          <p className="text-xl text-foreground/70 max-w-2xl">
            {t("header.streamer_guide_desc")}
          </p>
        </div>
      </div>
    </header>
  );
}

export default StreamersGuideHeader;
