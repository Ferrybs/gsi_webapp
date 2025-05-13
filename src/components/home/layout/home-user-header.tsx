import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { Skeleton } from "../../ui/skeleton";
import { useTranslation } from "react-i18next";
import { getCurrentUserAction } from "@/actions/user/get-current-user-action";
import { Users, UsersSchema } from "@/schemas/users.schema";
import { useEffect, useState } from "react";

export default function HomeUserHeader() {
  const router = useRouter();
  const { t } = useTranslation();

  const [userData, setUserData] = useState<Users | null>(null);
  useEffect(() => {
    getCurrentUserAction().then((user) => setUserData(UsersSchema.parse(user)));
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        {!userData ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : (
          <Avatar className="h-8 w-8">
            <AvatarImage src={userData.avatar_url || undefined} />
            <AvatarFallback>
              {userData.username.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        )}
        <span className="max-w-[150px] truncate font-semibold">
          {!userData ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            userData.username?.slice(0, 30)
          )}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-0">
        {!userData ? (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-muted-foreground/10">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-col min-w-0 gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-muted-foreground/10">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userData?.avatar_url || undefined} />
              <AvatarFallback>
                {userData?.username?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm truncate">
                {userData?.username?.slice(0, 30)}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {userData?.email}
              </span>
            </div>
          </div>
        )}
        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="py-3 cursor-pointer font-medium flex items-center gap-2 m-1"
        >
          <User className="h-4 w-4" />
          {t("profile.title")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            signOut();
            router.push("/");
          }}
          className="py-3 cursor-pointer text-destructive font-medium flex items-center gap-2  m-1"
        >
          <LogOut className="h-4 w-4" />
          {t("logout", "Log out")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
