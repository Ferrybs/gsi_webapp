"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, User, History } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { UserInfo } from "./user-info";
import { StreamerInfo } from "./streamer-info";
import { UserRoleSchema, Users, UsersSchema } from "@/schemas/users.schema";
import { UserStats } from "./user-stats";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { getCurrentUserAction } from "@/actions/user/get-current-user-action";

export function UserProfile() {
  const [userData, setUser] = useState<Users | null>(null);
  useEffect(() => {
    getCurrentUserAction().then((user) => setUser(UsersSchema.parse(user)));
  }, []);
  const { t } = useTranslation();

  if (!userData) {
    return <UserProfileSkeleton />;
  }

  const user_roles = userData.user_roles.map((i) => i.role_name);
  return (
    <div className="container py-8">
      <div className="grid gap-8">
        <div className="flex items-center gap-4">
          <UserAvatar userData={userData} />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{userData.username}</h2>
            <p className="text-muted-foreground flex items-center gap-1">
              {user_roles.includes(
                UserRoleSchema.shape.role_name.enum.Streamer,
              ) ? (
                <>
                  <Shield className="h-4 w-4" /> {t("userProfile.streamer")}
                </>
              ) : (
                <>
                  <User className="h-4 w-4" /> {t("userProfile.user")}
                </>
              )}
            </p>
          </div>
        </div>
        <div>
          <Tabs defaultValue="info">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="info">
                {t("userProfile.tabs.info")}
              </TabsTrigger>
              <TabsTrigger value="stats">
                {t("userProfile.tabs.stats")}
              </TabsTrigger>
              <TabsTrigger value="history">
                {t("userProfile.tabs.history")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {t("userProfile.info.title")}
                  </CardTitle>
                  <CardDescription>
                    {t("userProfile.info.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <UserInfo userData={userData} />
                    {user_roles.includes(
                      UserRoleSchema.shape.role_name.enum.Streamer,
                    ) ? (
                      <StreamerInfo userData={userData} />
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="stats">
              <UserStats />
            </TabsContent>
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>{t("userProfile.history.title")}</CardTitle>
                  <CardDescription>
                    {t("userProfile.history.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <History className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">
                      {t("userProfile.history.noActivity")}
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      {t("userProfile.history.noActivityDescription")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export function UserProfileSkeleton() {
  return (
    <div className="container py-8">
      <div className="grid gap-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div>
          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">
                <Skeleton className="h-4 w-16" />
              </TabsTrigger>
              <TabsTrigger value="stats">
                <Skeleton className="h-4 w-16" />
              </TabsTrigger>
              <TabsTrigger value="history">
                <Skeleton className="h-4 w-16" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
