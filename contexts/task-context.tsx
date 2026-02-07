"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Task, TaskStatus, TaskPriority, TaskFilter } from "@/types/task";

interface TaskContextType {
  tasks: Task[];
  filter: TaskFilter;
  filteredTasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  setFilter: (filter: Partial<TaskFilter>) => void;
  getTaskStats: () => { total: number; todo: number; inProgress: number; done: number };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Sample initial data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design system architecture",
    description: "Create the initial design system and component library for the project.",
    status: "done",
    priority: "high",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Implement authentication",
    description: "Set up user authentication with JWT tokens and secure routes.",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "Write API documentation",
    description: "Document all API endpoints with examples and response schemas.",
    status: "todo",
    priority: "medium",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "Set up CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing and deployment.",
    status: "todo",
    priority: "low",
    dueDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilterState] = useState<TaskFilter>({
    status: "all",
    priority: "all",
    search: "",
  });

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filter.status !== "all" && task.status !== filter.status) return false;
        if (filter.priority !== "all" && task.priority !== filter.priority) return false;
        if (filter.search) {
          const searchLower = filter.search.toLowerCase();
          return (
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .sort((a, b) => {
        // Sort by priority first
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        // Then by due date (if exists)
        if (a.dueDate && b.dueDate) {
          return a.dueDate.getTime() - b.dueDate.getTime();
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }, [tasks, filter]);

  const addTask = useCallback((taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "done" ? "todo" : task.status === "todo" ? "in-progress" : "done",
              updatedAt: new Date(),
            }
          : task
      )
    );
  }, []);

  const setFilter = useCallback((newFilter: Partial<TaskFilter>) => {
    setFilterState((prev) => ({ ...prev, ...newFilter }));
  }, []);

  const getTaskStats = useCallback(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      done: tasks.filter((t) => t.status === "done").length,
    };
  }, [tasks]);

  const value = useMemo(
    () => ({
      tasks,
      filter,
      filteredTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      setFilter,
      getTaskStats,
    }),
    [tasks, filter, filteredTasks, addTask, updateTask, deleteTask, toggleTaskStatus, setFilter, getTaskStats]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
