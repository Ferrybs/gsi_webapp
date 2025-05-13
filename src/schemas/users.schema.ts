import { z } from "zod";
import { role_type, user_status } from "../../generated/prisma";

export const UserRoleSchema = z.object({
  user_id: z.string(),
  role_name: z.nativeEnum(role_type),
});

const TRADE_LINK_REGEX =
  /^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=[A-Za-z0-9_-]+$/;

export const UsersSchema = z.object({
  user_roles: z.array(UserRoleSchema),
  id: z.string(),
  steam_id: z.string(),
  username: z.string(),
  email: z.string().email().nullable(),
  trade_link: z
    .string()
    .regex(TRADE_LINK_REGEX, "error.invalid_trade_link")
    .or(z.literal(""))
    .nullable(),
  avatar_url: z.string().nullable(),
  user_status_name: z.nativeEnum(user_status),
  created_at: z.preprocess((arg) => {
    if (typeof arg === "string" || typeof arg === "number") {
      return new Date(arg);
    }
    return arg;
  }, z.date()),
});

export const userEditSchema = UsersSchema.pick({
  email: true,
  trade_link: true,
});

export type Users = z.infer<typeof UsersSchema>;

export type UserRole = z.infer<typeof UserRoleSchema>;
