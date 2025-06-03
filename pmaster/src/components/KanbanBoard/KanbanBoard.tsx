import { useState, useEffect } from "react";
import { getTaskStatuses } from "../../api/statuses";
import { deleteTask, getTasksByStatus, updateTask } from "../../api/tasks";
import type { TaskStatus, Task } from "../../types/apiTypes";
import { StatusColumn } from "../StatusColumn/StatusColumn";
import { CreateTaskModal } from "../CreateTaskModal";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

interface KanbanBoardProps {
  projectId: number;
}

export const KanbanBoard = ({ projectId }: KanbanBoardProps) => {
  const [statuses, setStatuses] = useState<TaskStatus[]>([]);
  const [tasks, setTasks] = useState<Record<number, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreateTaskClick = (statusId: number) => {
    setSelectedStatusId(statusId);
    setIsCreateModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statusesResponse = await getTaskStatuses();
        setStatuses(statusesResponse.data);

        const tasksByStatus: Record<number, Task[]> = {};
        for (const status of statusesResponse.data) {
          const tasksResponse = await getTasksByStatus(status.id);
          if (!tasksResponse?.data) {
            continue;
          }

          tasksByStatus[status.id] = tasksResponse.data.filter(
            (task) => task.project_id === projectId
          );
        }
        setTasks(tasksByStatus);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("taskId", taskId.toString());
  };

  const handleDrop = async (e: React.DragEvent, newStatusId: number) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    let taskToUpdate: Task | undefined;
    let currentStatusId: number | undefined;
    try {
      // Find the task in the current state

      for (const statusId in tasks) {
        const task = tasks[statusId].find((t) => t.id === taskId);
        if (task) {
          taskToUpdate = task;
          currentStatusId = parseInt(statusId);
          break;
        }
      }

      if (!taskToUpdate || currentStatusId === undefined) return;

      // Optimistically update the UI first
      setTasks((prev) => {
        const newTasks = { ...prev };

        // Remove from old status
        newTasks[currentStatusId!] = newTasks[currentStatusId!].filter(
          (t) => t.id !== taskId
        );

        // Create a new task object with updated status
        const updatedTask = {
          ...taskToUpdate,
          status_id: newStatusId,
        };

        // Add to new status (at the beginning of the array)
        // @ts-expect-error qwe
        newTasks[newStatusId] = [updatedTask, ...(newTasks[newStatusId] || [])];

        return newTasks;
      });

      // Then make the API call
      await updateTask(taskId, {
        ...taskToUpdate,
        status_id: newStatusId,
      });
    } catch (err) {
      // Revert on error
      setTasks((prev) => {
        const newTasks = { ...prev };

        // Remove from where it might have been added
        newTasks[newStatusId] = (newTasks[newStatusId] || []).filter(
          (t) => t.id !== taskId
        );

        // Add back to original status
        if (currentStatusId !== undefined) {
          newTasks[currentStatusId] = [
            taskToUpdate!,
            ...(newTasks[currentStatusId] || []),
          ];
        }

        return newTasks;
      });

      setError(
        err instanceof Error ? err.message : "Failed to update task status"
      );
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsCreateModalOpen(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(taskId);
      setTasks((prev) => {
        const newTasks = { ...prev };
        for (const statusId in newTasks) {
          newTasks[statusId] = newTasks[statusId].filter(
            (t) => t.id !== taskId
          );
        }
        return newTasks;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const handleTaskCreatedOrUpdated = (updatedTask: Task) => {
    setTasks((prev) => {
      const newTasks = { ...prev };

      // Remove from old status if it exists
      for (const statusId in newTasks) {
        newTasks[statusId] = newTasks[statusId].filter(
          (t) => t.id !== updatedTask.id
        );
      }

      // Add to new status
      const statusId = updatedTask.status_id;
      if (!newTasks[statusId]) {
        newTasks[statusId] = [];
      }
      newTasks[statusId].unshift(updatedTask);

      return newTasks;
    });
    setEditingTask(null);
    setIsCreateModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="flex gap-4 overflow-x-auto py-4">
        {statuses.map((status) => (
          <StatusColumn
            key={status.id}
            status={status}
            tasks={tasks[status.id] || []}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </div>
      <div className="flex gap-4 justify-center">
        <span
          style={{ color: "white" }}
          onClick={() => handleCreateTaskClick(1)}
        >
          <PlusCircleIcon className="h-12 w-12 cursor-pointer"/>
        </span>
      </div>
      {(isCreateModalOpen || editingTask) && (
        <CreateTaskModal
          statusId={editingTask?.status_id ?? selectedStatusId ?? statuses[0]?.id}
          projectId={projectId}
          isOpen={isCreateModalOpen || !!editingTask}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingTask(null);
          }}
          onTaskCreated={handleTaskCreatedOrUpdated}
          availableStatuses={statuses}
          initialValues={
            editingTask
              ? editingTask
              : undefined
          }
        />
      )}
    </>
  );
};
