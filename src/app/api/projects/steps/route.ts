import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { stepId, isCompleted } = await request.json();

  const step = await prisma.step.update({
    where: { id: stepId },
    data: {
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
      completedBy: isCompleted ? session.user.name : null,
    },
  });

  return NextResponse.json({ step });
}
