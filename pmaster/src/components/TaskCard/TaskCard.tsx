import type { Task } from "../../types/apiTypes";

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: number) => void;
}

export const TaskCard = ({ task, onDragStart }: TaskCardProps) => {
  return (
    <div
      className="border border-gray-700 rounded-lg p-4 mb-3 bg-gray-800 shadow-md transition-all duration-200 hover:bg-gray-750 hover:shadow-lg hover:border-gray-600 cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-white">{task.title}</h4>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
          #{task.id}
        </span>
      </div>
      <p className="text-sm text-gray-300 mb-3 line-clamp-2">
        {task.description}
      </p>
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400">
          Due: {new Date(task.deadline).toLocaleDateString()}
        </span>
        <span className="px-2 py-1 rounded bg-gray-700 text-gray-200">
          {task.status_id}
        </span>
      </div>
    </div>
  );
};
