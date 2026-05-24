import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { DEFAULT_PHASES, DEFAULT_APPROVALS, DEFAULT_SCHEDULE } from "@/lib/phases-template";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, email, phone, password, projectName } = body;

  if (!name || !email || !password || !projectName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const client = await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      password: hashedPassword,
      role: "CLIENT",
    },
  });

  const project = await prisma.project.create({
    data: {
      name: projectName,
      clientId: client.id,
      managerId: session.user.id,
      status: "active",
    },
  });

  for (let i = 0; i < DEFAULT_PHASES.length; i++) {
    const phaseTemplate = DEFAULT_PHASES[i];
    const phase = await prisma.phase.create({
      data: {
        projectId: project.id,
        number: phaseTemplate.number,
        name: phaseTemplate.name,
        description: phaseTemplate.description,
        status: i === 0 ? "IN_PROGRESS" : "NOT_STARTED",
        order: i,
      },
    });

    for (let j = 0; j < phaseTemplate.steps.length; j++) {
      await prisma.step.create({
        data: {
          phaseId: phase.id,
          title: phaseTemplate.steps[j].title,
          description: phaseTemplate.steps[j].description,
          order: j,
        },
      });
    }
  }

  for (let i = 0; i < DEFAULT_APPROVALS.length; i++) {
    await prisma.approval.create({
      data: {
        projectId: project.id,
        phase: DEFAULT_APPROVALS[i].phase,
        title: DEFAULT_APPROVALS[i].title,
        description: DEFAULT_APPROVALS[i].description,
        priority: DEFAULT_APPROVALS[i].priority,
        order: i,
      },
    });
  }

  for (let i = 0; i < DEFAULT_SCHEDULE.length; i++) {
    await prisma.scheduleItem.create({
      data: {
        projectId: project.id,
        phase: DEFAULT_SCHEDULE[i].phase,
        title: DEFAULT_SCHEDULE[i].title,
        duration: DEFAULT_SCHEDULE[i].duration,
        milestones: DEFAULT_SCHEDULE[i].milestones,
        order: i,
      },
    });
  }

  return NextResponse.json({ client, project }, { status: 201 });
}
