import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ClientNav from "@/components/layout/client-nav";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.role === "ADMIN") redirect("/admin");

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <ClientNav user={session.user} />
      <main className="pt-20 pb-12">{children}</main>
    </div>
  );
}
