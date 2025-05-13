"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComputerIcon as Steam } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

export function SteamSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("steam");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-32">
            <Image
              src="/CS2Bits-logo.png"
              alt="CS2 Bits Logo"
              width={140}
              height={140}
              className="rounded-lg"
              priority
            />
          </div>
        </div>
        <CardTitle className="text-2xl">
          {t("signInPage.welcomeTitle")}
        </CardTitle>
        <CardDescription>{t("signInPage.description")}</CardDescription>
      </CardHeader>

      <CardFooter>
        <Button
          onClick={handleSignIn}
          className="w-full bg-primary hover:bg-primary/90 text-foreground"
          disabled={isLoading}
        >
          <Image
            src="/steam-logo.png"
            alt="CS2 Gameplay"
            width={35}
            height={35}
          />
          {isLoading
            ? t("signInPage.button.connecting")
            : t("signInPage.button.signIn")}
        </Button>
      </CardFooter>

      <div className="px-6 pb-6 text-center text-sm text-muted-foreground">
        <Trans
          i18nKey="signInPage.agreement"
          components={[
            <a
              key="0"
              href="/legal/terms-of-use"
              className="underline hover:text-foreground"
            />,
            <a
              key="1"
              href="/legal/privacy"
              className="underline hover:text-foreground"
            />,
          ]}
        />
      </div>
    </Card>
  );
}
