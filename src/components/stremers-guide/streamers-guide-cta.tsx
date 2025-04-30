"use client";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

export default function StreamersGuideCTA() {
  const { t } = useTranslation();

  return (
    <section>
      <div className="bg-gradient-to-r from-primary/20 to-black/40 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t("cta.title")}
        </h2>
        <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
          {t("cta.description")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary hover:bg-primary/90 text-foreground text-lg px-8 py-6">
            {t("cta.button")}
          </Button>
        </div>
      </div>
    </section>
  );
}
