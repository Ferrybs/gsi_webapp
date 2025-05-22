"use server";
import { getCurrentUserAction } from "../user/get-current-user-action";
import jwt from "jsonwebtoken";
export async function getCurrentUserGSITokenAction() {
  const user = await getCurrentUserAction();

  if (!user) {
    return null;
  }
  const token = jwt.sign(
    {
      id: user.steam_id,
    },
    process.env.GSI_SECRET as string,
    { expiresIn: "2d" },
  );
  return token;
}
