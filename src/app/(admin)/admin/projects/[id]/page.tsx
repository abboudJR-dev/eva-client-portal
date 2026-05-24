import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ProjectEditor from "@/components/admin/project-editor";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true, email: true, phone: true } },
      phases: { include: { steps: { orderBy: { order: "asc" } } }, orderBy: { number: "asc" } },
      documents: { orderBy: { uploadedAt: "desc" } },
      approvals: { orderBy: { order: "asc" } },
      scheduleItems: { orderBy: { order: "asc" } },
    },
  });

  if (!project) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase text-[#C5A258] font-semibold mb-1">
          Project Management
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[#1A1A1A]">
          {project.name}
        </h1>
        <p className="text-sm text-[#8A8279] mt-1">
          Client: {project.client.name} ({project.client.email})
        </p>
      </div>

      <ProjectEditor project={project} />
    </div>
  );
}
