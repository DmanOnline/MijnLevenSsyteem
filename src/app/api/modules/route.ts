import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const modules = await prisma.module.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(modules);
}
