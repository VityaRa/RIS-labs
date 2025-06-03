import { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Task } from "../../types/apiTypes";

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export const TaskCard = ({
  task,
  onDragStart,
  onEdit,
  onDelete,
}: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative border border-gray-700 rounded-lg p-4 mb-3 bg-gray-800 shadow-md transition-all duration-200 hover:bg-gray-750 hover:shadow-lg hover:border-gray-600 cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-white">{task.title}</h4>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300 text-left">
          #{task.id}
        </span>
      </div>
      <p className="text-sm text-gray-300 mb-3 line-clamp-2  text-left">
        {task.description}
      </p>
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400  text-left">
          Due: {new Date(task.deadline).toLocaleDateString()}
        </span>
      </div>

      {/* Actions Bar (shown on hover) */}
      {isHovered && (
        <div
          className="absolute top-2 right-2 flex space-x-2 bg-gray-800 rounded-lg p-1 shadow-lg border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition-colors"
            title="Edit task"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
            title="Delete task"
          >
            <TrashIcon className="h-4 w-4"/>
          </button>
        </div>
      )}
    </div>
  );
};
