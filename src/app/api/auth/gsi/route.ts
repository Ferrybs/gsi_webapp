import { getCurrentUserGSIAction } from "@/actions/auth/get-current-user-GSI-action";

export const GET = async (req: Request) => {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const response = await getCurrentUserGSIAction(token);

  if (!response.success || !response.data) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify(response.data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
