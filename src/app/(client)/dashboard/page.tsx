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
      <div className="wrap">
        <section className="page">
          <div className="doc-empty" style={{ marginTop: 24 }}>
            <h3>Welcome to EVA Interiors</h3>
            <p>
              Your project is being set up. Your Relationship Manager will notify
              you once everything is ready.
            </p>
          </div>
        </section>
      </div>
    );
  }

  const totalSteps = project.phases.reduce((acc, p) => acc + p.steps.length, 0);
  const completedSteps = project.phases.reduce(
    (acc, p) => acc + p.steps.filter((s) => s.isCompleted).length,
    0,
  );
  const pendingApprovals = project.approvals.filter(
    (a) => a.status === "PENDING",
  ).length;
  const currentPhase =
    project.phases.find((p) => p.status === "IN_PROGRESS")?.name ||
    "Getting Started";

  return (
    <div className="wrap">
      <section className="page">
        <div className="page-head reveal">
          <span className="eyebrow">Your Design Journey</span>
          <h1>{project.name}</h1>
          <p className="meta">
            Relationship Manager:{" "}
            <b>{project.manager?.name ?? "EVA Sales Team"}</b>
          </p>
        </div>

        <ProgressOverview
          totalSteps={totalSteps}
          completedSteps={completedSteps}
          pendingApprovals={pendingApprovals}
          currentPhase={currentPhase}
        />

        <h2 className="section-title reveal">Project Phases</h2>
        <PhaseTimeline phases={project.phases} />
      </section>
    </div>
  );
}
