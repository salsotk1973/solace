import { auth } from "@clerk/nextjs/server";

export type CurrentUser = { userId: string | null };

function shouldBypassClerkInLocalDev() {
  return process.env.NODE_ENV === "development";
}

export async function getCurrentUserId(): Promise<string | null> {
  if (shouldBypassClerkInLocalDev()) {
    return null;
  }

  const { userId } = await auth();
  return userId ?? null;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  return { userId: await getCurrentUserId() };
}
