import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserByExternalId } from "@/lib/services/user.service";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId: externalId } = await auth();
  if (!externalId) redirect("/sign-in");

  const user = await getUserByExternalId(externalId);
  if (!user || user.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}