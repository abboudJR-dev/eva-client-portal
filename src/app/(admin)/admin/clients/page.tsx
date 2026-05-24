import { prisma } from "@/lib/db";
import Link from "next/link";
import CreateClientForm from "@/components/admin/create-client-form";
import { User, Mail, Phone } from "lucide-react";

export default async function ClientsPage() {
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    include: { projects: { select: { id: true, name: true, status: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[#1A1A1A]">Clients</h1>
          <p className="text-sm text-[#8A8279] mt-1">Manage client accounts and credentials.</p>
        </div>
      </div>

      <CreateClientForm />

      <div className="mt-8 space-y-3">
        {clients.map((client) => (
          <div key={client.id} className="bg-white border border-[#C8BFB2]/30 p-5 hover:shadow-sm transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#F0EBE3] flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-[#C5A258]" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-base font-medium text-[#1A1A1A]">
                    {client.name}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-[#8A8279]">
                      <Mail size={10} /> {client.email}
                    </span>
                    {client.phone && (
                      <span className="flex items-center gap-1 text-xs text-[#8A8279]">
                        <Phone size={10} /> {client.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {client.projects.length > 0 ? (
                  client.projects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/admin/projects/${p.id}`}
                      className="text-[0.65rem] tracking-wider uppercase font-bold px-2.5 py-1 bg-[#C5A258]/5 text-[#C5A258] border border-[#C5A258]/20 hover:bg-[#C5A258]/10 transition-colors"
                    >
                      {p.name}
                    </Link>
                  ))
                ) : (
                  <span className="text-xs text-[#C8BFB2]">No projects</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {clients.length === 0 && (
          <div className="text-center py-12 bg-white border border-[#C8BFB2]/30">
            <User size={32} className="mx-auto text-[#C8BFB2] mb-3" />
            <p className="text-[#8A8279]">No clients yet. Create one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
