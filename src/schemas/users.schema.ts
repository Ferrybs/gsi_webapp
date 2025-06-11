import { z } from "zod";
import { role_type, user_status } from "@prisma/client";
import { stringToDate } from "./helper.schema";

export const UserRoleSchema = z.object({
  user_id: z.string(),
  role_name: z.nativeEnum(role_type),
});

const TRADE_LINK_REGEX =
  /^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=[A-Za-z0-9_-]+$/;

export const UsersSchema = z.object({
  user_roles: z.array(UserRoleSchema).optional().nullable(),
  id: z.string(),
  steam_id: z.string(),
  username: z.string(),
  email: z.string().email().or(z.literal("")).nullable(),
  trade_link: z
    .string()
    .regex(TRADE_LINK_REGEX, "Invalid trade link")
    .or(z.literal(""))
    .nullable(),
  avatar_url: z.string().nullable(),
  user_status_name: z.nativeEnum(user_status),
  created_at: stringToDate,
});

export const userEditSchema = UsersSchema.pick({
  email: true,
  trade_link: true,
});

export type Users = z.infer<typeof UsersSchema>;

export type UserRole = z.infer<typeof UserRoleSchema>;
