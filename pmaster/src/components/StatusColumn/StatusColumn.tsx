import type { TaskStatus, Task } from "../../types/apiTypes";
import { TaskCard } from "../TaskCard/TaskCard";

interface StatusColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, taskId: number) => void;
  onDrop: (e: React.DragEvent, statusId: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

export const StatusColumn = ({
  status,
  tasks,
  onDragStart,
  onDrop,
  onEditTask,
  onDeleteTask,
}: StatusColumnProps) => {
  return (
    <div
      className="flex-1 rounded-lg p-4 bg-gray-800 border border-gray-700 min-h-[500px] min-w-44"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, status.id)}
    >
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
        <h3 className="font-semibold text-white">{status.name}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
          {tasks.length} tasks
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};