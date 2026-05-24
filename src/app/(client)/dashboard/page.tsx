import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import PhaseTimeline from "@/components/client/phase-timeline";
import ProgressOverview from "@/components/client/progress-overview";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const project = await prisma.project.findFirst({
    where: { clientId: session.user.id },
    include: {
      phases: { include: { steps: { orderBy: { order: "asc" } } }, orderBy: { number: "asc" } },
      approvals: { orderBy: { order: "asc" } },
      manager: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20">
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-[#1A1A1A] mb-4">
            Welcome to EVA Interiors
          </h1>
          <p className="text-[#8A8279]">
            Your project is being set up. Your Relationship Manager will notify you once everything is ready.
          </p>
        </div>
      </div>
    );
  }

  const totalSteps = project.phases.reduce((acc, p) => acc + p.steps.length, 0);
  const completedSteps = project.phases.reduce((acc, p) => acc + p.steps.filter((s) => s.isCompleted).length, 0);
  const pendingApprovals = project.approvals.filter((a) => a.status === "PENDING").length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <p className="text-xs tracking-widest uppercase text-[#C5A258] font-semibold mb-1">Your Design Journey</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[#1A1A1A] mb-2">
          {project.name}
        </h1>
        {project.manager && (
          <p className="text-sm text-[#8A8279]">
            Relationship Manager: <span className="text-[#1A1A1A] font-medium">{project.manager.name}</span>
          </p>
        )}
      </div>

      <ProgressOverview
        totalSteps={totalSteps}
        completedSteps={completedSteps}
        pendingApprovals={pendingApprovals}
        currentPhase={project.phases.find((p) => p.status === "IN_PROGRESS")?.name || "Getting Started"}
      />

      <div className="mt-12">
        <h2 className="font-[family-name:var(--font-display)] text-xl mb-6 text-[#1A1A1A]">
          Project Phases
        </h2>
        <PhaseTimeline phases={project.phases} />
      </div>
    </div>
  );
}
