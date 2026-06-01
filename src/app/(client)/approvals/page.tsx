import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ApprovalsList from "@/components/client/approvals-list";

export default async function ApprovalsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const project = await prisma.project.findFirst({
    where: { clientId: session.user.id },
    include: { approvals: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  if (!project) {
    return (
      <div className="wrap">
        <section className="page">
          <div className="doc-empty" style={{ marginTop: 24 }}>
            <h3>No project found</h3>
            <p>
              Your project is being set up. Your Relationship Manager will notify
              you once approvals are ready.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="wrap">
      <section className="page">
        <div className="page-head reveal">
          <span className="eyebrow">Your Decisions</span>
          <h1>Approvals &amp; Actions</h1>
          <p className="lede">
            Every point where your input or approval keeps your project moving.
            Approve directly here, or leave a note for your Relationship Manager.
          </p>
        </div>

        <ApprovalsList approvals={project.approvals} projectId={project.id} />
      </section>
    </div>
  );
}
