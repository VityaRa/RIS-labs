import { useState, useEffect } from "react";
import { getTaskStatuses } from "../../api/statuses";
import { getTasksByStatus, updateTask } from "../../api/tasks";
import type { TaskStatus, Task } from "../../types/apiTypes";
import { StatusColumn } from "../StatusColumn/StatusColumn";
import { CreateTaskModal } from "../CreateTaskModal";

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

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => {
      const newTasks = { ...prev };
      const statusId = newTask.status_id;

      if (!newTasks[statusId]) {
        newTasks[statusId] = [];
      }

      newTasks[statusId] = [newTask, ...newTasks[statusId]];
      return newTasks;
    });
  };

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
            onCreateTask={handleCreateTaskClick}
          />
        ))}
      </div>
      <div className="flex gap-4 justify-center">
        <span style={{color: 'white'}} onClick={() => handleCreateTaskClick(1)}>
          Create new Task
        </span>
      </div>
      {isCreateModalOpen && selectedStatusId && (
        <CreateTaskModal
          statusId={selectedStatusId}
          projectId={projectId}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTaskCreated={handleTaskCreated}
          availableStatuses={statuses}
        />
      )}
    </>
  );
};
