"use client";
import Image from "next/image";
import { Button } from "../../ui/button";
import { useTranslation } from "react-i18next";

export default function HomeHeader() {
  const { t } = useTranslation();
  return (
    <header className="container mx-auto py-2 px-4">
      <div className="flex justify-between items-center">
        <Image
          src="/CS2Bits-logo.png"
          alt="CS2 Gameplay"
          width={50}
          height={50}
        />
        <div className="flex gap-3">
          <Button className="bg-primary hover:bg-primary/90 text-foreground">
            <Image
              src="/steam-logo.png"
              alt="CS2 Gameplay"
              width={30}
              height={30}
            />
            {t("login")}
          </Button>
        </div>
      </div>
    </header>
  );
}
