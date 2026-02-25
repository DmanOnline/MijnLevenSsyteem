import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT /api/tasks/projects/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.project.findFirst({
    where: { id, userId: session.userId },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Project niet gevonden" },
      { status: 404 }
    );
  }

  // Check name uniqueness if changing
  if (body.name && body.name.trim() !== existing.name) {
    const duplicate = await prisma.project.findFirst({
      where: {
        userId: session.userId,
        name: body.name.trim(),
        id: { not: id },
      },
    });
    if (duplicate) {
      return NextResponse.json(
        { error: "Er bestaat al een project met deze naam" },
        { status: 400 }
      );
    }
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.color !== undefined && { color: body.color }),
    },
    include: {
      _count: {
        select: { tasks: { where: { status: { not: "done" } } } },
      },
    },
  });

  return NextResponse.json({ project });
}

// DELETE /api/tasks/projects/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.project.findFirst({
    where: { id, userId: session.userId },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Project niet gevonden" },
      { status: 404 }
    );
  }

  // Unlink tasks from this project (don't delete them)
  await prisma.task.updateMany({
    where: { projectId: id },
    data: { projectId: null },
  });

  await prisma.project.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
