import { prisma } from "@/lib/db";
import Link from "next/link";
import { FolderOpen } from "lucide-react";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      client: { select: { name: true, email: true } },
      phases: { select: { status: true } },
      approvals: { select: { status: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[#1A1A1A]">All Projects</h1>
        <p className="text-sm text-[#8A8279] mt-1">Click a project to manage phases, steps, documents, and approvals.</p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#C8BFB2]/30">
          <FolderOpen size={32} className="mx-auto text-[#C8BFB2] mb-3" />
          <p className="text-[#8A8279]">No projects yet. Create a client first.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const completedPhases = project.phases.filter((p) => p.status === "COMPLETED").length;
            const pendingApprovals = project.approvals.filter((a) => a.status === "PENDING").length;
            return (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-[#C8BFB2]/30 p-5 hover:shadow-sm hover:border-[#C5A258]/30 transition-all gap-3"
              >
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-base font-medium text-[#1A1A1A]">
                    {project.name}
                  </h3>
                  <p className="text-xs text-[#8A8279] mt-0.5">Client: {project.client.name}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#8A8279]">
                  <span>{completedPhases}/{project.phases.length} phases</span>
                  <span className="text-[#C5A258] font-semibold">{pendingApprovals} pending</span>
                  <span className={`tracking-wider uppercase font-bold px-2 py-0.5 ${
                    project.status === "active" ? "text-[#4A7B5E] bg-[#4A7B5E]/5" : "text-[#8A8279] bg-[#8A8279]/5"
                  }`}>
                    {project.status}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
