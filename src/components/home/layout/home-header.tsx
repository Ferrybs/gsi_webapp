"use client";
import Image from "next/image";
import { Button } from "../../ui/button";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import HomeUserHeader from "./home-user-header";
import { Skeleton } from "../../ui/skeleton";

export default function HomeHeader() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();

  return (
    <header className="container mx-auto py-2 px-4">
      <div className="flex justify-between items-center">
        <Link href={"/"}>
          <Image
            src="/CS2Bits-logo.png"
            alt="CS2 Gameplay"
            width={50}
            height={50}
          />
        </Link>
        <div className="flex gap-3">
          {status === "loading" ? (
            <Skeleton className="h-10 w-[120px]" />
          ) : session ? (
            <HomeUserHeader />
          ) : (
            <Button
              onClick={() => signIn("steam")}
              className="bg-primary hover:bg-primary/90 text-foreground"
            >
              <Image
                src="/steam-logo.png"
                alt="CS2 Gameplay"
                width={30}
                height={30}
              />
              {t("login")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
