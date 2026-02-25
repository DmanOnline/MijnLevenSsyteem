import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/tasks/reorder
export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const body = await request.json();
  const { orderedIds } = body as { orderedIds: string[] };

  if (!orderedIds || !Array.isArray(orderedIds)) {
    return NextResponse.json(
      { error: "orderedIds array is verplicht" },
      { status: 400 }
    );
  }

  // Update sort orders in a transaction
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.task.updateMany({
        where: { id, userId: session.userId },
        data: { sortOrder: index },
      })
    )
  );

  return NextResponse.json({ success: true });
}
