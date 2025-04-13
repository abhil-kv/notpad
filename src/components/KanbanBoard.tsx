import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import TaskCard from "./TaskCard";

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

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    status: "backlog",
    severity: "medium",
    isCompleted: false,
    dueDate: new Date().toISOString().split('T')[0], // ISO string format
    dueTime: '' // HH:MM format
  });

  // Load tasks from localStorage on component mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("notebook-app-kanban-tasks");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        // Set some default tasks if none exist
        const defaultTasks: Task[] = [
          {
            id: "1",
            title: "Research project requirements",
            description:
              "Gather all necessary information about the project scope",
            status: "backlog",
          },
          {
            id: "2",
            title: "Create wireframes",
            description: "Design initial wireframes for the application",
            status: "pending",
          },
          {
            id: "3",
            title: "Develop landing page",
            description: "Code the landing page based on approved designs",
            status: "in-progress",
          },
          {
            id: "4",
            title: "Test user authentication",
            description: "Verify login and registration functionality",
            status: "completed",
          },
        ];
        setTasks(defaultTasks);
        localStorage.setItem(
          "notebook-app-kanban-tasks",
          JSON.stringify(defaultTasks)
        );
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      try {
        localStorage.setItem(
          "notebook-app-kanban-tasks",
          JSON.stringify(tasks)
        );
      } catch (error) {
        console.error("Error saving tasks to localStorage:", error);
      }
    }
  }, [tasks]);

  const handleDragEnd = (result: any) => {
    console.log("Drag ended:", result);

    // Fix for mobile: If there's no destination, it might be because the drag was cancelled
    // or the drop target wasn't valid. In this case, just return without making any changes.
    if (!result.destination) return;

    const { source, destination } = result;

    // Create a copy of the tasks array
    const updatedTasks = [...tasks];

    // Find the task that was dragged
    const [movedTask] = updatedTasks.splice(source.index, 1);

    // Update its status based on the destination column
    movedTask.status = destination.droppableId as
      | "backlog"
      | "pending"
      | "in-progress"
      | "completed";

    // Insert the task at the new position
    updatedTasks.splice(destination.index, 0, movedTask);

    // Update state
    setTasks(updatedTasks);
  };

  const openNewTaskDialog = () => {
    setCurrentTask({
      id: "",
      title: "",
      description: "",
      status: "backlog",
      severity: "medium",
      isCompleted: false,
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const openEditTaskDialog = (task: Task) => {
    setCurrentTask(task);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleTaskChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'dueDate' && value === '') {
      setCurrentTask((prev) => ({ ...prev, [name]: new Date().toISOString().split('T')[0] }));
    } else {
      setCurrentTask((prev) => ({ ...prev, [name]: value }));
    }
  };

  const saveTask = () => {
    if (!currentTask.title.trim()) return;

    if (isEditMode) {
      // Update existing task
      setTasks((prev) =>
        prev.map((task) => (task.id === currentTask.id ? currentTask : task))
      );
    } else {
      // Add new task
      const newTask = {
        ...currentTask,
        id: Date.now().toString(),
      };
      setTasks((prev) => [...prev, newTask]);
    }

    setIsDialogOpen(false);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Filter tasks by status
  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md w-full h-full overflow-auto"
      style={{ touchAction: "manipulation" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Task Board</h2>
        <Button onClick={openNewTaskDialog} className="flex items-center gap-2">
          <Plus size={16} />
          Add Task
        </Button>
      </div>

      <DragDropContext
        onDragEnd={handleDragEnd}
        onDragStart={(start) => console.log("Drag started:", start)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Backlog Column */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3 px-2">Backlog</h3>
            <Droppable droppableId="backlog">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[200px]"
                >
                  {getTasksByStatus("backlog").map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3"
                          style={{ touchAction: "none" }}
                        >
                          <TaskCard
                            task={task}
                            onEdit={handleEditTask}
                            onDelete={deleteTask}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Pending Column */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3 px-2">Pending</h3>
            <Droppable droppableId="pending">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[200px]"
                >
                  {getTasksByStatus("pending").map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3"
                          style={{ touchAction: "none" }}
                        >
                          <TaskCard
                            task={task}
                            onEdit={handleEditTask}
                            onDelete={deleteTask}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* In Progress Column */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3 px-2">
              In Progress
            </h3>
            <Droppable droppableId="in-progress">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[200px]"
                >
                  {getTasksByStatus("in-progress").map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3"
                          style={{ touchAction: "none" }}
                        >
                          <TaskCard
                            task={task}
                            onEdit={handleEditTask}
                            onDelete={deleteTask}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Completed Column */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3 px-2">Completed</h3>
            <Droppable droppableId="completed">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[200px]"
                >
                  {getTasksByStatus("completed").map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3"
                          style={{ touchAction: "none" }}
                        >
                          <TaskCard
                            task={task}
                            onEdit={handleEditTask}
                            onDelete={deleteTask}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {/* Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={currentTask.title}
                onChange={handleTaskChange}
                placeholder="Task title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={currentTask.description}
                onChange={handleTaskChange}
                placeholder="Task description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  name="dueDate"
                  value={currentTask.dueDate}
                  onChange={handleTaskChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueTime">Due Time (optional)</Label>
                <Input
                  id="dueTime"
                  type="time"
                  name="dueTime"
                  value={currentTask.dueTime}
                  onChange={handleTaskChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="severity">Severity</Label>
              <select
                id="severity"
                name="severity"
                value={currentTask.severity}
                onChange={handleTaskChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTask}>
              {isEditMode ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanBoard;
