import { auth } from "@/lib/auth";

/**
 * Throws if the current user is not signed in or not an admin.
 * Returns the session user (with id and role) on success.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if (session.user.role !== "ADMIN") throw new Error("Forbidden");
  return session.user;
}