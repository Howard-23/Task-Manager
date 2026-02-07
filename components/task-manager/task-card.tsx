"use client";

import { Task, TaskStatus, TaskPriority } from "@/types/task";
import { useTasks } from "@/contexts/task-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: "To Do", color: "bg-slate-500" },
  "in-progress": { label: "In Progress", color: "bg-blue-500" },
  done: { label: "Done", color: "bg-green-500" },
};

const priorityConfig: Record<TaskPriority, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  low: { label: "Low", variant: "secondary" },
  medium: { label: "Medium", variant: "default" },
  high: { label: "High", variant: "destructive" },
};

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { toggleTaskStatus, deleteTask } = useTasks();

  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== "done";

  return (
    <Card className={cn(
      "group transition-all duration-200 hover:shadow-md",
      task.status === "done" && "opacity-75"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.status === "done"}
            onCheckedChange={() => toggleTaskStatus(task.id)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-semibold text-base leading-tight line-clamp-2",
                task.status === "done" && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className={cn(
          "text-sm text-muted-foreground line-clamp-2 mb-3",
          task.status === "done" && "line-through"
        )}>
          {task.description}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={priorityConfig[task.priority].variant} className="text-xs">
            {priorityConfig[task.priority].label}
          </Badge>
          <div className={cn(
            "w-2 h-2 rounded-full",
            statusConfig[task.status].color
          )} />
          <span className="text-xs text-muted-foreground">
            {statusConfig[task.status].label}
          </span>
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1 text-xs ml-auto",
              isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
            )}>
              <Calendar className="h-3 w-3" />
              {format(task.dueDate, "MMM d")}
              {isOverdue && " (Overdue)"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
