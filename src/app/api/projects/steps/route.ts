import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Update step title/description
  if (body.title !== undefined) {
    const step = await prisma.step.update({
      where: { id: body.stepId },
      data: {
        title: body.title,
        ...(body.description !== undefined && { description: body.description }),
        ...(body.sampleUrl !== undefined && { sampleUrl: body.sampleUrl }),
        ...(body.sampleLabel !== undefined && { sampleLabel: body.sampleLabel }),
      },
    });
    return NextResponse.json({ step });
  }

  // Toggle completion
  const { stepId, isCompleted } = body;
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

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { phaseId, title, description, sampleUrl, sampleLabel } = await request.json();

  // Get the current max order for this phase
  const maxStep = await prisma.step.findFirst({
    where: { phaseId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const step = await prisma.step.create({
    data: {
      phaseId,
      title,
      description: description || null,
      sampleUrl: sampleUrl || null,
      sampleLabel: sampleLabel || null,
      order: (maxStep?.order ?? -1) + 1,
    },
  });

  return NextResponse.json({ step });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { stepId } = await request.json();

  await prisma.step.delete({
    where: { id: stepId },
  });

  return NextResponse.json({ success: true });
}
