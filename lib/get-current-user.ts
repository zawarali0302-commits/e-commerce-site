import { auth } from "@/lib/auth";

/**
 * Returns the current session user, or null if not signed in.
 * session.user.id is the database User.id directly (NextAuth + PrismaAdapter).
 */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

/**
 * Returns the current user's ID, or null if not signed in.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}