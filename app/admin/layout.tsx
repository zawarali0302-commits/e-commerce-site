import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}