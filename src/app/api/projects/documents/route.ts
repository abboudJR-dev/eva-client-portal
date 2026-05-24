import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, name, url, phase, description } = await request.json();

  const document = await prisma.document.create({
    data: {
      projectId,
      name,
      url: url || null,
      phase: phase || null,
      description: description || null,
      uploadedBy: session.user.name,
    },
  });

  return NextResponse.json({ document }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { documentId } = await request.json();

  await prisma.document.delete({ where: { id: documentId } });

  return NextResponse.json({ success: true });
}
