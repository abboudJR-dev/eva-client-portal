import { prisma } from "@/lib/db";
import Link from "next/link";
import { Users, FolderOpen, Clock, CheckCircle } from "lucide-react";

export default async function AdminDashboard() {
  const [clientCount, projectCount, pendingApprovals, recentProjects] = await Promise.all([
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.project.count(),
    prisma.approval.count({ where: { status: "PENDING" } }),
    prisma.project.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { client: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[#1A1A1A]">
          Admin Dashboard
        </h1>
        <p className="text-sm text-[#8A8279] mt-1">Manage client projects and track progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border border-[#C8BFB2]/30 p-5">
          <Users size={20} className="text-[#C5A258] mb-2" />
          <span className="font-[family-name:var(--font-display)] text-3xl text-[#1A1A1A]">{clientCount}</span>
          <p className="text-xs tracking-wider uppercase text-[#8A8279] mt-1">Clients</p>
        </div>
        <div className="bg-white border border-[#C8BFB2]/30 p-5">
          <FolderOpen size={20} className="text-[#C5A258] mb-2" />
          <span className="font-[family-name:var(--font-display)] text-3xl text-[#1A1A1A]">{projectCount}</span>
          <p className="text-xs tracking-wider uppercase text-[#8A8279] mt-1">Projects</p>
        </div>
        <div className="bg-white border border-[#C8BFB2]/30 p-5">
          <Clock size={20} className="text-[#C5A258] mb-2" />
          <span className="font-[family-name:var(--font-display)] text-3xl text-[#C5A258]">{pendingApprovals}</span>
          <p className="text-xs tracking-wider uppercase text-[#8A8279] mt-1">Pending Approvals</p>
        </div>
        <Link href="/admin/clients" className="bg-[#C5A258] p-5 flex flex-col justify-center items-center hover:bg-[#A68A3E] transition-colors">
          <span className="text-white text-sm tracking-wider uppercase font-semibold">+ New Client</span>
        </Link>
      </div>

      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[#1A1A1A] mb-4">Recent Projects</h2>
        {recentProjects.length === 0 ? (
          <p className="text-[#8A8279] text-sm">No projects yet. Create a client to get started.</p>
        ) : (
          <div className="space-y-2">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="flex items-center justify-between bg-white border border-[#C8BFB2]/30 p-4 hover:shadow-sm hover:border-[#C5A258]/30 transition-all"
              >
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-sm font-medium text-[#1A1A1A]">
                    {project.name}
                  </h3>
                  <p className="text-xs text-[#8A8279] mt-0.5">{project.client.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[0.6rem] tracking-wider uppercase font-bold px-2 py-0.5 ${
                    project.status === "active"
                      ? "text-[#4A7B5E] bg-[#4A7B5E]/5"
                      : "text-[#8A8279] bg-[#8A8279]/5"
                  }`}>
                    {project.status}
                  </span>
                  <CheckCircle size={14} className="text-[#C8BFB2]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
