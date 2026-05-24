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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-[#8A8279]">No project found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase text-[#C5A258] font-semibold mb-1">Your Decisions</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[#1A1A1A]">
          Approvals & Actions
        </h1>
        <p className="text-sm text-[#8A8279] mt-2 max-w-xl">
          Every point where your input, approval, or action is required. You can approve directly from here, or let your RM know via WhatsApp/email.
        </p>
      </div>

      <ApprovalsList approvals={project.approvals} projectId={project.id} />
    </div>
  );
}
