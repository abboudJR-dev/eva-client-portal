import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ClientNav from "@/components/layout/client-nav";
import GoldGrad from "@/components/gold-grad";
import RevealManager from "@/components/reveal-manager";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.role === "ADMIN") redirect("/admin");

  return (
    <div className="portal-shell">
      <GoldGrad />
      <ClientNav user={session.user} />
      <main>{children}</main>
      <RevealManager />
    </div>
  );
}
