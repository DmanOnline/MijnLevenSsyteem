"use client";

import { useState } from "react";
import { Task } from "@/lib/types/tasks";
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onClick: (task: Task) => void;
  onReorder: (orderedIds: string[]) => void;
  onAddClick: () => void;
}

export default function TaskList({
  tasks,
  onToggle,
  onClick,
  onReorder,
  onAddClick,
}: TaskListProps) {
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(taskId);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    setDragOverId(null);

    if (draggedId === targetId) return;

    const ids = tasks.map((t) => t.id);
    const fromIndex = ids.indexOf(draggedId);
    const toIndex = ids.indexOf(targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    ids.splice(fromIndex, 1);
    ids.splice(toIndex, 0, draggedId);
    onReorder(ids);
  };

  return (
    <div>
      {tasks.map((task) => (
        <div
          key={task.id}
          onDragOver={(e) => handleDragOver(e, task.id)}
          onDragLeave={() => setDragOverId(null)}
          onDrop={(e) => handleDrop(e, task.id)}
          className={dragOverId === task.id ? "border-t-2 border-accent" : ""}
        >
          <TaskCard
            task={task}
            onToggle={onToggle}
            onClick={onClick}
            draggable
            onDragStart={handleDragStart}
          />
        </div>
      ))}

      {/* Add task button - Todoist style */}
      <button
        onClick={onAddClick}
        className="group w-full flex items-center gap-3 px-2 py-2.5 text-sm text-muted-foreground hover:text-accent transition-colors"
      >
        <span className="w-[18px] h-[18px] rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
        Taak toevoegen
      </button>
    </div>
  );
}
