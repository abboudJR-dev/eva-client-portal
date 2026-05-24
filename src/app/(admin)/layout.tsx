import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminNav from "@/components/layout/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <AdminNav user={session.user} />
      <main className="pt-20 pb-12">{children}</main>
    </div>
  );
}
