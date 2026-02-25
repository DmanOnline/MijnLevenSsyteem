"use client";

import { Task, TaskStatus } from "@/lib/types/tasks";
import TaskCard from "./TaskCard";
import { useState } from "react";

interface TaskBoardProps {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onClick: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
}

const COLUMNS: { status: TaskStatus; title: string; color: string }[] = [
  { status: "todo", title: "Te doen", color: "border-blue-500/50" },
  { status: "in_progress", title: "Bezig", color: "border-amber-500/50" },
  { status: "done", title: "Klaar", color: "border-emerald-500/50" },
];

export default function TaskBoard({
  tasks,
  onToggle,
  onClick,
  onStatusChange,
}: TaskBoardProps) {
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ id: task.id, status: task.status }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (data.status === newStatus) return;

      const task = tasks.find((t) => t.id === data.id);
      if (task) {
        onStatusChange(task, newStatus);
      }
    } catch {
      // ignore invalid drag data
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);
        const isDragOver = dragOverColumn === col.status;

        return (
          <div
            key={col.status}
            className={`flex flex-col rounded-xl border-t-2 ${col.color} bg-surface/50`}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => handleDrop(e, col.status)}
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-3 py-3">
              <h3 className="text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <span className="text-xs text-muted-foreground bg-surface rounded-full px-2 py-0.5">
                {columnTasks.length}
              </span>
            </div>

            {/* Cards */}
            <div
              className={`flex-1 p-2 space-y-2 overflow-y-auto transition-all ${
                isDragOver ? "bg-accent/5 ring-2 ring-inset ring-accent/20 rounded-b-xl" : ""
              }`}
            >
              {columnTasks.length === 0 && (
                <p className="text-xs text-muted-foreground/40 text-center py-8">
                  Sleep taken hierheen
                </p>
              )}
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onClick={onClick}
                  draggable
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
