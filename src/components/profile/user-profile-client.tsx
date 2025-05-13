"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "./user-profile";
import { useProfileData } from "@/hooks/use-profile-data";
import { useTranslation } from "react-i18next";

export function UserProfileClient() {
  const {
    userData,
    streamerData,
    isLoading,
    isError,
    error,
    refetchUser,
    refetchStreamer,
  } = useProfileData();
  const { t } = useTranslation();
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("profile.errorTitle")}</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>{t("profile.errorDescription", { message: error?.message })}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => {
              refetchUser();
              refetchStreamer();
            }}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            {t("profile.tryAgain")}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!userData) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("profile.notFoundTitle")}</AlertTitle>
        <AlertDescription>{t("profile.notFoundDescription")}</AlertDescription>
      </Alert>
    );
  }

  return <UserProfile userData={userData} streamerData={streamerData} />;
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/3">
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
        <div className="w-full md:w-2/3">
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
