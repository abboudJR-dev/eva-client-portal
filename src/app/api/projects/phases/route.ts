import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { phaseId, status } = await request.json();

  const phase = await prisma.phase.update({
    where: { id: phaseId },
    data: { status },
  });

  return NextResponse.json({ phase });
}
