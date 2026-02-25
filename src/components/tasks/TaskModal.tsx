"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, TaskFormData, TaskModalState, Project } from "@/lib/types/tasks";
import { getSmartDefaultDate } from "@/lib/tasks";
import TaskForm from "./TaskForm";

interface TaskModalProps {
  modalState: TaskModalState;
  projects: Project[];
  onClose: () => void;
  onSave: (data: TaskFormData) => Promise<void>;
  onDelete: (task: Task) => Promise<void>;
}

function toDateStr(d: string | null): string {
  if (!d) return "";
  return d.substring(0, 10);
}

export default function TaskModal({
  modalState,
  projects,
  onClose,
  onSave,
  onDelete,
}: TaskModalProps) {
  const { open, mode, task } = modalState;

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "medium",
    scheduledDate: "",
    scheduledTime: "",
    dueDate: "",
    projectId: "",
    recurrenceRule: null,
    recurrenceDay: null,
    recurrenceEnd: "",
    estimatedDuration: 60,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && mode === "edit" && task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        scheduledDate: toDateStr(task.scheduledDate),
        scheduledTime: task.scheduledTime || "",
        dueDate: toDateStr(task.dueDate),
        projectId: task.projectId || "",
        recurrenceRule: task.recurrenceRule,
        recurrenceDay: task.recurrenceDay,
        recurrenceEnd: task.recurrenceEnd ? toDateStr(task.recurrenceEnd) : "",
        estimatedDuration: task.estimatedDuration || 60,
      });
    } else if (open && mode === "create") {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        scheduledDate: getSmartDefaultDate(),
        scheduledTime: "",
        dueDate: "",
        projectId: "",
        recurrenceRule: null,
        recurrenceDay: null,
        recurrenceEnd: "",
        estimatedDuration: 60,
      });
    }
    setIsSubmitting(false);
    setError("");
  }, [open, mode, task]);

  const handleChange = useCallback((partial: Partial<TaskFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title.trim()) return;
      setIsSubmitting(true);
      setError("");
      try {
        await onSave(formData);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Opslaan mislukt");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onSave, onClose]
  );

  const handleDelete = useCallback(async () => {
    if (!task) return;
    setIsSubmitting(true);
    setError("");
    try {
      await onDelete(task);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verwijderen mislukt");
    } finally {
      setIsSubmitting(false);
    }
  }, [task, onDelete, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md pointer-events-auto animate-scale-in max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">
              {mode === "edit" ? "Taak bewerken" : "Nieuwe taak"}
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto px-5 py-4">
            {error && (
              <div className="mb-3 p-2 rounded-lg bg-red-500/10 text-red-400 text-xs">
                {error}
              </div>
            )}
            <TaskForm
              formData={formData}
              projects={projects}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={onClose}
              onDelete={mode === "edit" ? handleDelete : undefined}
              isEditing={mode === "edit"}
              isSubmitting={isSubmitting}
              editingTaskId={mode === "edit" ? task?.id : undefined}
            />
          </div>
        </div>
      </div>
    </>
  );
}
