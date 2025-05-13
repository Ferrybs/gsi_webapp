"use client";
import { useTranslation } from "react-i18next";
import { LegalNavigation } from "@/components/legal/legal-navigation";

export default function TermsOfUsePage() {
  const { t } = useTranslation();

  return (
    <>
      <LegalNavigation />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert max-w-none">
            <h1 className="text-3xl font-bold mb-2">{t("terms.title")}</h1>
            <p className="text-sm text-foreground/60 mb-6">
              {t("terms.lastUpdated")}
            </p>

            <p className="text-foreground/80 mb-6">{t("terms.intro")}</p>

            <h2 className="text-xl font-bold mt-8 mb-4">
              {t("terms.acceptance.title")}
            </h2>
            <p className="text-foreground/80 mb-4">
              {t("terms.acceptance.content")}
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">
              {t("terms.eligibility.title")}
            </h2>
            <p className="text-foreground/80 mb-4">
              {t("terms.eligibility.content")}
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">
              {t("terms.account.title")}
            </h2>
            <p className="text-foreground/80 mb-4">
              {t("terms.account.content1")}
            </p>
            <p className="text-foreground/80 mb-4">
              {t("terms.account.content2")}
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">
              {t("terms.challenges.title")}
            </h2>
            <p className="text-foreground/80 mb-4">
              {t("terms.challenges.intro1")}
            </p>
            <p className="text-foreground/80 mb-4">
              {t("terms.challenges.intro2")}
            </p>
            <ul className="list-disc pl-6 mb-4 text-foreground/80 space-y-2">
              <li>{t("terms.challenges.items.1")}</li>
              <li>{t("terms.challenges.items.2")}</li>
              <li>{t("terms.challenges.items.3")}</li>
              <li>{t("terms.challenges.items.4")}</li>
              <li>{t("terms.challenges.items.5")}</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">
              {t("terms.conduct.title")}
            </h2>
            <p className="text-foreground/80 mb-4">
              {t("terms.conduct.intro")}
            </p>
            <ul className="list-disc pl-6 mb-4 text-foreground/80 space-y-2">
              <li>{t("terms.conduct.items.1")}</li>
              <li>{t("terms.conduct.items.2")}</li>
              <li>{t("terms.conduct.items.3")}</li>
              <li>{t("terms.conduct.items.4")}</li>
              <li>{t("terms.conduct.items.5")}</li>
              <li>{t("terms.conduct.items.6")}</li>
              <li>{t("terms.conduct.items.7")}</li>
              <li>{t("terms.conduct.items.8")}</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">
              {t("terms.intellectualProperty.title")}
            </h2>
            <p className="text-foreground/80 mb-4">
              {t("terms.intellectualProperty.content1")}
            </p>
            <p className="text-foreground/80 mb-4">
              {t("terms.intellectualProperty.content2")}
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">
              {t("terms.liability.title")}
            </h2>
            <p className="text-foreground/80 mb-4">
              {t("terms.liability.content1")}
            </p>
            <p className="text-foreground/80 mb-4">
              {t("terms.liability.content2")}
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">
              {t("terms.modifications.title")}
            </h2>
            <p className="text-foreground/80 mb-4">
              {t("terms.modifications.content")}
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">
              {t("terms.governingLaw.title")}
            </h2>
            <p className="text-foreground/80 mb-4">
              {t("terms.governingLaw.content")}
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">
              {t("terms.contact.title")}
            </h2>
            <p className="text-foreground/80 mb-4">
              {t("terms.contact.intro")}
            </p>
            <p
              className="text-foreground/80 mb-4"
              dangerouslySetInnerHTML={{ __html: t("terms.contact.email") }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
