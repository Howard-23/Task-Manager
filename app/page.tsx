"use client";

import { useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { useTasks } from "@/contexts/task-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskCard, TaskDialog, TaskFilters, TaskStats, EmptyState } from "@/components/task-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const { filteredTasks, filter, setFilter } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingTask(null);
    }
  };

  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    inProgress: filteredTasks.filter((t) => t.status === "in-progress"),
    done: filteredTasks.filter((t) => t.status === "done"),
  };

  const hasFilters = !!(filter.search || filter.status !== "all" || filter.priority !== "all");

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
            <p className="text-muted-foreground mt-1">
              Organize and track your tasks efficiently
            </p>
          </div>
          <Button onClick={handleAdd} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <TaskStats />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <TaskFilters />
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <EmptyState onAddClick={handleAdd} hasFilters={hasFilters} />
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All ({filteredTasks.length})
              </TabsTrigger>
              <TabsTrigger value="todo">
                To Do ({tasksByStatus.todo.length})
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                In Progress ({tasksByStatus.inProgress.length})
              </TabsTrigger>
              <TabsTrigger value="done">
                Done ({tasksByStatus.done.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="todo" className="mt-0">
              <div className="grid gap-4">
                {tasksByStatus.todo.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No tasks to do</p>
                ) : (
                  tasksByStatus.todo.map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="in-progress" className="mt-0">
              <div className="grid gap-4">
                {tasksByStatus.inProgress.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No tasks in progress</p>
                ) : (
                  tasksByStatus.inProgress.map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="done" className="mt-0">
              <div className="grid gap-4">
                {tasksByStatus.done.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No completed tasks</p>
                ) : (
                  tasksByStatus.done.map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <TaskDialog open={dialogOpen} onOpenChange={handleCloseDialog} task={editingTask} />
    </main>
  );
}
