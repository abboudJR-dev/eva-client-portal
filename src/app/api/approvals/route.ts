import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { approvalId, status, comments, projectId } = body;

  if (!approvalId || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { clientId: session.user.id },
        { managerId: session.user.id },
      ],
    },
  });

  if (!project && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const approval = await prisma.approval.update({
    where: { id: approvalId },
    data: {
      status,
      comments: comments || null,
      approvedAt: new Date(),
      approvedBy: session.user.name,
    },
  });

  return NextResponse.json({ approval });
}
