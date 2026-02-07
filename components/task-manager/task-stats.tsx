"use client";

import { useTasks } from "@/contexts/task-context";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, Circle, ListTodo } from "lucide-react";

export function TaskStats() {
  const { getTaskStats } = useTasks();
  const stats = getTaskStats();

  const items = [
    {
      label: "Total",
      value: stats.total,
      icon: ListTodo,
      color: "text-slate-600",
      bgColor: "bg-slate-100",
    },
    {
      label: "To Do",
      value: stats.todo,
      icon: Circle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      label: "Done",
      value: stats.done,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
