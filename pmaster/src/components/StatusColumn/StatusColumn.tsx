import type { TaskStatus, Task } from "../../types/apiTypes";
import { TaskCard } from "../TaskCard/TaskCard";

interface StatusColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, taskId: number) => void;
  onDrop: (e: React.DragEvent, statusId: number) => void;
  onCreateTask: (statusId: number) => void; // Add this prop
}

export const StatusColumn = ({
  status,
  tasks,
  onDragStart,
  onDrop,
  onCreateTask,
}: StatusColumnProps) => {
  return (
    <div
      className="flex-1 rounded-lg p-4 bg-gray-800 border border-gray-700 min-h-[500px] transition-colors duration-200 hover:border-gray-600"
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
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}
      </div>
      {tasks.length === 0 && (
        <div className="text-center py-8 animate-fadeIn">
          <p className="text-gray-500 mb-4">No tasks in this status</p>
          <button
            onClick={() => onCreateTask(status.id)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-105 text-sm font-medium"
          >
            Create Task
          </button>
        </div>
      )}
    </div>
  );
};
