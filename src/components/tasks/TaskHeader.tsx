"use client";

import { TaskStatus, TaskPriority } from "@/lib/types/tasks";

type ViewMode = "list" | "board";

interface TaskHeaderProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  filterStatus: TaskStatus | null;
  onFilterStatus: (status: TaskStatus | null) => void;
  filterPriority: TaskPriority | null;
  onFilterPriority: (priority: TaskPriority | null) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onNewTask: () => void;
}

export default function TaskHeader({
  view,
  onViewChange,
  filterStatus,
  onFilterStatus,
  filterPriority,
  onFilterPriority,
  search,
  onSearchChange,
  onNewTask,
}: TaskHeaderProps) {
  const statusFilters: { value: TaskStatus | null; label: string }[] = [
    { value: null, label: "Alle" },
    { value: "todo", label: "Te doen" },
    { value: "in_progress", label: "Bezig" },
    { value: "done", label: "Klaar" },
  ];

  const priorityFilters: { value: TaskPriority | null; label: string }[] = [
    { value: null, label: "Alle" },
    { value: "high", label: "Hoog" },
    { value: "medium", label: "Gemiddeld" },
    { value: "low", label: "Laag" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* View toggle */}
      <div className="flex rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => onViewChange("list")}
          className={`px-3 py-1.5 text-xs font-medium transition-all ${
            view === "list"
              ? "bg-accent text-white"
              : "bg-card text-muted-foreground hover:bg-surface-hover"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="inline mr-1"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          Lijst
        </button>
        <button
          onClick={() => onViewChange("board")}
          className={`px-3 py-1.5 text-xs font-medium transition-all ${
            view === "board"
              ? "bg-accent text-white"
              : "bg-card text-muted-foreground hover:bg-surface-hover"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="inline mr-1"
          >
            <rect x="3" y="3" width="7" height="18" rx="1" />
            <rect x="14" y="3" width="7" height="10" rx="1" />
          </svg>
          Kanban
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-1">
        {statusFilters.map((f) => (
          <button
            key={f.value || "all"}
            onClick={() => onFilterStatus(f.value)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              filterStatus === f.value
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:bg-surface-hover"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Priority filter */}
      <div className="flex gap-1">
        {priorityFilters.map((f) => (
          <button
            key={f.value || "all-p"}
            onClick={() => onFilterPriority(f.value)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              filterPriority === f.value
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:bg-surface-hover"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="relative">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Zoeken..."
          className="pl-8 pr-3 py-1.5 w-44 rounded-lg border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/50 focus:w-56 transition-all"
        />
      </div>

      {/* New task button */}
      <button
        onClick={onNewTask}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent/90 transition-all"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nieuwe taak
      </button>
    </div>
  );
}
