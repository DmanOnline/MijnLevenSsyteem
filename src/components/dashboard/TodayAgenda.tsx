"use client";

import Link from "next/link";
import type { DashboardData } from "./DashboardShell";

interface Props {
  events: DashboardData["events"] | null;
  tasks: DashboardData["tasks"] | null;
  loading: boolean;
}

interface AgendaItem {
  id: string;
  title: string;
  time: string | null;
  isAllDay: boolean;
  color: string;
  type: "event" | "task";
  priority?: string;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export default function TodayAgenda({ events, tasks, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 animate-fade-in opacity-0 stagger-3">
        <div className="h-4 w-32 bg-border rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-1 rounded-full bg-border" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 bg-border rounded animate-pulse" />
                <div className="h-2.5 w-1/3 bg-border rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Merge events and tasks into a single timeline
  const items: AgendaItem[] = [];

  if (events?.items) {
    for (const e of events.items) {
      items.push({
        id: e.id,
        title: e.title,
        time: e.isAllDay ? null : formatTime(e.startDate),
        isAllDay: e.isAllDay,
        color: e.color,
        type: "event",
      });
    }
  }

  if (tasks?.todayItems) {
    for (const t of tasks.todayItems) {
      items.push({
        id: t.id,
        title: t.title,
        time: t.scheduledTime ?? null,
        isAllDay: !t.scheduledTime,
        color: t.project?.color ?? "#06B6D4",
        type: "task",
        priority: t.priority,
      });
    }
  }

  // Sort: all-day first, then by time
  const allDay = items.filter((i) => i.isAllDay);
  const timed = items
    .filter((i) => !i.isAllDay)
    .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));

  const nowMinutes = getCurrentMinutes();

  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-fade-in opacity-0 stagger-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Vandaag
        </h3>
        <Link href="/calendar" className="text-xs text-accent hover:underline">
          Kalender
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Geen events of taken vandaag
        </p>
      ) : (
        <div className="space-y-1">
          {/* All-day items */}
          {allDay.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-border">
              {allDay.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-surface"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate max-w-[200px]">
                    {item.type === "task" && "✓ "}{item.title}
                  </span>
                </span>
              ))}
            </div>
          )}

          {/* Timed items */}
          {timed.map((item, idx) => {
            const itemMinutes = item.time
              ? parseInt(item.time.split(":")[0]) * 60 + parseInt(item.time.split(":")[1])
              : 0;
            const nextItem = timed[idx + 1];
            const nextMinutes = nextItem?.time
              ? parseInt(nextItem.time.split(":")[0]) * 60 + parseInt(nextItem.time.split(":")[1])
              : 1440;

            const showNowLine = nowMinutes >= itemMinutes && nowMinutes < nextMinutes && idx <= timed.length - 1;

            return (
              <div key={item.id}>
                <div className="flex items-start gap-3 py-1.5 group">
                  <span className="text-xs text-muted-foreground tabular-nums w-10 shrink-0 pt-0.5">
                    {item.time}
                  </span>
                  <div
                    className="w-0.5 self-stretch rounded-full shrink-0 min-h-[20px]"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">
                      {item.type === "task" && (
                        <span className="text-muted-foreground mr-1">✓</span>
                      )}
                      {item.title}
                    </p>
                    {item.priority && item.priority !== "medium" && (
                      <span className={`text-[10px] ${
                        item.priority === "high" ? "text-negative" : "text-muted-foreground"
                      }`}>
                        {item.priority === "high" ? "Hoog" : "Laag"}
                      </span>
                    )}
                  </div>
                </div>
                {showNowLine && (
                  <div className="flex items-center gap-2 py-1">
                    <span className="text-[10px] text-accent font-medium w-10 text-right">nu</span>
                    <div className="flex-1 h-px bg-accent" />
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
