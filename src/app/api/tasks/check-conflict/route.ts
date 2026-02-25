import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/tasks/check-conflict?date=YYYY-MM-DD&time=HH:mm&duration=60&excludeTaskId=...
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const duration = parseInt(searchParams.get("duration") || "60");
    const excludeTaskId = searchParams.get("excludeTaskId");

    if (!date || !time) {
      return NextResponse.json({ conflicts: [] });
    }

    // Calculate task time range
    const [hours, minutes] = time.split(":").map(Number);
    const taskStart = new Date(`${date}T${time}:00`);
    const taskEnd = new Date(taskStart.getTime() + duration * 60 * 1000);

    // Check calendar events that overlap with task time
    const visibleCalendars = await prisma.subCalendar.findMany({
      where: { userId: session.userId, isVisible: true },
      select: { id: true },
    });
    const visibleIds = visibleCalendars.map((c) => c.id);

    const calendarConflicts = visibleIds.length > 0
      ? await prisma.calendarEvent.findMany({
          where: {
            userId: session.userId,
            subCalendarId: { in: visibleIds },
            isLocallyDeleted: false,
            isAllDay: false,
            // Overlap: event starts before task ends AND event ends after task starts
            startDate: { lt: taskEnd },
            endDate: { gt: taskStart },
          },
          select: { id: true, title: true, startDate: true, endDate: true },
          take: 5,
        })
      : [];

    // Check other tasks that overlap
    // Tasks with scheduledDate + scheduledTime
    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);

    const tasksOnDay = await prisma.task.findMany({
      where: {
        userId: session.userId,
        status: { not: "done" },
        scheduledDate: { gte: dayStart, lte: dayEnd },
        scheduledTime: { not: null },
        ...(excludeTaskId ? { id: { not: excludeTaskId } } : {}),
      },
      select: {
        id: true,
        title: true,
        scheduledTime: true,
        estimatedDuration: true,
      },
    });

    // Filter tasks that overlap with the new task's time range
    const taskConflicts = tasksOnDay.filter((t) => {
      if (!t.scheduledTime) return false;
      const [tH, tM] = t.scheduledTime.split(":").map(Number);
      const tStart = new Date(`${date}T${t.scheduledTime}:00`);
      const tEnd = new Date(tStart.getTime() + (t.estimatedDuration || 60) * 60 * 1000);

      // Overlap check
      return tStart < taskEnd && tEnd > taskStart;
    });

    const conflicts = [
      ...calendarConflicts.map((c) => ({
        type: "calendar" as const,
        id: c.id,
        title: c.title,
        startTime: c.startDate.toISOString(),
        endTime: c.endDate.toISOString(),
      })),
      ...taskConflicts.map((t) => {
        const tStart = new Date(`${date}T${t.scheduledTime}:00`);
        const tEnd = new Date(tStart.getTime() + (t.estimatedDuration || 60) * 60 * 1000);
        return {
          type: "task" as const,
          id: t.id,
          title: t.title,
          startTime: tStart.toISOString(),
          endTime: tEnd.toISOString(),
        };
      }),
    ];

    return NextResponse.json({ conflicts });
  } catch (err) {
    console.error("GET /api/tasks/check-conflict error:", err);
    return NextResponse.json({ conflicts: [] });
  }
}
