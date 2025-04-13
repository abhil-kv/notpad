import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "backlog" | "pending" | "in-progress" | "completed";
  severity?: "low" | "medium" | "high" | "critical";
  isCompleted?: boolean;
  dueDate?: string; // ISO string format
  dueTime?: string; // HH:MM format
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard = ({
  task = {
    id: "1",
    title: "Task Title",
    description: "This is a sample task description. Click edit to change it.",
    status: "backlog",
  },
  onEdit = () => {},
  onDelete = () => {},
}: TaskCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(task.title);
  const [editedDescription, setEditedDescription] = React.useState(
    task.description,
  );
  const [editedDate, setEditedDate] = React.useState(
    task.dueDate || new Date().toISOString().split('T')[0]
  );
  const [editedTime, setEditedTime] = React.useState(task.dueTime || '');

  const handleEditSubmit = () => {
    onEdit({
      ...task,
      title: editedTitle,
      description: editedDescription,
      dueDate: editedDate,
      dueTime: editedTime || undefined,
    });
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    onDelete(task.id);
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedDate(task.dueDate || new Date().toISOString().split('T')[0]);
    setEditedTime(task.dueTime || '');
    setIsEditDialogOpen(true);
  };

  // Format date for display
  const formatDisplayDate = () => {
    if (!task.dueDate) return null;
    
    const date = new Date(task.dueDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    
    if (task.dueTime) {
      const [hours, minutes] = task.dueTime.split(':');
      return `${hours}:${minutes} ${day}/${month}/${year}`;
    }
    
    return `${day}/${month}/${year}`;
  };

  const getStatusColor = () => {
    if (task.severity) {
      switch (task.severity) {
        case "low":
          return "bg-green-400";
        case "medium":
          return "bg-yellow-400";
        case "high":
          return "bg-orange-400";
        case "critical":
          return "bg-red-500";
        default:
          return "bg-slate-400";
      }
    }

    switch (task.status) {
      case "backlog":
        return "bg-slate-400";
      case "pending":
        return "bg-yellow-400";
      case "in-progress":
        return "bg-blue-400";
      case "completed":
        return "bg-green-400";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <>
      <Card className="w-full max-w-[480px] bg-white shadow-md hover:shadow-lg transition-shadow cursor-grab active:cursor-grabbing">
        <div className={`h-2 w-full ${getStatusColor()} rounded-t-lg`}></div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-base truncate mr-2">
              {task.title}
            </h3>
            <div className="flex space-x-1">
              {task.status !== "backlog" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-blue-500"
                  onClick={() => {
                    const prevStatus =
                      task.status === "completed"
                        ? "in-progress"
                        : task.status === "in-progress"
                          ? "pending"
                          : "backlog";
                    onEdit({
                      ...task,
                      status: prevStatus,
                    });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={openEditDialog}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-red-500"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {task.status !== "completed" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-blue-500"
                  onClick={() => {
                    const nextStatus =
                      task.status === "backlog"
                        ? "pending"
                        : task.status === "pending"
                          ? "in-progress"
                          : "completed";
                    onEdit({
                      ...task,
                      status: nextStatus,
                    });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-3 mb-2">
            {task.description}
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => {
                  const newStatus = !task.isCompleted
                    ? "completed"
                    : "in-progress";
                  onEdit({
                    ...task,
                    isCompleted: !task.isCompleted,
                    status: newStatus,
                  });
                }}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-xs text-gray-500">
                {task.isCompleted ? "Completed" : "Mark as complete"}
              </span>
            </div>
            {task.dueDate && (
              <span className="text-xs text-gray-500">
                {formatDisplayDate()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={editedDate}
                  onChange={(e) => setEditedDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueTime">Due Time (optional)</Label>
                <Input
                  id="dueTime"
                  type="time"
                  value={editedTime}
                  onChange={(e) => setEditedTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;