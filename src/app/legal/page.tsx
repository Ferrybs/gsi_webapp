"use client";
import Link from "next/link";
import { FileText, Shield, Cookie } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function LegalPage() {
  const { t } = useTranslation();

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">{t("legalPage.title")}</h2>
        <p className="text-foreground/80 mb-8">{t("legalPage.subtitle")}</p>

        <div className="grid gap-6">
          <Card className="bg-card/30 border-border/30">
            <CardHeader className="flex flex-row items-center gap-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>{t("legalPage.terms.title")}</CardTitle>
                <CardDescription>
                  {t("legalPage.terms.updated")}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-foreground/80">
                {t("legalPage.terms.description")}
              </p>
              <Link
                href="/legal/terms-of-use"
                className="text-primary hover:underline font-medium"
              >
                {t("legalPage.terms.read")}
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card/30 border-border/30">
            <CardHeader className="flex flex-row items-center gap-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>{t("legalPage.privacy.title")}</CardTitle>
                <CardDescription>
                  {t("legalPage.privacy.updated")}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-foreground/80">
                {t("legalPage.privacy.description")}
              </p>
              <Link
                href="/legal/privacy"
                className="text-primary hover:underline font-medium"
              >
                {t("legalPage.privacy.read")}
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card/30 border-border/30">
            <CardHeader className="flex flex-row items-center gap-4">
              <Cookie className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>{t("legalPage.cookies.title")}</CardTitle>
                <CardDescription>
                  {t("legalPage.cookies.updated")}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-foreground/80">
                {t("legalPage.cookies.description")}
              </p>
              <Link
                href="/legal/cookies"
                className="text-primary hover:underline font-medium"
              >
                {t("legalPage.cookies.read")}
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
